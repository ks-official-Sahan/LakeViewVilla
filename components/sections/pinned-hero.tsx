"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  useCallback,
} from "react";
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
import { Play, Pause, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { trackContact } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type Props = { nextSectionId: string };

const BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";

export function PinnedHero({ nextSectionId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoScrollRef = useRef(false); // 🧯 prevents “scroll up but jumps down” loop
  const destroyedRef = useRef(false);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);

  // Motion & data-saving gates
  const prefersReducedMotion = useReducedMotion();
  const saveData = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    // @ts-ignore
    const c = navigator.connection;
    return !!c?.saveData;
  }, []);
  const allowMotion = !prefersReducedMotion && !saveData;

  // Only tilt on fine pointers
  const isFinePointer = useMemo(
    () =>
      (typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: fine)").matches) ||
      false,
    []
  );

  // Gentle parallax
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

  // Gate video by network + intersection
  useEffect(() => {
    if (typeof window === "undefined") return;

    // @ts-ignore effectiveType is non-standard
    const et: string | undefined = navigator.connection?.effectiveType;
    const slow = et === "2g" || et === "slow-2g";
    if (saveData || slow) {
      setAllowVideo(false);
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        setAllowVideo(vis);
      },
      { rootMargin: "150px 0px 0px 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [saveData]);

  const playVideo = useCallback(async () => {
    const v = videoRef.current;
    if (!v || isVideoLoading) return;
    if (!v.paused) return;
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
  }, [isVideoLoading]);

  const pauseVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (!v.paused) v.pause();
    } catch {}
    setIsVideoPlaying(false);
  }, []);

  // Keyboard shortcut: “k” toggles video
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k") return;
      isVideoPlaying ? pauseVideo() : void playVideo();
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [isVideoPlaying, pauseVideo, playVideo]);

  // Pin + scrub with directional snap (no more reverse jump)
  useEffect(() => {
    if (!allowMotion) return;
    const root = rootRef.current;
    const inner = innerRef.current;
    const endEl = document.getElementById(nextSectionId);
    if (!root || !inner || !endEl) return;

    destroyedRef.current = false;
    inner.style.willChange = "opacity, transform";

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        id: "hero-pin",
        trigger: root,
        start: "top top",
        endTrigger: endEl,
        end: "top top",
        pin: true,
        pinSpacing: true,
        scrub: 0.25,
        anticipatePin: 1,
        fastScrollEnd: true,
        // Snap only via our own logic (direction-aware)
        // snap: false (default)
        onEnter() {
          if (allowVideo && videoReady) void playVideo();
        },
        onEnterBack() {
          if (allowVideo && videoReady) void playVideo();
        },
        onLeave() {
          pauseVideo();
        },
        onLeaveBack() {
          // back at the top of hero
          if (allowVideo && videoReady) void playVideo();
        },
        onUpdate(self) {
          if (destroyedRef.current) return;

          // Visual scrub
          const p = self.progress;
          const heroOpacity = 1 - Math.pow(p, 1.12);
          inner.style.opacity = String(heroOpacity);
          inner.style.transform = `scale(${1 - p * 0.02})`;

          // Direction-aware end snapping to the next section
          // ✅ Fixes “scroll up makes it jump down” by checking direction
          if (!autoScrollRef.current) {
            if (self.direction > 0 && p > 0.998) {
              autoScrollRef.current = true;
              gsap.to(window, {
                duration: 0.45,
                ease: "power2.out",
                scrollTo: { y: endEl, offsetY: 0, autoKill: false },
                onComplete: () => (autoScrollRef.current = false),
              });
            } else if (self.direction < 0 && p < 0.002) {
              autoScrollRef.current = true;
              gsap.to(window, {
                duration: 0.35,
                ease: "power2.out",
                scrollTo: { y: root, offsetY: 0, autoKill: false },
                onComplete: () => (autoScrollRef.current = false),
              });
            }
          }
        },
      });

      return () => st.kill();
    }, root);

    const onVis = () => {
      if (document.hidden) pauseVideo();
      else if (allowMotion && allowVideo && videoReady) void playVideo();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      destroyedRef.current = true;
      ctx.revert();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [
    allowMotion,
    nextSectionId,
    allowVideo,
    videoReady,
    pauseVideo,
    playVideo,
  ]);

  // Prepare video (idle) for faster first play
  useEffect(() => {
    if (!allowMotion) return;
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setVideoReady(true);
    v.addEventListener("canplay", onCanPlay, { once: true });

    // @ts-ignore
    const idle =
      window.requestIdleCallback || ((cb: any) => setTimeout(cb, 150));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => v.load?.(), { timeout: 800 } as any);

    return () => {
      cancel(id as any);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, [allowMotion]);

  // Actions
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
    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 80);
  };

  const videoId = useId();

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative h-[100svh] overflow-hidden overscroll-contain touch-pan-y"
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
            src="/villa/drone_view_villa.webp"
            alt=""
            role="presentation"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR}
            quality={80}
            draggable={false}
          />

          {/* Keep <video> for SSR parity; attach sources only when allowed */}
          <video
            ref={videoRef}
            id={videoId}
            className="absolute inset-0 w-full h-full object-cover"
            preload={allowVideo ? "metadata" : "none"}
            autoPlay={allowMotion && allowVideo}
            muted
            loop
            playsInline
            poster="/villa/drone_view_villa.webp"
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onLoadedData={() => {
              if (allowMotion && allowVideo) void playVideo();
            }}
            onError={(e) => console.warn("[hero] video error:", e)}
            style={{ pointerEvents: "none" }}
            aria-hidden="true"
          >
            {allowVideo && (
              <>
                <source
                  src="/hero_1080p.webm"
                  type="video/webm"
                  media="(min-width:1200px)"
                />
                <source
                  src="/hero_720p.webm"
                  type="video/webm"
                  media="(min-width:720px)"
                />
                <source
                  src="/hero_480p.webm"
                  type="video/webm"
                  media="(max-width:719px)"
                />
                <source
                  src="/hero_1080p.mp4"
                  type="video/mp4"
                  media="(min-width:1200px)"
                />
                <source
                  src="/hero_720p.mp4"
                  type="video/mp4"
                  media="(min-width:720px)"
                />
                <source
                  src="/hero_480p.mp4"
                  type="video/mp4"
                  media="(max-width:719px)"
                />
              </>
            )}
          </video>

          {/* Adaptive scrim */}
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
                <p>{HERO_CONTENT.titleParts[0]}</p>
                <p>{HERO_CONTENT.titleParts[1]}</p>
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
                className="border-2 hover:border-cyan-400/70 hover:text-cyan-100 bg-cyan-500/30 backdrop-blur-2xl text-white border-cyan-300/80 px-5 py-3 md:px-8 md:py-5 md:text-lg hover:glass font-semibold"
                onClick={handleWhatsApp}
                aria-label="Contact us via WhatsApp to book your stay"
              >
                {HERO_CONTENT.ctas[1]}
              </Button>
            </motion.div>
          </div>

          {/* Controls (safe-area aware) */}
          <div className="absolute left-[max(env(safe-area-inset-left),1rem)] bottom-[max(env(safe-area-inset-bottom),1rem)] flex items-center gap-2">
            <button
              className="z-20 rounded-full p-2 md:p-3 text-white transition-all duration-300 glass hover:glass-strong"
              onClick={() => (isVideoPlaying ? pauseVideo() : void playVideo())}
              disabled={isVideoLoading || !allowVideo}
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

            <Button
              size="sm"
              variant="secondary"
              className="hidden sm:inline-flex bg-white/20 text-white hover:bg-white/30 backdrop-blur-md"
              onClick={() => {
                const endEl = document.getElementById(nextSectionId);
                if (endEl)
                  endEl.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Skip
            </Button>
          </div>

          {/* Scroll hint */}
          <motion.button
            type="button"
            onClick={() => {
              const endEl = document.getElementById(nextSectionId);
              if (endEl)
                endEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="pointer-events-auto absolute bottom-[max(env(safe-area-inset-bottom),1rem)] left-1/2 -translate-x-1/2 text-white/90"
            animate={{ y: [0, 12, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            aria-label="Scroll to next section"
          >
            <div className="flex flex-col items-center px-3 py-1.5">
              <span className="text-xs sm:text-sm mb-1 font-medium">
                Scroll to explore
              </span>
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            </div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
