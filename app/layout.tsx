import type React from "react";
import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

import { WebVitals } from "@/components/analytics/web-vitals";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ClientEffects } from "@/components/layout/client-effects";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { ReactQueryProvider } from "@/lib/cache/react-query";

// ✅ New: unified, typed SEO helpers (replaces "@/lib/seo/structured-data")
import { siteGraph } from "@/lib/seo";
import { siteConfig, SEO_CONFIG } from "@/data/content";
import { SITE_CONFIG } from "@/data/site";
import { serializeJsonLd } from "@/lib/utils";

import { GTM } from "@/components/analytics/GTM";
import MarketingPixels from "@/components/analytics/marketing-pixels";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/config/mantine-theme";
import { AudioProvider } from "@/context/AudioContext";
import Script from "next/script";
import dynamic from "next/dynamic";
import ClientLoadingScreen from "@/components/ClientLoadingScreen";

if (
  !process.env.NEXT_PUBLIC_WHATSAPP &&
  process.env.NODE_ENV === "production"
) {
  throw new Error("NEXT_PUBLIC_WHATSAPP is required for production builds");
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
  title: {
    default: "Private Villa Tangalle — Lagoon Stay | Lake View Villa Tangalle",
    template: "%s | Lake View Villa Tangalle",
  },
  description: "Book Lake View Villa Tangalle. A private vacation rental and lodging business offering panoramic lake views, comfortable A/C bedrooms, fast Wi-Fi, and chef services in Sri Lanka.",
  keywords: [
  // Original Merged & Deduplicated Keywords
  "Lake View Villa Tangalle",
  "Lake View",
  "Lake View Tangalle",
  "Lake Tangalle",
  "Tangalle villa",
  "lake view villa",
  "Sri Lanka lagoon stay",
  "private villa Tangalle",
  "Tangalle accommodation",
  "Booking Tangalle",
  "Tangalle Rental",
  "Tangalle",
  "Sri Lanka vacation rental",
  "Booking",
  "Rental",
  "Villa",
  "Lake",
  "Vacation",
  "Coastal Line Tangalle",
  "low budget villas in sri lanka",
  "low budget villas in tangalle",
  "Villas in Tangalle",
  "Tangalle beachfront villa",
  "Luxury villa Tangalle",
  "Tangalle holiday villa",
  "Beach villa Tangalle Sri Lanka",
  "Tangalle villa with pool",
  "Ocean view villa Tangalle",
  "Tangalle boutique villa",
  "Family villa Tangalle",
  "vacation rental Tangalle",
  "vacation rental",
  "Tangalle resort villa",
  "Tangalle luxury villa",
  "Tangalle beach villa",
  "Tangalle resorts",
  "Romantic villa Tangalle",
  "Tangalle honeymoon villa",
  "Best villas in Tangalle Sri Lanka",
  "Where to stay in Tangalle",
  "Tangalle luxury stays",
  "Tangalle resort vs villa",
  "Tangalle Airbnb alternative",
  "Near Tangalle beach",
  "Near Tangalle lagoon",
  "Near Hiriketiya / Goyambokka / Rekawa",
  "Goyambokka villa",
  "Villas near Goyambokka beach",
  "Goyambokka beach hotels",
  "Goyambokka accommodation",
  "Goyambokka luxury villas",
  "Beachfront villa Goyambokka",
  "Private villa near Goyambokka Tangalle",
  "Goyambokka boutique villa",
  "Luxury Goyambokka beach villa",
  "Goyambokka romantic villa for couples",
  "Family villa near Goyambokka beach",
  "Best villas in Goyambokka Tangalle",
  "Where to stay near Goyambokka beach Sri Lanka",
  "Goyambokka beach villas with pool",
  "Goyambokka Sri Lanka accommodation guide",
  "Things to do near Goyambokka beach",

  // Keywords from the Secondary Array
  "Lake View Villa Tangalle 2026",
  "panoramic lagoon views",
  "fast Wi-Fi villa",
  "chef service villa Tangalle",
  "vacationers",
  "Tangalle accommodation alternative",
  "Lake View Villa vs hotels",
  "Lake View Villa Tangalle pricing",
  "best places to stay in Tangalle",
  "lagoon stay Sri Lanka",
  "beachfront alternative Tangalle",
  "Tangalle Airbnb",

  // Newly Added Optimised Keywords
  "Southern province villa stays",
  "affordable luxury villa Tangalle",
  "Tangalle nature retreat",
  "South Coast Sri Lanka holiday rental",
  "Lake View Villa Tangalle reviews",
  "long term villa rental Tangalle",
  "self-catering accommodation Tangalle",
  "villas near Deep South Sri Lanka"
],
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.png", sizes: "any", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Private Villa Tangalle | Lake View Villa Tangalle",
    description: "Lake View Villa Tangalle is a private vacation rental in Sri Lanka. It helps travelers relax with A/C rooms, fast Wi-Fi, and scenic lagoon views.",
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      { url: "/og", width: 1200, height: 630, alt: "Lake View Villa Tangalle — Lagoon view" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description:
      "Private villa on a serene lagoon in Tangalle with panoramic views.",
    images: ["/og"],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const graph = siteGraph({
    address: {
      streetAddress: SITE_CONFIG.addressStreet,
      addressRegion: SITE_CONFIG.addressRegion,
      postalCode: SITE_CONFIG.postalCode,
    },
  });

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        <link rel="canonical" href={SITE_CONFIG.primaryDomain} />

        <link
          rel="preload"
          href="/villa/optimized/villa_img_02.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/favicon-32.png"
          as="image"
          type="image/png"
        />

        <link
          rel="preconnect"
          href="https://vitals.vercel-analytics.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://vitals.vercel-analytics.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://connect.facebook.net"
          crossOrigin=""
        />

        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16.png"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />

        <script
          id="ld-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
        />
        <script
          id="ld-nav"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: ["Home", "Gallery", "Stays", "Visit", "FAQ", "Developer"],
              url: [
                SITE_CONFIG.primaryDomain,
                `${SITE_CONFIG.primaryDomain}/gallery`,
                `${SITE_CONFIG.primaryDomain}/stays`,
                `${SITE_CONFIG.primaryDomain}/visit`,
                `${SITE_CONFIG.primaryDomain}/faq`,
                `${SITE_CONFIG.primaryDomain}/developer`,
              ],
              parent: [SITE_CONFIG.primaryDomain],
              position: 1,
              isPartOf: SITE_CONFIG.primaryDomain,
            }),
          }}
        />
      </head>
      <body
        className="min-h-svh bg-background text-foreground antialiased grain-overlay"
        suppressHydrationWarning
      >
        {/* Skip-to-content link for keyboard users (WCAG 2.2 AAA) */}
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <GTM />
        {process.env.NEXT_PUBLIC_GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="light"
          // disableTransitionOnChange
        >
          <ReactQueryProvider>
            <MantineProvider defaultColorScheme="light" theme={theme}>
              <AudioProvider>
                <LenisProvider>
                  <ClientLoadingScreen
                    logoSrc="/logo.png"
                    logoAlt="Lake View Villa Tangalle"
                    enableTapSkip
                  />
                  <Suspense fallback={null}>
                    <ClientEffects />
                  </Suspense>
                  <main id="content" className="relative isolate">
                    <Suspense fallback={null}>{children}</Suspense>
                  </main>
                  {/* Analytics & tracking components (client-side) */}
                  <Analytics />
                  <WebVitals />
                  <MarketingPixels />
                </LenisProvider>
              </AudioProvider>
            </MantineProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
