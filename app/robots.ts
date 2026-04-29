import { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engine crawlers
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Slurp", allow: "/" }, // Yahoo
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },

      // AI and LLM crawlers
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
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