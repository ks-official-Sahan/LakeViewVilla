/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://lakeviewvillatangalle.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  outDir: "public",
  changefreq: "daily",
  priority: 0.7,
  trailingSlash: false,
  exclude: ["/api/*", "/search", "/_error"],

  transform: async (config, path) => {
    const priorityMap = {
      "/": 1.0,
      "/stays": 0.9,
      "/gallery": 0.7,
      "/visit": 0.7,
      "/faq": 0.6,
      "/developer": 1,
    };

    const IMAGES = {
      "/": [
        {
          loc: "/villa/drone_view_villa.webp",
          title: "Lake View Villa – Lagoon at sunrise",
        },
        { loc: "/images/yala-safari.webp", title: "Yala Safari" },
        { loc: "/images/turtle-beach.webp", title: "Turtle Beach" },
        { loc: "/images/blowhole.webp", title: "Hummanaya Blowhole" },
        { loc: "/villa/villa_img_02.webp", title: "Villa exterior and garden" },
        { loc: "/villa/beach_img_01.webp", title: "Beach view" },
        { loc: "/villa/with_guests_01.webp", title: "With our Guests" },
        { loc: "/villa/with_guests_02.webp", title: "With our Guests" },
        {
          loc: "/villa/with_guests_04_dinning..webp",
          title: "Dining with guests",
        },
        { loc: "/villa/room_02_img_01.webp", title: "Room 2 – Twin beds" },
        {
          loc: "/villa/villa_outside_01.webp",
          title: "Villa exterior and garden",
        },
        { loc: "/villa/villa_img_01.webp", title: "Villa exterior" },
      ],
      "/gallery": [
        { loc: "/villa/beach_img_01.webp", title: "Beach view" },
        {
          loc: "/villa/drone_view_villa.webp",
          title: "Lake View Villa – Lagoon at sunrise",
        },
        { loc: "/villa/garden_img_01.webp", title: "Garden walkway" },
        { loc: "/villa/garden_img_02.webp", title: "Garden walkway" },
        { loc: "/villa/garden_img_03.webp", title: "Garden walkway" },
        { loc: "/villa/garden_img_04.webp", title: "Garden walkway" },
        { loc: "/villa/garden_img_05.webp", title: "Garden walkway" },
        { loc: "/villa/kitchen_img_01.webp", title: "Kitchen" },
        { loc: "/villa/kitchen_img_02.webp", title: "Kitchen" },
        { loc: "/villa/kitchen_img_03.webp", title: "Kitchen" },
        { loc: "/villa/kitchen_img_04.webp", title: "Kitchen" },
        { loc: "/villa/lake_img_01.webp", title: "Lake View" },
        { loc: "/villa/lake_img_02.webp", title: "Lake View" },
        { loc: "/villa/room_01_img_01.webp", title: "Room 1 – King bed" },
        { loc: "/villa/room_01_img_02.webp", title: "Room 1 – King bed" },
        { loc: "/villa/room_01_img_03_cot.webp", title: "Room 1 – Cot" },
        {
          loc: "/villa/room_01_img_04_bathroom.webp",
          title: "Room 1 – Bathroom",
        },
        {
          loc: "/villa/room_01_img_05_bathroom.webp",
          title: "Room 1 – Bathroom",
        },
        { loc: "/villa/room_02_img_01.webp", title: "Room 2 – King bed" },
        { loc: "/villa/room_02_img_02.webp", title: "Room 2 – King bed" },
        { loc: "/villa/room_02_img_03.webp", title: "Room 2 – Bed" },
        {
          loc: "/villa/room_02_img_04_bathroom.webp",
          title: "Room 2 – Bathroom",
        },
        { loc: "/villa/room_img_01.webp", title: "Bedroom interior" },
        { loc: "/villa/villa_img_01.webp", title: "Villa exterior" },
        { loc: "/villa/villa_img_02.webp", title: "Villa exterior and garden" },
        {
          loc: "/villa/villa_outside_01.webp",
          title: "Villa exterior and garden",
        },
        {
          loc: "/villa/villa_outside_02.webp",
          title: "Villa exterior and garden",
        },
        {
          loc: "/villa/villa_outside_03.webp",
          title: "Villa exterior and garden",
        },
        {
          loc: "/villa/villa_outside_04.webp",
          title: "Villa exterior and garden",
        },
        {
          loc: "/villa/villa_outside_05.webp",
          title: "Villa exterior and garden",
        },
        {
          loc: "/villa/villa_outside_06.webp",
          title: "Villa exterior and garden",
        },
        {
          loc: "/villa/villa_outside_07.webp",
          title: "Villa exterior and garden",
        },
        { loc: "/villa/with_guests_01.webp", title: "With our Guests" },
        { loc: "/villa/with_guests_02.webp", title: "With our Guests" },
        { loc: "/villa/with_guests_03.webp", title: "With our Guests" },
        {
          loc: "/villa/with_guests_04_dinning..webp",
          title: "Dining with guests",
        },
        {
          loc: "/villa/with_guests_05_dinning..webp",
          title: "Dining with guests",
        },
      ],
      "/stays": [],
      "/visit": [],
      "/developer": [
        // { loc: "/developer/sahan.webp", title: "Sahan Sachintha" },
      ],
    };

    return {
      loc: path,
      changefreq: "weekly",
      priority: priorityMap[path] ?? 0.7,
      lastmod: new Date().toISOString(),
      images: IMAGES[path],
    };
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/search", "/_next/", "/api/", "/_error"] },
    ],
  },
};
