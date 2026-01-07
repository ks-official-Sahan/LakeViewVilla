import type React from "react";
import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Navigation } from "@/components/layout/navigation";
import { ExpandableCTA } from "@/components/ui2/expandable-cta";
import { WebVitals } from "@/components/analytics/web-vitals";
// import { LoadingScreen } from "@/components/ui2/loading-screen";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ClientEffects } from "@/components/layout/client-effects";

// ✅ New: unified, typed SEO helpers (replaces "@/lib/seo/structured-data")
import { siteGraph } from "@/lib/seo";
import { siteConfig, SEO_CONFIG } from "@/data/content";
import { SITE_CONFIG } from "@/data/site";

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

// const LoadingScreen = dynamic(
//   () =>
//     import("@/components/ui2/loading-screen").then((mod) => mod.LoadingScreen),
//   {
//     ssr: false,
//     loading: () => null,
//   }
// );

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
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
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
    // other: [
    //   { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0a0f10" },
    // ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: SEO_CONFIG.title,
    description: "Private villa on a serene lagoon in Tangalle.",
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      // { url: "/villa/optimized/drone_view_villa.jpg", width: 1200, height: 630, alt: "Lake View Villa Tangalle - Serene lagoon at sunrise" },
      { url: "/og", width: 1200, height: 630, alt: "Lake View Villa Tangalle" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.title,
    description:
      "Private villa on a serene lagoon in Tangalle with panoramic views.",
    images: [
      // "/villa/optimized/drone_view_villa.jpg",
      "/og",
    ],
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
    >
      <head>
        <link rel="canonical" href={SITE_CONFIG.primaryDomain} />
        <link
          rel="preload"
          href="/villa/optimized/villa_img_02.webp"
          as="image"
          type="image/avif"
        />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
        <script
          id="ld-nav"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
      <body className="min-h-svh bg-background text-foreground antialiased">
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
          <MantineProvider defaultColorScheme="light" theme={theme}>
            <AudioProvider>
              <ClientLoadingScreen
                logoSrc="/logo.png"
                logoAlt="Lake View Villa Tangalle"
                enableTapSkip
              />
              <ScrollProgress />
              <Suspense fallback={null}>
                <ClientEffects />
              </Suspense>
              <Navigation />
              <main id="content" className="relative isolate">
                <Suspense fallback={null}>{children}</Suspense>
              </main>
              <ExpandableCTA />
              <Script id="ga" strategy="afterInteractive">
                <Analytics />
              </Script>
              <Script id="web-vitals" strategy="afterInteractive">
                <WebVitals />
              </Script>
              <Script id="marketing-pixels" strategy="lazyOnload">
                <MarketingPixels />
              </Script>
              {/* <FloatingAudioSwitch /> */}
            </AudioProvider>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
