// components/sections/pinned-hero.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const blurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

type Props = { nextSectionId: string };

export function PinnedHero({ nextSectionId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const saveData = useMemo(
    () =>
      typeof navigator !== "undefined" && "connection" in navigator
        ? // @ts-ignore
          Boolean(navigator.connection?.saveData)
        : false,
    []
  );
  const allowMotion = !prefersReducedMotion && !saveData;

  const playVideo = async () => {
    const v = videoRef.current;
    if (!v || isVideoLoading) return;
    setIsVideoLoading(true);
    try {
      v.muted = true;
      v.playsInline = true;
      await v.play();
      setIsVideoPlaying(true);
    } catch {
      setIsVideoPlaying(false);
    } finally {
      setIsVideoLoading(false);
    }
  };
  const pauseVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
    } catch {}
    setIsVideoPlaying(false);
  };

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    const endEl = document.getElementById(nextSectionId) || root;

    inner.style.willChange = "opacity, transform";

    const doc = document.documentElement;
    doc.style.setProperty("--hero-progress", "0");
    doc.style.setProperty("--hero-xfade", "1");

    const st = ScrollTrigger.create({
      id: "hero-pin",
      trigger: root,
      start: "top top",
      endTrigger: endEl,
      end: "top top",
      pin: true,
      pinSpacing: true,
      scrub: allowMotion ? 0.25 : false,
      anticipatePin: 1,
      fastScrollEnd: true,
      // ✅ auto-snap to top/bottom of the pinned range (i.e., hero fully shown or fully gone)
      snap: allowMotion
        ? {
            snapTo: [0, 1], // start or end
            duration: { min: 0.2, max: 0.7 },
            ease: "power2.out",
            inertia: true,
            delay: 0, // snap immediately when user stops
          }
        : false,
      onUpdate(self) {
        const p = self.progress; // 0..1
        const heroOpacity = 1 - Math.pow(p, 1.12);
        inner.style.opacity = String(heroOpacity);
        inner.style.transform = `scale(${1 - p * 0.02})`;
        doc.style.setProperty("--hero-progress", p.toFixed(4));
        doc.style.setProperty("--hero-xfade", heroOpacity.toFixed(4));

        const v = videoRef.current;
        if (!v) return;
        if (p > 0.98 && !v.paused) pauseVideo();
        else if (
          p <= 0.98 &&
          document.visibilityState === "visible" &&
          allowMotion
        ) {
          void playVideo();
        }
      },
      onToggle(self) {
        if (self.isActive && allowMotion) void playVideo();
      },
      onLeave() {
        // a11y: ensure keyboard users are correctly "in" the next section
        const next = document.getElementById(nextSectionId);
        if (next) {
          if (!next.hasAttribute("tabindex"))
            next.setAttribute("tabindex", "-1");
          next.focus({ preventScroll: true });
        }
      },
      onEnterBack() {
        // coming back up: focus the hero for consistent navigation
        if (root) {
          if (!root.hasAttribute("tabindex"))
            root.setAttribute("tabindex", "-1");
          root.focus({ preventScroll: true });
        }
      },
    });

    const onVis = () => {
      if (document.hidden) pauseVideo();
      else if (allowMotion) void playVideo();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      st.kill();
    };
  }, [allowMotion, nextSectionId]);

  const handleGallery = () => {
    const el = document.getElementById("gallery");
    if (!el) return;
    if (location.hash !== "#gallery") location.hash = "gallery";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleWhatsApp = () => {
    const url = buildWhatsAppUrl(
      SITE_CONFIG.whatsappNumber,
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?"
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative h-[100svh] overflow-hidden"
      aria-label="Lake View Villa hero section"
    >
      <div ref={innerRef} className="absolute inset-0">
        {/* Background image loop */}
        <motion.div
          className="absolute inset-0"
          animate={
            allowMotion
              ? { scale: [1.08, 1.13, 1.08], x: [0, -10, 0], y: [0, -6, 0] }
              : { scale: 1.08 }
          }
          transition={
            allowMotion
              ? {
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }
              : undefined
          }
          aria-hidden="true"
        >
          <Image
            src="/serene-lagoon-at-sunrise-with-villa-silhouette.jpg"
            alt=""
            role="presentation"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            quality={85}
            draggable={false}
          />
        </motion.div>

        {/* Ambient video overlay */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: allowMotion ? 0.65 : 0.45 }}
          transition={{ duration: 1, delay: 0.4 }}
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            preload={allowMotion ? "metadata" : "none"}
            poster="/aerial-view-of-tropical-lagoon-with-villa.jpg"
            muted
            loop
            playsInline
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onError={(e) => console.warn("[hero] video error:", e)}
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Copy + CTAs */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance font-display"
              initial={{
                y: allowMotion ? 80 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 35%, rgba(6,182,212,0.95) 55%, rgba(255,255,255,0.92) 75%, rgba(255,255,255,0.88) 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow:
                  "0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(14,165,233,0.35), 0 0 90px rgba(6,182,212,0.25)",
              }}
            >
              {HERO_CONTENT.title}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl lg:text-3xl mb-8 text-pretty max-w-3xl mx-auto font-medium"
              initial={{
                y: allowMotion ? 40 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{
                color: "rgba(255,255,255,0.95)",
                textShadow:
                  "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
              }}
            >
              {HERO_CONTENT.tagline}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{
                y: allowMotion ? 24 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            >
              <Button
                size="lg"
                className="glass-strong text-white border-white/40 hover:border-white/60 px-10 py-5 text-lg font-semibold shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)] transition-all duration-300 hover:scale-105"
                onClick={handleGallery}
                aria-label="View photo gallery of Lake View Villa"
              >
                View Gallery
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/25 hover:text-white hover:border-cyan-300/80 px-10 py-5 text-lg font-semibold bg-transparent backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105"
                onClick={handleWhatsApp}
                aria-label="Contact us via WhatsApp to book your stay"
              >
                {HERO_CONTENT.ctas[1]}
              </Button>
            </motion.div>
          </div>

          {/* Play/Pause control */}
          <button
            className="absolute bottom-8 right-8 glass hover:glass-strong rounded-full p-4 text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            onClick={() => (isVideoPlaying ? pauseVideo() : void playVideo())}
            disabled={isVideoLoading}
            aria-label={
              isVideoPlaying
                ? "Pause background video"
                : "Play background video"
            }
            aria-pressed={isVideoPlaying}
          >
            {isVideoLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : isVideoPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
