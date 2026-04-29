import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import VisitPage from "./client";

export const metadata: Metadata = {
  title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
  description: "Discover things to do in Tangalle. Lake View Villa Tangalle is a central base that helps you explore Sri Lanka's south coast, find easy directions, and contact us directly to plan your stay.",
  alternates: { canonical: "/visit" },
  openGraph: {
    title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
    description: "Lake View Villa Tangalle is your base for coastal exploration. Discover things to do in Tangalle, find directions, and contact us.",
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
    description: "Lake View Villa Tangalle is your base for coastal exploration. Discover things to do in Tangalle, find directions, and contact us.",
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
