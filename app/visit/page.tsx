import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import VisitPage from "./client";

export const metadata: Metadata = {
  title: "Visit Us — Lake View Villa Tangalle (Map, Directions & Contact)",
  description:
    "Find Lake View Villa Tangalle with precise directions. Open in Google Maps or WhatsApp for the exact pin.",
  alternates: { canonical: "/visit" },
  openGraph: {
    title: "Visit Us — Lake View Villa Tangalle",
    description: "Map, driving directions, and quick contact options.",
    url: "https://lakeviewvillatangalle.com/visit",
    type: "website",
    images: [
      {
        url: "/villa/drone_view_villa.jpg",
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
    images: ["/villa/drone_view_villa.jpg"],
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
