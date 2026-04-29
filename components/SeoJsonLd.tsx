"use client";
import Script from "next/script";
import React from "react";
import { serializeJsonLd } from "@/lib/utils";

type Breadcrumb = { name: string; url: string };
type Faq = { q: string; a: string };

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

  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((b, idx) => (
        <Script
          key={idx}
          id={`ld-block-${idx}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(b) }}
        />
      ))}
    </>
  );
}
