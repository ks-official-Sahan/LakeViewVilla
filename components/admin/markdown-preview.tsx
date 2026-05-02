"use client";

import { useEffect, useState } from "react";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

export function MarkdownPreview({ markdown, className = "" }: MarkdownPreviewProps) {
  const [html, setHtml] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErr(null);
    void (async () => {
      try {
        const file = await remark()
          .use(remarkGfm)
          .use(remarkHtml, { sanitize: false })
          .process(markdown || "");
        if (!cancelled) setHtml(String(file));
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Preview error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  if (err) {
    return (
      <p className={`text-sm text-amber-600 dark:text-amber-400 ${className}`}>{err}</p>
    );
  }

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none text-[var(--color-foreground)] prose-headings:text-[var(--color-foreground)] prose-p:text-[var(--color-muted)] prose-a:text-[var(--color-primary)] prose-strong:text-[var(--color-foreground)] ${className}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
