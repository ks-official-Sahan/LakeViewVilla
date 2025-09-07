"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { HERO_CONTENT, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";

const blurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

type Particle = {
  id: number;
  x: number; // 0..100 vw%
  y: number; // 0..100 vh%
  size: number; // px
  duration: number; // s
  delay: number; // s
  opacity: number; // 0..1
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [inView, setInView] = useState(false);

  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const saveData = useMemo(
    () =>
      typeof navigator !== "undefined" && "connection" in navigator
        ? // @ts-ignore
          Boolean(navigator.connection?.saveData)
        : false,
    []
  );

  const allowMotion = !prefersReducedMotion && !saveData;
  const allowAutoplay = allowMotion;

  // Scroll transforms
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, allowMotion ? -300 : 0]);
  const opacity = useTransform(scrollY, [0, 400], [1, allowMotion ? 0 : 1]);

  // Mouse tilt/translate (cheap + bounded)
  const tiltX = useTransform(scrollY, () =>
    allowMotion && !isCoarsePointer ? mouse.y * -6 : 0
  );
  const tiltY = useTransform(scrollY, () =>
    allowMotion && !isCoarsePointer ? mouse.x * 10 : 0
  );

  // Particles (static seed, no reflows)
  const particles = useMemo<Particle[]>(() => {
    const n = allowMotion ? 28 : 0;
    return Array.from({ length: n }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 5,
      duration: 18 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.08 + Math.random() * 0.12,
    }));
  }, [allowMotion]);

  /** Env detection */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsCoarsePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsCoarsePointer(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** Parallax (rAF-throttled) */
  useEffect(() => {
    if (isCoarsePointer || !allowMotion) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = containerRef.current!.getBoundingClientRect();
        setMouse({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width, // -0.5..0.5
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handler);
    return () => {
      el?.removeEventListener("mousemove", handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isCoarsePointer, allowMotion]);

  /** Intro copy GSAP */
  useEffect(() => {
    if (!allowMotion) return;
    const tl = gsap.timeline({ delay: 0.25 });
    tl.fromTo(
      ".hero-title",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
      .fromTo(
        ".hero-tagline",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ".hero-ctas",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
  }, [allowMotion]);

  /** Intersection + tab visibility */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) pauseVideo();
      else if (allowAutoplay && inView) void playVideo();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [allowAutoplay, inView]);

  /** Playback helpers */
  const playVideo = async () => {
    const video = videoRef.current;
    if (!video || isVideoLoading) return;
    setIsVideoLoading(true);
    try {
      video.muted = true;
      video.playsInline = true;
      if (playPromiseRef.current) await playPromiseRef.current;
      playPromiseRef.current = video.play();
      await playPromiseRef.current;
      setIsVideoPlaying(true);
    } catch (err) {
      console.warn("[hero] play() blocked:", (err as any)?.name || err);
      setIsVideoPlaying(false);
    } finally {
      setIsVideoLoading(false);
      playPromiseRef.current = null;
    }
  };

  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.pause();
    } catch {}
    setIsVideoPlaying(false);
    playPromiseRef.current = null;
  };

  useEffect(() => {
    if (!allowAutoplay || !inView || document.hidden) return;
    const t = setTimeout(() => void playVideo(), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowAutoplay, inView]);

  /** CTAs */
  const handleGallery = () => {
    const el = document.getElementById("gallery");
    if (!el) return;
    if (location.hash !== "#gallery") location.hash = "gallery";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWhatsApp = () => {
    const msg =
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please share availability and rates?";
    const url = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[100svh] overflow-hidden"
      aria-label="Lake View Villa hero section"
    >
      {/* Layer 1: Background image (parallax + Ken Burns) */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y }}
        animate={
          allowMotion
            ? { scale: [1.08, 1.14, 1.08], x: [0, -16, 0], y: [0, -8, 0] }
            : { scale: 1.08, x: 0, y: 0 }
        }
        transition={
          allowMotion
            ? { duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
            : undefined
        }
        aria-hidden="true"
      >
        <Image
          src="/serene-lagoon-at-sunrise-with-villa-silhouette.jpg" // canonical name
          alt=""
          role="presentation"
          fill
          className={`object-cover ${allowMotion ? "ken-burns" : ""}`}
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          quality={85}
          draggable={false}
        />
      </motion.div>

      {/* Layer 2: Ambient video */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: allowMotion ? 0.65 : 0.45 }}
        transition={{ duration: 1.1, delay: 0.5 }}
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload={allowAutoplay ? "metadata" : "none"}
          poster="/aerial-view-of-tropical-lagoon-with-villa.jpg"
          muted
          loop
          playsInline
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          onLoadedMetadata={() => {
            if (allowAutoplay && inView && !document.hidden) void playVideo();
          }}
          onError={(e) => console.warn("[hero] video error:", e)}
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Layer 3: Aurora gradient (GPU-cheap) */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: allowMotion ? 0.5 : 0.35 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(900px 500px at 80% 65%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(600px 400px at 50% 50%, rgba(34,197,94,0.12), transparent 60%)",
          filter: "saturate(120%)",
        }}
        aria-hidden="true"
      />

      {/* Layer 4: Particles (subtle drift) */}
      {particles.length > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                top: `${p.y}%`,
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 60%, transparent 70%)",
                boxShadow: "0 0 12px rgba(255,255,255,0.25)",
                opacity: p.opacity,
              }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [0, 20, -10, 0],
                y: [0, -15, 10, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Layer 5: Reactive vignette / spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(2px)",
          background: allowMotion
            ? `
              radial-gradient(circle at ${50 + mouse.x * 25}% ${
                50 + mouse.y * 25
              }%,
                rgba(14,165,233,0.14) 0%,
                rgba(6,182,212,0.10) 22%,
                rgba(0,0,0,0.22) 42%,
                rgba(0,0,0,0.50) 70%,
                rgba(0,0,0,0.75) 100%)`
            : "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.6))",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center text-center text-white px-4"
        style={{
          opacity,
          rotateX: tiltX as any,
          rotateY: tiltY as any,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="max-w-4xl">
          {/* Headline with subtle glint sweep */}
          <motion.h1
            className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance font-display focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
            initial={{ y: allowMotion ? 90 : 0, opacity: allowMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            tabIndex={0}
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
            <motion.span
              animate={
                allowMotion
                  ? { backgroundPosition: ["0% 50%", "100% 50%"] }
                  : undefined
              }
              transition={
                allowMotion
                  ? {
                      duration: 12,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
                  : undefined
              }
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 18%, rgba(255,255,255,0) 36%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {HERO_CONTENT.title}
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero-tagline text-xl md:text-2xl lg:text-3xl mb-8 text-pretty max-w-3xl mx-auto font-medium"
            initial={{ y: allowMotion ? 50 : 0, opacity: allowMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
              backdropFilter: "blur(1px)",
            }}
          >
            {HERO_CONTENT.tagline}
          </motion.p>

          {/* CTAs with magnetic micro-interactions + shine */}
          <motion.div
            className="hero-ctas flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ y: allowMotion ? 24 : 0, opacity: allowMotion ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          >
            <MagneticButton
              onClick={handleGallery}
              ariaLabel="View photo gallery of Lake View Villa"
            >
              View Gallery
            </MagneticButton>

            <MagneticButton
              variant="outline"
              onClick={handleWhatsApp}
              ariaLabel="Contact us via WhatsApp to book your stay"
              outlineTone="cyan"
            >
              {HERO_CONTENT.ctas[1]}
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Play/Pause control */}
      <AnimatePresence>
        <motion.button
          className="absolute bottom-8 right-8 z-20 glass hover:glass-strong rounded-full p-4 text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          onClick={() => (isVideoPlaying ? pauseVideo() : playVideo())}
          disabled={isVideoLoading}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: isVideoLoading ? 1 : 1.08 }}
          whileTap={{ scale: isVideoLoading ? 1 : 0.96 }}
          aria-label={
            isVideoPlaying ? "Pause background video" : "Play background video"
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
        </motion.button>
      </AnimatePresence>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90"
        animate={allowMotion ? { y: [0, 12, 0] } : undefined}
        transition={
          allowMotion
            ? { duration: 2.5, repeat: Number.POSITIVE_INFINITY }
            : undefined
        }
        aria-hidden="true"
      >
        <div className="flex flex-col items-center px-4 py-3">
          <span className="text-sm mb-2 font-medium">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/90 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
        </div>
      </motion.div>
    </section>
  );
}

/** MagneticButton: subtle cursor attraction, glossy shine on hover (GPU-cheap) */
function MagneticButton({
  children,
  onClick,
  ariaLabel,
  variant,
  outlineTone = "cyan",
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  variant?: "outline";
  outlineTone?: "cyan" | "emerald";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setDx(x * 6);
      setDy(y * 6);
    };
    const onLeave = () => {
      setDx(0);
      setDy(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const base =
    "relative px-10 py-5 text-lg font-semibold transition-all duration-300 backdrop-blur-md";
  const solid =
    "glass-strong text-white border-white/40 hover:border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)]";
  const outline =
    outlineTone === "cyan"
      ? "border-2 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/25 hover:text-white hover:border-cyan-300/80 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] bg-transparent"
      : "border-2 border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/25 hover:text-white hover:border-emerald-300/80 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] bg-transparent";

  return (
    <Button
      ref={ref}
      size="lg"
      variant={variant}
      className={`${base} ${variant === "outline" ? outline : solid}`}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        transform: `translate3d(${dx}px, ${dy}px, 0)`,
      }}
    >
      {/* glossy sweep */}
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.20), rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.02))",
          backgroundSize: "200% 100%",
          maskImage:
            "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
          animation: "btnShine 2.2s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes btnShine {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
      `}</style>
    </Button>
  );
}
