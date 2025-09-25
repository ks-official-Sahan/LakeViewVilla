// components/SeoJsonLd.tsx
"use client";
import Script from "next/script";

type Breadcrumb = { name: string; url: string };
type Faq = { q: string; a: string };

export default function SeoJsonLd({
  breadcrumb,
  faq,
}: {
  breadcrumb?: Breadcrumb[];
  faq?: Faq[];
}) {
  const base = "https://lakeviewvillatangalle.com";
  const sameAs = [
    "https://www.booking.com/hotel/lk/lake-view-tangalle123.html",
    "https://www.instagram.com/lakeviewvillatangalle/",
    "https://www.facebook.com/p/Lake-view-Homestay-Tangalle-100064155182720/",
    "https://www.tripadvisor.com/Hotel_Review-g304142-d24052834-Reviews-Lake_View_Villa_tangalle-Tangalle_Southern_Province.html",
    "https://www.agoda.com/lake-view-h30642043/hotel/tangalle-lk.html",
    "https://www.expedia.com/Tangalle-Hotels-Lake-View-Homestay.h102927826.Hotel-Information",
  ];

  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${base}#org`,
      name: "Lake View Villa Tangalle",
      url: base,
      logo: `${base}/og/logo.png`,
      sameAs,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+94-71-744-8391",
          contactType: "customer service",
          areaServed: "LK",
          availableLanguage: ["en", "si"],
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}#website`,
      url: base,
      name: "Lake View Villa Tangalle",
      potentialAction: {
        "@type": "SearchAction",
        target: `${base}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "@id": `${base}#lodging`,
      name: "Lake View Villa",
      url: base,
      image: [`${base}/og/og-home.jpg`],
      slogan: "Where Dream Stays Come True.",
      description:
        "Private villa on Tangalle’s serene lagoon. Chef service, A/C rooms, fast Wi-Fi.",
      telephone: "+94701164056",
      priceRange: "$$",
      currenciesAccepted: "USD, LKR, EUR",
      checkinTime: "14:00",
      checkoutTime: "11:00",
      acceptsReservations: "True",
      address: {
        "@type": "PostalAddress",
        streetAddress: "19/6 Julgahawalagoda, Kadurupokuna South",
        addressLocality: "Tangalle",
        addressRegion: "Southern Province",
        addressCountry: "LK",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 6.0172272,
        longitude: 80.7812215,
      },
      hasMap: "https://maps.app.goo.gl/wRLkZBxMSvfhd2jZA",
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Lake view",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Air conditioning",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Chef services",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Fast Wi-Fi",
          value: true,
        },
      ],
      sameAs,
    },
    breadcrumb && {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    },
    faq && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ].filter(Boolean);

  return (
    <>
      {blocks.map((b, i) => (
        <Script
          key={i}
          id={`ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
    </>
  );
}
