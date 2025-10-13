import bundleAnalyzer from "@next/bundle-analyzer";
/** @type {import('next').NextConfig} */

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProd = process.env.NODE_ENV === "production";

// ───────────────────────────────
// Security headers (no CSP duplication here)
// ───────────────────────────────
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
  // { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Cross-Origin-Opener-Policy",
    value: isProd ? "same-origin" : "same-origin-allow-popups",
  },
  // { key: "Cross-Origin-Embedder-Policy", value: "require-corp"},
  // { key: "X-XSS-Protection", value: "1; mode=block" },
  // { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
];

// ───────────────────────────────
// Content Security Policy (CSP)
// Allows: Next runtime, GTM/GA, Meta pixel, Vercel Analytics,
// Google Maps, Google Fonts, YouTube/IG/FB embeds, icons/fonts.
// No 'unsafe-eval' in prod (only dev for HMR).
// ───────────────────────────────
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

  // Images (self + data/blob + HTTPS + Maps photos)
  "img-src 'self' data: blob: https: https://*.ggpht.com",

  // Styles (Next injects inline styles; allow https for Google Fonts CSS)
  "style-src 'self' 'unsafe-inline' https:",

  // Fonts (self-hosted/next/font + Google Fonts + data:)
  "font-src 'self' https: data: https://fonts.gstatic.com",

  // Scripts
  SCRIPT_SRC,

  // XHR/WebSocket targets
  CONNECT_SRC,

  // Frames/embeds (GTM, Google, YouTube, Instagram, Facebook, Maps)
  FRAME_SRC,

  // Media (video/audio)
  "media-src 'self' data: blob: https:",

  // Workers/Manifest
  "worker-src 'self' blob:",
  // "manifest-src 'self'", //Remove manifest-src (Chrome occasionally misfires even when it’s self). It will inherit from default-src 'self' anyway.
].join("; ");

// ───────────────────────────────
// HTTP Link-based preconnects
// ───────────────────────────────
const preconnectLinks = [
  "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
  "<https://www.googletagmanager.com>; rel=preconnect; crossorigin",
  "<https://vitals.vercel-analytics.com>; rel=preconnect; crossorigin",
  // "<https://www.google-analytics.com>; rel=preconnect; crossorigin",
  // "<https://region1.google-analytics.com>; rel=preconnect; crossorigin",
  // "<https://connect.facebook.net>; rel=preconnect; crossorigin",
  // "<https://va.vercel-scripts.com>; rel=preconnect; crossorigin",
  // "<https://maps.googleapis.com>; rel=preconnect; crossorigin",
  // "<https://maps.gstatic.com>; rel=preconnect; crossorigin",
  // "<https://fonts.googleapis.com>; rel=preconnect",
];

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  poweredByHeader: false,

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1536, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
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
        // Cache common static assets (incl. fonts/icons/videos)
        source:
          "/(.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|eot|mp4|webm))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next image optimizer responses
        source: "/_next/image(.*)",
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
      // secondary → primary (apex)
      {
        source: "/:path*",
        has: [{ type: "host", value: "lakeviewtangalle.com" }],
        destination: "https://lakeviewvillatangalle.com/:path*",
        permanent: true,
      },
      // www → apex (primary)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lakeviewvillatangalle.com" }],
        destination: "https://lakeviewvillatangalle.com/:path*",
        permanent: true,
      },
      // www.secondary → apex (primary)
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
      transform: "lucide-react/dist/esm/icons/{{member}}",
      preventFullImport: true,
    },
  },

  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "@vercel/analytics",
      "lenis",
      "three",
      "lucide-react",
      "@mantine/core",
      // "@mantine/hooks",
      // "@mantine/notifications",
      // "@mantine/dates",
      // "@mantine/modals",
      "@tabler/icons-react",
    ],
  },
};

// export default nextConfig;
export default withBundleAnalyzer(nextConfig);
