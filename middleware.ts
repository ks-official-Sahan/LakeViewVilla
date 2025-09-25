// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY = "lakeviewvillatangalle.com";
const SECONDARY = "lakeviewtangalle.com";

const isLocalHost = (host?: string) =>
  !!host &&
  (host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local"));

const isVercelPreview = (host?: string) => {
  if (!host) return false;
  // Vercel sets VERCEL_ENV=production|preview|development at build/runtime
  const env = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;
  return host.endsWith(".vercel.app") && env !== "production";
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || url.hostname;
  const { pathname } = url;

  const isProd = process.env.NODE_ENV === "production";
  const skipCanonical = !isProd || isLocalHost(host) || isVercelPreview(host);

  // 1) Canonical domain + HTTPS → only in real production (not local dev / preview)
  if (!skipCanonical) {
    const needsHttps = url.protocol === "http:";
    const needsPrimary = url.hostname === SECONDARY || url.hostname !== PRIMARY; // collapse www/any to apex

    if (needsHttps || needsPrimary) {
      url.protocol = "https:";
      url.hostname = PRIMARY;
      url.port = ""; // ✅ never carry the local dev port into prod redirects
      return NextResponse.redirect(url, 308);
    }
  }

  // 2) Trailing slash normalization (safe everywhere)
  if (pathname !== "/" && pathname.endsWith("/")) {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  // 3) Security headers (CSP is slightly looser in dev to allow React Fast Refresh)
  const res = NextResponse.next();

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    // Scripts: allow Vercel analytics; keep 'unsafe-eval' ONLY outside prod for HMR
    `script-src 'self' 'unsafe-inline' ${
      isProd ? "" : "'unsafe-eval'"
    } https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: *.booking.com",
    "font-src 'self' data:",
    "connect-src 'self' https://va.vercel-scripts.com",
    "frame-src https://www.google.com https://*.google.com https://*.gstatic.com https://www.youtube.com https://www.youtube-nocookie.com",
    "media-src 'self' https: data: blob:",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

  res.headers.set("Content-Security-Policy", csp);
  // HSTS is a no-op on http, but fine to send always
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  // (Avoid conflicting with next.config header; you can remove one if you prefer)
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
