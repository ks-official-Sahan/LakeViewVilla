import type { Metadata } from "next";
import { SectionReveal } from "@/components/motion/section-reveal";
import { PROPERTY } from "@/data/content";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import GalleryClient from "./gallery-client";

export const metadata: Metadata = {
  title: "Gallery - Lake View Villa Tangalle",
  description:
    "Explore Lake View Villa Tangalle through a curated photo gallery of the lagoon, interiors, and surroundings.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery - Lake View Villa Tangalle",
    description:
      "See the lagoon, villa interiors, and the grounds at Lake View Villa Tangalle.",
    url: "https://lakeviewvillatangalle.com/gallery",
    type: "website",
    images: [
      {
        url: "/drone-aerial-footage-of-tropical-lagoon-and-villa.jpg",
        width: 1200,
        height: 630,
        alt: "Aerial view of the lagoon and villa at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery - Lake View Villa Tangalle",
    description:
      "See our lagoon, interiors, and surroundings in the photo gallery.",
    images: ["/drone-aerial-footage-of-tropical-lagoon-and-villa.jpg"],
  },
};

function getGalleryImages() {
  const booking = PROPERTY;

  const fromBooking =
    (booking?.images_sample ?? []).map((src: string, i: number) => ({
      src: src.startsWith("/") ? src : `/${src}`,
      alt: `${booking?.name ?? "Lake View Villa"} — Image ${i + 1}`,
      w: 1200,
      h: 800,
    })) ?? [];

  const fallbacks = [
    {
      src: "/drone-aerial-footage-of-tropical-lagoon-and-villa.jpg",
      alt: "Aerial view of the lagoon and villa at sunrise",
      w: 1200,
      h: 800,
    },
    {
      src: "/room_02_img_01.jpeg",
      alt: "Living area with modern furnishings",
      w: 1200,
      h: 800,
    },
    {
      src: "/garden_img_01.jpeg",
      alt: "Garden path and greenery around the villa",
      w: 1200,
      h: 800,
    },
  ];

  // de-dupe on src and keep order stable
  const seen = new Set<string>();
  const images = [...fromBooking, ...fallbacks].filter((x) => {
    if (seen.has(x.src)) return false;
    seen.add(x.src);
    return true;
  });

  return images;
}

export default function Page() {
  const images = getGalleryImages();

  return (
    <>
      {/* JSON-LD (Breadcrumbs) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: "Home", url: "https://lakeviewvillatangalle.com/" },
              {
                name: "Gallery",
                url: "https://lakeviewvillatangalle.com/gallery",
              },
            ])
          ),
        }}
      />

      <div className="min-h-screen relative overflow-hidden">
        {/* Ambient background (GPU-cheap, no hydration issues) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_10%,rgba(56,189,248,0.16),transparent_70%),radial-gradient(50%_30%_at_80%_20%,rgba(45,212,191,0.14),transparent_70%),linear-gradient(180deg,#0b1220,#0b1220_30%,#0f172a)]"
        />
        <div className="relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                    Villa Gallery
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300/95 max-w-2xl mx-auto">
                  A curated reel of the lagoon, interiors, and surrounding
                  nature.
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  {images.length} photos
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-20">
          {/* Client-only masonry + lightbox */}
          <GalleryClient images={images} />
        </div>
      </div>
    </>
  );
}
