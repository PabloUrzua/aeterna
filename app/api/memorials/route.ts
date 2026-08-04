import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

// In-memory mock database for fallback
const mockMemorials = [
  {
    id: "demo-slug-alejandro",
    slug: "alejandro-valenzuela",
    name: "Alejandro Valenzuela García",
    birthDate: "1948-05-14",
    deathDate: "2026-06-10",
    biography: "Profesor principal y alma de este memorial. Dedicó su vida a la docencia filosófica en el Liceo de Hombres de Valparaíso y a cultivar el pensamiento crítico en sus alumnos. Siempre creyó que dudar es el origen de la sabiduría y que la juventud debía cuestionar todo para alcanzar la libertad de pensamiento.",
    mainImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    isPrivate: false,
    password: null,
    qrCodeUrl: "https://recuerdos.amuley.com/memorial/alejandro-valenzuela",
    creatorId: "system-admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memories: [],
    condolences: []
  }
];

export async function GET(request: NextRequest) {
  // 60 reads per minute per IP
  if (!rateLimit(request, { limit: 60, windowMs: 60_000, route: "GET:/api/memorials" })) {
    return tooManyRequests();
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      const memorial = await prisma.memorial.findUnique({
        where: { slug },
        include: {
          memories: { orderBy: { createdAt: "desc" } },
          condolences: { orderBy: { createdAt: "desc" } },
          collaborators: true
        }
      });
      if (memorial) {
        return NextResponse.json({ success: true, data: memorial });
      }
      
      // Fallback if slug matches mock
      const mock = mockMemorials.find(m => m.slug === slug);
      if (mock) {
        return NextResponse.json({ success: true, data: mock });
      }

      return NextResponse.json({ success: false, error: "Memorial no encontrado" }, { status: 404 });
    }

    // Return all
    try {
      const dbMemorials = await prisma.memorial.findMany({
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, data: dbMemorials.length > 0 ? dbMemorials : mockMemorials });
    } catch {
      return NextResponse.json({ success: true, data: mockMemorials });
    }
  } catch (error) {
    console.warn("Prisma error, falling back to mock database", error);
    if (slug) {
      const mock = mockMemorials.find(m => m.slug === slug);
      if (mock) return NextResponse.json({ success: true, data: mock });
      return NextResponse.json({ success: false, error: "Memorial no encontrado (Mock)" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: mockMemorials });
  }
}

export async function POST(request: NextRequest) {
  // 20 creates per minute per IP
  if (!rateLimit(request, { limit: 20, windowMs: 60_000, route: "POST:/api/memorials" })) {
    return tooManyRequests();
  }

  try {
    const body = await request.json();
    const { name, slug, birthDate, deathDate, biography, mainImage, coverImage, isPrivate, password, creatorId } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user || error) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      // Check if creator exists or create a default user
      let defaultCreatorId = user.id;

      const newMemorial = await prisma.memorial.create({
        data: {
          name,
          slug: cleanSlug,
          birthDate,
          deathDate,
          biography,
          mainImage: mainImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          coverImage: coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          isPrivate: !!isPrivate,
          password: password || null,
          creatorId: defaultCreatorId,
          qrCodeUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://amuley.com"}/memorial/${cleanSlug}`
        }
      });

      return NextResponse.json({ success: true, data: newMemorial });
    } catch (dbError) {
      console.warn("Prisma error during creation, falling back to mock database write", dbError);
      
      const newMock = {
        id: `mock-${Date.now()}`,
        slug: cleanSlug,
        name,
        birthDate,
        deathDate,
        biography,
        mainImage: mainImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        coverImage: coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        isPrivate: !!isPrivate,
        password: password || null,
        qrCodeUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://amuley.com"}/memorial/${cleanSlug}`,
        creatorId: creatorId || "system-admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memories: [],
        condolences: []
      };

      mockMemorials.push(newMock);
      return NextResponse.json({ success: true, data: newMock, warning: "Guardado en base de datos mock temporal" });
    }
  } catch {
    return NextResponse.json({ success: false, error: "Error en la petición" }, { status: 500 });
  }
}
