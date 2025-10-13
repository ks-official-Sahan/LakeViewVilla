"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendarIcon, PhoneIcon, WhatsAppIcon } from "./svg-icons";
import { trackContact } from "@/lib/analytics";
import { IconBrandWhatsapp } from "@tabler/icons-react";

export function ExpandableCTA() {
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState(true);
  const [dockOffset, setDockOffset] = useState(0);
  const reduceMotion = useReducedMotion();

  const rawNumber =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP) ||
    "+94717448391";
  const intlDisplay = rawNumber;
  const waNumber = useMemo(() => rawNumber.replace(/[^\d]/g, ""), [rawNumber]);

  const whatsapp = () => {
    const msg =
      "Hi! I'm interested in booking Lake View Villa Tangalle. Could you please provide availability and rates?";
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    trackContact("whatsapp", url, "Chat on WhatsApp");
    setTimeout(() => window.open(url, "_blank", "noopener"), 120);
  };

  const call = () => {
    trackContact("phone", `tel:${rawNumber}`, "Call now");
    setTimeout(() => window.open(`tel:${rawNumber}`, "_self"), 120);
  };

  const book = () =>
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });

  // Show small “Chat” pill briefly the first time.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setPill(false), 2400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Scroll-aware: shrink on fast scroll, ensure we don’t collide with footer
  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const dy = Math.abs(window.scrollY - lastY);
        lastY = window.scrollY;

        // Footer avoidance (if a <footer> exists)
        const footer = document.querySelector("footer") as HTMLElement | null;
        if (footer) {
          const fb = footer.getBoundingClientRect();
          const vh = window.innerHeight;
          // If footer is entering viewport bottom, lift the FAB up
          const overlap = Math.max(0, vh - fb.top + 16);
          setDockOffset(Math.min(overlap, 160));
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click / Esc
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const panelVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduceMotion ? 0.16 : 0.28, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.18 } },
  };

  return (
    <div
      ref={rootRef}
      className="fixed z-[80] right-[max(1rem,env(safe-area-inset-right))] pointer-events-none"
      style={{
        bottom: `calc(max(1rem, env(safe-area-inset-bottom)) + ${dockOffset}px)`,
      }}
      // className="fixed z-[80] right-[max(2.2rem,env(safe-area-inset-right))] pointer-events-none"
      // style={{
      //   bottom: `calc(max(5.3rem, env(safe-area-inset-bottom)) + ${dockOffset}px)`,
      // }}
      aria-live="polite"
    >
      {/* Glass panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Contact options"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={panelVariants}
            className="pointer-events-auto mb-3 w-[min(92vw,22rem)] rounded-2xl bg-slate-900/85 text-white backdrop-blur-xl ring-1 ring-white/10 shadow-2xl p-3"
          >
            <div className="flex items-center gap-2 px-1 pb-2">
              <img
                src="/logo.png"
                alt=""
                className="h-6 w-6 rounded-full ring-1 ring-white/15 object-cover"
              />
              <p className="text-sm text-white/80">We reply in minutes</p>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto rounded-md p-1 text-white/70 hover:text-white transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid gap-2">
              <button
                onClick={whatsapp}
                className="group w-full rounded-xl px-4 py-3 text-left bg-[linear-gradient(135deg,#25D366,#128C7E)] shadow-lg hover:shadow-xl transition ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
                    <IconBrandWhatsapp className="h-6 w-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold leading-5">Chat on WhatsApp</p>
                    <p className="text-xs text-white/90 leading-4">
                      Fastest response
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={call}
                className="w-full rounded-xl px-4 py-3 text-left bg-white/6 hover:bg-white/10 transition ring-1 ring-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/90">
                    <PhoneIcon className="h-5 w-5 text-white" />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium leading-5">Call now</p>
                    <p className="text-sm text-white/80">{intlDisplay}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={book}
                className="w-full rounded-xl px-4 py-3 text-left bg-white/6 hover:bg-white/10 transition ring-1 ring-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/90">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium leading-5">Book your stay</p>
                    <p className="text-xs text-white/75 leading-4">
                      Check dates & rates
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB cluster */}
      <div className="pointer-events-auto flex items-center justify-end gap-2">
        {/* Intro pill (auto hides) */}
        <AnimatePresence initial={false}>
          {!open && pill && (
            <motion.span
              key="pill"
              initial={{ opacity: 0, x: 8, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="px-3 py-1.5 rounded-full bg-white text-slate-900 text-sm shadow-lg"
            >
              Chat
            </motion.span>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          aria-label={open ? "Close chat options" : "Open chat options"}
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.96 }}
          className="relative grid place-items-center h-10 w-10 md:h-14 md:w-14 rounded-full shadow-2xl ring-1 ring-white/50
                     bg-green-500
                     hover:brightness-110 transition"
        >
          {/* white inner ring for contrast on noisy media */}
          <span className="absolute inset-[3px] rounded-full ring-1 ring-white/40 pointer-events-none" />
          {/* neon aura */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/25 blur-xl pointer-events-none" />
          <IconBrandWhatsapp className="relative w-7 h-7 md:h-8 md:w-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]" />
          {/* online dot */}
          {!open && (
            <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-white/95" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
