"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";

// IMPORTANT: dynamic() expects a default export.
// Return `{ default: m.NamedExport }` to satisfy the typing.
const ExperiencesReel = dynamic(
  () =>
    import("@/components/sections/experiences-reel").then((m) => ({
      default: m.ExperiencesReel,
    })),
  { ssr: false, loading: () => null }
);
const GalleryTeaser = dynamic(
  () =>
    import("@/components/sections/gallery-teaser").then((m) => ({
      default: m.GalleryTeaser,
    })),
  { ssr: false, loading: () => null }
);
const FacilitiesSection = dynamic(
  () =>
    import("@/components/sections/facilities").then((m) => ({
      default: m.default,
    })),
  { ssr: false, loading: () => null }
);
const StaysTeaser = dynamic(
  () =>
    import("@/components/sections/stays-teaser").then((m) => ({
      default: m.StaysTeaser,
    })),
  { ssr: false, loading: () => null }
);
const MapDirections = dynamic(
  () =>
    import("@/components/sections/map-directions").then((m) => ({
      default: m.MapDirections,
    })),
  { ssr: false, loading: () => null }
);
const ValuesSection = dynamic(
  () =>
    import("@/components/sections/values").then((m) => ({
      default: m.ValuesSection,
    })),
  { ssr: false, loading: () => null }
);
const FAQ = dynamic(
  () =>
    import("@/components/sections/faq").then((m) => ({
      default: m.FAQ,
    })),
  { ssr: false, loading: () => null }
);

export function BelowFold() {
  // Don’t even render children until near viewport
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible && (
        <Suspense fallback={null}>
          <ExperiencesReel />
          <GalleryTeaser />
          <FacilitiesSection />
          <StaysTeaser />
          <MapDirections />
          <ValuesSection />
          <FAQ />
        </Suspense>
      )}
    </div>
  );
}
