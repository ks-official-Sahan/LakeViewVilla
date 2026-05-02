const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";
const VILLA_NAME = "Lake View Villa Tangalle";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "+94701164056";

// ─── Organization & Website ────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: VILLA_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
      width: 400,
      height: 120,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: WHATSAPP,
      contactType: "reservations",
      availableLanguage: ["English", "Sinhala"],
    },
    sameAs: [
      "https://www.instagram.com/lakeviewvillatangalle",
      "https://www.facebook.com/lakeviewvillatangalle",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: VILLA_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Lodging Business ──────────────────────────────────────────────────────

export function lodgingBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE_URL}/#lodging`,
    name: VILLA_NAME,
    url: SITE_URL,
    description:
      "Private luxury villa on a serene lagoon in Tangalle, Sri Lanka. 2 en-suite bedrooms, modern amenities, exclusive stays.",
    image: [
      `${SITE_URL}/villa/optimized/hero-1.webp`,
      `${SITE_URL}/villa/optimized/hero-2.webp`,
    ],
    telephone: WHATSAPP,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tangalle",
      addressRegion: "Southern Province",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.0274,
      longitude: 80.7981,
    },
    priceRange: "$$",
    checkinTime: "14:00",
    checkoutTime: "11:00",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private garden", value: true },
      { "@type": "LocationFeatureSpecification", name: "Lagoon view", value: true },
      { "@type": "LocationFeatureSpecification", name: "Full kitchen", value: true },
    ],
    numberOfRooms: 2,
    petsAllowed: false,
  };
}

// ─── Blog / Article ────────────────────────────────────────────────────────

interface ArticleSchemaOptions {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}

export function articleSchema(opts: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${opts.slug}#article`,
    headline: opts.title,
    description: opts.description,
    url: `${SITE_URL}/blog/${opts.slug}`,
    image: opts.imageUrl
      ? { "@type": "ImageObject", url: opts.imageUrl }
      : undefined,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt ?? opts.publishedAt,
    author: {
      "@type": "Person",
      name: opts.authorName ?? "Lake View Villa",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${opts.slug}` },
  };
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

// ─── FAQ Page ──────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FAQItem[]) {
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
  };
}

// ─── Image Object ──────────────────────────────────────────────────────────

interface ImageObjectOptions {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

export function imageObjectSchema(opts: ImageObjectOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    url: opts.url,
    description: opts.alt,
    width: opts.width,
    height: opts.height,
    caption: opts.caption,
    creator: { "@id": `${SITE_URL}/#organization` },
  };
}
