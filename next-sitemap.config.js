// next-sitemap.config.js — FULL PRODUCTION-GRADE CONFIG
/** @type {import('next-sitemap').IConfig} */
const SITE_URL = process.env.SITE_URL || "https://lakeviewvillatangalle.com";

if (!/^https?:\/\/[^/]+$/.test(SITE_URL)) {
  throw new Error(
    `Invalid SITE_URL (${SITE_URL}). Set env SITE_URL to 'https://lakeviewvillatangalle.com'`
  );
}

/** Absolute URL helper */
const abs = (path) =>
  path
    ? path.startsWith("http")
      ? path
      : `${SITE_URL.replace(/\/$/, "")}${
          path.startsWith("/") ? path : `/${path}`
        }`
    : undefined;

/** Page priorities */
const PRIORITY_MAP = {
  "/": 1.0,
  "/stays": 0.9,
  "/visit": 0.7,
  "/faq": 0.6,
  "/developer": 1.0,
  "/developer/cv": 1.0,
  "/links/airbnb": 0.85,
  "/links/instagram": 0.75,
  "/links/facebook": 0.75,
  "/links/booking": 0.8,
  "/links/airbnb/view": 0.85,
  "/links/instagram/view": 0.75,
  "/links/facebook/view": 0.75,
  "/links/booking/view": 0.8,
  // "/watch/hero": 0.8,
  "/gallery": 0.7,
};

