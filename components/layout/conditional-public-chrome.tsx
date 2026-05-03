"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Hides marketing chrome (nav, scroll bar, CTA) on `/admin` routes. */
export function ConditionalPublicChrome({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
