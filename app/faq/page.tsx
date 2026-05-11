import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import FAQClient from "./client";

export const metadata: Metadata = {
  title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
  description: "Find answers in our Tangalle villa FAQ. Lake View Villa provides booking details, directions, A/C room info, and guides for local Sri Lankan attractions.",
  keywords: [
    "Tangalle villa FAQ",
    "booking Tangalle",
    "Lake View Villa directions",
    "Lake View Villa FAQ",
    "Tangalle accommodation questions",
    "Sri Lanka villa questions"
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Tangalle Villa FAQ — Bookings & Directions | Lake View Villa",
    description: "Read our Tangalle villa FAQ. Find direct answers about booking Tangalle stays, Lake View Villa directions, A/C rooms, and local Sri Lankan attractions.",
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
    description: "Read our Tangalle villa FAQ. Find direct answers about booking Tangalle stays, Lake View Villa directions, A/C rooms, and local Sri Lankan attractions.",
    images: ["/villa/optimized/drone_view_villa.webp"],
  },
};

import { FAQ_ITEMS } from "@/data/content";

export default function Page() {
  const faqList = FAQ_ITEMS.map((item) => ({ q: item.question, a: item.answer }));
  return (
    <>
      <SeoJsonLd
        breadcrumb={[
          { name: "Home", url: "https://lakeviewvillatangalle.com/" },
          { name: "FAQ", url: "https://lakeviewvillatangalle.com/faq" },
        ]}
        faq={faqList}
      />
      <FAQClient />
    </>
  );
}
