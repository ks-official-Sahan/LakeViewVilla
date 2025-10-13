// app/watch/hero/page.tsx
import React from "react";
import Script from "next/script";
import Link from "next/link";

export const metadata = {
  title: "Lake View Villa — Hero Video",
  description:
    "Watch the Lake View Villa Tangalle hero video. Aerial and on-site footage of the villa and lagoon.",
  alternates: { canonical: "https://lakeviewvillatangalle.com/watch/hero" },
};

const SITE = "https://lakeviewvillatangalle.com";

export default function WatchHeroPage() {
  const videoUrl = `${SITE}/hero/hero.webm`;
  const poster = `${SITE}/hero/hero-poster.webp`;
  const thumbnail = `${SITE}/hero/hero-poster.webp`; // used in JSON-LD
  const uploadDate = "2025-09-01T00:00:00Z"; // adjust to actual upload date
  const durationISO = "PT0M28S"; // Adjust to actual duration (ISO 8601)
  const name = "Lake View Villa Tangalle — Hero Reel";
  const description =
    "A short hero reel showcasing Lake View Villa Tangalle — aerial lagoon views, villa exterior, and guest moments.";

  const videoObject = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: [thumbnail],
    uploadDate,
    duration: durationISO,
    contentUrl: videoUrl,
    embedUrl: `${SITE}/watch/hero`,
    publication: { "@type": "PublicationEvent", startDate: uploadDate },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Watch Hero",
        item: SITE + "/watch/hero",
      },
    ],
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 prose">
      <h1>{name}</h1>
      <p className="text-slate-600">{description}</p>

      <div className="mt-6">
        {/* Poster image as fallback/preload for LCP */}
        <video
          controls
          preload="metadata"
          poster={poster}
          className="w-full rounded-lg shadow-lg"
          aria-label="Lake View Villa hero video"
        >
          <source src={videoUrl} type="video/webm" />
          {/* fallback text */}
          Your browser does not support the video tag.{" "}
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            Open the video
          </a>
        </video>
      </div>

      <div className="mt-6">
        <p>
          Prefer booking details and photos? Visit the{" "}
          <Link href="/" className="text-blue-600 underline">
            Lake View Villa homepage
          </Link>
          .
        </p>
      </div>

      {/* JSON-LD for VideoObject + Breadcrumb */}
      <Script
        id="videoobject-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(videoObject)}
      </Script>
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(breadcrumb)}
      </Script>
    </main>
  );
}
