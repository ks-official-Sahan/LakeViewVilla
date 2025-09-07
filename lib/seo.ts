import type { WebSite, Organization, LodgingBusiness, BreadcrumbList, FAQPage } from "schema-dts"

export function createWebSiteSchema(): WebSite {
  return {
    "@type": "WebSite",
    "@id": "https://lakeviewvillatangalle.com/#website",
    url: "https://lakeviewvillatangalle.com",
    name: "Lake View Villa Tangalle",
    description: "Private villa on a serene lagoon in Tangalle, Sri Lanka",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lakeviewvillatangalle.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function createOrganizationSchema(): Organization {
  return {
    "@type": "Organization",
    "@id": "https://lakeviewvillatangalle.com/#organization",
    name: "Lake View Villa Tangalle",
    url: "https://lakeviewvillatangalle.com",
    logo: "https://lakeviewvillatangalle.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+94771234567",
      contactType: "customer service",
      availableLanguage: ["English", "Sinhala"],
    },
  }
}

export function createLodgingBusinessSchema(): LodgingBusiness {
  return {
    "@type": "LodgingBusiness",
    "@id": "https://lakeviewvillatangalle.com/#lodging",
    name: "Lake View Villa Tangalle",
    description: "Private villa on a serene lagoon with panoramic views",
    url: "https://lakeviewvillatangalle.com",
    telephone: "+94771234567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lagoon Road",
      addressLocality: "Tangalle",
      addressRegion: "Southern Province",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.0235,
      longitude: 80.7925,
    },
    hasMap: "https://maps.google.com/?q=6.0235,80.7925",
    starRating: {
      "@type": "Rating",
      ratingValue: 5,
      bestRating: 5,
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning" },
      { "@type": "LocationFeatureSpecification", name: "Free WiFi" },
      { "@type": "LocationFeatureSpecification", name: "Private Pool" },
      { "@type": "LocationFeatureSpecification", name: "Chef Service" },
    ],
  }
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQPage {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
