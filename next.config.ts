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

  // Next.js 16 — Cache Components + named profiles for cacheLife() in cached data helpers
  cacheComponents: true,
  cacheLife: {
    pages: { stale: 30, revalidate: 60, expire: 3600 },
    gallery: { stale: 300, revalidate: 600, expire: 86400 },
    blogList: {
      stale: 60,
      revalidate: 120,
      expire: 7200,
    },
    blogPost: {
      stale: 120,
      revalidate: 300,
      expire: 86400,
    },
    blogSitemap: {
      stale: 300,
      revalidate: 600,
      expire: 86400,
    },
    admin: { stale: 0, revalidate: 5, expire: 60 },
    seoMeta: { stale: 600, revalidate: 1800, expire: 604800 },
  },
  reactCompiler: true,

  typescript: { ignoreBuildErrors: false },
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
    "@tabler/icons-react": {
      transform: "@tabler/icons-react/dist/esm/icons/{{member}}",
      preventFullImport: true,
    },
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
    viewTransition: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,

  },
};

export default withBundleAnalyzer(nextConfig);
