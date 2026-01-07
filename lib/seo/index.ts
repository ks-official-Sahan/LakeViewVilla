// Unified, typed JSON-LD helpers using schema-dts
import type {
  WithContext,
  WebSite,
  Organization,
  LodgingBusiness,
  BreadcrumbList,
  FAQPage,
  HowTo,
  ItemList,
  Product,
  Offer,
  VideoObject,
} from "schema-dts";
import { SITE_CONFIG, siteConfig } from "@/data/site";
import { PROPERTY } from "@/data/property";

// Prefer env at runtime; fall back to canonical constant.
const PHONE = process.env.NEXT_PUBLIC_WHATSAPP ?? SITE_CONFIG.whatsappNumber;

// ---------- Core Schemas ----------
// export function webSiteSchema(): WithContext<WebSite> {
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: SITE_CONFIG.sameAs, // NEW
    contactPoint: {
      "@type": "ContactPoint",
      telephone: process.env.NEXT_PUBLIC_WHATSAPP ?? SITE_CONFIG.whatsappNumber,
      contactType: "customer service",
      availableLanguage: ["English", "Sinhala"],
      areaServed: "LK",
    },
  };
}

export function lodgingBusinessSchema(opts?: {
  starRating?: { ratingValue: number; bestRating?: number };
  address?: {
    streetAddress?: string;
    addressRegion?: string;
    postalCode?: string;
  };
  // }): WithContext<LodgingBusiness> {
}) {
  // const base: WithContext<LodgingBusiness> = {
  const base = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "VacationRental"],
    "@id": `${siteConfig.url}/#lodging`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: process.env.NEXT_PUBLIC_WHATSAPP ?? SITE_CONFIG.whatsappNumber,
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.coordinates.lat,
      longitude: SITE_CONFIG.coordinates.lng,
    },
    hasMap: SITE_CONFIG.googleMapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: opts?.address?.streetAddress ?? SITE_CONFIG.addressStreet,
      addressLocality: "Tangalle",
      addressRegion: opts?.address?.addressRegion ?? SITE_CONFIG.addressRegion,
      postalCode: opts?.address?.postalCode ?? SITE_CONFIG.postalCode,
      addressCountry: "LK",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Air conditioning",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Free WiFi",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Chef service (on request)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Free private parking on site",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Beach access (≈650 m)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Laundry (on request)",
        value: true,
      },
    ],
    sameAs: SITE_CONFIG.sameAs,
  } as const;

  if (opts?.starRating) {
    (base as any).starRating = {
      "@type": "Rating",
      ratingValue: opts.starRating.ratingValue,
      ...(opts.starRating.bestRating && {
        bestRating: opts.starRating.bestRating,
      }),
    };
  }
  return base;
}

export function vacationRentalSchema() {
  const images = (PROPERTY.images_sample || []).map((src) =>
    src.startsWith("/") ? `${siteConfig.url}${src}` : `${siteConfig.url}/${src}`
  );

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${siteConfig.url}/#vacationRental`,
    name: SITE_CONFIG.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: images.slice(0, 8),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.addressStreet,
      addressLocality: PROPERTY.address.city,
      addressRegion: SITE_CONFIG.addressRegion,
      postalCode: SITE_CONFIG.postalCode,
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.coordinates.lat,
      longitude: SITE_CONFIG.coordinates.lng,
    },
    telephone: SITE_CONFIG.whatsappNumber,
    priceRange: "$$",
    checkinTime: "14:00:00",
    checkoutTime: "11:00:00",
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Free WiFi",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Free private parking on site",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Air conditioning",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Kitchen",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Beachfront",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Balcony",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Terrace",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Garden",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Lake view",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Family rooms",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Airport shuttle (additional charge)",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Laundry facilities",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Breakfast available",
        value: true,
      },
    ],
    numberOfRooms: PROPERTY.occupancy.bedrooms,
    maximumAttendeeCapacity: PROPERTY.occupancy.max_guests,
    sameAs: SITE_CONFIG.sameAs,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: PROPERTY.scores_reviews.overall_score,
      reviewCount: PROPERTY.scores_reviews.reviews_count,
      bestRating: 10,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "REPLACE_WITH_GUEST_NAME",
        },
        datePublished: "REPLACE_WITH_REVIEW_DATE",
        name: "REPLACE_WITH_REVIEW_HEADLINE",
        reviewBody: "REPLACE_WITH_REVIEW_TEXT",
        reviewRating: {
          "@type": "Rating",
          ratingValue: PROPERTY.scores_reviews.overall_score,
          bestRating: 10,
          worstRating: 1,
        },
      },
    ],
  } as const;
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(
  faqs: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function howToSchema(
  steps: Array<{ name: string; text: string }>
): WithContext<HowTo> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Visit Lake View Villa Tangalle",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

// Multiple offers rendered correctly as an ItemList of Product+Offer
export function offersSchema(
  offers: Array<{
    name: string;
    price: string;
    description: string;
    priceCurrency?: string;
  }>
): WithContext<ItemList> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: offers.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product" as Product["@type"],
        name: o.name,
        description: o.description,
        offers: {
          "@type": "Offer" as Offer["@type"],
          price: o.price,
          priceCurrency: o.priceCurrency ?? "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function videoObjectSchema(
  videoUrl: string,
  thumbnailUrl: string,
  uploadDate = "2024-01-15"
): WithContext<VideoObject> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Lake View Villa Tangalle - Virtual Tour",
    description: "Experience the serene beauty of Lake View Villa Tangalle",
    thumbnailUrl,
    contentUrl: videoUrl,
    uploadDate,
  };
}

// ---------- Optional: one Graph to rule them all ----------
export function siteGraph(opts?: Parameters<typeof lodgingBusinessSchema>[0]) {
  const graph = [
    webSiteSchema(),
    organizationSchema(),
    lodgingBusinessSchema(opts),
    vacationRentalSchema(),
  ];
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  } as const;
}
