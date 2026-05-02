// app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://lakeviewvillatangalle.com";

// ─── Shared disallow lists ────────────────────────────────────────────────────
const API_ONLY = ["/api/"];
const API_AND_NEXT = ["/api/", "/_next/"];

// ─── Crawlers that need /_next/ to fully render JS (search quality bots) ─────
const FULL_RENDER_ALLOW = ["/", "/_next/static/", "/_next/image"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─────────────────────────────────────────────────────────────────────
      // DEFAULT — all unspecified crawlers
      // Allow content, block internal API and Next.js build artifacts
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...API_AND_NEXT,
          "/admin/",
          "/search",
          "/_error",
          "/404",
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // GOOGLE — full render access for indexing + ad quality scoring
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Googlebot",
        allow: FULL_RENDER_ALLOW,
        disallow: API_ONLY,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/_next/image"],
        disallow: API_ONLY,
      },
      {
        // Google Ads quality crawler — must render landing pages for Ad Score
        userAgent: "AdsBot-Google",
        allow: FULL_RENDER_ALLOW,
        disallow: API_ONLY,
      },
      {
        userAgent: "AdsBot-Google-Mobile",
        allow: FULL_RENDER_ALLOW,
        disallow: API_ONLY,
      },
      {
        // Google AI training + Gemini citation
        userAgent: "Google-Extended",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        // Google Cloud Vertex AI crawler
        userAgent: "Google-CloudVertexBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // MICROSOFT / BING — full render for search + ads
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Bingbot",
        allow: FULL_RENDER_ALLOW,
        disallow: API_ONLY,
      },
      {
        // Microsoft Ads quality bot
        userAgent: "adidxbot",
        allow: "/",
        disallow: API_ONLY,
      },

      // ─────────────────────────────────────────────────────────────────────
      // OPENAI — ChatGPT citations + browsing + search
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // ANTHROPIC — Claude citations + browsing
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "Claude-User",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // PERPLEXITY — AI search citations
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // META — Facebook link previews + AI
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "Meta-ExternalFetcher",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // BYTEDANCE — TikTok + Douyin AI indexing
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "TikTok Spider",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // APPLE — Siri + Safari suggestions
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // AMAZON — Alexa AI + product research
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // DUCKDUCKGO — DuckAssist AI answers
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "DuckAssistBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // MISTRAL — Le Chat AI citations
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "MistralAI-User",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // MANUS — Agentic AI browser
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Manus Bot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // CLOUDFLARE — AI crawler (Cloudflare AI Gateway)
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Cloudflare Crawler",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // HUAWEI — PetalSearch AI indexing
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "PetalBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // COHERE — Command R AI citations
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // PRORATA — Content licensing + attribution AI
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "ProRataInc",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // NOVELLUM — AI content crawler
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Novellum AI Crawl",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // TIMPI — Decentralised search engine
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Timpibot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // TERRACOTTA — Ceramic Network search crawler
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Terracotta Bot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // ARCHIVERS — Internet preservation (citation value for GEO)
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "archive.org_bot",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        userAgent: "Arquivo Web Crawler",
        allow: "/",
        disallow: API_AND_NEXT,
      },
      {
        // Common Crawl — feeds most open-source LLM training datasets
        userAgent: "CCBot",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // ANCHOR BROWSER — AI-native browser
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Anchor Browser",
        allow: "/",
        disallow: API_AND_NEXT,
      },

      // ─────────────────────────────────────────────────────────────────────
      // BLOCKED — aggressive link analysis scrapers with no citation value
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

// const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       // Allow all standard search engine crawlers
//       { userAgent: "Googlebot", allow: "/" },
//       { userAgent: "Bingbot", allow: "/" },
//       { userAgent: "Slurp", allow: "/" },
//       { userAgent: "DuckDuckBot", allow: "/" },
//       { userAgent: "Baiduspider", allow: "/" },
//       { userAgent: "YandexBot", allow: "/" },
//       { userAgent: "Applebot", allow: "/" },
//       { userAgent: "Twitterbot", allow: "/" },
//       { userAgent: "facebookexternalhit", allow: "/" },

//       // Explicitly allow ALL AI crawlers (no restrictions)
//       { userAgent: "GPTBot", allow: "/" },
//       { userAgent: "ChatGPT-User", allow: "/" },
//       { userAgent: "Google-Extended", allow: "/" },
//       { userAgent: "PerplexityBot", allow: "/" },
//       { userAgent: "ClaudeBot", allow: "/" },
//       { userAgent: "Bytespider", allow: "/" },
//       { userAgent: "cohere-ai", allow: "/" },
//       { userAgent: "anthropic-ai", allow: "/" },
//       { userAgent: "OAI-SearchBot", allow: "/" },
//       { userAgent: "CCBot", allow: "/" },
//       { userAgent: "Omgilibot", allow: "/" },
//       { userAgent: "Omgili", allow: "/" },

//       // Catch-all for all other crawlers
//       {
//         userAgent: "*",
//         allow: "/",
//         disallow: [
//           "/admin/",
//           "/api/",
//           "/_next/",
//           "/search",
//           "/_error",
//           "/404",
//           "/login",
//           "/register",
//           "/dashboard",
//         ],
//       },
//     ],
//     sitemap: `${SITE}/sitemap.xml`,
//     host: SITE,
//   };
// }

// import { MetadataRoute } from "next";

// const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       // Standard search engine crawlers
//       { userAgent: "Googlebot", allow: "/" },
//       { userAgent: "Bingbot", allow: "/" },
//       { userAgent: "Slurp", allow: "/" }, // Yahoo
//       { userAgent: "DuckDuckBot", allow: "/" },
//       { userAgent: "Baiduspider", allow: "/" },
//       { userAgent: "YandexBot", allow: "/" },

//       // AI and LLM crawlers
//       { userAgent: "GPTBot", allow: "/" },
//       { userAgent: "ChatGPT-User", allow: "/" },
//       { userAgent: "Google-Extended", allow: "/" },
//       { userAgent: "PerplexityBot", allow: "/" },
//       { userAgent: "ClaudeBot", allow: "/" },
//       { userAgent: "Applebot", allow: "/" },
//       { userAgent: "Bytespider", allow: "/" },
//       { userAgent: "cohere-ai", allow: "/" },
//       { userAgent: "anthropic-ai", allow: "/" },
//       { userAgent: "OAI-SearchBot", allow: "/" },
//       { userAgent: "CCBot", allow: "/" }, // Common Crawl (used by many LLMs)
//       { userAgent: "Omgilibot", allow: "/" }, // AI crawler
//       { userAgent: "Omgili", allow: "/" }, // AI crawler

//       // Social media bots
//       { userAgent: "Twitterbot", allow: "/" },
//       { userAgent: "facebookexternalhit", allow: "/" },
//       { userAgent: "LinkedInBot", allow: "/" },
//       { userAgent: "Pinterestbot", allow: "/" },

//       // Catch-all rules
//       {
//         userAgent: "*",
//         allow: "/",
//         disallow: ["/admin/", "/api/", "/_next/", "/search", "/_error"],
//       },
//     ],
//     sitemap: `${SITE}/sitemap.xml`,
//     host: SITE,
//   };
// }