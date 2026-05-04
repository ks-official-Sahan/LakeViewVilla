import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import VisitPage from "./client";

export const metadata: Metadata = {
  title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
  description: "Discover things to do in Tangalle. Find easy directions to Lake View Villa Tangalle, explore Sri Lanka's south coast, and contact us for your stay.",
  keywords: [
    "things to do in Tangalle",
    "Tangalle attractions",
    "Sri Lanka south coast",
    "visit Tangalle",
    "Tangalle lagoon",
    "Lake View Villa directions",
    "Lake View Villa Tangalle location"
  ],
  alternates: { canonical: "/visit" },
  openGraph: {
    title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
    description: "Discover things to do in Tangalle. Find easy directions to Lake View Villa Tangalle, explore Sri Lanka's south coast, and contact us for your stay.",
    url: "https://lakeviewvillatangalle.com/visit",
    type: "website",
    images: [
      {
        url: "/villa/optimized/drone_view_villa.webp",
        width: 1200,
        height: 630,
        alt: "Lake View Villa Tangalle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
    description: "Discover things to do in Tangalle. Find easy directions to Lake View Villa Tangalle, explore Sri Lanka's south coast, and contact us for your stay.",
    images: ["/villa/optimized/drone_view_villa.webp"],
  },
};

export default function Page() {
  return (
    <>
      <SeoJsonLd
        breadcrumb={[
          { name: "Home", url: "https://lakeviewvillatangalle.com/" },
          { name: "Visit", url: "https://lakeviewvillatangalle.com/visit" },
        ]}
      />
      <VisitPage />
    </>
  );
}
