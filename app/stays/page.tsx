// app/stays/page.tsx (server component)
import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import StaysPage from "./client";

export const metadata: Metadata = {
  title: "Tangalle Accommodation — Stays & Rates | Lake View Villa",
  description: "Book Tangalle accommodation. Lake View Villa Tangalle offers a private room rental in Sri Lanka with serene lagoon views, A/C, and fast Wi-Fi for a perfect getaway.",
  keywords: [
    "Tangalle accommodation",
    "Tangalle rental",
    "private room Tangalle",
    "best places to stay in Tangalle",
    "Tangalle villa",
    "Tangalle lagoon stay",
    "Sri Lanka villa",
    "private villa",
    "best rate WhatsApp",
  ],
  alternates: { canonical: "/stays" },
  openGraph: {
    title: "Tangalle Accommodation — Stays & Rates | Lake View Villa",
    description: "Book Tangalle accommodation. Lake View Villa Tangalle offers a private room rental in Sri Lanka with serene lagoon views, A/C, and fast Wi-Fi for a perfect getaway.",
    url: "https://lakeviewvillatangalle.com/stays",
    type: "website",
    images: [
      {
        url: "/villa/optimized/drone_view_villa.webp",
        width: 1200,
        height: 630,
        alt: "Lake View Villa Tangalle — lagoon at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tangalle Accommodation — Stays & Rates | Lake View Villa",
    description: "Book Tangalle accommodation. Lake View Villa Tangalle offers a private room rental in Sri Lanka with serene lagoon views, A/C, and fast Wi-Fi for a perfect getaway.",
    images: ["/villa/optimized/drone_view_villa.webp"],
  },
};

export default function Page() {
  return (
    <>
      <SeoJsonLd
        breadcrumb={[
          { name: "Home", url: "https://lakeviewvillatangalle.com/" },
          { name: "Stays", url: "https://lakeviewvillatangalle.com/stays" },
        ]}
      />
      <StaysPage />
    </>
  );
}
