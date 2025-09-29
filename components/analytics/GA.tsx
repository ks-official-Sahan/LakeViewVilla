"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GA() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // SPA page_view on route change
  useEffect(() => {
    if (!GA_ID || typeof window === "undefined" || !("gtag" in window)) return;
    const qp = searchParams?.toString();
    const page_path = qp ? `${pathname}?${qp}` : pathname;
    // GA4 page_view
    // @ts-ignore
    window.gtag("config", GA_ID, { page_path });
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
