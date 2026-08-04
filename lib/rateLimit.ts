/**
 * lib/rateLimit.ts
 *
 * Lightweight in-memory rate limiter for Next.js API routes.
 * Tracks requests per IP per route with a sliding-window bucket.
 *
 * Usage (inside an API route handler):
 *   import { rateLimit } from "@/lib/rateLimit";
 *   const allowed = rateLimit(request, { limit: 20, windowMs: 60_000 });
 *   if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
 */

import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

// Shared in-memory store. Keyed by "<ip>:<route>".
const store = new Map<string, Bucket>();

// Periodically clean expired buckets to prevent memory leaks.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store.entries()) {
    if (now > bucket.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000); // every 5 minutes

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window. */
  limit: number;
  /** Window duration in milliseconds. Default: 60_000 (1 minute). */
  windowMs?: number;
  /** Route identifier – used to isolate counters per endpoint. */
  route?: string;
}

/**
 * Returns true if the request is allowed, false if it has been rate-limited.
 * In development mode it always returns true to avoid blocking hot-reload.
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const { limit, windowMs = 60_000, route = request.nextUrl.pathname } = options;

  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";

  const key = `${ip}:${route}`;
  const now = Date.now();

  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  bucket.count++;

  if (bucket.count > limit) return false;

  return true;
}

/**
 * Returns a 429 response with standard headers.
 */
export function tooManyRequests(retryAfterMs = 60_000): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Demasiadas solicitudes. Por favor, espera un momento.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
        "Content-Type": "application/json",
      },
    }
  );
}