/** IMAGE MAP — complete list of all images for `/` and `/gallery` */
const IMAGE_MAP = {
  "/": [
    { url: "/villa/yala-safari.webp", title: "Yala Safari Adventure" },
    { url: "/villa/yala-safari.avif", title: "Yala Safari Adventure" },
    { url: "/villa/turtle-beach.webp", title: "Turtle Beach Experience" },
    { url: "/villa/turtle-beach.avif", title: "Turtle Beach Experience" },
    { url: "/villa/blowhole.webp", title: "Hummanaya Blowhole View" },
    { url: "/villa/blowhole.avif", title: "Hummanaya Blowhole View" },
    { url: "/villa/villa_img_01.webp", title: "Lake View Villa Exterior" },
    { url: "/villa/villa_img_01.avif", title: "Lake View Villa Exterior" },
    { url: "/villa/villa_img_02.webp", title: "Villa Garden & Exterior" },
    { url: "/villa/villa_img_02.avif", title: "Villa Garden & Exterior" },
    { url: "/villa/beach_img_01.webp", title: "Private Beach View" },
    { url: "/villa/beach_img_01.avif", title: "Private Beach View" },
    { url: "/villa/with_guests_01.webp", title: "Guests Enjoying the Villa" },
    { url: "/villa/with_guests_01.avif", title: "Guests Enjoying the Villa" },
    { url: "/villa/with_guests_02.webp", title: "Guests at Dining Area" },
    { url: "/villa/with_guests_02.avif", title: "Guests at Dining Area" },
    { url: "/villa/with_guests_04_dining.webp", title: "Dining with Guests" },
    { url: "/villa/with_guests_04_dining.avif", title: "Dining with Guests" },
    { url: "/villa/room_02_img_01.webp", title: "Room 2 – Twin Beds" },
    { url: "/villa/room_02_img_01.avif", title: "Room 2 – Twin Beds" },
    { url: "/villa/villa_outside_01.webp", title: "Villa Exterior Garden" },
    { url: "/villa/villa_outside_01.avif", title: "Villa Exterior Garden" },
  ],
  "/gallery": [
    { url: "/villa/beach_img_01.webp", title: "Private Beach View" },
    { url: "/villa/beach_img_01.avif", title: "Private Beach View" },
    { url: "/villa/garden_img_01.webp", title: "Garden Walkway" },
    { url: "/villa/garden_img_01.avif", title: "Garden Walkway" },
    { url: "/villa/garden_img_02.webp", title: "Garden Walkway" },
    { url: "/villa/garden_img_02.avif", title: "Garden Walkway" },
    { url: "/villa/garden_img_03.webp", title: "Garden Walkway" },
    { url: "/villa/garden_img_03.avif", title: "Garden Walkway" },
    { url: "/villa/garden_img_04.webp", title: "Garden Walkway" },
    { url: "/villa/garden_img_04.avif", title: "Garden Walkway" },
    { url: "/villa/garden_img_05.webp", title: "Garden Walkway" },
    { url: "/villa/garden_img_05.avif", title: "Garden Walkway" },
    { url: "/villa/kitchen_img_01.webp", title: "Villa Kitchen Interior" },
    { url: "/villa/kitchen_img_01.avif", title: "Villa Kitchen Interior" },
    { url: "/villa/kitchen_img_02.webp", title: "Villa Kitchen" },
    { url: "/villa/kitchen_img_02.avif", title: "Villa Kitchen" },
    { url: "/villa/kitchen_img_03.webp", title: "Villa Kitchen" },
    { url: "/villa/kitchen_img_03.avif", title: "Villa Kitchen" },
    { url: "/villa/kitchen_img_04.webp", title: "Villa Kitchen" },
    { url: "/villa/kitchen_img_04.avif", title: "Villa Kitchen" },
    { url: "/villa/lake_img_01.webp", title: "Lake View" },
    { url: "/villa/lake_img_01.avif", title: "Lake View" },
    { url: "/villa/lake_img_02.webp", title: "Lake View" },
    { url: "/villa/lake_img_02.avif", title: "Lake View" },
    { url: "/villa/room_01_img_01.webp", title: "Room 1 – King Bed" },
    { url: "/villa/room_01_img_01.avif", title: "Room 1 – King Bed" },
    { url: "/villa/room_01_img_02.webp", title: "Room 1 – King Bed" },
    { url: "/villa/room_01_img_02.avif", title: "Room 1 – King Bed" },
    { url: "/villa/room_01_img_03_cot.webp", title: "Room 1 – Cot Bed" },
    { url: "/villa/room_01_img_03_cot.avif", title: "Room 1 – Cot Bed" },
    { url: "/villa/room_01_img_04_bathroom.webp", title: "Room 1 Bathroom" },
    { url: "/villa/room_01_img_04_bathroom.avif", title: "Room 1 Bathroom" },
    { url: "/villa/room_01_img_05_bathroom.webp", title: "Room 1 Bathroom" },
    { url: "/villa/room_01_img_05_bathroom.avif", title: "Room 1 Bathroom" },
    { url: "/villa/room_02_img_01.webp", title: "Room 2 – King Bed" },
    { url: "/villa/room_02_img_01.avif", title: "Room 2 – King Bed" },
    { url: "/villa/room_02_img_02.webp", title: "Room 2 – King Bed" },
    { url: "/villa/room_02_img_02.avif", title: "Room 2 – King Bed" },
    { url: "/villa/room_02_img_03.webp", title: "Room 2 – Bed" },
    { url: "/villa/room_02_img_03.avif", title: "Room 2 – Bed" },
    { url: "/villa/room_02_img_04_bathroom.webp", title: "Room 2 Bathroom" },
    { url: "/villa/room_02_img_04_bathroom.avif", title: "Room 2 Bathroom" },
    { url: "/villa/room_img_01.webp", title: "Bedroom Interior" },
    { url: "/villa/room_img_01.avif", title: "Bedroom Interior" },
  ],
};

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  outDir: "public",
  trailingSlash: false,
  changefreq: "weekly",
  priority: 0.7,

  exclude: ["/api/*", "/search", "/_error", "/_next/*", "/og/*"],

  transform: async (config, path) => {
    const images = (IMAGE_MAP[path] ?? [])
      .map((img) =>
        img?.url && abs(img.url)
          ? {
              url: abs(img.url),
              loc: abs(img.url),
              title: img.title,
              caption: img.title,
            }
          : null
      )
      .filter(Boolean);

    const video =
      path === "/watch/hero"
        ? [
            {
              title: "Hero Video — Lake View Villa",
              description:
                "A short hero video showcasing Lake View Villa Tangalle.",
              content_loc: abs("/hero.webm"),
              thumbnail_loc: abs("/villa/villa_img_01.webp"),
              duration: 18,
            },
          ]
        : undefined;

    return {
      loc: abs(path),
      changefreq: "weekly",
      priority: PRIORITY_MAP[path] ?? 0.7,
      lastmod: new Date().toISOString(),
      images: images.length ? images : undefined,
      video,
    };
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/search", "/_next/", "/api/", "/_error"] },
    ],
    additionalSitemaps: [`${SITE_URL.replace(/\/$/, "")}/sitemap.xml`],
  },
};
