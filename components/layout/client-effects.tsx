"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const SmoothScroll = dynamic(
  () =>
    import("@/components/motion/smooth-scroll").then((m) => ({
      default: m.SmoothScroll,
    })),
  { ssr: false }
);

const CursorFollower = dynamic(
  () =>
    import("@/components/motion/cursor-follower").then((m) => ({
      default: m.CursorFollower,
    })),
  { ssr: false }
);

const RippleBackground = dynamic(
  () => import("@/components/webgl/ripple-background"),
  { ssr: false, loading: () => null }
);

export function ClientEffects() {
  const [enableWebGL, setEnableWebGL] = useState(false);

  useEffect(() => {
    const shouldEnableWebGL =
      process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "1" ||
      process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG === "true";

    setEnableWebGL(shouldEnableWebGL);
  }, []);

  return (
    <>
      {enableWebGL ? <RippleBackground /> : null}
      <SmoothScroll />
      <CursorFollower />
    </>
  );
}
