"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  PointerEvent,
  TouchEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import * as NextImage from "next/image";

type Props = {
  logoSrc?: string;
  logoAlt?: string;
  initials?: string;
  title?: string;
  subtitle?: string;
  criticalAssets?: string[];
  minDurationMs?: number;
  hardTimeoutMs?: number;
  enableTapSkip?: boolean;
  longPressMs?: number;
  swipeUpThreshold?: number;
  onDone?: () => void;
};

export function LoadingScreen({
  logoSrc = "/logo.png",
  logoAlt = "Lake View Villa",
  initials = "LV",
  title = "Lake View Villa",
  subtitle = "Tangalle, Sri Lanka",
  criticalAssets = ["/hero.webm"],
  minDurationMs = 1000,
  hardTimeoutMs = 5000,
  enableTapSkip = false,
  longPressMs = 0,
  swipeUpThreshold = 0,
  onDone,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const saveData = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    // @ts-ignore vendor-specific
    return Boolean(navigator.connection?.saveData);
  }, []);
  const allowMotion = !prefersReducedMotion && !saveData;

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const longPressToRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Lock page scroll under veil (client-only)
  useEffect(() => {
    if (!visible || typeof document === "undefined") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [visible]);

  // Build progress signals safely for SSR
  const realSignals = useMemo<Promise<unknown>[]>(() => {
    if (typeof window === "undefined") {
      // On server, return a resolved placeholder to avoid touching DOM APIs
      return [Promise.resolve()];
    }
    const signals: Promise<unknown>[] = [];

    // 1) Fonts (optional)
    try {
      // @ts-ignore
      if (document?.fonts?.ready) {
        // @ts-ignore
        signals.push(document.fonts.ready.catch(() => {}));
      }
    } catch {
      /* ignore */
    }

    // 2) Window load
    signals.push(
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") return resolve();
        window.addEventListener("load", () => resolve(), {
          once: true,
          passive: true,
        });
      })
    );

    // 3) Critical assets (best-effort, client only)
    const assetPromises =
      typeof Image !== "undefined"
        ? criticalAssets.map(async (src) => {
            try {
              const img = new Image();
              img.decoding = "async";
              img.src = src;
              await (img.decode?.() ?? Promise.resolve());
            } catch {
              /* ignore */
            }
          })
        : [];
    signals.push(Promise.allSettled(assetPromises));

    return signals;
  }, [criticalAssets]);

  const approachTarget = useCallback((target: number) => {
    if (doneRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      setProgress((p) => {
        const delta = target - p;
        if (Math.abs(delta) < 0.25) return target;
        const step =
          Math.max(0.6, Math.min(4, Math.abs(delta) * 0.16)) * Math.sign(delta);
        return Number(Math.max(0, Math.min(100, p + step)).toFixed(2));
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const elapsed = startTsRef.current
      ? performance.now() - startTsRef.current
      : 0;
    const wait = Math.max(0, minDurationMs - elapsed);

    window.setTimeout(() => {
      setVisible(false);
      onDone?.();
      if (typeof document !== "undefined") {
        const main = document.querySelector("main") as HTMLElement | null;
        if (main) {
          if (!main.hasAttribute("tabindex"))
            main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }
      }
    }, wait);
  }, [minDurationMs, onDone]);

  // Lifecycle (client-only effects)
  useEffect(() => {
    if (!visible) return;

    startTsRef.current = performance.now();
    setCanSkip(false);

    const showSkipTo = window.setTimeout(() => setCanSkip(true), 2000);
    const hardTo = window.setTimeout(() => {
      setProgress(100);
      finish();
    }, hardTimeoutMs);

    approachTarget(90);

    Promise.allSettled(realSignals).then(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const ramp = () => {
        setProgress((p) => {
          const inc = allowMotion ? 3.5 : 10;
          const next = p + inc;
          if (next >= 100) {
            finish();
            return 100;
          }
          rafRef.current = requestAnimationFrame(ramp);
          return next;
        });
      };
      rafRef.current = requestAnimationFrame(ramp);
    });

    return () => {
      window.clearTimeout(hardTo);
      window.clearTimeout(showSkipTo);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Optional gestures
  const onPointerDown = (_e: PointerEvent) => {
    if (!canSkip || longPressMs <= 0) return;
    longPressToRef.current = window.setTimeout(() => finish(), longPressMs);
  };
  const onPointerUp = (_e: PointerEvent) => {
    if (longPressToRef.current) {
      window.clearTimeout(longPressToRef.current);
      longPressToRef.current = null;
    }
  };
  const onClick = () => {
    if (!enableTapSkip || !canSkip) return;
    finish();
  };
  const onTouchStart = (e: TouchEvent) => {
    if (!canSkip || swipeUpThreshold <= 0) return;
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!canSkip || swipeUpThreshold <= 0) return;
    if (touchStartYRef.current == null) return;
    const dy = touchStartYRef.current - e.touches[0]?.clientY || 0; // swipe up positive
    if (dy > swipeUpThreshold) {
      touchStartYRef.current = null;
      finish();
    }
  };

  const percent = Math.round(progress);

  // Futuristic disc tilt (parallax) — client-only pointer use
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  useEffect(() => {
    if (!allowMotion || typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (e.clientX - cx) / cx; // -1..1
      const ny = (e.clientY - cy) / cy; // -1..1
      mx.set(nx);
      my.set(ny);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [allowMotion, mx, my]);

  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), {
    stiffness: 120,
    damping: 12,
  });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), {
    stiffness: 120,
    damping: 12,
  });
  const glowX = useTransform(mx, [-1, 1], ["20%", "80%"]);
  const glowY = useTransform(my, [-1, 1], ["20%", "80%"]);

  const R = 56;
  const CIRC = 2 * Math.PI * R;
  const dash = (percent / 100) * CIRC;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-busy="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: allowMotion ? 0.45 : 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClick={onClick}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          {/* GLASS VEIL (blurs partially loaded app behind) */}
          <div className="absolute inset-0 bg-white/22 backdrop-blur-3xl backdrop-saturate-150" />
          <div className="absolute inset-0 [--_b:blur(55px)] [backdrop-filter:var(--_b)] [-webkit-backdrop-filter:var(--_b)] pointer-events-none" />

          {/* Ambient layers */}
          {allowMotion && (
            <>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.8 }}
                style={{
                  background:
                    "radial-gradient(1200px 600px at 20% 20%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(1000px 500px at 80% 70%, rgba(45,212,191,0.16), transparent 60%), linear-gradient(180deg, #ffffff, #f5fbff)",
                }}
              />
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-overlay"
                initial={{ backgroundPosition: "0px 0px" }}
                animate={{ backgroundPosition: ["0 0", "40px 20px", "0 0"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(2,6,23,0.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(2,6,23,0.035) 0 1px, transparent 1px 3px)",
                  backgroundSize: "14px 14px, 14px 14px",
                }}
              />
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(50% 30% at 50% 0%, rgba(255,255,255,0.65), transparent 60%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 0.8 }}
              />
            </>
          )}

          {/* Core cluster */}
          <div className="relative text-center px-6 select-none">
            <motion.div
              style={{
                rotateX: allowMotion ? (rx as any) : 0,
                rotateY: allowMotion ? (ry as any) : 0,
                willChange: "transform",
              }}
              initial={{ scale: allowMotion ? 0.95 : 1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: allowMotion ? 0.5 : 0.2,
                ease: "easeOut",
              }}
              className="mx-auto mb-8"
            >
              <div className="relative w-40 h-40 mx-auto">
                {allowMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(200px 200px at ${glowX} ${glowY}, rgba(255,255,255,0.35), transparent 60%)`,
                    }}
                  />
                )}
                {allowMotion && (
                  <motion.div
                    className="absolute -inset-1 rounded-full blur-[1px]"
                    style={{
                      background:
                        "conic-gradient(from 0deg, rgba(56,189,248,0.28), rgba(6,182,212,0.28), rgba(56,189,248,0.28))",
                      boxShadow: "0 0 36px rgba(14,165,233,0.42)",
                      willChange: "transform",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    aria-hidden
                  />
                )}
                <div className="absolute inset-0 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-white/50 flex items-center justify-center">
                  {logoSrc ? (
                    <NextImage.default
                      src={logoSrc}
                      alt={logoAlt}
                      priority
                      fill
                      className="w-20 h-20 object-contain drop-shadow-[0_8px_24px_rgba(6,182,212,0.35)]"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600 font-display tracking-wide">
                      {initials}
                    </span>
                  )}
                </div>
                <svg
                  className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
                  viewBox="0 0 140 140"
                  role="img"
                  aria-label="Page loading progress"
                >
                  <defs>
                    <linearGradient id="lvv-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgb(14,165,233)" />
                      <stop offset="100%" stopColor="rgb(6,182,212)" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke="rgba(2,6,23,0.08)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke="url(#lvv-grad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    strokeDasharray={`${dash} ${CIRC - dash}`}
                    animate={{ strokeDasharray: `${dash} ${CIRC - dash}` }}
                    transition={{
                      duration: allowMotion ? 0.15 : 0.1,
                      ease: "linear",
                    }}
                  />
                </svg>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: allowMotion ? 14 : 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: allowMotion ? 0.5 : 0.2, delay: 0.05 }}
              className="text-2xl font-bold text-slate-800 mb-1 font-display"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ y: allowMotion ? 12 : 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: allowMotion ? 0.45 : 0.2, delay: 0.1 }}
              className="text-slate-600 mb-6"
            >
              {subtitle}
            </motion.p>

            <div className="w-72 max-w-[85vw] mx-auto">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Loading"
                className="relative h-2 rounded-full bg-slate-200/90 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: allowMotion ? 0.25 : 0.12 }}
                  className="h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgb(14,165,233), rgb(6,182,212))",
                  }}
                />
                {allowMotion && (
                  <motion.div
                    className="absolute inset-y-0 w-24 -translate-x-24 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)]"
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 1.15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-2 text-sm tabular-nums text-slate-500"
              >
                {percent}% <span className="sr-only">loaded</span>
              </motion.p>
            </div>
          </div>

          {(enableTapSkip || longPressMs > 0 || swipeUpThreshold > 0) && (
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[max(env(safe-area-inset-bottom),1rem)] text-center text-[11px] text-slate-500">
              <span className="inline-block rounded-full bg-white/80 px-2 py-1 shadow-sm">
                {enableTapSkip ? "Tap" : ""}
                {enableTapSkip && (longPressMs > 0 || swipeUpThreshold > 0)
                  ? " / "
                  : ""}
                {longPressMs > 0 ? "Hold" : ""}
                {longPressMs > 0 && swipeUpThreshold > 0 ? " / " : ""}
                {swipeUpThreshold > 0 ? "Swipe up" : ""} to skip
              </span>
            </div>
          )}

          <AnimatePresence>
            {!visible && allowMotion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute inset-0 bg-white"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
