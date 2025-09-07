import { siteConfig } from "@/data/content"

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: process.env.NEXT_PUBLIC_WHATSAPP,
      contactType: "customer service",
    },
  }
}

export function generateLodgingBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "VacationRental"],
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: process.env.NEXT_PUBLIC_WHATSAPP,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.0172272,
      longitude: 80.7812215,
    },
    hasMap: "https://maps.google.com/maps?q=6.0172272,80.7812215",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tangalle",
      addressCountry: "LK",
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
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

export function generateHowToSchema(steps: Array<{ name: string; text: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Visit Lake View Villa Tangalle",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function generateOfferSchema(offers: Array<{ name: string; price: string; description: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    itemOffered: offers.map((offer) => ({
      "@type": "Product",
      name: offer.name,
      description: offer.description,
      offers: {
        "@type": "Offer",
        price: offer.price,
        priceCurrency: "USD",
      },
    })),
  }
}

export function generateVideoObjectSchema(videoUrl: string, thumbnailUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Lake View Villa Tangalle - Virtual Tour",
    description: "Experience the serene beauty of Lake View Villa Tangalle",
    thumbnailUrl,
    contentUrl: videoUrl,
    uploadDate: "2024-01-15",
  }
}
