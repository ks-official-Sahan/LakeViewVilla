"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { SITE_CONFIG } from "@/data/site";

type Experience = {
  name: string;
  image: string;
  thumb?: string;
  description: string;
  ctaHref: string;
};

const sendMsg = (loc: string) =>
  buildWhatsAppUrl(
    SITE_CONFIG.whatsappNumber,
    `Hi, I would like to book a day trip to ${loc} with Lake View Villa.`
  );

const EXPERIENCES: Experience[] = [
  { name: "Rekawa Turtle Beach", image: "/images/optimized/rekawa.webp", description: "One of Sri Lanka's most important turtle nesting sites — witness nature's oldest ritual at dusk.", ctaHref: sendMsg("Rekawa Turtle Beach") },
  { name: "Hiriketiya Beach", image: "/images/optimized/hiriketiya.webp", description: "A crescent bay beloved by surfers and yogis alike — crystal water, golden sand, zero crowds.", ctaHref: sendMsg("Hiriketiya Beach") },
  { name: "Lagoon Kayaking", image: "/images/optimized/kayaking.webp", description: "Paddle through mirror-calm waters flanked by mangroves, birds, and absolute silence.", ctaHref: sendMsg("Tangalle Lagoon Kayaking") },
  { name: "Kalamatiya Sanctuary", image: "/images/optimized/kalamatiya.webp", description: "A coastal wetland where flamingoes, pelicans, and painted storks make their seasonal home.", ctaHref: sendMsg("Kalamatiya Bird Sanctuary") },
  { name: "Mulkirigala Rock Temple", image: "/images/optimized/mulkirigala.webp", description: "An ancient Buddhist monastery carved into a dramatic rock face — 2,200 years of living history.", ctaHref: sendMsg("Mulkirigala Rock Temple") },
  { name: "Yala National Park", image: "/images/optimized/yala.webp", description: "Leopards, elephants, sloth bears — the world's densest leopard population in raw Sri Lankan wilderness.", ctaHref: sendMsg("Yala National Park") },
  { name: "Hummanaya Blowhole", image: "/images/optimized/blowhole.webp", description: "Sri Lanka's largest blowhole shoots seawater 18 metres into the air — a geological spectacle.", ctaHref: sendMsg("Hummanaya Blowhole") },
  { name: "Sigiriya Rock Fortress", image: "/images/optimized/sigiriya.webp", description: "A UNESCO World Heritage Site — an ancient palace city perched atop a towering volcanic rock.", ctaHref: sendMsg("Sigiriya Rock Fortress") },
];

const wrap = (i: number) => ((i % EXPERIENCES.length) + EXPERIENCES.length) % EXPERIENCES.length;

export function ExperiencesReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Auto-advance
  useEffect(() => {
    if (paused || prefersReduced) return;
    autoRef.current = setInterval(() => setIndex((i) => wrap(i + 1)), 5500);
    return () => clearInterval(autoRef.current);
  }, [paused, prefersReduced]);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => wrap(i + dir));
    clearInterval(autoRef.current);
    setPaused(false);
  }, []);

  // Section entrance
  useGSAP(
    () => {
      if (prefersReduced) return;
      gsap.fromTo(headingRef.current, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium,
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });
      gsap.fromTo(reelRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium, delay: 0.15,
        scrollTrigger: { trigger: reelRef.current, start: "top 88%", once: true },
      });
    },
    { scope: sectionRef }
  );

  // Slide transition
  useEffect(() => {
    if (!slideRef.current || !infoRef.current || prefersReduced) return;
    const tl = gsap.timeline();
    tl.fromTo(slideRef.current, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.65, ease: EASE.out });
    tl.fromTo(infoRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE.out, stagger: 0.1 }, "-=0.35");
  }, [index, prefersReduced]);

  const prev = wrap(index - 1);
  const next = wrap(index + 1);
  const cur = EXPERIENCES[index];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  return (
    <section
      ref={sectionRef}
      id="experiences"
      aria-labelledby="experiences-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Ambient */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(65% 45% at 50% 0%, rgba(14,165,233,.09), transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Around the Villa</p>
          <h2 id="experiences-heading"
            className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold tracking-tight text-[var(--color-foreground)]">
            Discover Tangalle&apos;s{" "}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">wonders</span>
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Ancient temples, ocean dramas, wildlife corridors — all within easy reach.
          </p>
        </div>

        {/* Reel */}
        <div
          ref={reelRef}
          className="relative mx-auto max-w-5xl select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Experiences slideshow"
          aria-roledescription="carousel"
        >
          {/* Peek — prev */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={`Previous: ${EXPERIENCES[prev].name}`}
            className="group absolute left-0 top-0 bottom-0 z-10 w-[18%] overflow-hidden rounded-l-3xl"
          >
            <div className="absolute inset-0">
              <Image src={EXPERIENCES[prev].image} alt="" aria-hidden fill className="object-cover saturate-50" sizes="20vw" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(90deg, rgba(4,12,18,.65), rgba(4,12,18,.30) 50%, transparent)",
                maskImage: "linear-gradient(to right, black 50%, transparent)"
              }} />
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center text-white/50 group-hover:text-white transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </div>
          </button>

          {/* Peek — next */}
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={`Next: ${EXPERIENCES[next].name}`}
            className="group absolute right-0 top-0 bottom-0 z-10 w-[18%] overflow-hidden rounded-r-3xl"
          >
            <div className="absolute inset-0">
              <Image src={EXPERIENCES[next].image} alt="" aria-hidden fill className="object-cover saturate-50" sizes="20vw" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(270deg, rgba(4,12,18,.65), rgba(4,12,18,.30) 50%, transparent)",
                maskImage: "linear-gradient(to left, black 50%, transparent)"
              }} />
            </div>
            <div className="absolute inset-y-0 left-2 flex items-center text-white/50 group-hover:text-white transition-colors">
              <ChevronRight className="h-6 w-6" />
            </div>
          </button>

          {/* Active slide */}
          <div
            ref={slideRef}
            aria-label={cur.name}
            aria-roledescription="slide"
            className="relative mx-[18%] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
            style={{ height: "clamp(22rem, 42vw, 36rem)" }}
          >
            <Image
              key={index}
              src={cur.image}
              alt={cur.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 70vw, 800px"
              priority={index === 0}
            />
            {/* Gradient scrim */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(4,12,18,.88) 0%, rgba(4,12,18,.35) 45%, transparent 70%)" }} />

            {/* Content */}
            <div ref={infoRef} className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <h3 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl" style={{ textShadow: "0 2px 16px rgba(0,0,0,.7)" }}>
                {cur.name}
              </h3>
              <p className="mb-5 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
                {cur.description}
              </p>
              <a
                href={cur.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-all hover:bg-white/22 hover:border-white/40"
              >
                <Phone className="h-4 w-4" />
                Book Day Trip
              </a>
            </div>

            {/* Progress bar */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
              {!paused && !prefersReduced && (
                <div
                  key={`${index}-bar`}
                  className="h-full bg-[var(--color-primary)]"
                  style={{ animation: "progressBar 5.5s linear forwards" }}
                />
              )}
            </div>
          </div>

          {/* Dot navigation */}
          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Slide navigation">
            {EXPERIENCES.map((exp, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to ${exp.name}`}
                onClick={() => { setIndex(i); clearInterval(autoRef.current); }}
                className={`rounded-full transition-all duration-300 ${i === index
                  ? "w-8 h-2 bg-[var(--color-primary)]"
                  : "w-2 h-2 bg-[var(--color-border)] hover:bg-[var(--color-muted)]"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progressBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  );
}
