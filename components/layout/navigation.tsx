"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Image as ImageIcon,
  Bed,
  MapPin,
  HelpCircle,
  Code,
} from "lucide-react";
import ThemeSwitch from "../theme/theme-switch";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/stays", label: "Stays", icon: Bed },
  { href: "/visit", label: "Visit", icon: MapPin },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  // { href: "/developer", label: "Developer", icon: Code },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const invert = !scrolled && !isOpen; // on top, transparent, content blends dynamically

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-background/50 glass-strong backdrop-blur-3xl dark:glass-dark border-b border-border"
            : "bg-transparent glass"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45 }}
        role="banner"
      >
        <nav
          className="container mx-auto px-4 py-2 md:px-4 md:py-3"
          aria-label="Primary"
        >
          <div
            className={`flex items-center justify-between ${
              invert ? "nav-content-invert" : ""
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 font-bold"
              aria-label="Lake View Villa – Home"
            >
              <Image
                src="/logo.png"
                alt="Lake_View"
                width={150}
                height={150}
                className="h-10 w-10"
                priority
              />
              <span className="text-lg md:text-xl title-shadow">
                Lake View Villa
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors title-shadow focus-visible:outline-none focus-visible:ring-2 border-b-2 focus-visible:ring-primary/60 ${
                      active
                        ? "bg-foreground border-b-cyan-500"
                        : "hover:bg-foreground/10"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm title-shadow">{item.label}</span>
                  </Link>
                );
              })}
              {process.env.NODE_ENV !== "production" && (
                <div className="ml-1 rounded-lg px-1.5 py-1">
                  <ThemeSwitch />
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[64px] left-0 right-0 z-40 md:hidden border-b border-border bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                        active ? "bg-foreground/10" : "hover:bg-foreground/10"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                {process.env.NODE_ENV !== "production" && (
                  <div className="rounded-lg px-4 py-3">
                    <ThemeSwitch />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
