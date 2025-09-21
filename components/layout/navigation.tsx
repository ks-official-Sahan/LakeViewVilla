"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  ImageIcon,
  Bed,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/stays", label: "Stays", icon: Bed },
  { href: "/visit", label: "Visit", icon: MapPin },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || isOpen
            ? "backdrop-blur-md bg-slate-900/90 border-b border-white/10"
            : "bg-transparent backdrop-blur-2xl"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="container mx-auto px-4 py-2 md:px-4 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-lg md:text-xl font-bold text-white flex justify-center items-center gap-3">
              <Image
                src={"/logo.png"}
                alt="Lake View Villa"
                width={10}
                height={10}
                className="w-10 h-10"
              />
              <span className="bg-gradient-to-r from-cyan-100 to-blue-200 bg-clip-text text-transparent">
                Lake View Villa
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-cyan-400 bg-white/10"
                        : "text-white hover:text-cyan-400 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              {/* <div
                className={
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                }
              >
                <ThemeToggle />
              </div> */}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-30 md:hidden backdrop-blur-md bg-slate-900/95 border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-4">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-cyan-400 bg-white/10"
                          : "text-white hover:text-cyan-400 hover:bg-white/5"
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
                {/* <div
                  className={
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  }
                >
                  <ThemeToggle />
                </div> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
