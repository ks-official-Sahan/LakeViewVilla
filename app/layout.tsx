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
import { LoadingScreen } from "@/components/ui2/loading-screen";
import { ThemeProvider } from "@/components/theme/theme-provider";
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateLodgingBusinessSchema,
} from "@/lib/structured-data";
import { ClientEffects } from "@/components/layout/client-effects";
import { siteConfig, SEO_CONFIG } from "@/data/content";

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
  title: SEO_CONFIG.title,
  description: SEO_CONFIG.description,
  keywords: SEO_CONFIG.keywords,
  metadataBase: new URL(siteConfig.url),
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
    title: SEO_CONFIG.title,
    description:
      "Private villa on a serene lagoon in Tangalle with panoramic views.",
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable}`}
    >
      <head>
        <link rel="preload" href="/villa/drone_view_villa.jpg" as="image" />
        <link rel="preconnect" href="https://cf.bstatic.com" />
        <link rel="dns-prefetch" href="https://cf.bstatic.com" />
        <link rel="preconnect" href="https://r-xx.bstatic.com" />
        <link rel="dns-prefetch" href="https://r-xx.bstatic.com" />
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
      <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen
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
          <WebVitals />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
