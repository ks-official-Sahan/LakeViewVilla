// import type { MetadataRoute } from "next";

// // export default function robots() {
// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
//     sitemap: "https://lakeviewvillatangalle.com/sitemap.xml",
//     host: "https://lakeviewvillatangalle.com",
//   };
// }

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://lakeviewvillatangalle.com";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/stays", "/visit", "/gallery", "/faq", "/search"],
      disallow: ["/api/", "/_next/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
