// components/SeoJsonLd.tsx
"use client";
import Script from "next/script";
import React from "react";
import { serializeJsonLd } from "@/lib/utils";

type Breadcrumb = { name: string; url: string };
type Faq = { q: string; a: string };

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
}: {
  breadcrumb?: Breadcrumb[];
  faq?: Faq[];
}) {
  const blocks: any[] = [];

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
