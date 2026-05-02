"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE } from "@/lib/gsap";
import { PROPERTY, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { MapPin, Phone, Mail, ArrowUpRight, ExternalLink } from "lucide-react";

const NAV_COLS = [
  {
    heading: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/gallery", label: "Gallery" },
      { href: "/stays", label: "Stays" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { href: "/visit", label: "Visit Us" },
      { href: "/faq", label: "FAQ" },
      { href: "/developer", label: "Developer" },
    ],
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  const whatsappUrl = buildWhatsAppUrl(
    SITE_CONFIG.whatsappNumber,
    "Hi! I'd like to check availability and rates at Lake View Villa Tangalle."
  );

  useGSAP(
    () => {
      const cols = footerRef.current?.querySelectorAll<HTMLElement>("[data-footer-col]");
      if (!cols) return;
      gsap.fromTo(
        cols,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.7, ease: EASE.out,
          stagger: 0.1,
          scrollTrigger: { trigger: footerRef.current, start: "top 90%", once: true },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      aria-labelledby="footer-heading"
      className="relative isolate overflow-hidden bg-slate-950 text-slate-300"
    >
      {/* ── Aurora gradient ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 15% 5%, rgba(14,165,233,.10) 0%, transparent 65%), radial-gradient(45% 35% at 88% 20%, rgba(45,212,191,.09) 0%, transparent 60%)",
        }}
      />

      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* ── Main grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          {/* Brand */}
          <div data-footer-col className="md:col-span-5 lg:col-span-4">
            <Link
              href="/"
              transitionTypes={["spa-page"]}
              className="inline-flex items-center gap-3 group"
              aria-label="Lake View Villa home"
            >
              <Image
                src="/icon.png"
                alt="Lake View Villa Tangalle logo"
                width={44}
                height={44}
                className="rounded-xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105"
              />
              <h2 id="footer-heading" className="text-lg font-semibold text-white">
                Lake View Villa
              </h2>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              A private villa on a serene lagoon in Tangalle, Sri Lanka. Sunrise
              over still water; nights under infinite stars.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book via WhatsApp"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/12 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/22 hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                Book via WhatsApp
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </a>

              {SITE_CONFIG.googleMapsUrl && (
                <a
                  href={SITE_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Open in Maps
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
            </div>
          </div>

          {/* Contact */}
          <div data-footer-col className="md:col-span-4 lg:col-span-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Contact
            </h3>
            <address className="not-italic space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>
                  <span itemProp="streetAddress">19/6 Julgahawalagoda</span>,{" "}
                  <span itemProp="addressLocality">Kadurupokuna South</span>,{" "}
                  <span itemProp="addressCountry">Tangalle</span>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`tel:${SITE_CONFIG.whatsappNumber?.replace(/\s+/g, "") ?? "+94701164056"}`}
                  className="transition-colors hover:text-white"
                >
                  {SITE_CONFIG.whatsappNumberText ?? "+94 70 116 4056"}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${PROPERTY.email}`}
                  className="transition-colors hover:text-white"
                >
                  {PROPERTY.email}
                </a>
              </p>
            </address>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <nav
              key={col.heading}
              data-footer-col
              aria-label={`${col.heading} navigation`}
              className="md:col-span-2 lg:col-span-2"
            >
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      transitionTypes={["spa-page"]}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/8 py-6 text-xs text-slate-500 md:flex-row">
          <p>
            <Link href="/developer" transitionTypes={["spa-page"]} className="transition-colors hover:text-slate-300">
              Sahan Sachintha
            </Link>{" "}
            &copy; {year} Lake View Villa Tangalle. All rights reserved.
          </p>
          <p className="opacity-75">
            Built with performance, accessibility &amp; calm delight.
          </p>
        </div>
      </div>
    </footer>
  );
}
