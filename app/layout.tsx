import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Navigation } from "@/components/layout/navigation";
import { ExpandableCTA } from "@/components/ui2/expandable-cta";
import { WebVitals } from "@/components/analytics/web-vitals";
import { LoadingScreen } from "@/components/ui2/loading-screen";
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateLodgingBusinessSchema,
} from "@/lib/structured-data";
import { ClientEffects } from "@/components/layout/client-effects";

if (
  !process.env.NEXT_PUBLIC_WHATSAPP &&
  process.env.NODE_ENV === "production"
) {
  throw new Error(
    "NEXT_PUBLIC_WHATSAPP environment variable is required for production builds"
  );
}

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lake View Villa Tangalle — Private Villa on a Serene Lagoon",
  description:
    "Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi, and chef services. Book your Sri Lankan getaway today.",
  keywords:
    "Tangalle villa, lake view villa, Sri Lanka lagoon stay, private villa Tangalle, Tangalle accommodation, Sri Lanka vacation rental",
  authors: [{ name: "Lake View Villa Tangalle" }],
  creator: "Lake View Villa Tangalle",
  publisher: "Lake View Villa Tangalle",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://lakeviewvillatangalle.com"),
  alternates: { canonical: "/", languages: { "en-US": "/en-US", en: "/" } },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0e8e9a" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Lake View Villa Tangalle — Private Villa on a Serene Lagoon",
    description:
      "Private villa on a serene lagoon in Tangalle. Sunrise over still water, palms in silhouette, and your day moves at lagoon speed.",
    type: "website",
    locale: "en_US",
    url: "https://lakeviewvillatangalle.com",
    siteName: "Lake View Villa Tangalle",
    images: [
      {
        url: "/villa/drone_view_villa.jpg",
        width: 1200,
        height: 630,
        alt: "Lake View Villa Tangalle - Serene lagoon at sunrise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lake View Villa Tangalle — Private Villa on a Serene Lagoon",
    description:
      "Private villa on a serene lagoon in Tangalle with panoramic lake views and modern amenities.",
    creator: "@lakeviewvilla",
    images: ["/villa/drone_view_villa.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: "google-site-verification-token" },
  generator: "v0.app",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" href="/villa/drone_view_villa.jpg" as="image" />
        <link rel="preconnect" href="https://cf.bstatic.com" />
        <link rel="dns-prefetch" href="https://cf.bstatic.com" />
        <link rel="preconnect" href="https://r-xx.bstatic.com" />
        <link rel="dns-prefetch" href="https://r-xx.bstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLodgingBusinessSchema()),
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-slate-50"
        suppressHydrationWarning
      >
        <LoadingScreen
          logoSrc="/logo.png"
          logoAlt="Lake View Villa Tangalle"
          enableTapSkip
          // longPressMs={500}
          // swipeUpThreshold={64}
        />
        <ScrollProgress />
        {/* All client-only, window/WebGL/animation work goes here */}
        <Suspense fallback={null}>
          <ClientEffects />
        </Suspense>
        <Navigation />
        <Suspense fallback={null}>{children}</Suspense>
        <ExpandableCTA />
        <WebVitals />
        <Analytics />
      </body>
    </html>
  );
}
