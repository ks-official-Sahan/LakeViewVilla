"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useInView,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Play } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { SITE_CONFIG } from "@/data/site";

type Experience = {
  name: string;
  image?: string; // hero image
  video?: string; // optional: mp4/webm (muted/inline)
  thumb?: string; // optional: preview image for side peeks (use for video slides)
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const sendMessage = (location: string) => {
  const msg = `Hi, I would like to book a day trip to ${location} with Lake View Villa.`;
  return buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, msg);
};

const EXPERIENCES: Experience[] = [
  {
    name: "Rekawa Turtle Beach",
    image: "/images/optimized/rekawa.webp",
    description:
      "Rekawa Turtle Beach is one of Sri Lanka’s most important turtle nesting sites.",
    // ctaHref: "https://maps.app.goo.gl/",
    // ctaLabel: "Open in Maps",
    ctaHref: sendMessage("Rekawa Turtle Beach"),
    ctaLabel: "Book Now",
  },
  {
    name: "Hiriketiya Beach",
    image: "/images/optimized/hiriketiya.webp",
    description: "Hiriketiya Beach is one of Sri Lanka’s most popular bays.",
    ctaHref: sendMessage("Hiriketiya Beach"),
    ctaLabel: "Book Now",
  },
  {
    name: "Kayaking in Tangalle Lagoon",
    image: "/images/optimized/kayaking.webp",
    description:
      "Guests can enjoy peaceful kayaking trips in the calm waters of Tangalle Lagoon. Surrounded by mangroves, birds, and serene nature.",
    ctaHref: sendMessage("Tangalle Lagoon Kayaking"),
    ctaLabel: "Book Now",
  },
  {
    name: "Kalamatiya Bird Sanctuary",
    image: "/images/optimized/kalamatiya.webp",
    description:
      "Kalamatiya Bird Sanctuary is a coastal wetland reserve famous for its rich biodiversity and migratory birds.",
    ctaHref: sendMessage("Kalamatiya Bird Sanctuary"),
    ctaLabel: "Book Now",
  },
  {
    name: "Mulkirigala Rock Temple",
    image: "/images/optimized/mulkirigala.webp",
    description:
      "Mulkirigala Rock Temple, also known as Raja Maha Vihara, is an ancient Buddhist monastery built on a massive rock formation.",
    ctaHref: sendMessage("Mulkirigala Rock Temple"),
    ctaLabel: "Book Now",
  },
  {
    name: "Yala National Park Safari",
    // video: "/videos/yala-safari.mp4",
    // thumb: "/images/yala-safari.webp",
    image: "/images/optimized/yala.webp",
    description: "Leopards, elephants, and raw Sri Lankan wilderness.",
    ctaHref: sendMessage("Yala National Park"),
    ctaLabel: "Book Now",
  },
  {
    name: "Hummanaya Blowhole",
    image: "/images/optimized/blowhole.webp",
    description:
      "Hummanaya Blow Hole is the largest natural blowhole in Sri Lanka, located along the southern coastline.",
    ctaHref: sendMessage("Hummanaya Blowhole"),
    ctaLabel: "Book Now",
  },
  {
    name: "Sigiriya Rock Fortress",
    image: "/images/optimized/sigiriya.webp",
    description:
      "Sigiriya Rock Fortress is a UNESCO World Heritage Site and one of Sri Lanka's most iconic landmarks.",
    ctaHref: sendMessage("Sigiriya Rock Fortress"),
    ctaLabel: "Book Now",
  },
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function ExperiencesReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35, margin: "-10% 0px" });

  const reduceMotion = useReducedMotion();
  const saveData = useMemo(
    () => Boolean((navigator as any)?.connection?.saveData),
    []
  );
  const allowMotion = !reduceMotion && !saveData;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  const prevIdx = mod(index - 1, EXPERIENCES.length);
  const nextIdx = mod(index + 1, EXPERIENCES.length);

  // Auto-advance (respect visibility, motion, interactions)
  useEffect(() => {
    if (!inView || paused || dragging || !allowMotion) return;
    const id = window.setInterval(
      () => setIndex((i) => mod(i + 1, EXPERIENCES.length)),
      5200
    );
    return () => clearInterval(id);
  }, [inView, paused, dragging, allowMotion]);

  // Drag physics
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.8 });
  const reveal = useTransform(springX, [-160, 0, 160], [0.9, 0, 0.9]); // how much to “tease” peeks on drag
  const rawBlur = useTransform(springX, [-200, 0, 200], [1.25, 1.75, 1.25]); // low blur while dragging, higher when idle
  const blurAmt = useTransform(rawBlur, (v) => `blur(${v}px)`);

  const onDragEnd = () => {
    setDragging(false);
    const dx = x.get();
    const threshold = 80;
    if (dx > threshold) setIndex((i) => mod(i - 1, EXPERIENCES.length));
    else if (dx < -threshold) setIndex((i) => mod(i + 1, EXPERIENCES.length));
    x.set(0);
  };

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => mod(i + dir, EXPERIENCES.length)),
    []
  );

  // Active video discipline
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  useEffect(() => {
    // pause all non-active
    Object.entries(videoRefs.current).forEach(([k, el]) => {
      if (Number(k) !== index && el && !el.paused) {
        try {
          el.pause();
        } catch {}
      }
    });
    const v = videoRefs.current[index];
    if (!v || !allowMotion || !inView) return;
    (async () => {
      try {
        v.muted = true;
        v.playsInline = true;
        await v.play();
      } catch {}
    })();
  }, [index, inView, allowMotion]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  const ActiveMedia = ({ exp, i }: { exp: Experience; i: number }) => (
    <div className="absolute inset-0">
      {exp.video ? (
        <video
          ref={(el) => (videoRefs.current[i] = el)}
          className="w-full h-full object-cover"
          preload={allowMotion ? "metadata" : "none"}
          muted
          loop
          playsInline
        >
          <source src={exp.video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={exp.image || "/placeholder.webp"}
          alt=""
          role="presentation"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
        />
      )}
    </div>
  );

  const PeekMedia = ({ exp }: { exp: Experience }) => (
    <div className="absolute inset-0">
      <Image
        src={exp.thumb || exp.image || "/placeholder.webp"}
        alt=""
        role="presentation"
        fill
        loading="lazy"
        sizes="(max-width: 1024px) 40vw, 420px"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."
      />
    </div>
  );

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="relative py-28 md:py-32"
      aria-labelledby="experiences-heading"
    >
      {/* Ambient field (cheap, GPU-friendly) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(14,165,233,0.10), transparent 60%)",
          maskImage:
            "linear-gradient(to bottom, black 10%, rgba(0,0,0,0.85) 45%, transparent 100%)",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="text-center mb-14 md:mb-16">
          <motion.h2
            id="experiences-heading"
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 text-balance"
            initial={{ y: allowMotion ? 20 : 0, opacity: allowMotion ? 0 : 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Discover Tangalle’s wonders
          </motion.h2>
          <motion.p
            className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
            initial={{ y: allowMotion ? 12 : 0, opacity: allowMotion ? 0 : 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          >
            Ancient temples, ocean dramas, wildlife corridors — all within easy
            reach.
          </motion.p>
        </div>

        {/* Reel frame */}
        <div
          ref={frameRef}
          className="relative mx-auto max-w-6xl select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Experiences carousel"
        >
          {/* Side peeks */}
          <motion.button
            type="button"
            onClick={() => go(-1)}
            className="group absolute left-0 top-0 bottom-0 w-[28%] md:w-[24%] overflow-hidden rounded-l-3xl"
            style={{ transform: "translateZ(0)" }}
            aria-label={`View previous: ${EXPERIENCES[prevIdx].name}`}
          >
            <div className="relative h-full">
              <div
                className="absolute inset-0 scale-[1.02]"
                style={{ filter: "saturate(0.9)" }}
              >
                <PeekMedia exp={EXPERIENCES[prevIdx]} />
              </div>
              {/* fade/blur into viewport */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backdropFilter: blurAmt,
                  WebkitBackdropFilter: blurAmt,
                  background:
                    "linear-gradient(90deg, rgba(2,6,23,0.55), rgba(2,6,23,0.35) 35%, transparent 95%)",
                  maskImage:
                    "linear-gradient(to right, black 40%, transparent 95%)",
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-white/80">
              <ChevronLeft className="opacity-70 group-hover:opacity-100 transition" />
            </div>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => go(1)}
            className="group absolute right-0 top-0 bottom-0 w-[28%] md:w-[24%] overflow-hidden rounded-r-3xl"
            style={{ transform: "translateZ(0)" }}
            aria-label={`View next: ${EXPERIENCES[nextIdx].name}`}
          >
            <div className="relative h-full">
              <div
                className="absolute inset-0 scale-[1.02]"
                style={{ filter: "saturate(0.9)" }}
              >
                <PeekMedia exp={EXPERIENCES[nextIdx]} />
              </div>
              <motion.div
                className="absolute inset-0"
                style={{
                  backdropFilter: blurAmt,
                  WebkitBackdropFilter: blurAmt,
                  background:
                    "linear-gradient(270deg, rgba(2,6,23,0.55), rgba(2,6,23,0.35) 35%, transparent 95%)",
                  maskImage:
                    "linear-gradient(to left, black 40%, transparent 95%)",
                }}
              />
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-2 grid place-items-center text-white/80">
              <ChevronRight className="opacity-70 group-hover:opacity-100 transition" />
            </div>
          </motion.button>

          {/* Active canvas (drag/swipe) */}
          <motion.div
            className="relative h-[28rem] md:h-[34rem] mx-[10%] md:mx-[12%] rounded-3xl overflow-hidden ring-1 ring-slate-900/10 bg-slate-900"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            style={{ x: springX, willChange: "transform" }}
            onDragStart={() => {
              setDragging(true);
              setPaused(true);
            }}
            onDragEnd={onDragEnd}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
                aria-roledescription="slide"
                aria-label={EXPERIENCES[index].name}
              >
                <ActiveMedia exp={EXPERIENCES[index]} i={index} />

                {/* Text content (no heavy veils; crisp over media) */}
                <div className="absolute inset-0 grid place-items-center p-6 text-white">
                  <div className="text-center max-w-3xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
                    <motion.h3
                      className="text-3xl md:text-4xl font-bold text-balance text-shadow-deep"
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.05,
                      }}
                    >
                      {EXPERIENCES[index].name}
                    </motion.h3>
                    <motion.p
                      className="mt-3 text-lg md:text-xl text-white/95 text-pretty text-shadow-deep"
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.55,
                        ease: "easeOut",
                        delay: 0.12,
                      }}
                    >
                      {EXPERIENCES[index].description}
                    </motion.p>

                    {EXPERIENCES[index].ctaHref && (
                      <motion.a
                        href={EXPERIENCES[index].ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 rounded-full bg-white/15 hover:bg-white/25 glass-strong shadow-2xl px-4 py-2 text-sm font-medium ring-1 ring-white/25 transition text-shadow-deep box-shadow-deep"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.45,
                          ease: "easeOut",
                          delay: 0.18,
                        }}
                      >
                        <MapPin className="w-4 h-4" />
                        {EXPERIENCES[index].ctaLabel || "Open Map"}
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Optional: video toggle for active slide if it has video */}
            {EXPERIENCES[index].video && (
              <button
                type="button"
                onClick={() => {
                  const v = videoRefs.current[index];
                  if (!v) return;
                  if (v.paused) v.play().catch(() => {});
                  else v.pause();
                }}
                className="absolute bottom-4 right-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur ring-1 ring-white/25 p-3"
                aria-label="Toggle current slide video"
              >
                <Play className="w-5 h-5" />
              </button>
            )}
          </motion.div>

          {/* Dots */}
          <div className="mt-7 flex items-center justify-center gap-2">
            {EXPERIENCES.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "true" : "false"}
                  className={`h-2 rounded-full transition-all ${
                    active
                      ? "w-8 bg-sky-600"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
