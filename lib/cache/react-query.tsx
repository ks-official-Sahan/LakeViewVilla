"use client";

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

// ─── Default Configuration ──────────────────────────────────────────────────

const DEFAULT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Data considered fresh for 60s (avoids refetch on mount)
      staleTime: 60 * 1000,
      // Keep unused cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests twice with exponential backoff
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      // Refetch when window regains focus (good for dashboards)
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (ISR handles staleness)
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
};

/** Shared factory — use for nested providers (e.g. admin islands) when tree context is unreliable during SSR. */
export function makeQueryClient() {
  return new QueryClient(DEFAULT_CONFIG);
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// ─── Prefetch Helpers (for Server Components) ───────────────────────────────

/**
 * Create a QueryClient for server-side prefetching.
 * Use in layout.tsx or page.tsx server components with HydrationBoundary.
 *
 * @example
 * ```tsx
 * // In a server component:
 * import { createServerQueryClient } from "@/lib/cache/react-query";
 * import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
 *
 * export default async function Page() {
 *   const queryClient = createServerQueryClient();
 *   await queryClient.prefetchQuery({ queryKey: ["posts"], queryFn: fetchPosts });
 *   return (
 *     <HydrationBoundary state={dehydrate(queryClient)}>
 *       <PostList />
 *     </HydrationBoundary>
 *   );
 * }
 * ```
 */
/** New QueryClient for the current server render (do not reuse across requests). */
export function createServerQueryClient() {
  return makeQueryClient();
}

// ─── Optimistic Update Utilities ────────────────────────────────────────────

/**
 * Helper for optimistic updates in mutations.
 *
 * @example
 * ```tsx
 * const mutation = useMutation({
 *   mutationFn: updatePost,
 *   ...optimisticUpdate(queryClient, ["posts"], (old, newPost) =>
 *     old.map((p) => (p.id === newPost.id ? { ...p, ...newPost } : p))
 *   ),
 * });
 * ```
 */
export function optimisticUpdate<TData, TVariables>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updater: (old: TData, variables: TVariables) => TData
) {
  return {
    onMutate: async (variables: TVariables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update
      if (previousData !== undefined) {
        queryClient.setQueryData<TData>(queryKey, (old) =>
          old !== undefined ? updater(old, variables) : old
        );
      }

      return { previousData };
    },
    onError: (
      _err: unknown,
      _variables: TVariables,
      context: { previousData?: TData } | undefined
    ) => {
      // Rollback on error
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

// ─── Query Key Factory ──────────────────────────────────────────────────────

/** Centralized query keys to avoid typos and ensure consistency */
export const queryKeys = {
  // Blog
  blogPosts: () => ["blog", "posts"] as const,
  blogPost: (slug: string) => ["blog", "posts", slug] as const,

  // Admin media library (`GET /api/admin/media`)
  adminMediaLibrary: () => ["admin", "media", "library"] as const,
  mediaByCategory: (category: string) =>
    ["admin", "media", "library", category] as const,

  // Admin
  dashboard: () => ["admin", "dashboard"] as const,
  auditLogs: () => ["admin", "audit"] as const,
  users: () => ["admin", "users"] as const,
  settings: () => ["admin", "settings"] as const,

  // Content
  pages: () => ["content", "pages"] as const,
  page: (slug: string) => ["content", "pages", slug] as const,
} as const;
