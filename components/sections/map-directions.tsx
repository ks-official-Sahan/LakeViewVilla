"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Phone } from "lucide-react";
import { SITE_CONFIG, DIRECTIONS } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { SectionReveal } from "@/components/motion/section-reveal";
import { trackContact, trackMapOpen } from "@/lib/analytics";

export function MapDirections() {
  const mapsEmbedSrc = SITE_CONFIG.googleMapsUrl;

  const handleGetDirections = () => {
    const url = SITE_CONFIG.googleMapsUrl;
    trackMapOpen(url, "Get directions");
    setTimeout(() => window.open(url, "_blank", "noopener"), 120);
  };

  const handleCallForLocation = () => {
    const message =
      "Hi! I need the exact pin location for Lake View Villa Tangalle. Could you please share the precise location?";
    const url = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, message);
    trackContact("whatsapp", url, "Chat on WhatsApp");
    setTimeout(() => window.open(url, "_blank", "noopener"), 120);
  };

  return (
    <SectionReveal>
      <section
        id="location"
        className="border-t border-[var(--color-border)] bg-[var(--color-background)] py-20 md:py-28"
      >
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-center"
          >
            <h2 className="font-[var(--font-display)] text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--color-foreground)]">
              Find your way to paradise
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-[var(--color-muted)]">
              Located on a serene lagoon in Tangalle — easy to reach and
              perfectly positioned for exploring the south coast.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="relative"
            >
              <div
                className="relative mx-auto aspect-square max-w-lg overflow-hidden rounded-[2.5rem] shadow-[0_24px_80px_rgba(14,165,233,.12)] ring-1 ring-[var(--color-border)] md:max-w-none md:[clip-path:circle(48%_at_50%_50%)]"
              >
                <iframe
                  src={mapsEmbedSrc}
                  width="100%"
                  height="100%"
                  className="h-full min-h-[280px] w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lake View Villa Tangalle Location"
                />
              </div>

              <div className="absolute left-6 top-6 z-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-2 text-sm font-medium text-[var(--color-foreground)] shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                  Lake View Villa Tangalle
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h3 className="mb-6 text-xl font-semibold text-[var(--color-foreground)] md:text-2xl">
                  How to reach us
                </h3>
                <div className="space-y-4">
                  {DIRECTIONS.map((direction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] text-sm font-bold text-white shadow-md">
                        {index + 1}
                      </div>
                      <p className="leading-relaxed text-[var(--color-muted)]">{direction}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-[var(--color-primary)] py-6 text-[var(--color-primary-foreground)] hover:opacity-95"
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Open in Google Maps
                </Button>

                <Button
                  onClick={handleCallForLocation}
                  variant="outline"
                  className="w-full border-[var(--color-primary)] py-6 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp for exact pin
                </Button>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h4 className="mb-2 font-semibold text-[var(--color-foreground)]">
                  Need assistance?
                </h4>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  We can help with directions, airport transfers, and timing.
                  Message anytime — we typically reply within minutes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
