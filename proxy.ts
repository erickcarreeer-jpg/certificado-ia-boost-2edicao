import { NextRequest, NextResponse } from "next/server"

// In-memory rate limit store (per Vercel instance — good enough for abuse prevention)
const store = new Map<string, { count: number; resetAt: number }>()

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (entry.count >= limit) return true
  entry.count++
  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getIp(request)

  // /api/verify-student — 10 requests per minute per IP (prevents email enumeration)
  if (pathname === "/api/verify-student") {
    if (isRateLimited(`verify:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde um minuto e tente novamente." },
        { status: 429 }
      )
    }
  }

  // /api/check-answers — 20 requests per minute per IP
  if (pathname === "/api/check-answers") {
    if (isRateLimited(`check:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde um minuto e tente novamente." },
        { status: 429 }
      )
    }
  }

  // /api/generate-certificate — stricter: 5 requests per minute per IP
  if (pathname === "/api/generate-certificate") {
    if (isRateLimited(`cert:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde um minuto e tente novamente." },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/verify-student", "/api/check-answers", "/api/generate-certificate"],
}
