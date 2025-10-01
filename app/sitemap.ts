// import type { MetadataRoute } from "next";

// export default function sitemap(): MetadataRoute.Sitemap {
//   const base = "https://lakeviewvillatangalle.com";
//   const now = new Date();
//   return [
//     {
//       url: `${base}/`,
//       lastModified: now,
//       changeFrequency: "weekly",
//       priority: 1,
//     },
//     {
//       url: `${base}/stays`,
//       lastModified: now,
//       changeFrequency: "weekly",
//       priority: 0.8,
//     },
//     {
//       url: `${base}/visit`,
//       lastModified: now,
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//     {
//       url: `${base}/gallery`,
//       lastModified: now,
//       changeFrequency: "monthly",
//       priority: 0.7,
//     },
//     {
//       url: `${base}/faq`,
//       lastModified: now,
//       changeFrequency: "monthly",
//       priority: 0.5,
//     },
//     {
//       url: `${base}/developer`,
//       lastModified: now,
//       changeFrequency: "weekly",
//       priority: 0.9,
//     },
//     {
//       url: `${base}/search`,
//       lastModified: now,
//       changeFrequency: "monthly",
//       priority: 0.2,
//     },
//   ];
// }

// /* old */

// // import type { MetadataRoute } from "next";

// // export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
// //   const base = "https://lakeviewvillatangalle.com";
// //   const paths = ["", "stays", "gallery", "visit", "faq"];

// //   const now = new Date();
// //   return paths.map((p) => ({
// //     url: `${base}/${p}`,
// //     lastModified: now,
// //     changeFrequency: p ? ("weekly" as const) : ("weekly" as const),
// //     priority: p === "" ? 1 : 0.7,
// //   }));
// // }
