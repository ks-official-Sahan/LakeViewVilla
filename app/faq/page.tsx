import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import FAQClient from "./client";
import { FAQ_ITEMS } from "@/data/content";

export const metadata: Metadata = {
  title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
  description: "Read our Tangalle villa FAQ. Lake View Villa Tangalle is a lagoon stay that helps you find direct answers about booking Tangalle stays, villa directions, and A/C room availability.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
    description: "Lake View Villa Tangalle provides answers. Read our Tangalle villa FAQ to find details about bookings, directions, and Sri Lankan attractions.",
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
    description: "Lake View Villa Tangalle provides answers. Read our Tangalle villa FAQ to find details about bookings, directions, and Sri Lankan attractions.",
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
        faq={FAQ_ITEMS.map((item) => ({ q: item.question, a: item.answer }))}
      />
      <FAQClient />
    </>
  );
}
