/**
 * proxy.ts — Next.js 16 request proxy (replaces middleware.ts)
 *
 * Runs in Node.js runtime by default.
 * Uses lightweight cookie-based session detection for route protection.
 * Full session validation happens in Server Components and API routes.
 */
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin auth gate ──────────────────────────────────────────────────────
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for Auth.js session cookie (JWT strategy)
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ??
      request.cookies.get("__Secure-authjs.session-token")?.value ??
      request.cookies.get("next-auth.session-token")?.value ??
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/admin/login") {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ??
      request.cookies.get("__Secure-authjs.session-token")?.value ??
      request.cookies.get("next-auth.session-token")?.value ??
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // ── Security headers ─────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
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
