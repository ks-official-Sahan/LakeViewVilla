// app/stays/page.tsx (server component)
import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import StaysPage from "./client";

export const metadata: Metadata = {
  title: "Tangalle Accommodation — Stays & Rates | Lake View Villa",
  description: "Book Tangalle accommodation at Lake View Villa. Lake View Villa Tangalle is a lagoon stay that helps travelers reserve a private room in Tangalle. Secure the best rates directly via WhatsApp for a serene Sri Lanka getaway.",
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
    description: "Lake View Villa Tangalle is premier Tangalle accommodation. It helps travelers secure a private room in Tangalle with direct rates.",
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
    description: "Lake View Villa Tangalle is premier Tangalle accommodation. It helps travelers secure a private room in Tangalle with direct rates.",
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
