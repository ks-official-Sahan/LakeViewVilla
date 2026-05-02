"use client";

import { useEffect, useRef, useState } from "react";
import { List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string; // Markdown content
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Extract headings from markdown (###, ##, #)
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches: Heading[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      matches.push({ id, text, level });
    }

    setHeadings(matches);

    // Set up intersection observer for active heading tracking
    if (matches.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "0% 0% -80% 0%" }
      );

      matches.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });

      observerRef.current = observer;
    }

    return () => observerRef.current?.disconnect();
  }, [content]);

  if (headings.length <= 1) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <List className="h-4 w-4 text-[var(--color-primary)]" />
        <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
          Table of Contents
        </h3>
      </div>

      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={`block rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  activeId === heading.id
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveId(heading.id);
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
