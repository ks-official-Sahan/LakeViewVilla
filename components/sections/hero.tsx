"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackContact } from "@/lib/analytics";

type Props = { nextSectionId: string };

// small blur placeholder (keep your BLUR or a very small base64)
const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";

export function PinnedHero({ nextSectionId }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const allowMotion = !prefersReducedMotion;

  const handleGallery = () => {
    const el = document.getElementById("gallery");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppUrl(
      SITE_CONFIG.whatsappNumber,
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?"
    );
    trackContact("whatsapp", url, "Chat on WhatsApp");
    // open after a small timeout for analytics to fire
    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 80);
  };

  return (
    <section
      ref={(el) => (rootRef.current = el)}
      id="home"
      className="relative h-[100svh] overflow-hidden touch-pan-y"
      aria-label="Lake View Villa hero section"
    >
      {/* Background media + scrim */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/villa/drone_view_villa.jpg"
          alt="Lake View Villa - aerial view"
          role="img"
          fill
          sizes="100vw"
          priority // LCP image
          placeholder="blur"
          blurDataURL={BLUR}
          quality={80}
          className="object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.68)_0%,rgba(0,0,0,.35)_40%,rgba(0,0,0,.15)_70%,rgba(0,0,0,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.42)_45%,rgba(0,0,0,.18)_75%,rgba(0,0,0,0)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="w-full max-w-5xl mx-auto py-12">
          <motion.h1
            className="font-bold mb-4 font-display leading-tight"
            initial={{ y: allowMotion ? 80 : 0, opacity: allowMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              textShadow: "0 0 30px rgba(0,0,0,.45), 0 2px 18px rgba(0,0,0,.6)",
            }}
          >
            <span className="block text-[clamp(1.6rem,7vw,4.75rem)]">
              <p>{HERO_CONTENT.titleParts[0]}</p>
              <p>{HERO_CONTENT.titleParts[1]}</p>
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto font-medium text-white/95 text-[clamp(0.95rem,3.6vw,1.375rem)] max-w-[68ch] mb-7"
            initial={{ y: allowMotion ? 40 : 0, opacity: allowMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            style={{ textShadow: "0 2px 18px rgba(0,0,0,.55)" }}
          >
            <span>{HERO_CONTENT.tagline}</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            initial={{ y: allowMotion ? 24 : 0, opacity: allowMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          >
            <Button
              size="lg"
              className="glass-strong text-white border-white/40 hover:border-white/60 px-5 py-3 md:px-8 md:py-5 md:text-lg font-semibold"
              onClick={handleGallery}
              aria-label="View photo gallery of Lake View Villa"
            >
              View Gallery
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:border-cyan-400/70 hover:text-cyan-100 bg-cyan-500/30 backdrop-blur-2xl text-white border-cyan-300/80 px-5 py-3 md:px-8 md:py-5 md:text-lg hover:glass font-semibold"
              onClick={handleWhatsApp}
              aria-label="Contact us via WhatsApp to book your stay"
            >
              {HERO_CONTENT.ctas[1]}
            </Button>
          </motion.div>
        </div>

        {/* Scroll hint (user-initiated only) */}
        <button
          type="button"
          onClick={() => {
            const endEl = document.getElementById(nextSectionId);
            if (endEl)
              endEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="pointer-events-auto absolute bottom-[max(env(safe-area-inset-bottom),1rem)] left-1/2 -translate-x-1/2 text-white/90"
          aria-label="Scroll to next section"
        >
          <div className="flex flex-col items-center px-3 py-1.5">
            <span className="text-xs sm:text-sm mb-1 font-medium">
              Scroll to explore
            </span>
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          </div>
        </button>
      </div>
    </section>
  );
}
