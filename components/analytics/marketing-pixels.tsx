// components/analytics/marketing-pixels.tsx
"use client";

export default function MarketingPixels() {
  // GTM-friendly click events for SEM/SMM attribution & conversions
  const gadsId = process.env.NEXT_PUBLIC_GADS_ID; // e.g. "AW-XXXXXXXXX"
  const gadsPhoneLabel = process.env.NEXT_PUBLIC_GADS_PHONE_CALL_LABEL; // e.g. "abcdEFGHijkLMnoPQR"

  // Helper: fire GA4/Ads if present, else only dataLayer push (GTM will route)
  function fire(name: string, params: Record<string, any> = {}) {
    // GTM layer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: name, ...params });

    // Optional: direct Ads call conversion on phone clicks (parallel to GTM)
    if (
      name === "phone_call_click" &&
      (window as any).gtag &&
      gadsId &&
      gadsPhoneLabel
    ) {
      try {
        (window as any).gtag("event", "conversion", {
          send_to: `${gadsId}/${gadsPhoneLabel}`,
        });
      } catch {}
    }
  }

  if (typeof window !== "undefined") {
    document.addEventListener(
      "click",
      (e) => {
        const el = (e.target as HTMLElement)?.closest("a");
        if (!el) return;
        const href = el.getAttribute("href") || "";

        // tel: → phone call conversion
        if (href.startsWith("tel:")) {
          fire("phone_call_click", {
            link_url: href,
            cta: el.dataset.cta || "phone",
          });
        }

        // WhatsApp deep links
        if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
          fire("whatsapp_click", {
            link_url: href,
            cta: el.dataset.cta || "whatsapp",
          });
        }

        // CTA buttons: add data-cta="book|visit|gallery|..." in markup
        if (el.dataset.cta) {
          fire("cta_click", {
            cta: el.dataset.cta,
            link_url: href || location.href,
          });
        }
      },
      { capture: true }
    );
  }

  return null;
}
