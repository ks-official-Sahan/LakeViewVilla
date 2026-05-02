/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://lakeviewvillatangalle.com",
  generateRobotsTxt: false, // We manage robots.txt manually
  generateIndexSitemap: true,
  outDir: "public",
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,

  // Exclude admin and API routes
  exclude: [
    "/admin",
    "/admin/*",
    "/api/*",
    "/404",
    "/500",
    "/_not-found",
  ],

  // Custom priority overrides
  additionalPaths: async () => {
    const paths = [];

    // Try to fetch dynamic blog posts from database
    // Falls back to empty array if DB not available at build time
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const posts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      });

      for (const post of posts) {
        paths.push({
          loc: `/blog/${post.slug}`,
          changefreq: "monthly",
          priority: 0.6,
          lastmod: post.updatedAt.toISOString(),
        });
      }

      await prisma.$disconnect();
    } catch {
      // DB not available at sitemap generation time — static paths only
    }

    return paths;
  },

  // Override priorities for specific static pages
  transform: async (config, path) => {
    const priorityMap = {
      "/": 1.0,
      "/stays": 0.9,
      "/gallery": 0.8,
      "/visit": 0.75,
      "/blog": 0.75,
      "/faq": 0.6,
      "/developer": 0.3,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorityMap[path] ?? config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};

module.exports = config;
