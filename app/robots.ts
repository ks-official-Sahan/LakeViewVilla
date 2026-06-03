import { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engine crawlers (FULL_RENDER_ALLOW via /_next/static/)
      { userAgent: "Googlebot", allow: ["/", "/_next/static/"] },
      { userAgent: "Bingbot", allow: ["/", "/_next/static/"] },
      { userAgent: "Slurp", allow: "/" }, // Yahoo
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },

      // AI and LLM crawlers (FULL_RENDER_ALLOW via /_next/static/)
      { userAgent: "GPTBot", allow: ["/", "/_next/static/"] },
      { userAgent: "ChatGPT-User", allow: ["/", "/_next/static/"] },
      { userAgent: "Google-Extended", allow: ["/", "/_next/static/"] },
      { userAgent: "PerplexityBot", allow: ["/", "/_next/static/"] },
      { userAgent: "ClaudeBot", allow: ["/", "/_next/static/"] },
      { userAgent: "Applebot", allow: ["/", "/_next/static/"] },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: ["/", "/_next/static/"] },
      { userAgent: "CCBot", allow: "/" }, // Common Crawl (used by many LLMs)
      { userAgent: "Omgilibot", allow: "/" }, // AI crawler
      { userAgent: "Omgili", allow: "/" }, // AI crawler

      // Social media bots
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "facebookexternalhit", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
      { userAgent: "Pinterestbot", allow: "/" },

      // Catch-all rules
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/search", "/_error"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}