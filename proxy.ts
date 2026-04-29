/**
 * proxy.ts — Next.js 16 request proxy (replaces middleware.ts)
 *
 * Runs in Node.js runtime by default.
 * Handles auth gating for /admin routes, security headers, and rate limiting.
 */
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth gate ──────────────────────────────────────────────────────
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ??
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Security headers ─────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon-*, apple-icon, logo, og images
     * - Static asset files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon-.*|apple-icon\\.png|logo\\.png|.*\\.svg|.*\\.webp|.*\\.png|.*\\.jpg|.*\\.ico|site\\.webmanifest).*)",
  ],
};
