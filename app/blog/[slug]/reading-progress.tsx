"use client";

import { useEffect, useState } from "react";

/**
 * Thin reading progress bar that anchors to the top of the viewport.
 * Uses scroll position relative to total page height.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[var(--color-border)]"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-[var(--color-gold)] transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
