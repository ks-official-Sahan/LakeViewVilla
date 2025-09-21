"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const blurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYE...";

type Props = { nextSectionId: string };

export function PinnedHero({ nextSectionId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const saveData = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      Boolean((navigator as any).connection?.saveData),
    []
  );
  const allowMotion = !prefersReducedMotion && !saveData;

  const isFinePointer = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: fine)").matches,
    []
  );
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(py, [0, 1], [5, -5]), {
    stiffness: 110,
    damping: 16,
  });
  const tiltY = useSpring(useTransform(px, [0, 1], [-5, 5]), {
    stiffness: 110,
    damping: 16,
  });

  const playVideo = async () => {
    const v = videoRef.current;
    if (!v || isVideoLoading) return;
    if (!v.paused || playPromiseRef.current) return;
    setIsVideoLoading(true);
    try {
      v.muted = true;
      v.playsInline = true;
      playPromiseRef.current = v.play();
      await playPromiseRef.current;
      setIsVideoPlaying(true);
    } catch {
      setIsVideoPlaying(false);
    } finally {
      setIsVideoLoading(false);
      playPromiseRef.current = null;
    }
  };

  const pauseVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (!v.paused) v.pause();
    } catch {}
    setIsVideoPlaying(false);
    playPromiseRef.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k")
        isVideoPlaying ? pauseVideo() : void playVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVideoPlaying]);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const endEl = document.getElementById(nextSectionId);
    if (!root || !inner || !endEl) return;
    const doc = document.documentElement;
    doc.style.setProperty("--hero-progress", "0");
    doc.style.setProperty("--hero-xfade", "1");
    inner.style.willChange = "opacity, transform";

    const autoSnapOnce = { done: false };
    const st = ScrollTrigger.create({
      id: "hero-pin",
      trigger: root,
      start: "top top",
      endTrigger: endEl,
      end: "top top",
      pin: true,
      pinSpacing: true,
      scrub: allowMotion ? 0.25 : false,
      anticipatePin: allowMotion ? 1 : 0,
      fastScrollEnd: true,
      onEnter() {
        if (allowMotion && videoReady) void playVideo();
      },
      onEnterBack() {
        if (allowMotion && videoReady) void playVideo();
      },
      onUpdate(self) {
        const p = self.progress;
        const heroOpacity = 1 - Math.pow(p, 1.12);
        inner.style.opacity = String(heroOpacity);
        inner.style.transform = `scale(${1 - p * 0.02})`;
        doc.style.setProperty("--hero-progress", p.toFixed(4));
        doc.style.setProperty("--hero-xfade", heroOpacity.toFixed(4));
        if (p > 0.995 && !autoSnapOnce.done) {
          autoSnapOnce.done = true;
          gsap.to(window, {
            duration: 0.45,
            ease: "power2.out",
            scrollTo: { y: endEl, offsetY: 0 },
            onComplete: () => {
              doc.style.setProperty("--hero-progress", "1");
              doc.style.setProperty("--hero-xfade", "0");
              if (!endEl.hasAttribute("tabindex"))
                endEl.setAttribute("tabindex", "-1");
              endEl.focus({ preventScroll: true });
            },
          });
        }
      },
      onLeave() {
        doc.style.setProperty("--hero-progress", "1");
        doc.style.setProperty("--hero-xfade", "0");
        pauseVideo();
      },
      onKill() {
        doc.style.setProperty("--hero-progress", "1");
        doc.style.setProperty("--hero-xfade", "0");
      },
    });

    const onVis = () => {
      if (document.hidden) pauseVideo();
      else if (allowMotion && videoReady) void playVideo();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      st.kill();
    };
  }, [allowMotion, nextSectionId, videoReady]);

  useEffect(() => {
    if (!allowMotion) return;
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setVideoReady(true);
    v.addEventListener("canplay", onCanPlay, { once: true });
    // @ts-ignore
    const idle =
      window.requestIdleCallback || ((cb: any) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => v.load?.(), { timeout: 1200 } as any);
    return () => {
      cancel(id as any);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, [allowMotion]);

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

  const videoId = useId();

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative h-[100svh] overflow-hidden overscroll-contain"
      aria-label="Lake View Villa hero section"
      onPointerMove={(e) => {
        if (!allowMotion || !isFinePointer) return;
        const r = rootRef.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
    >
      <div ref={innerRef} className="absolute inset-0">
        {/* MEDIA */}
        <motion.div
          className="absolute inset-0"
          animate={
            allowMotion
              ? { scale: [1.05, 1.09, 1.05], x: [0, -10, 0], y: [0, -6, 0] }
              : { scale: 1.05 }
          }
          transition={
            allowMotion
              ? { duration: 24, repeat: Infinity, ease: "linear" }
              : undefined
          }
          style={{
            rotateX: allowMotion ? (tiltX as any) : 0,
            rotateY: allowMotion ? (tiltY as any) : 0,
          }}
          aria-hidden="true"
        >
          <Image
            src="/villa/drone_view_villa.jpg"
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
          <video
            ref={videoRef}
            id={videoId}
            className="absolute inset-0 w-full h-full object-cover"
            preload={allowMotion ? "metadata" : "none"}
            autoPlay={allowMotion}
            muted
            loop
            playsInline
            poster="/villa/drone_view_villa.jpg"
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onLoadedData={() => {
              if (allowMotion) void playVideo();
            }}
            onError={(e) => console.warn("[hero] video error:", e)}
            style={{ pointerEvents: "none" }}
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero1.webm" type="video/webm" />
          </video>
          {/* Adaptive contrast scrim */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.68)_0%,rgba(0,0,0,.35)_40%,rgba(0,0,0,.15)_70%,rgba(0,0,0,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.42)_45%,rgba(0,0,0,.18)_75%,rgba(0,0,0,0)_100%)]" />
        </motion.div>

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-3 sm:px-4">
          <div className="w-full max-w-5xl mx-auto">
            <motion.h1
              className="font-bold mb-4 font-display leading-tight"
              style={{
                textShadow:
                  "0 0 30px rgba(0,0,0,.45), 0 2px 18px rgba(0,0,0,.6)",
              }}
              initial={{
                y: allowMotion ? 80 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <span className="block text-[clamp(1.6rem,7vw,4.75rem)] text-shadow-deep">
                {HERO_CONTENT.title}
              </span>
            </motion.h1>

            <motion.p
              style={{ textShadow: "0 2px 18px rgba(0,0,0,.55)" }}
              className="mx-auto font-medium text-white/95 text-[clamp(0.95rem,3.6vw,1.375rem)] max-w-[68ch] mb-7"
              initial={{
                y: allowMotion ? 40 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <span className="text-shadow-deep">{HERO_CONTENT.tagline}</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              initial={{
                y: allowMotion ? 24 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
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
                className="border-2 hover:border-cyan-400/70 hover:text-cyan-100 bg-cyan-500/20 text-white border-cyan-300/80 px-5 py-3 md:px-8 md:py-5 md:text-lg font-semibold backdrop-blur-md"
                onClick={handleWhatsApp}
                aria-label="Contact us via WhatsApp to book your stay"
              >
                {HERO_CONTENT.ctas[1]}
              </Button>
            </motion.div>
          </div>

          {/* LEFT control (safe-area aware) */}
          <button
            className="absolute z-20 rounded-full p-2 md:p-3 text-white transition-all duration-300 glass hover:glass-strong left-[max(env(safe-area-inset-left),1rem)] bottom-[max(env(safe-area-inset-bottom),1rem)]"
            onClick={() => (isVideoPlaying ? pauseVideo() : void playVideo())}
            disabled={isVideoLoading}
            title={isVideoPlaying ? "Pause video (K)" : "Play video (K)"}
            aria-label={
              isVideoPlaying
                ? "Pause background video"
                : "Play background video"
            }
            aria-pressed={isVideoPlaying}
            aria-controls={videoId}
          >
            {isVideoLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : isVideoPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>

          {/* Scroll hint */}
          <motion.div
            className="pointer-events-none absolute bottom-[max(env(safe-area-inset-bottom),1rem)] left-1/2 -translate-x-1/2 text-white/90"
            animate={{ y: [0, 12, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            aria-hidden="true"
          >
            <div className="flex flex-col items-center px-3 py-1.5">
              <span className="text-xs sm:text-sm mb-1 font-medium">
                Scroll to explore
              </span>
              <div className="w-px h-6 bg-gradient-to-b from-white/90 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
