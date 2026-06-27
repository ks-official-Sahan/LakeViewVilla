// app/watch/hero/page.tsx
import React from "react";
import Link from "next/link";
import { serializeJsonLd } from "@/lib/utils";

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
      <article>
        <h1>{name}</h1>
        <p className="text-slate-600">{description}</p>

        <section className="mt-6" aria-labelledby="hero-video-heading">
          <h2 id="hero-video-heading" className="sr-only">Lake View Villa Tangalle Hero Video</h2>
          {/* Poster image as fallback/preload for LCP */}
          <video
            controls
            preload="metadata"
            poster={poster}
            className="w-full rounded-lg shadow-lg"
            aria-label="A short hero reel showcasing Lake View Villa Tangalle including aerial lagoon views, villa exterior, and guest moments"
          >
          <source src={videoUrl} type="video/webm" />
          {/* fallback text */}
          Your browser does not support the video tag.{" "}
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            Open the video
          </a>
          </video>
        </section>

        <aside className="mt-6" aria-label="Related Links">
          <p>
            Prefer booking details and photos? Visit the{" "}
            <Link href="/" className="text-blue-600 underline">
              Lake View Villa homepage
            </Link>
            .
          </p>
        </aside>

        {/* JSON-LD for VideoObject + Breadcrumb */}
        <script
          id="videoobject-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(videoObject) }}
        />
        <script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }}
        />
      </article>
    </main>
  );
}
