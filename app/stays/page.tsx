// app/stays/page.tsx (server component)
import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import StaysPage from "./client";

export const metadata: Metadata = {
  title: "Stays & Rates — Lake View Villa Tangalle",
  description:
    "Direct WhatsApp for best rates. A/C rooms, lagoon views, chef services, fast Wi-Fi. Book your stay in Tangalle.",
  keywords: [
    "Tangalle villa",
    "Tangalle lagoon stay",
    "Sri Lanka villa",
    "private villa",
    "best rate WhatsApp",
  ],
  alternates: { canonical: "/stays" },
  openGraph: {
    title: "Stays & Rates — Lake View Villa Tangalle",
    description:
      "Private villa on Tangalle’s serene lagoon — direct booking via WhatsApp.",
    url: "https://lakeviewvillatangalle.com/stays",
    type: "website",
    images: [
      {
        url: "/villa/drone_view_villa.webp",
        width: 1200,
        height: 630,
        alt: "Lake View Villa Tangalle — lagoon at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stays & Rates — Lake View Villa Tangalle",
    description: "Best direct rates. A/C rooms, chef services, fast Wi-Fi.",
    images: ["/villa/drone_view_villa.webp"],
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
