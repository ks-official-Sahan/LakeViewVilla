"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50"
        >
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white font-display">
                    LV
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-500"
                />
              </div>
            </motion.div>

            {/* Villa Name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold text-gray-800 mb-2 font-display"
            >
              Lake View Villa
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600 mb-8"
            >
              Tangalle, Sri Lanka
            </motion.p>

            {/* Progress Bar */}
            <div className="w-64 mx-auto">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-500"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 mt-2"
              >
                {Math.round(progress)}%
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// type LoadingScreenProps = {
//   firstVisitOnly?: boolean;
//   minDurationMs?: number;
//   maxDurationMs?: number;
//   title?: string;
//   subtitle?: string;
//   /** Enable tap-to-skip anywhere */
//   enableTapSkip?: boolean;
//   /** Hold duration to trigger long-press skip (ms); set 0 to disable */
//   longPressMs?: number;
//   /** Swipe distance in px to trigger swipe-up skip; set 0 to disable */
//   swipeUpThreshold?: number;
// };

// export function LoadingScreen({
//   firstVisitOnly = true,
//   minDurationMs = 650,
//   maxDurationMs = 8000,
//   title = "Lake View Villa",
//   subtitle = "Tangalle, Sri Lanka",
//   enableTapSkip = true,
//   longPressMs = 600,
//   swipeUpThreshold = 56,
// }: LoadingScreenProps) {
//   const reduceMotion = useReducedMotion();
//   const [mounted, setMounted] = useState(false);
//   const [active, setActive] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const startTs = useRef<number | null>(null);
//   const readyRef = useRef(false);
//   const rafRef = useRef<number | null>(null);
//   const doneRef = useRef(false);

//   // gesture refs
//   const longPressTimer = useRef<number | null>(null);
//   const pointerStartY = useRef<number | null>(null);
//   const pointerMoved = useRef(false);

//   const triggerSkip = () => {
//     readyRef.current = true;
//   };

//   useEffect(() => {
//     setMounted(true);
//     if (typeof window !== "undefined" && firstVisitOnly) {
//       const seen = sessionStorage.getItem("lvv:splashSeen");
//       if (seen === "1") setActive(false);
//     }
//   }, [firstVisitOnly]);

//   // Lock scroll while active
//   useEffect(() => {
//     if (!mounted) return;
//     const root = document.documentElement;
//     const prev = root.style.overflow;
//     if (active) root.style.overflow = "hidden";
//     return () => {
//       root.style.overflow = prev;
//     };
//   }, [active, mounted]);

//   // Readiness: fonts + window load (with 2s safety)
//   useEffect(() => {
//     if (!active) return;
//     const fontReady =
//       typeof document !== "undefined" && "fonts" in document
//         ? (document as any).fonts.ready.catch(() => {})
//         : Promise.resolve();
//     const windowLoaded = new Promise((res) => {
//       if (typeof document === "undefined") return res(undefined);
//       if (document.readyState === "complete") return res(undefined);
//       const onLoad = () => {
//         window.removeEventListener("load", onLoad);
//         res(undefined);
//       };
//       window.addEventListener("load", onLoad);
//     });
//     const safety = new Promise((res) => setTimeout(res, 2000));

//     Promise.race([Promise.all([fontReady, windowLoaded]), safety]).then(() => {
//       readyRef.current = true;
//     });
//   }, [active]);

//   // Deterministic progress
//   useEffect(() => {
//     if (!active) return;
//     const now = () => performance.now();
//     const clamp = (v: number, lo = 0, hi = 100) =>
//       Math.min(hi, Math.max(lo, v));
//     const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

//     const tick = (t: number) => {
//       if (startTs.current == null) startTs.current = t;
//       const elapsed = t - startTs.current;

//       const baseTarget = readyRef.current ? 100 : 96;
//       const ease = readyRef.current ? 0.22 : 0.08;
//       const timeFloor = Math.min(100, (elapsed / 1200) * 70);
//       const rawTarget = Math.max(timeFloor, baseTarget);
//       const next = lerp(progress, rawTarget, ease);

//       const minMet = elapsed >= minDurationMs;
//       const hardCap = elapsed >= maxDurationMs;
//       const accelerated =
//         readyRef.current && minMet ? Math.max(next, progress + 1.8) : next;

//       const clamped = clamp(accelerated, 0, 100);
//       setProgress(clamped);

//       const isComplete = clamped >= 99.8 || hardCap;
//       if (isComplete && !doneRef.current) {
//         doneRef.current = true;
//         setProgress(100);
//         try {
//           if (firstVisitOnly) sessionStorage.setItem("lvv:splashSeen", "1");
//         } catch {}
//         setTimeout(() => setActive(false), reduceMotion ? 100 : 350);
//         return;
//       }
//       rafRef.current = requestAnimationFrame(tick);
//     };

//     rafRef.current = requestAnimationFrame(tick);
//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [active, minDurationMs, maxDurationMs, reduceMotion]);

//   // Desktop Esc (kept), plus mobile-friendly gestures/buttons below
//   useEffect(() => {
//     if (!active) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") triggerSkip();
//     };
//     window.addEventListener("keydown", onKey, { passive: true });
//     return () => window.removeEventListener("keydown", onKey);
//   }, [active]);

