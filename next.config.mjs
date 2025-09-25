/** @type {import('next').NextConfig} */

// ───────────────────────────────
// Security headers (global)
// ───────────────────────────────
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Minimal, explicit. (FLoC/Topics disabled by omission.)
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), fullscreen=(self),   interest-cohort=(), sync-xhr=(), sync-script=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // ⚠️ COEP removed globally to avoid breaking Google Maps & other third-party iframes
  // { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
];

// ───────────────────────────────
// Content Security Policy
// Add vendors as you integrate them. Maps is enabled below.
// ───────────────────────────────
const CSP = [
  "default-src 'self'",
  // Images (include ggpht.com used by Google Maps photos/tiles)
  "img-src 'self' data: blob: https: https://*.ggpht.com",
  "font-src 'self' https: data:",
  "style-src 'self' 'unsafe-inline' https:",
  // Scripts: GTM/GA/Meta + Vercel Analytics + Google Maps APIs
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://vitals.vercel-analytics.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com",
  // XHR/Websocket: include Maps endpoints
  "connect-src 'self' https://vitals.vercel-analytics.com https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com",
  // Iframes: Google (maps/youtube/etc.) + Instagram/Facebook widgets
  "frame-src https://www.googletagmanager.com https://www.google.com https://maps.google.com https://*.google.com https://www.youtube.com https://www.instagram.com https://www.facebook.com",
  "media-src 'self' blob: data:",
  "object-src 'none'",
  "base-uri 'self'",
  // WhatsApp web intents
  "form-action 'self' https://wa.me",
  "upgrade-insecure-requests",
  "frame-ancestors 'self'",
].join("; ");

// ───────────────────────────────
// HTTP Link-based preconnects
// ───────────────────────────────
const preconnectLinks = [
  "<https://www.googletagmanager.com>; rel=preconnect; crossorigin",
  "<https://www.google-analytics.com>; rel=preconnect; crossorigin",
  "<https://connect.facebook.net>; rel=preconnect; crossorigin",
  "<https://vitals.vercel-analytics.com>; rel=preconnect; crossorigin",
  // Maps speed-ups
  "<https://maps.googleapis.com>; rel=preconnect; crossorigin",
  "<https://maps.gstatic.com>; rel=preconnect; crossorigin",
];

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Keep relaxed in CI; enforce locally if desired
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
      // Maps tiles/imagery domains are covered by https:, but this is explicit:
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
        ],
      },
      {
        source: "/(.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'none'; img-src 'self' data: blob: https:; style-src 'none'; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["framer-motion", "gsap", "@vercel/analytics"],
  },
};

export default nextConfig;
