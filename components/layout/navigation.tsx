"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { Menu, X, Phone } from "lucide-react";
import ThemeSwitch from "../theme/theme-switch";
import { SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/stays", label: "Stays" },
  { href: "/blog", label: "Blog" },
  { href: "/visit", label: "Visit" },
  { href: "/faq", label: "FAQ" },
];

export function Navigation() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // GSAP entrance on mount
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => setIsOpen(false), [pathname]);

  // Animate drawer open/close
  useEffect(() => {
    if (!drawerRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        drawerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const isHero = !scrolled && !isOpen;
  const whatsappUrl = buildWhatsAppUrl(
    SITE_CONFIG.whatsappNumber,
    "Hi! I'd like to book Lake View Villa Tangalle."
  );

  return (
    <>
      <header
        ref={headerRef}
        role="banner"
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out ${
          scrolled || isOpen
            ? "border-b border-white/10 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,.08)] backdrop-blur-2xl dark:bg-black/25 dark:shadow-[0_8px_32px_rgba(0,0,0,.35)]"
            : "bg-transparent shadow-none"
        }`}
      >
        <div className="lv-container flex h-[var(--header-h)] items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            transitionTypes={["spa-page"]}
            className="group flex items-center gap-2.5"
            aria-label="Lake View Villa — Home"
          >
            <Image
              src="/logo.png"
              alt="Lake View Villa"
              width={36}
              height={36}
              className="h-[clamp(2rem,4vw,2.35rem)] w-[clamp(2rem,4vw,2.35rem)] rounded-lg transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span
              className={`hidden font-semibold tracking-tight sm:block transition-colors duration-300 [font-size:clamp(0.8125rem,calc(0.65rem+0.45vw),1rem)] ${
                isHero ? "text-white drop-shadow-md" : "text-[var(--color-foreground)]"
              }`}
            >
              Lake View Villa
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-[clamp(0.1rem,0.5vw,0.35rem)] lg:gap-1 md:flex"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  transitionTypes={["spa-page"]}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-lg px-[clamp(0.45rem,1vw,0.95rem)] py-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/60 [font-size:clamp(0.75rem,calc(0.65rem+0.35vw),0.875rem)] ${
                    isHero
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/8 hover:text-[var(--color-primary)]"
                  }`}
                >
                  {label}
                  {/* Active underline */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--color-primary)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-[clamp(0.35rem,1vw,0.65rem)] md:flex">
            {process.env.NODE_ENV !== "production" && (
              <div className="rounded-lg p-1">
                <ThemeSwitch />
              </div>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book via WhatsApp"
              className={`inline-flex items-center gap-[clamp(0.25rem,0.8vw,0.45rem)] rounded-xl px-[clamp(0.65rem,2vw,1.1rem)] py-[clamp(0.4rem,1.2vw,0.55rem)] font-semibold transition-all duration-200 [font-size:clamp(0.75rem,calc(0.68rem+0.25vw),0.875rem)] ${
                isHero
                  ? "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/30"
                  : "bg-[var(--color-primary)] text-white hover:opacity-90"
              }`}
            >
              <Phone className="h-[clamp(0.85rem,2vw,1rem)] w-[clamp(0.85rem,2vw,1rem)] shrink-0" />
              Book Now
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl md:hidden transition-colors ${
              isHero ? "text-white hover:bg-white/10" : "text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/10"
            }`}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          ref={drawerRef}
          className="fixed inset-x-0 z-40 max-h-[min(72dvh,calc(100dvh-var(--header-h)))] overflow-y-auto overscroll-y-contain border-b border-white/10 bg-white/92 backdrop-blur-2xl dark:bg-[#0a0f10]/94 md:hidden"
          style={{ top: "var(--header-h)" }}
        >
          <nav
            aria-label="Mobile navigation"
            className="lv-container space-y-1 py-4"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  transitionTypes={["spa-page"]}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/8"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                Book via WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
