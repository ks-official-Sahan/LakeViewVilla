// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  if (hostname === "lakeviewtangalle.com") {
    return NextResponse.redirect(
      `https://lakeviewvillatangalle.com${pathname}`,
      308
    );
  }

  const response = NextResponse.next();

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    // Dev-friendly; tighten in prod by removing 'unsafe-eval' if you can.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: *.booking.com",
    "font-src 'self' data:",
    "connect-src 'self' https://va.vercel-scripts.com",
    // ✅ allow Google/YouTube iframes (maps uses google.com + gstatic assets internally)
    "frame-src https://www.google.com https://*.google.com https://*.gstatic.com https://www.youtube.com https://*.youtube.com",
    // ✅ allow remote media + local data/blob
    "media-src 'self' https: data: blob:",
    // prevent clickjacking of *your* pages
    "frame-ancestors 'none'",
    // Optional hardening
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY"); // ok: this protects *your* pages; it won’t block *your* outbound iframes
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
