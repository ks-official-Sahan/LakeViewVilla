"use client";

import {
  cloneElement,
  isValidElement,
  Children,
  useCallback,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { HorizontalScrollSection, type HorizontalScrollSectionProps } from "./HorizontalScrollSection";

export type HorizontalScrollGalleryProps = Omit<HorizontalScrollSectionProps, "snap"> & {
  snap?: boolean;
  /** Native horizontal scroll step on Arrow keys (mobile / overflow-x). Default: 320 */
  keyboardScrollPx?: number;
};

function mergeSnapChildClass(child: ReactNode): ReactNode {
  if (!isValidElement<{ className?: string }>(child)) return child;
  const base = child.props.className ?? "";
  return cloneElement(child, {
    className: `${base} snap-start shrink-0`.trim(),
  });
}

/**
 * Opinionated horizontal strip: default GSAP snap on desktop, CSS snap + keyboard on mobile.
 */
export function HorizontalScrollGallery({
  children,
  keyboardScrollPx = 320,
  snap,
  trackClassName = "",
  onKeyDown,
  tabIndex,
  role,
  "aria-label": ariaLabel,
  "aria-roledescription": ariaRoledescription,
  className = "",
  ...rest
}: HorizontalScrollGalleryProps) {
  const slides = Children.map(children, mergeSnapChildClass);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      const root = e.currentTarget;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        root.scrollBy({ left: keyboardScrollPx, behavior: "smooth" });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        root.scrollBy({ left: -keyboardScrollPx, behavior: "smooth" });
      }
    },
    [keyboardScrollPx, onKeyDown],
  );

  return (
    <HorizontalScrollSection
      {...rest}
      snap={snap ?? true}
      tabIndex={tabIndex ?? 0}
      role={role ?? "region"}
      aria-label={ariaLabel ?? "Horizontal gallery"}
      aria-roledescription={ariaRoledescription ?? "carousel"}
      className={`outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${className}`}
      trackClassName={`snap-x snap-mandatory md:snap-none gap-4 ${trackClassName}`}
      onKeyDown={handleKeyDown}
    >
      {slides}
    </HorizontalScrollSection>
  );
}
