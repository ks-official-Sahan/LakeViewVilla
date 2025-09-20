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
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

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
      // @ts-ignore
      Boolean(navigator.connection?.saveData),
    []
  );
  const allowMotion = !prefersReducedMotion && !saveData;

  // Pointer tilt (fine pointers only)
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
    if (!v.paused || playPromiseRef.current) return; // already playing / in-flight

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

  // Keyboard toggle (K)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k") {
        if (isVideoPlaying) pauseVideo();
        else void playVideo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVideoPlaying]);

  // Pin + publish CSS vars + deterministic handoff
  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const endEl = document.getElementById(nextSectionId);
    if (!root || !inner || !endEl) return;

    const doc = document.documentElement;
    // Start with hero fully visible
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
      snap: false, // we do a deliberate scrollTo handoff
      onEnter() {
        if (allowMotion && videoReady) void playVideo();
      },
      onEnterBack() {
        if (allowMotion && videoReady) void playVideo();
      },
      onUpdate(self) {
        const p = self.progress; // 0..1
        const heroOpacity = 1 - Math.pow(p, 1.12);
        inner.style.opacity = String(heroOpacity);
        inner.style.transform = `scale(${1 - p * 0.02})`;

        // Publish vars for dependent sections
        doc.style.setProperty("--hero-progress", p.toFixed(4));
        doc.style.setProperty("--hero-xfade", heroOpacity.toFixed(4));

        // Deterministic handoff once
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
        // Lock to "hero gone"
        doc.style.setProperty("--hero-progress", "1");
        doc.style.setProperty("--hero-xfade", "0");
        pauseVideo();
      },
      onKill() {
        // Safety defaults if this component unmounts / refreshes
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

  // Encourage buffering; autoplay when ready
  useEffect(() => {
    if (!allowMotion) return;
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => setVideoReady(true);
    v.addEventListener("canplay", onCanPlay, { once: true });

    // Nudge loading in idle time
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
      // element-scoped pointer move (fine pointers)
      onPointerMove={(e) => {
        if (!allowMotion || !isFinePointer) return;
        const r = rootRef.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
    >
      <div ref={innerRef} className="absolute inset-0">
        {/* MEDIA LAYER — crisp video, image fallback underneath */}
        <motion.div
          className="absolute inset-0 will-change-transform"
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
            {/* <source src="/hero.mp4" type="video/mp4" /> */}
          </video>
        </motion.div>

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 text-balance font-display"
              initial={{
                y: allowMotion ? 80 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 40%, rgba(56,189,248,0.96) 55%, rgba(255,255,255,0.92) 75%, rgba(255,255,255,0.88) 100%)",
                backgroundSize: "220% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow:
                  "0 0 30px rgba(255,255,255,0.55), 0 0 60px rgba(14,165,233,0.3)",
              }}
            >
              {HERO_CONTENT.title}
            </motion.h1>

            <motion.p
              className="text-md md:text-xl lg:text-2xl mb-8 text-pretty max-w-3xl mx-auto font-medium"
              initial={{
                y: allowMotion ? 40 : 0,
                opacity: allowMotion ? 0 : 1,
              }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{
                color: "rgba(255,255,255,0.96)",
                textShadow: "0 2px 22px rgba(0,0,0,0.6)",
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
                className="glass-strong text-white border-white/40 hover:border-white/60 px-6 py-3 md:px-10 md:py-5 md:text-lg font-semibold shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)] transition-all duration-300 hover:scale-105"
                onClick={handleGallery}
                aria-label="View photo gallery of Lake View Villa"
              >
                View Gallery
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/25 hover:text-white hover:border-cyan-300/80 px-6 py-3 md:px-10 md:py-5 md:text-lg font-semibold bg-transparent backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105"
                onClick={handleWhatsApp}
                aria-label="Contact us via WhatsApp to book your stay"
              >
                {HERO_CONTENT.ctas[1]}
              </Button>
            </motion.div>
          </div>

          {/* LEFT control (safe-area aware) */}
          <button
            className="absolute z-20 rounded-full p-2 md:p-4 text-white transition-all duration-300 glass hover:glass-strong shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]
                       left-[max(env(safe-area-inset-left),2rem)] bottom-[max(env(safe-area-inset-bottom),2rem)]"
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
            className="pointer-events-none absolute bottom-[max(env(safe-area-inset-bottom),1.5rem)] left-1/2 -translate-x-1/2 text-white/90"
            animate={{ y: [0, 12, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            aria-hidden="true"
          >
            <div className="flex flex-col items-center px-4 py-2">
              <span className="text-sm mb-1.5 font-medium">
                Scroll to explore
              </span>
              <div className="w-px h-7 bg-gradient-to-b from-white/90 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
