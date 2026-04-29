"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { gsap, EASE, DURATION } from "@/lib/gsap";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/data/content";

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Section entrance
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: DURATION.reveal, ease: EASE.premium,
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  function toggle(index: number) {
    const isOpening = openIndex !== index;
    const prev = openIndex;
    setOpenIndex(isOpening ? index : null);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Animate close previous
    if (prev !== null && contentRefs.current[prev]) {
      gsap.to(contentRefs.current[prev], {
        height: 0, opacity: 0, duration: 0.28, ease: "power2.in",
      });
    }

    // Animate open new
    if (isOpening && contentRefs.current[index]) {
      const el = contentRefs.current[index]!;
      const auto = el.scrollHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: auto, opacity: 1, duration: 0.38, ease: EASE.out }
      );
    }
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden py-24 md:py-32"
    >
      {/* Background texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 80% 60%, rgba(34,211,238,.05), transparent 65%), radial-gradient(50% 35% at 20% 40%, rgba(14,165,233,.05), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 md:px-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-14 text-center md:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Got Questions?
          </p>
          <h2
            id="faq-heading"
            className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-tight tracking-tight text-[var(--color-foreground)]"
          >
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Everything you need to know about your stay at Lake View Villa.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                ref={(el) => { itemRefs.current[idx] = el; }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[var(--color-primary)]/40 bg-[var(--color-surface)] shadow-[0_8px_32px_rgba(14,165,233,.10)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/25"
                }`}
              >
                {/* Question trigger */}
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <h3 className="text-[15px] font-semibold leading-snug text-[var(--color-foreground)]">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-[var(--color-primary)] text-white shadow-md"
                        : "bg-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>

                {/* Answer — GSAP-animated height */}
                <div
                  ref={(el) => { contentRefs.current[idx] = el; }}
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  style={{ height: isOpen && openIndex === 0 && idx === 0 ? "auto" : isOpen ? "auto" : 0, overflow: "hidden", opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="h-px w-full bg-[var(--color-border)] mb-4" />
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
