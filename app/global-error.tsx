"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  const [copied, setCopied] = useState(false);

  // Log + beacon (best-effort, non-blocking)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[global-error]", error);
    try {
      const payload = JSON.stringify({
        type: "global-error",
        message: error?.message ?? "Unknown",
        digest: (error as any)?.digest,
        stack: error?.stack?.slice(0, 4_000), // cap
        url: typeof location !== "undefined" ? location.href : "",
        ts: Date.now(),
      });
      // Prefer sendBeacon if available
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        navigator.sendBeacon("/api/metrics", payload);
      } else {
        fetch("/api/metrics", {
          method: "POST",
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  }, [error]);

  const detail = useMemo(() => {
    const text = [
      `Message: ${error?.message ?? "—"}`,
      `Digest: ${(error as any)?.digest ?? "—"}`,
      process.env.NODE_ENV !== "production" && error?.stack
        ? `Stack:\n${error.stack}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    return text; // ✅ return the computed string, not `detail`
  }, [error]);

  return (
    // Next requires <html><body> here
    <html lang="en">
      <body className="min-h-screen grid place-items-center bg-gradient-to-b from-background via-muted/30 to-background text-foreground">
        <main className="w-full max-w-xl mx-auto px-6 py-10 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-red-500/10 text-red-600 ring-1 ring-red-500/20 p-4 mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Error"
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.72-3l-8.47-14.14a2 2 0 0 0-3.43 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">
            An unexpected error occurred. You can retry or go back to the
            homepage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-95 transition"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-lg border hover:bg-muted transition"
            >
              Go home
            </a>
            <a
              href="mailto:ks.official.sahan@gmail.com?subject=Site%20Error&body=Hi%2C%20I%20encountered%20an%20error%20on%20Lake%20View%20Villa.%0A%0A"
              className="px-5 py-2.5 rounded-lg border hover:bg-muted transition"
            >
              Contact support
            </a>
          </div>

          {/* Dev-friendly details (stack hidden in prod) */}
          <details className="mt-6 text-left max-h-64 overflow-auto rounded-lg bg-muted/40 p-4">
            <summary className="cursor-pointer select-none font-medium">
              Error details
            </summary>
            <pre className="mt-3 text-sm whitespace-pre-wrap break-words">
              {detail}
            </pre>
          </details>

          <div className="mt-3">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(detail);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {}
              }}
              className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              {copied ? "Copied!" : "Copy details"}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
