import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import VisitPage from "./client";

export const metadata: Metadata = {
  title: "Visit Us — Map & Directions",
  description: "Find easy directions to Lake View Villa Tangalle. View our Google Maps location and contact us via WhatsApp for your arrival.",
  alternates: { canonical: "/visit" },
  openGraph: {
    title: "Visit Us — Lake View Villa Tangalle | Map & Directions",
    description: "Find easy directions to Lake View Villa Tangalle. View our Google Maps location and contact us via WhatsApp for your arrival.",
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
    title: "Visit Us — Lake View Villa Tangalle",
    description: "Directions & quick contact.",
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
