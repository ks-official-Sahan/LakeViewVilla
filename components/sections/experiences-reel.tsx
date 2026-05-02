"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, MapPin, Compass } from "lucide-react";
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
  const [isChanging, setIsChanging] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Auto-advance
  useEffect(() => {
    if (paused || prefersReduced) return;
    autoRef.current = setInterval(() => setIndex((i) => wrap(i + 1)), 6000);
    return () => clearInterval(autoRef.current);
  }, [paused, prefersReduced]);

  const go = useCallback((dir: 1 | -1) => {
    if (isChanging) return;
    setIsChanging(true);
    setIndex((i) => wrap(i + dir));
    clearInterval(autoRef.current);
    setPaused(false);
    setTimeout(() => setIsChanging(false), 800);
  }, [isChanging]);

  // Section entrance
  useGSAP(
    () => {
      if (prefersReduced) return;
      gsap.fromTo(headingRef.current, { opacity: 0, y: 40, filter: "blur(8px)" }, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: DURATION.reveal, ease: EASE.premium,
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      });
      gsap.fromTo(reelRef.current, { opacity: 0, scale: 0.98, filter: "blur(4px)" }, {
        opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: EASE.premium, delay: 0.1,
        scrollTrigger: { trigger: reelRef.current, start: "top 80%", once: true },
      });
    },
    { scope: sectionRef }
  );

  // Cinematic slide transition
  useEffect(() => {
    if (!slideRef.current || !infoRef.current || prefersReduced) return;
    const tl = gsap.timeline();
    
    // Animate the image container
    tl.fromTo(
      slideRef.current, 
      { filter: "brightness(0.5) contrast(1.2)", scale: 1.08 }, 
      { filter: "brightness(1) contrast(1)", scale: 1, duration: 1.2, ease: "power3.out" }
    );
    
    // Staggered text reveal
    tl.fromTo(
      infoRef.current.children, 
      { opacity: 0, y: 30, filter: "blur(4px)" }, 
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: EASE.out, stagger: 0.1 }, 
      "-=0.9"
    );
  }, [index, prefersReduced]);

  const prev = wrap(index - 1);
  const next = wrap(index + 1);
  const cur = EXPERIENCES[index];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      setPaused((p) => !p);
    }
    if (e.key === "Home") {
      e.preventDefault();
      clearInterval(autoRef.current);
      setPaused(false);
      setIndex(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      clearInterval(autoRef.current);
      setPaused(false);
      setIndex(EXPERIENCES.length - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="experiences"
      aria-labelledby="experiences-heading"
      className="relative overflow-hidden py-24 md:py-36 bg-[var(--color-surface)] section-connector"
    >
      {/* Ambient glow map pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.svg')" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(var(--color-gold-rgb, 212,168,83), 0.05), transparent 50%)" }} />

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 flex flex-col items-center md:items-start text-center md:text-left md:mb-20">
          <p className="mb-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            <Compass className="h-4 w-4" /> Around the Villa
          </p>
          <h2 id="experiences-heading"
            className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tighter text-[var(--color-foreground)] leading-[1.1] max-w-3xl">
            Discover Tangalle&apos;s{" "}
            <span className="text-gradient-gold inline-block italic pr-2">wonders</span>
          </h2>
          <p className="mt-6 max-w-xl text-base md:text-lg text-[var(--color-muted)] font-medium">
            Ancient temples, ocean dramas, wildlife corridors — curated excursions all within easy reach of your sanctuary.
          </p>
        </div>

        {/* Cinematic Reel Container */}
        <div
          ref={reelRef}
          className="relative mx-auto w-full select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Experiences slideshow"
          aria-roledescription="carousel"
          aria-keyshortcuts="ArrowLeft ArrowRight Space Home End"
        >
          <p className="sr-only" aria-live="polite">
            {cur.name}. Slide {index + 1} of {EXPERIENCES.length}.
          </p>
          {/* Peek — prev */}
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={isChanging}
            aria-label={`Previous: ${EXPERIENCES[prev].name}`}
            className="group absolute left-0 top-0 bottom-0 z-10 hidden md:block w-[12%] overflow-hidden rounded-l-[2rem] transition-all hover:w-[15%]"
          >
            <div className="absolute inset-0">
              <Image src={EXPERIENCES[prev].image} alt="" aria-hidden fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 saturate-50 brightness-50" sizes="15vw" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4) 70%, transparent)",
                maskImage: "linear-gradient(to right, black 80%, transparent)"
              }} />
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center text-white/50 group-hover:text-white transition-all group-hover:-translate-x-2">
              <ChevronLeft className="h-8 w-8" />
            </div>
          </button>

          {/* Peek — next */}
          <button
            type="button"
            onClick={() => go(1)}
            disabled={isChanging}
            aria-label={`Next: ${EXPERIENCES[next].name}`}
            className="group absolute right-0 top-0 bottom-0 z-10 hidden md:block w-[12%] overflow-hidden rounded-r-[2rem] transition-all hover:w-[15%]"
          >
            <div className="absolute inset-0">
              <Image src={EXPERIENCES[next].image} alt="" aria-hidden fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 saturate-50 brightness-50" sizes="15vw" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(270deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4) 70%, transparent)",
                maskImage: "linear-gradient(to left, black 80%, transparent)"
              }} />
            </div>
            <div className="absolute inset-y-0 left-4 flex items-center text-white/50 group-hover:text-white transition-all group-hover:translate-x-2">
              <ChevronRight className="h-8 w-8" />
            </div>
          </button>

          {/* Active slide */}
          <div
            aria-label={cur.name}
            aria-roledescription="slide"
            className="relative mx-0 md:mx-[12%] overflow-hidden rounded-[2rem] bg-[#0a0f10] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-white/5"
            style={{ height: "clamp(30rem, 60vw, 42rem)" }}
          >
            <div ref={slideRef} className="absolute inset-0">
              <Image
                key={index}
                src={cur.image}
                alt={cur.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority={index === 0}
              />
              {/* Noise grain overlay for cinematic feel */}
              <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Premium Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f10] via-[#0a0f10]/40 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f10]/80 via-transparent to-transparent opacity-60" />

            {/* Mobile Controls */}
            <div className="absolute top-1/2 left-4 right-4 flex justify-between -translate-y-1/2 md:hidden z-20">
              <button onClick={() => go(-1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={() => go(1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Content overlay */}
            <div ref={infoRef} className="absolute inset-x-0 bottom-0 p-6 md:p-12 text-white z-10 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                South Coast
              </div>
              <h3 className="mb-4 text-3xl font-black tracking-tight md:text-5xl lg:text-6xl text-shadow-deep">
                {cur.name}
              </h3>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {cur.description}
              </p>
              <a
                href={cur.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black shadow-lg transition-all hover:bg-[var(--color-gold)] hover:text-white"
              >
                Plan this excursion
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:bg-white group-hover:text-[var(--color-gold)] group-hover:translate-x-1">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </a>
            </div>

            {/* Animated Progress Tracker Line */}
            <div className="absolute inset-x-0 top-0 flex h-1.5 w-full bg-black/40">
              {!paused && !prefersReduced && (
                <div
                  key={`${index}-bar`}
                  className="h-full bg-[var(--color-gold)]"
                  style={{ animation: "progressBar 6s linear forwards" }}
                />
              )}
            </div>
          </div>

          {/* Minimalist Dot Navigation */}
          <div className="mt-8 flex items-center justify-center gap-3" role="tablist" aria-label="Slide navigation">
            {EXPERIENCES.map((exp, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to ${exp.name}`}
                onClick={() => { setIndex(i); clearInterval(autoRef.current); }}
                className={`relative h-1.5 rounded-full transition-all duration-500 overflow-hidden ${
                  i === index
                    ? "w-12 bg-transparent"
                    : "w-3 bg-[var(--color-border)] hover:bg-[var(--color-muted)]"
                }`}
              >
                {i === index && (
                  <>
                    <div className="absolute inset-0 bg-[var(--color-border)]" />
                    <div 
                      key={`progress-${index}`}
                      className="absolute inset-y-0 left-0 bg-[var(--color-gold)]" 
                      style={!paused && !prefersReduced ? { animation: "progressBar 6s linear forwards" } : { width: '100%' }}
                    />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
