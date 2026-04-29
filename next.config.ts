import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";

// ─── Security Headers ────────────────────────────────────────────────────────
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), fullscreen=(self)",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  {
    key: "Cross-Origin-Opener-Policy",
    value: isProd ? "same-origin" : "same-origin-allow-popups",
  },
];

// ─── Content Security Policy ─────────────────────────────────────────────────
const SCRIPT_SRC = [
  "script-src",
  "'self'",
  "'unsafe-inline'",
  isProd ? "" : "'unsafe-eval'",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com",
  "https://connect.facebook.net",
  "https://vitals.vercel-analytics.com",
  "https://va.vercel-scripts.com",
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  "https://*.googleapis.com",
  "https://*.gstatic.com",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
]
  .filter(Boolean)
  .join(" ");

const CONNECT_SRC = [
  "connect-src",
  "'self'",
  "https://lakeviewvillatangalle.com",
  "https://www.lakeviewvillatangalle.com",
  "https://lakeviewvilla.vercel.app",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://tagassistant.google.com",
  "https://region1.google-analytics.com",
  "https://stats.g.doubleclick.net",
  "https://vitals.vercel-analytics.com",
  "https://va.vercel-scripts.com",
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  "https://*.g.doubleclick.net",
  "https://*.googleapis.com",
  "https://*.gstatic.com",
  // Cloudinary for media management
  "https://res.cloudinary.com",
  "https://api.cloudinary.com",
].join(" ");

const FRAME_SRC = [
  "frame-src",
  "https://www.googletagmanager.com",
  "https://tagassistant.google.com",
  "https://www.google.com",
  "https://maps.google.com",
  "https://*.google.com",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
  "https://www.instagram.com",
  "https://www.facebook.com",
].join(" ");

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://wa.me",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
  "img-src 'self' data: blob: https: https://*.ggpht.com https://res.cloudinary.com",
  "style-src 'self' 'unsafe-inline' https:",
  "font-src 'self' https: data: https://fonts.gstatic.com",
  SCRIPT_SRC,
  CONNECT_SRC,
  FRAME_SRC,
  "media-src 'self' data: blob: https:",
  "worker-src 'self' blob:",
].join("; ");

// ─── Preconnect links ────────────────────────────────────────────────────────
const preconnectLinks = [
  "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
  "<https://www.googletagmanager.com>; rel=preconnect; crossorigin",
  "<https://vitals.vercel-analytics.com>; rel=preconnect; crossorigin",
];

// ─── Next.js 16 Configuration ────────────────────────────────────────────────
const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false,

  // Packages that must run in Node.js (not bundled by webpack)
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // Next.js 16 — explicit cache directive + automatic memoization
  cacheComponents: true,
  reactCompiler: true,

  typescript: { ignoreBuildErrors: true },
  skipTrailingSlashRedirect: true,

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1536, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    qualities: [75, 80, 90],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "*.booking.com" },
      { protocol: "https", hostname: "lakeviewvillatangalle.com" },
      { protocol: "https", hostname: "lakeviewtangalle.com" },
      { protocol: "https", hostname: "cf.bstatic.com" },
      { protocol: "https", hostname: "r-xx.bstatic.com" },
      { protocol: "https", hostname: "a0.muscache.com" },
      { protocol: "https", hostname: "www.tripadvisor.com" },
      { protocol: "https", hostname: "www.instagram.com" },
      { protocol: "https", hostname: "connect.facebook.net" },
      { protocol: "https", hostname: "*.ggpht.com" },
      { protocol: "https", hostname: "maps.gstatic.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: CSP },
          ...preconnectLinks.map((value) => ({ key: "Link", value })),
          { key: "Vary", value: "Accept-Encoding, Save-Data" },
        ],
      },
      {
        source:
          "/(.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|eot|mp4|webm))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "lakeviewtangalle.com" }],
        destination: "https://lakeviewvillatangalle.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lakeviewvillatangalle.com" }],
        destination: "https://lakeviewvillatangalle.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lakeviewtangalle.com" }],
        destination: "https://lakeviewvillatangalle.com/:path*",
        permanent: true,
      },
    ];
  },

  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
      preventFullImport: true,
    },
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "@gsap/react",
      "@vercel/analytics",
      "lenis",
      "three",
      "@mantine/core",
      "@tabler/icons-react",
      "clsx",
      "tailwind-merge",
      "date-fns",
      "@tanstack/react-query",
      "next-auth",
    ],
    useLightningcss: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
};

export default withBundleAnalyzer(nextConfig);
