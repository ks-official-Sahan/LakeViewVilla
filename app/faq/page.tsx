import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import FAQClient from "./client";

export const metadata: Metadata = {
  title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
  description: "Read our Tangalle villa FAQ. Find direct answers about booking Tangalle accommodation, Lake View Villa directions, A/C rooms, and local Sri Lankan attractions.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
    description: "Read our Tangalle villa FAQ. Find direct answers about booking Tangalle accommodation, Lake View Villa directions, A/C rooms, and local Sri Lankan attractions.",
    url: "https://lakeviewvillatangalle.com/faq",
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
    title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
    description: "Read our Tangalle villa FAQ. Find direct answers about booking Tangalle accommodation, Lake View Villa directions, A/C rooms, and local Sri Lankan attractions.",
    images: ["/villa/optimized/drone_view_villa.webp"],
  },
};

export default function Page() {
  return (
    <>
      <SeoJsonLd
        breadcrumb={[
          { name: "Home", url: "https://lakeviewvillatangalle.com/" },
          { name: "FAQ", url: "https://lakeviewvillatangalle.com/faq" },
        ]}
      />
      <FAQClient />
    </>
  );
}
