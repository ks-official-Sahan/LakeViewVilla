import type { ReactNode } from "react";
import { Suspense } from "react";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Navigation } from "@/components/layout/navigation";
import { ExpandableCTA } from "@/components/ui2/expandable-cta";

/** Marketing shell only — `/admin` stays outside this group so builds skip pathname/chrome here (Next Cache Components). */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      {children}
      <ExpandableCTA />
    </>
  );
}
