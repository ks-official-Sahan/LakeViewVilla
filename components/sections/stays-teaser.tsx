"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { Star, Users, Phone, ArrowRight } from "lucide-react";
import { BOOKING_FACTS, STAYS_INTRO, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackContact } from "@/lib/analytics";
import {
  IconBrandAirbnb,
  IconBrandBooking,
} from "@tabler/icons-react";

export function StaysTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleWhatsApp = () => {
    const msg = `Hi! I'd like to enquire about availability and rates for Lake View Villa Tangalle. Could you please share the best available rate and confirm availability?`;
    const url = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, msg);
    trackContact("whatsapp", url, "Stays Teaser CTA");
    setTimeout(() => window.open(url, "_blank", "noopener"), 120);
  };

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.fromTo(headingRef.current, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium,
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });

      const cards = cardsRef.current?.querySelectorAll<HTMLElement>("[data-room]");
      if (cards) {
        gsap.fromTo(cards, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0,
          duration: 0.65, ease: EASE.out,
          stagger: 0.12,
          scrollTrigger: { trigger: cardsRef.current, start: "top 82%", once: true },
        });
      }

      gsap.fromTo(ctaRef.current, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.65, ease: EASE.out, delay: 0.1,
        scrollTrigger: { trigger: ctaRef.current, start: "top 88%", once: true },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="stays"
      aria-labelledby="stays-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Ambient */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 45% at 80% 40%, rgba(14,165,233,.07), transparent 65%), radial-gradient(50% 35% at 10% 70%, rgba(34,211,238,.05), transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Accommodation</p>
          <h2
            id="stays-heading"
            className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight text-[var(--color-foreground)]"
          >
            Your perfect{" "}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">
              stay awaits
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--color-muted)]">{STAYS_INTRO}</p>

          {/* Rating pill */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 shadow-sm">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 fill-amber-400 text-amber-400`} />
              ))}
            </div>
            <span className="text-sm font-bold text-[var(--color-foreground)]">
              {BOOKING_FACTS.reviewMetrics?.average}
            </span>
            <span className="text-sm text-[var(--color-muted)]">
              · {BOOKING_FACTS.reviewMetrics?.count} reviews
            </span>
          </div>
        </div>

        {/* Room cards */}
        <div ref={cardsRef} className="mb-10 grid gap-5 md:grid-cols-2">
          {BOOKING_FACTS.rooms?.map((room, i) => (
            <article
              key={room.name}
              data-room
              className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:border-[var(--color-primary)]/30 hover:shadow-[0_8px_32px_rgba(14,165,233,.10)] md:p-7"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-foreground)]">{room.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                    <Users className="h-3.5 w-3.5" />
                    <span>Sleeps {room.sleeps}</span>
                  </div>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] text-xs font-bold text-white shadow-md">
                  0{i + 1}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {room.features.slice(0, 5).map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2.5 text-sm text-[var(--color-muted)]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Bottom gradient line */}
              <span aria-hidden
                className="mt-5 block h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] transition-transform duration-500 group-hover:scale-x-100"
              />
            </article>
          ))}
        </div>

        {/* CTA block */}
        <div ref={ctaRef} className="mx-auto max-w-lg">
          {/* Primary — WhatsApp */}
          <button
            onClick={handleWhatsApp}
            aria-label="Get the best rate on WhatsApp"
            className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:brightness-110"
          >
            <Phone className="h-5 w-5" />
            Get Best Rate on WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary — OTA buttons */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => window.open("https://www.airbnb.com/l/CfK96vPd", "_blank", "noopener")}
              aria-label="Book on Airbnb"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-foreground)] shadow-sm transition-all hover:border-[#FF5A5F]/40 hover:text-[#FF5A5F] hover:shadow-md"
            >
              <IconBrandAirbnb className="h-5 w-5" />
              Airbnb
            </button>
            <button
              onClick={() => window.open("https://www.booking.com/Pulse-81UlHU", "_blank", "noopener")}
              aria-label="Book on Booking.com"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-foreground)] shadow-sm transition-all hover:border-[#003580]/40 hover:text-[#003580] hover:shadow-md dark:hover:text-[#38bdf8]"
            >
              <IconBrandBooking className="h-5 w-5" />
              Booking.com
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
            Message us for personalized rates, instant confirmation &amp; flexible booking.
          </p>
        </div>
      </div>
    </section>
  );
}
