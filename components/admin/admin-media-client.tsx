"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { makeQueryClient } from "@/lib/cache/react-query";
import { MediaGrid } from "@/components/admin/media-grid";

type Asset = ComponentProps<typeof MediaGrid>["initialAssets"][number];

/** Nested QueryClient avoids rare SSR contexts where root provider context is missing (`No QueryClient set`). */
export function AdminMediaClient({ initialAssets }: { initialAssets: Asset[] }): ReactNode {
  const [client] = useState(() => makeQueryClient());
  return (
    <QueryClientProvider client={client}>
      <MediaGrid initialAssets={initialAssets} />
    </QueryClientProvider>
  );
}
