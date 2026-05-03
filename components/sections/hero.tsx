"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";
import { Phone, ChevronDown } from "lucide-react";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackContact } from "@/lib/analytics";
import { SplitTextReveal } from "@/components/scroll/SplitTextReveal";

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQFBhESIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Atu0NQZjIyW8sMUkUbAAqBsR+1nGoLlri/lkJ9NVSlKpuSxi5DYz/2Q==";

type Props = { nextSectionId: string };

export function PinnedHero({ nextSectionId }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const tealWashRef = useRef<HTMLDivElement>(null);
  /** Scroll-driven exit: eyebrow through CTAs (layer 3) */
  const heroContentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLButtonElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  /** Layer 5 — radial vignette (subtle scroll-linked contrast) */
  const vignetteRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = buildWhatsAppUrl(
    SITE_CONFIG.whatsappNumber,
    "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?"
  );

  const handleWhatsApp = () => {
    trackContact("whatsapp", whatsappUrl, "Chat on WhatsApp");
    setTimeout(() => window.open(whatsappUrl, "_blank", "noopener,noreferrer"), 80);
  };

  const handleScrollDown = () => {
    const el = document.getElementById(nextSectionId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Cinematic entrance on mount ────────────────────────────────
  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: EASE.premium } });

    // Parallax background enters slightly zoomed, de-zooms
    tl.fromTo(
      bgRef.current,
      { scale: 1.12, opacity: 0 },
      { scale: 1.04, opacity: 1, duration: 1.6 },
      0
    );

    // Scrim fades in
    tl.fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 0.2);

    // Eyebrow — horizontal clip reveal + fade
    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, clipPath: "inset(0 100% 0 0)" },
      { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: EASE.out },
      0.4
    );

    // Line 1 — slides up + reveals via clip-path
    tl.fromTo(
      line1Ref.current,
      { y: 80, opacity: 0, clipPath: "inset(0 0 100% 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.85, ease: EASE.premium },
      0.55
    );

    // Line 2 — same, staggered
    tl.fromTo(
      line2Ref.current,
      { y: 80, opacity: 0, clipPath: "inset(0 0 100% 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.85, ease: EASE.premium },
      0.75
    );

    // CTAs — scale + fade with snap
    const btns = ctasRef.current?.children;
    tl.fromTo(
      btns ?? [],
      { y: 20, opacity: 0, scale: 0.92 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.12,
        ease: "back.out(1.7)",
      },
      1.1
    );

    // Scroll hint fades in last
    tl.fromTo(
      scrollHintRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 },
      1.5
    );

    // ── Floating scroll hint bob animation ────────────────────────
    gsap.to(scrollHintRef.current, {
      y: 8,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.0,
    });
  }, { scope: sectionRef });

  // ── Scroll-driven parallax ─────────────────────────────────────
  useGSAP(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Layer 1 parallax + layer 2 teal wash + layer 3–4 text / hint (spec §4.4)
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        if (bgRef.current) {
          gsap.set(bgRef.current, {
            y: `${p * 22}%`,
            scale: 1.04 + p * 0.08,
          });
        }
        if (tealWashRef.current) {
          gsap.set(tealWashRef.current, {
            opacity: 0.35 + p * 0.65,
          });
        }
        if (heroContentRef.current) {
          gsap.set(heroContentRef.current, {
            y: -40 * p,
            opacity: Math.max(0, 1 - p * 2.15),
            filter: `blur(${8 * p}px)`,
          });
        }
        if (scrollHintRef.current) {
          const hintOpacity =
            p <= 0.1 ? 1 : Math.max(0, 1 - (p - 0.1) / 0.35);
          gsap.set(scrollHintRef.current, { opacity: hintOpacity });
        }
        if (vignetteRef.current) {
          gsap.set(vignetteRef.current, {
            opacity: 0.42 + p * 0.38,
            scale: 1 + p * 0.04,
          });
        }
      },
    });

    return () => st.kill();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Lake View Villa — hero section"
      className="relative h-[100svh] overflow-hidden"
    >
      {/* ── Background image with parallax ─────────────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 origin-center will-change-transform"
      >
        <Image
          src="/villa/optimized/villa_img_02.webp"
          alt="Lake View Villa Tangalle — aerial panorama over Rekawa lake"
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL={BLUR}
          quality={80}
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* ── Multi-layer cinematic scrim ─────────────────────────── */}
      <div
        ref={scrimRef}
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,12,18,.75) 0%, rgba(4,12,18,.40) 30%, rgba(4,12,18,.18) 60%, rgba(4,12,18,.55) 100%)",
        }}
      />
      {/* Layer 2 — teal wash (opacity scrubbed on scroll) */}
      <div
        ref={tealWashRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 opacity-[0.35] will-change-opacity"
        style={{
          background:
            "linear-gradient(to top, rgba(0,178,180,.22), transparent)",
        }}
      />
      <div
        ref={vignetteRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 origin-center will-change-[opacity,transform]"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 45%, transparent 35%, rgba(2,8,14,.55) 100%)",
          opacity: 0.42,
        }}
      />

      {/* ── SEO noscript fallback ───────────────────────────────── */}
      <noscript>
        <img
          src="/villa/optimized/villa_img_02.webp"
          alt="Lake View Villa Tangalle — aerial view over the lagoon"
          style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
        />
      </noscript>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex h-full min-h-0 flex-col text-white">
        {/*
          Explicit lane below fixed header — vertical centering only affects the band below this,
          so the eyebrow/cluster cannot drift under nav links (mid-width desktops).
        */}
        <div
          aria-hidden
          className="shrink-0"
          style={{
            height:
              "calc(var(--header-h) + env(safe-area-inset-top, 0px) + clamp(0.75rem, 2vh, 1.35rem))",
          }}
        />
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-[clamp(1rem,4vw,1.75rem)] pb-[clamp(5rem,12vh,7rem)] text-center">
          <div
            ref={heroContentRef}
            className="mx-auto w-full max-w-[min(100%,64rem)] will-change-[transform,opacity,filter]"
          >
          {/* Eyebrow label */}
          <p
            ref={eyebrowRef}
            className="mx-auto mb-[clamp(0.5rem,1.5vmin,0.85rem)] flex w-fit max-w-[min(100%,calc(100vw-2rem))] flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm sm:px-3 sm:tracking-[0.18em]"
            style={{ fontSize: "var(--fluid-hero-eyebrow)" }}
          >
            <span className="size-1 shrink-0 rounded-full bg-[#22d3ee] animate-pulse sm:size-1.5" />
            Tangalle · Sri Lanka
          </p>

          {/* Main heading — two lines with clip-path reveal */}
          <div ref={headingRef}>
            <h1 className="font-[var(--font-display)] font-black leading-[1.06] tracking-tight sm:leading-[1.03]">
              <span
                ref={line1Ref}
                className="block text-white"
                style={{
                  fontSize: "var(--fluid-hero-title)",
                  textShadow: "0 4px 32px rgba(0,0,0,.55), 0 1px 2px rgba(0,0,0,.8)",
                }}
              >
                {HERO_CONTENT.titleParts[0]}
              </span>
              <span
                ref={line2Ref}
                className="block bg-gradient-to-r from-[#7ee8fa] via-[#22d3ee] to-[#34d399] bg-clip-text text-transparent"
                style={{ fontSize: "var(--fluid-hero-title)" }}
              >
                {HERO_CONTENT.titleParts[1]}
              </span>
            </h1>
          </div>

          {/* Subtitle — scroll-driven word reveal (Phase 4) */}
          <SplitTextReveal
            text={HERO_CONTENT.tagline}
            as="p"
            variant="words"
            intensity="subtle"
            start="top 78%"
            className="mx-auto mt-[clamp(0.75rem,2.5vmin,1.35rem)] max-w-[min(62ch,calc(100vw-2rem))] font-medium leading-relaxed text-white/80"
            style={{
              textShadow: "0 2px 14px rgba(0,0,0,.5)",
              fontSize: "var(--fluid-hero-body)",
            }}
          />

          {/* CTAs — fixed max widths so buttons never dominate the headline */}
          <div
            ref={ctasRef}
            className="mx-auto mt-[clamp(1rem,3vmin,1.75rem)] flex w-full max-w-[min(40rem,100%)] flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link
              href="/gallery"
              transitionTypes={["spa-page"]}
              aria-label="View the photo gallery"
              className="group relative inline-flex h-11 w-full max-w-[min(100%,17rem)] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/30 bg-white/12 px-5 py-2 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:h-12 sm:w-52 sm:max-w-none sm:shrink-0 sm:px-6 sm:py-2.5"
              style={{ fontSize: "var(--fluid-cta-text)" }}
            >
              {/* Shimmer */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-full top-0 h-full w-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ animation: "none" }}
              />
              View Gallery
            </Link>

            <button
              onClick={handleWhatsApp}
              aria-label="Contact us via WhatsApp to book"
              className="group inline-flex h-11 w-full max-w-[min(100%,20rem)] cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] px-5 py-2 font-semibold text-white shadow-lg shadow-[#0ea5e9]/30 transition-all duration-300 hover:shadow-[#0ea5e9]/50 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]/60 sm:h-12 sm:w-60 sm:max-w-none sm:shrink-0 sm:px-6 sm:py-2.5"
              style={{ fontSize: "var(--fluid-cta-text)" }}
            >
              <Phone className="size-4 shrink-0 sm:size-[1.05rem]" />
              {HERO_CONTENT.ctas[1]}
            </button>
          </div>
          </div>
        </div>

        {/* Scroll hint */}
        <button
          ref={scrollHintRef}
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll down to explore"
          className="pointer-events-auto absolute bottom-[max(env(safe-area-inset-bottom,1rem),1.25rem)] left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-[clamp(0.25rem,1vw,0.45rem)] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <span className="font-medium uppercase tracking-[0.14em] sm:tracking-widest [font-size:clamp(0.5625rem,calc(0.48rem+0.35vw),0.6875rem)]">
            Scroll to explore
          </span>
          {/* Animated line */}
          <span className="relative h-8 w-px overflow-hidden rounded-full bg-white/20">
            <span
              aria-hidden
              className="absolute top-0 h-1/2 w-full rounded-full bg-white/80"
              style={{ animation: "scrollLine 1.6s ease-in-out infinite" }}
            />
          </span>
          <ChevronDown className="h-[clamp(0.85rem,2vw,1rem)] w-[clamp(0.85rem,2vw,1rem)] opacity-60" />
        </button>
      </div>

    </section>
  );
}
