"use client";

import { useState } from "react";
import { Twitter, Link2, Facebook, Check } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  compact?: boolean;
}

/**
 * Share buttons: Twitter/X, Facebook, copy link.
 * When compact=true, renders icon-only with tooltips (used in sidebar).
 */
export function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
    }
  };

  const btnBase = compact
    ? "flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    : "inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]";

  return (
    <div className={compact ? "flex gap-2" : "flex flex-wrap gap-3"}>
      {!compact && (
        <span className="self-center text-sm font-medium text-[var(--color-muted)] mr-1">
          Share:
        </span>
      )}

      {/* Twitter/X */}
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className={btnBase}
      >
        <Twitter className="h-4 w-4" />
        {!compact && <span>X (Twitter)</span>}
      </a>

      {/* Facebook */}
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={btnBase}
      >
        <Facebook className="h-4 w-4" />
        {!compact && <span>Facebook</span>}
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        aria-label={copied ? "Link copied!" : "Copy link"}
        className={`${btnBase} ${copied ? "border-emerald-400 text-emerald-600" : ""}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {!compact && <span>{copied ? "Copied!" : "Copy link"}</span>}
      </button>
    </div>
  );
}