//   // Pointer/Touch handlers
//   const onPointerDown = (e: React.PointerEvent) => {
//     pointerMoved.current = false;
//     pointerStartY.current = e.clientY;
//     if (longPressMs > 0) {
//       if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
//       longPressTimer.current = window.setTimeout(() => {
//         triggerSkip();
//       }, longPressMs);
//     }
//   };
//   const onPointerMove = (e: React.PointerEvent) => {
//     if (pointerStartY.current == null) return;
//     const dy = e.clientY - pointerStartY.current;
//     if (Math.abs(dy) > 8) pointerMoved.current = true;
//     // swipe up
//     if (swipeUpThreshold > 0 && -dy >= swipeUpThreshold) {
//       triggerSkip();
//       cancelLongPress();
//     }
//   };
//   const onPointerUp = () => {
//     // tap-to-skip only if enabled and we didn’t move (avoid accidental while scrolling)
//     if (enableTapSkip && !pointerMoved.current) triggerSkip();
//     cancelLongPress();
//     pointerStartY.current = null;
//   };
//   const onPointerCancel = () => {
//     cancelLongPress();
//     pointerStartY.current = null;
//   };
//   const cancelLongPress = () => {
//     if (longPressTimer.current) {
//       window.clearTimeout(longPressTimer.current);
//       longPressTimer.current = null;
//     }
//   };

//   if (!mounted || !active) return null;

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key="lvv-splash"
//         initial={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: "easeOut" }}
//         className="fixed inset-0 z-[9999] bg-gradient-to-br from-sky-50 via-white to-cyan-50"
//         aria-busy="true"
//         aria-live="polite"
//         // Mobile-friendly interactions:
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={onPointerUp}
//         onPointerLeave={onPointerCancel}
//         onPointerCancel={onPointerCancel}
//       >
//         {/* decorative layers (non-blocking) */}
//         <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_40%_at_50%_0%,rgba(12,122,255,0.08),transparent_60%)]" />
//         <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20 [background-image:repeating-linear-gradient(45deg,rgba(0,0,0,0.03)_0_6px,transparent_6px_12px)]" />

//         <div className="relative flex h-full items-center justify-center px-6">
//           <div className="text-center select-none">
//             {/* Logo */}
//             <motion.div
//               initial={
//                 reduceMotion
//                   ? { opacity: 1, scale: 1 }
//                   : { opacity: 0, scale: 0.9 }
//               }
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className="mb-8"
//             >
//               <div className="relative mx-auto h-24 w-24">
//                 <motion.div
//                   className="absolute inset-0 rounded-full"
//                   style={{
//                     background:
//                       "conic-gradient(from 0deg, rgba(14,165,233,0.6), rgba(34,211,238,0.6), rgba(14,165,233,0.6))",
//                     filter: "blur(0.2px)",
//                   }}
//                   animate={reduceMotion ? undefined : { rotate: 360 }}
//                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                   aria-hidden
//                 />
//                 <div className="absolute inset-[6px] rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md flex items-center justify-center">
//                   <span className="font-display text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-600">
//                     LV
//                   </span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Titles */}
//             <motion.h1
//               initial={
//                 reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
//               }
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
//               className="font-display mb-1 text-2xl font-semibold text-gray-800"
//             >
//               {title}
//             </motion.h1>
//             <motion.p
//               initial={
//                 reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
//               }
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
//               className="text-gray-600 mb-8"
//             >
//               {subtitle}
//             </motion.p>

//             {/* Progress */}
//             <div className="mx-auto w-72 max-w-[85vw]">
//               <div
//                 role="progressbar"
//                 aria-label="Page loading"
//                 aria-valuemin={0}
//                 aria-valuemax={100}
//                 aria-valuenow={Math.round(progress)}
//                 className="relative h-2 overflow-hidden rounded-full bg-gray-200"
//               >
//                 <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 to-transparent" />
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progress}%` }}
//                   transition={{ duration: 0.15, ease: "linear" }}
//                   className="relative h-full"
//                   style={{
//                     background:
//                       "linear-gradient(90deg, rgb(14,165,233), rgb(0,212,255))",
//                   }}
//                 >
//                   {!reduceMotion && (
//                     <motion.div
//                       className="absolute inset-y-0 w-24 -translate-x-24 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)]"
//                       animate={{ x: "200%" }}
//                       transition={{
//                         duration: 1.2,
//                         repeat: Infinity,
//                         ease: "linear",
//                       }}
//                     />
//                   )}
//                 </motion.div>
//               </div>
//               <motion.p
//                 initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.3, delay: 0.2 }}
//                 className="mt-2 text-sm tabular-nums text-gray-500"
//               >
//                 {Math.round(progress)}%<span className="sr-only"> loaded</span>
//               </motion.p>
//             </div>
//           </div>

//           {/* Visible Skip Button (mobile friendly, safe-area aware) */}
//           <button
//             type="button"
//             onClick={triggerSkip}
//             className="fixed bottom-[max(env(safe-area-inset-bottom),1rem)] right-[max(env(safe-area-inset-right),1rem)] rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-800 shadow-md border border-black/5 active:scale-[0.98]"
//             aria-label="Skip loading"
//           >
//             Skip
//           </button>
//         </div>

//         {/* Mobile hint */}
//         <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(max(env(safe-area-inset-bottom),1rem)+3rem)] text-center text-[11px] text-gray-500">
//           <span className="inline-block rounded-full bg-white/70 px-2 py-1 shadow-sm">
//             Tap / Swipe up / Hold to skip
//           </span>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }
