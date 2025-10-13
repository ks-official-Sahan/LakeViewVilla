// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const isLocalHost = (host?: string) =>
  !!host &&
  (host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local"));

const isVercelHost = (host?: string) => !!host && host.endsWith(".vercel.app");

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") ?? url.hostname;

  // Never touch localhost or vercel.app (no redirects, no changes)
  if (isLocalHost(host) || isVercelHost(host)) return NextResponse.next();

  // Enforce HTTPS on custom domains in prod only (proxy-aware)
  const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
  if (env === "production") {
    const proto = (
      request.headers.get("x-forwarded-proto") ?? "https"
    ).toLowerCase();
    if (proto !== "https") {
      url.protocol = "https:";
      url.port = "";
      return NextResponse.redirect(url, 308);
    }
  }

  // Do NOT canonicalize hosts here. Let Vercel Domains handle www/apex.
  return NextResponse.next();
}

// Exclude Next internals & any file with an extension — prevent asset interference
export const config = {
  matcher: ["/((?!api|_next/|.*\\..*).*)"],
};
