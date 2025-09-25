/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://lakeviewvillatangalle.com",
  generateRobotsTxt: true,
  exclude: ["/api/*", "/search"],
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
  outDir: "public",
  transform: async (config, path) => {
    const p =
      {
        "/": 1.0,
        "/stays": 0.9,
        "/gallery": 0.7,
        "/visit": 0.7,
        "/faq": 0.6,
      }[path] ?? 0.7;

    return {
      loc: path,
      changefreq: "weekly",
      priority: p,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/search" },
    ],
    additionalSitemaps: ["https://lakeviewvillatangalle.com/sitemap.xml"],
  },
};
