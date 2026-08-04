import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

interface MockMemory {
  id: string;
  type: string;
  title: string;
  content: string | null;
  fileUrl: string | null;
  authorName: string;
  authorRelation: string;
  memorialId: string;
  createdAt: string;
}

interface MockCondolence {
  id: string;
  authorName: string;
  message: string;
  memorialId: string;
  createdAt: string;
}

// Mock memories in-memory for fallback
const mockMemories: MockMemory[] = [
  {
    id: "m1",
    type: "PHOTO",
    title: "Con su querido leal, Toby",
    content: "En el parque Valparaíso paseando a Toby en su último otoño. Siempre reía cuando Toby corría detrás de las hojas secas.",
    fileUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    authorName: "Sofía Valenzuela",
    authorRelation: "Nieta",
    memorialId: "demo-slug-alejandro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: "m2",
    type: "PHOTO",
    title: "Viaje al Gran Cañón",
    content: "Un viaje familiar inolvidable donde Alejandro nos obligó a ver el amanecer para contemplar la inmensidad del horizonte.",
    fileUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    authorName: "Marta Valenzuela",
    authorRelation: "Hija",
    memorialId: "demo-slug-alejandro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
  },
  {
    id: "m3",
    type: "STORY",
    title: "El primer día de clases como profesor",
    content: "Llegó sumamente nervioso con su maletín de cuero marrón. Nos contó después que ensayó su discurso inaugural frente al espejo durante tres horas. Los estudiantes lo amaron desde el primer minuto por su cercanía y su pasión por Sócrates.",
    fileUrl: null,
    authorName: "Alejandro Valenzuela Hijo",
    authorRelation: "Hijo",
    memorialId: "demo-slug-alejandro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
  }
];

const mockCondolences: MockCondolence[] = [
  {
    id: "c1",
    authorName: "Laura Muñoz",
    message: "Siempre estarás en nuestro corazón, querido Alejandro. Tu legado de asombro y curiosidad sigue guiándonos a todos nosotros.",
    memorialId: "demo-slug-alejandro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: "c2",
    authorName: "Carlos Soto",
    message: "Un gran maestro que cambió mi forma de entender el mundo. Mis más sinceras condolencias a toda la familia Valenzuela.",
    memorialId: "demo-slug-alejandro",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];

export async function GET(request: NextRequest) {
  // 60 reads per minute per IP
  if (!rateLimit(request, { limit: 60, windowMs: 60_000, route: "GET:/api/memories" })) {
    return tooManyRequests();
  }

  const { searchParams } = new URL(request.url);
  const memorialId = searchParams.get("memorialId");
  const type = searchParams.get("type"); // "memories" or "condolences"

  if (!memorialId) {
    return NextResponse.json({ success: false, error: "Falta el id del memorial" }, { status: 400 });
  }

  try {
    if (type === "condolences") {
      const dbCondolences = await prisma.condolence.findMany({
        where: { memorialId },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, data: dbCondolences });
    } else {
      const dbMemories = await prisma.memory.findMany({
        where: { memorialId },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, data: dbMemories });
    }
  } catch (error) {
    console.warn("Prisma error, returning mock memories/condolences", error);
    // Filter mocks based on memorialId
    if (type === "condolences") {
      const filtered = mockCondolences.filter(c => c.memorialId === memorialId || memorialId.includes("alejandro"));
      return NextResponse.json({ success: true, data: filtered });
    } else {
      const filtered = mockMemories.filter(m => m.memorialId === memorialId || memorialId.includes("alejandro"));
      return NextResponse.json({ success: true, data: filtered });
    }
  }
}

export async function POST(request: NextRequest) {
  // 30 writes per minute per IP
  if (!rateLimit(request, { limit: 30, windowMs: 60_000, route: "POST:/api/memories" })) {
    return tooManyRequests();
  }

  try {
    const body = await request.json();
    const { isCondolence, memorialId, authorName, message, title, content, type, fileUrl, authorRelation } = body;

    if (!memorialId || !authorName) {
      return NextResponse.json({ success: false, error: "Faltan campos obligatorios" }, { status: 400 });
    }

    try {
      if (isCondolence) {
        if (!message) {
          return NextResponse.json({ success: false, error: "Falta el mensaje de condolencia" }, { status: 400 });
        }
        const condolence = await prisma.condolence.create({
          data: {
            authorName,
            message,
            memorialId
          }
        });
        return NextResponse.json({ success: true, data: condolence });
      } else {
        if (!title || !type) {
          return NextResponse.json({ success: false, error: "Faltan título o tipo de recuerdo" }, { status: 400 });
        }
        const memory = await prisma.memory.create({
          data: {
            type,
            title,
            content,
            fileUrl,
            authorName,
            authorRelation: authorRelation || "Familiar",
            memorialId
          }
        });
        return NextResponse.json({ success: true, data: memory });
      }
    } catch (dbError) {
      console.warn("Prisma error, falling back to writing in mock DB", dbError);
      
      if (isCondolence) {
        const newMockCondolence = {
          id: `c-mock-${Date.now()}`,
          authorName,
          message,
          memorialId,
          createdAt: new Date().toISOString()
        };
        mockCondolences.push(newMockCondolence);
        return NextResponse.json({ success: true, data: newMockCondolence, warning: "Guardado en mock" });
      } else {
        const newMockMemory = {
          id: `m-mock-${Date.now()}`,
          type,
          title,
          content,
          fileUrl: fileUrl || (type === "PHOTO" ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" : null),
          authorName,
          authorRelation: authorRelation || "Familiar",
          memorialId,
          createdAt: new Date().toISOString()
        };
        mockMemories.push(newMockMemory);
        return NextResponse.json({ success: true, data: newMockMemory, warning: "Guardado en mock" });
      }
    }
  } catch {
    return NextResponse.json({ success: false, error: "Error al procesar petición" }, { status: 500 });
  }
}
