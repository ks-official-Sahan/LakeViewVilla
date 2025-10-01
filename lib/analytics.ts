// /lib/analytics.ts
export type ContactMethod = "phone" | "email" | "whatsapp";

function pageCtx() {
  if (typeof window === "undefined") return {};
  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  };
}

export function dlPush(payload: Record<string, any>) {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(payload);
}

// Unified contact → CE: contact_intent → GA4 event: contact
export function trackContact(method: ContactMethod, url: string, text = "") {
  dlPush({
    event: "contact_intent",
    method,
    link_url: url,
    link_text: text,
    ...pageCtx(),
  });
}

// Developer page view → CE: developer_page_view → GA4: developer_page_view
export function trackDeveloperPageView() {
  dlPush({ event: "developer_page_view", ...pageCtx() });
}

// Dev portfolio outbound → CE: dev_portfolio_click → GA4: dev_portfolio_click
export function trackDevPortfolioClick(
  dest_url: string,
  dest_domain: string,
  text = ""
) {
  dlPush({
    event: "dev_portfolio_click",
    dest_url,
    dest_domain,
    link_text: text,
    ...pageCtx(),
  });
}

// Map open → CE: map_open → GA4: map_open
export function trackMapOpen(map_url: string, text = "") {
  dlPush({ event: "map_open", map_url, link_text: text, ...pageCtx() });
}

// Optional generic CTA
export function trackCta(cta: string, link_url?: string) {
  dlPush({
    event: "cta_click",
    cta,
    link_url: link_url || (typeof window !== "undefined" ? location.href : ""),
    ...pageCtx(),
  });
}
