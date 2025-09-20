// components/layout/footer.tsx
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(
    SITE_CONFIG.whatsappNumber,
    "Hi! I'd like to check availability and rates at Lake View Villa Tangalle."
  );

  return (
    <footer
      role="contentinfo"
      aria-labelledby="footer-heading"
      className="relative isolate bg-slate-950 text-slate-200"
    >
      {/* subtle aurora + top divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(14,165,233,0.10), transparent 60%), radial-gradient(50% 35% at 85% 15%, rgba(45,212,191,0.10), transparent 60%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="py-14 md:py-18 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="Lake View Villa Tangalle logo"
                width={48}
                height={48}
                className="rounded-xl ring-1 ring-white/10"
                priority
              />
              <h3 id="footer-heading" className="text-xl font-semibold">
                Lake View Villa Tangalle
              </h3>
            </div>
            <p className="mt-4 text-slate-400 leading-relaxed">
              A private villa on a serene lagoon in Tangalle. Sunrise over still
              water; nights under infinite stars.
            </p>

            {/* Primary CTA row */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 hover:text-white border border-emerald-400/30 px-4 py-2 text-sm font-medium transition-colors"
                aria-label="Chat on WhatsApp to book your stay"
              >
                <Phone className="h-4 w-4" />
                Book via WhatsApp
                <ArrowUpRight className="h-4 w-4 opacity-70" />
              </a>

              {SITE_CONFIG.googleMapsUrl && (
                <a
                  href={SITE_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10 px-4 py-2 text-sm font-medium transition-colors"
                  aria-label="Open the villa location on Google Maps"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Maps
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </a>
              )}
            </div>
          </div>

          {/* Contact (with microdata) */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-sm font-semibold tracking-wide text-slate-300">
              Contact
            </h4>
            <address className="not-italic mt-4 space-y-3 text-slate-400">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                <span>
                  <span itemProp="streetAddress">19/6 Julgahawalagoda</span>,{" "}
                  <span itemProp="addressLocality">Kadurupokuna South</span>,{" "}
                  <span itemProp="addressCountry">Tangalle</span>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-slate-300" />
                <a
                  href={`tel:${
                    SITE_CONFIG.whatsappNumber?.replace(/\s+/g, "") ||
                    "+94701164056"
                  }`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.whatsappNumberText || "+94 70 116 4056"}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-300" />
                <a
                  href="mailto:janithsadika50@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  janithsadika50@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Quick links */}
          <nav
            className="md:col-span-3 lg:col-span-4"
            aria-label="Footer navigation"
          >
            <h4 className="text-sm font-semibold tracking-wide text-slate-300">
              Quick Links
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Villa
                </a>
              </li>
              <li>
                <a
                  href="#amenities"
                  className="hover:text-white transition-colors"
                >
                  Amenities
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  className="hover:text-white transition-colors"
                >
                  Experiences
                </a>
              </li>
              <li>
                <a
                  href="#location"
                  className="hover:text-white transition-colors"
                >
                  Location
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="hover:text-white transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>

            {/* Back to top */}
            <div className="mt-6">
              <Link
                href="#home"
                className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                aria-label="Back to top"
              >
                ↑ Back to top
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-slate-400">
          <p>&copy; {year} Lake View Villa Tangalle. All rights reserved.</p>
          <p className="opacity-80">
            Built with performance, accessibility, and calm delight.
          </p>
        </div>
      </div>
    </footer>
  );
}
