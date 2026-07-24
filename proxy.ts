import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

const rateLimitMap = new Map();

export async function proxy(request: NextRequest) {
  // Only apply rate limiting to sensitive routes to avoid blocking assets
  const path = request.nextUrl.pathname;
  const isProtectedPath = path.startsWith('/api') || path === '/login' || path === '/register' || path === '/solicitar-memorial';

  if (isProtectedPath) {
    const ip = request.ip || 
               request.headers.get('x-real-ip') || 
               request.headers.get('x-forwarded-for') || 
               '127.0.0.1';
               
    const MAX_REQUESTS = 50; 
    const WINDOW_MS = 60 * 1000; 
    const currentTime = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: currentTime + WINDOW_MS
      });
    } else {
      const data = rateLimitMap.get(ip);
      if (currentTime > data.resetTime) {
        data.count = 1;
        data.resetTime = currentTime + WINDOW_MS;
      } else {
        data.count++;
        if (data.count > MAX_REQUESTS) {
          return new NextResponse(
            JSON.stringify({ 
              error: 'Too Many Requests', 
              message: 'Has realizado demasiadas peticiones. Por favor, espera un minuto.' 
            }),
            { 
              status: 429, 
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((data.resetTime - currentTime) / 1000).toString()
              } 
            }
          );
        }
      }
    }
  }

  // Continue with Supabase session update for all requests
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
