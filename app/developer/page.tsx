import type { Metadata } from "next";
import Script from "next/script";
import SeoJsonLd from "@/components/SeoJsonLd";
import DevClient from "./client";

export const metadata: Metadata = {
  title: "Developer – Sahan | Hyper-Luxury Full-Stack Engineer",
  description:
    "Sahan Sachintha – premium full-stack engineer crafting immersive, high-performance apps with Next.js, TypeScript, GSAP & Framer Motion.",
  alternates: { canonical: "/developer" },
  openGraph: {
    title: "Developer – Sahan | Hyper-Luxury Full-Stack Engineer",
    description:
      "World-class UI/UX, realtime GitHub, live status, and print-perfect CV.",
    url: "https://lakeviewvillatangalle.com/developer",
    siteName: "Lake View Villa – Developer",
    images: [
      { url: "/og", width: 1200, height: 630, alt: "Sahan – Developer" },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer – Sahan",
    images: ["/og"],
  },
  robots: { index: true, follow: true },
};

export default function DeveloperPage() {
  const base = "https://lakeviewvillatangalle.com";
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/developer#person`,
    name: "Sahan Sachintha",
    url: `${base}/developer`,
    sameAs: [
      "https://github.com/ks-official-sahan",
      "https://www.linkedin.com/in/sahan-sachintha",
      "https://developer.lakeviewvillatangalle.com",
      "https://dev.lakeviewvillatangalle.com",
      "https://sahansachintha.com",
      "https://www.sahansachintha.com",
    ],
  };
  const profile = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${base}/developer#profile`,
    url: `${base}/developer`,
    about: { "@id": `${base}/developer#person` },
    breadcrumb: { "@id": `${base}#website` },
    primaryImageOfPage: `${base}/og`,
  };
  const breadcrumb = [
    { name: "Home", url: base },
    { name: "Developer", url: `${base}/developer` },
  ];

  return (
    <main className="relative bg-background text-foreground">
      <SeoJsonLd breadcrumb={breadcrumb} />
      <Script
        id="ld-developer-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <Script
        id="ld-developer-profile"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }}
      />
      <DevClient initial={null} statusInitial={null} />
    </main>
  );
}
