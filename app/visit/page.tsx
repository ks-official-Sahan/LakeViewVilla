import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import VisitPage from "./client";

export const metadata: Metadata = {
  title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
  description: "Discover things to do in Tangalle. Lake View Villa provides easy access to Sri Lanka's south coast attractions, Rekawa turtle beach, and Hummanaya blowhole.",
  alternates: { canonical: "/visit" },
  openGraph: {
    title: "Things to Do in Tangalle — Visit & Location | Lake View Villa",
    description: "Discover things to do in Tangalle. Lake View Villa provides easy access to Sri Lanka's south coast attractions, Rekawa turtle beach, and Hummanaya blowhole.",
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
    description: "Discover things to do in Tangalle. Lake View Villa provides easy access to Sri Lanka's south coast attractions, Rekawa turtle beach, and Hummanaya blowhole.",
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
