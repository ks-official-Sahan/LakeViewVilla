import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import FAQClient from "./client";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Have questions about your stay? Find answers about facilities, bookings, directions, and more for Lake View Villa Tangalle.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Lake View Villa Tangalle | Frequently Asked Questions",
    description: "Have questions about your stay? Find answers about facilities, bookings, directions, and more for Lake View Villa Tangalle.",
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
    title: "FAQ — Lake View Villa Tangalle",
    description: "Answers about stays & travel.",
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
