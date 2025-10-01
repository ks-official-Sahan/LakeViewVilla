"use client";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

export function ClientEffects() {
  const [mods, setMods] = useState<{
    SmoothScroll?: ComponentType;
    CursorFollower?: ComponentType;
    RippleBackground?: ComponentType;
  }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const enableWebGL =
      process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "1" ||
      process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "true";

    const load = async () => {
      const [{ SmoothScroll }, { CursorFollower }] = await Promise.all([
        import("@/components/motion/smooth-scroll"),
        import("@/components/motion/cursor-follower"),
      ]);
      const webgl =
        enableWebGL && !prefersReducedMotion
          ? (await import("@/components/webgl/ripple-background")).default
          : undefined;
      setMods({ SmoothScroll, CursorFollower, RippleBackground: webgl });
    };

    // Idle or first interaction — whichever comes first
    const onFirstInteraction = () => {
      removeListeners();
      load();
    };
    const removeListeners = () => {
      ["pointerdown", "wheel", "keydown", "touchstart"].forEach((t) =>
        window.removeEventListener(t, onFirstInteraction, {
          passive: true,
        } as any)
      );
    };

    if (!prefersReducedMotion) {
      const rIC =
        (window as any).requestIdleCallback ||
        ((cb: any) => setTimeout(cb, 300));
      const id = rIC(load);
      ["pointerdown", "wheel", "keydown", "touchstart"].forEach((t) =>
        window.addEventListener(t, onFirstInteraction, { passive: true } as any)
      );
      return () => {
        removeListeners();
        (window as any).cancelIdleCallback?.(id);
      };
    }
  }, []);

  const { SmoothScroll, CursorFollower, RippleBackground } = mods;
  return (
    <>
      {RippleBackground ? <RippleBackground /> : null}
      {SmoothScroll ? <SmoothScroll /> : null}
      {/* cursor follower only on non-coarse pointers – handled inside the component */}
      {CursorFollower ? <CursorFollower /> : null}
    </>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";

// const SmoothScroll = dynamic(
//   () =>
//     import("@/components/motion/smooth-scroll").then((m) => ({
//       default: m.SmoothScroll,
//     })),
//   { ssr: false }
// );

// const CursorFollower = dynamic(
//   () =>
//     import("@/components/motion/cursor-follower").then((m) => ({
//       default: m.CursorFollower,
//     })),
//   { ssr: false }
// );

// const RippleBackground = dynamic(
//   () => import("@/components/webgl/ripple-background"),
//   { ssr: false, loading: () => null }
// );

// export function ClientEffects() {
//   const [enableWebGL, setEnableWebGL] = useState(false);

//   useEffect(() => {
//     const shouldEnableWebGL =
//       process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "1" ||
//       process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "true";

//     setEnableWebGL(shouldEnableWebGL);
//   }, []);

//   return (
//     <>
//       {enableWebGL ? <RippleBackground /> : null}
//       <SmoothScroll />
//       <CursorFollower />
//     </>
//   );
// }
