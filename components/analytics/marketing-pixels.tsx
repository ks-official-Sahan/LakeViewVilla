"use client";

import { useEffect } from "react";
import {
  trackContact,
  trackCta,
  trackDevPortfolioClick,
  trackMapOpen,
} from "@/lib/analytics";

declare global {
  interface Window {
    __contactListenerInstalled?: boolean;
  }
}

const DEV_HOSTS = new Set([
  "sahansachintha.com",
  "dev.lakeviewvillatangalle.com",
  "developer.lakeviewvillatangalle.com",
  "sahan-ruddy.vercel.app",
]);

function isMapUrl(u: URL | null, raw: string) {
  if (!u) return /^(maps:|geo:)/i.test(raw);
  const h = u.hostname;
  return (
    (/(^|\.)google\.[^/]+$/i.test(h) && u.pathname.startsWith("/maps")) ||
    /^maps\.app\.goo\.gl$/i.test(h) ||
    (/^goo\.gl$/i.test(h) && u.pathname.startsWith("/maps"))
  );
}

export default function MarketingPixels() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__contactListenerInstalled)
      return;
    window.__contactListenerInstalled = true;

    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest<HTMLAnchorElement>(
        "a[href]"
      );
      if (!a) return;

      const href = a.getAttribute("href") || "";
      const text = (a.textContent || "").trim();

      // Normalize URL if possible
      let u: URL | null = null;
      try {
        u = new URL(a.href);
      } catch {
        /* tel:, mailto:, geo:, bad absolute */
      }

      // Contacts
      if (href.startsWith("tel:")) return trackContact("phone", href, text);
      if (href.startsWith("mailto:")) return trackContact("email", href, text);
      if (href.includes("wa.me") || href.includes("api.whatsapp.com"))
        return trackContact("whatsapp", u?.toString() || href, text);

      // Developer portfolio
      if (u && DEV_HOSTS.has(u.hostname)) {
        return trackDevPortfolioClick(u.toString(), u.hostname, text);
      }

      // Maps open (optional)
      if (isMapUrl(u, href)) {
        return trackMapOpen(u?.toString() || href, text);
      }

      // Generic CTA via data-cta attribute (optional)
      if (a.dataset.cta) {
        return trackCta(a.dataset.cta, u?.toString() || href);
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
