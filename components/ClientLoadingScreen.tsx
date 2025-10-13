// components/ClientLoadingScreen.tsx
"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// Dynamically import the LoadingScreen client component only on the client.
// ssr: false ensures it's never part of server HTML (keeps heavy animation off critical path).
const LoadingScreen = dynamic(
  () =>
    import("@/components/ui2/loading-screen").then((mod) => {
      // Named export in your file: export function LoadingScreen(...) { ... }
      return mod.LoadingScreen;
    }),
  { ssr: false, loading: () => null }
);

export default function ClientLoadingScreen(
  props: ComponentProps<typeof LoadingScreen>
) {
  // Simply render the dynamic client-only LoadingScreen
  return <LoadingScreen {...(props as any)} />;
}
