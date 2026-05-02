// components/SeoJsonLd.tsx
"use client";
import Script from "next/script";
import React from "react";
import { serializeJsonLd } from "@/lib/utils";

type Breadcrumb = { name: string; url: string };
type Faq = { q: string; a: string };

export type SchemaOfferInput = {
  name: string;
  description?: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
};

export type SchemaHowToInput = {
  name: string;
  description?: string;
  steps: { name: string; text: string }[];
};

const BASE = "https://lakeviewvillatangalle.com";

const SAME_AS = [
  `${BASE}`,
  "https://www.airbnb.com/l/CfK96vPd",
  "https://www.booking.com/Pulse-81UlHU",
  "https://www.instagram.com/lakeviewvillatangalle/",
  "https://www.facebook.com/share/17M3VXHKbZ/?mibextid=wwXIfr",
  "https://www.tripadvisor.com/Hotel_Review-g304142-d24052834-Reviews-Lake_View_Villa_tangalle-Tangalle_Southern_Province.html",
  "https://www.agoda.com/lake-view-h30642043/hotel/tangalle-lk.html",
  "https://www.expedia.com/Tangalle-Hotels-Lake-View-Homestay.h102927826.Hotel-Information",
];

export default function SeoJsonLd({
  breadcrumb,
  faq,
  offers,
  howTo,
}: {
  breadcrumb?: Breadcrumb[];
  faq?: Faq[];
  offers?: SchemaOfferInput[];
  howTo?: SchemaHowToInput;
}) {
  // Organization
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}#org`,
    name: "Lake View Villa Tangalle",
    url: BASE,
    logo: `${BASE}/og/og-home.jpg`,
    sameAs: SAME_AS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+94-70-116-4056",
        contactType: "customer service",
        areaServed: "LK",
        availableLanguage: ["en", "si"],
      },
    ],
  };

  // WebSite with SearchAction
  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}#website`,
    url: BASE,
    name: "Lake View Villa Tangalle",
    description: "Lake View Villa Tangalle is a private vacation rental and lodging business helping travelers experience tranquility in Tangalle.",
    publisher: { "@id": `${BASE}#org` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // LodgingBusiness
  const lodging = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${BASE}#lodging`,
    name: "Lake View Villa",
    url: BASE,
    image: [`${BASE}/og/og-home.jpg`],
    slogan: "Where Dream Stays Come True.",
    description:
      "Private villa on Tangalle’s serene lagoon. Chef service, A/C rooms, fast Wi-Fi.",
    telephone: "+94-70-116-4056",
    priceRange: "$$",
    currenciesAccepted: "USD, LKR, EUR",
    checkinTime: "14:00:00+05:30",
    checkoutTime: "11:00:00+05:30",
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
    sameAs: SAME_AS,
  };

  const blocks: Record<string, unknown>[] = [org, site, lodging];

  if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }

  if (faq && Array.isArray(faq) && faq.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (offers && offers.length) {
    for (const o of offers) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Offer",
        name: o.name,
        ...(o.description ? { description: o.description } : {}),
        url: o.url ?? BASE,
        offeredBy: { "@id": `${BASE}#lodging` },
        ...(o.price && o.priceCurrency
          ? { price: o.price, priceCurrency: o.priceCurrency }
          : {}),
      });
    }
  }

  if (howTo?.steps?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: howTo.name,
      ...(howTo.description ? { description: howTo.description } : {}),
      step: howTo.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  return (
    <>
      {blocks.map((b, idx) => (
        <Script
          key={idx}
          id={`ld-${idx}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(b) }}
        />
      ))}
    </>
  );
}
