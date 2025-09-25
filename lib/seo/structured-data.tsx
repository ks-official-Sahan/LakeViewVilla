// // JSON-LD helpers (typed, DRY). Usage: feed objects into <script type="application/ld+json" />

// import { siteConfig, SITE_CONFIG } from "@/data/site";

// const PHONE = process.env.NEXT_PUBLIC_WHATSAPP ?? SITE_CONFIG.whatsappNumber;

// type BreadcrumbItem = { name: string; url: string };
// type FAQ = { question: string; answer: string };
// type HowToStep = { name: string; text: string };
// type OfferItem = {
//   name: string;
//   price: string;
//   description: string;
//   priceCurrency?: string;
// };

// export function generateWebSiteSchema() {
//   return {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     name: siteConfig.name,
//     url: siteConfig.url,
//     description: siteConfig.description,
//     potentialAction: {
//       "@type": "SearchAction",
//       target: {
//         "@type": "EntryPoint",
//         urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
//       },
//       "query-input": "required name=search_term_string",
//     },
//   };
// }

// export function generateOrganizationSchema() {
//   return {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: siteConfig.name,
//     url: siteConfig.url,
//     logo: `${siteConfig.url}/logo.png`,
//     contactPoint: {
//       "@type": "ContactPoint",
//       telephone: PHONE,
//       contactType: "customer service",
//       areaServed: "LK",
//       availableLanguage: ["en", "si"],
//     },
//   };
// }

// export function generateLodgingBusinessSchema() {
//   return {
//     "@context": "https://schema.org",
//     "@type": ["LodgingBusiness", "VacationRental"],
//     name: siteConfig.name,
//     description: siteConfig.description,
//     url: siteConfig.url,
//     telephone: PHONE,
//     geo: {
//       "@type": "GeoCoordinates",
//       latitude: SITE_CONFIG.coordinates.lat,
//       longitude: SITE_CONFIG.coordinates.lng,
//     },
//     hasMap: SITE_CONFIG.googleMapsUrl,
//     address: {
//       "@type": "PostalAddress",
//       addressLocality: "Tangalle",
//       addressCountry: "LK",
//     },
//   };
// }

// export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     itemListElement: items.map((item, index) => ({
//       "@type": "ListItem",
//       position: index + 1,
//       name: item.name,
//       item: item.url,
//     })),
//   };
// }

// export function generateFAQPageSchema(faqs: FAQ[]) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: faqs.map((faq) => ({
//       "@type": "Question",
//       name: faq.question,
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: faq.answer,
//       },
//     })),
//   };
// }

// export function generateHowToSchema(steps: HowToStep[]) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "HowTo",
//     name: "How to Visit Lake View Villa Tangalle",
//     step: steps.map((step, index) => ({
//       "@type": "HowToStep",
//       position: index + 1,
//       name: step.name,
//       text: step.text,
//     })),
//   };
// }

// // For multiple “offers”, return an ItemList of Products-with-Offer (valid JSON-LD)
// export function generateOfferSchema(offers: OfferItem[]) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     itemListElement: offers.map((o, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Product",
//         name: o.name,
//         description: o.description,
//         offers: {
//           "@type": "Offer",
//           price: o.price,
//           priceCurrency: o.priceCurrency ?? "USD",
//           availability: "https://schema.org/InStock",
//         },
//       },
//     })),
//   };
// }

// export function generateVideoObjectSchema(
//   videoUrl: string,
//   thumbnailUrl: string,
//   uploadDate = "2024-01-15"
// ) {
//   return {
//     "@context": "https://schema.org",
//     "@type": "VideoObject",
//     name: "Lake View Villa Tangalle - Virtual Tour",
//     description: "Experience the serene beauty of Lake View Villa Tangalle",
//     thumbnailUrl,
//     contentUrl: videoUrl,
//     uploadDate,
//   };
// }
