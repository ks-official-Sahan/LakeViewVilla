"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Phone } from "lucide-react";
import { SITE_CONFIG, DIRECTIONS } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { SectionReveal } from "@/components/motion/section-reveal";
import { trackContact, trackMapOpen } from "@/lib/analytics";

export function MapDirections() {
  // const mapsEmbedSrc = `https://www.google.com/maps?q=${SITE_CONFIG.coordinates.lat},${SITE_CONFIG.coordinates.lng}&hl=en&z=15&output=embed`;
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
    //window.open(url, "_blank");
    trackContact("whatsapp", url, "Chat on WhatsApp");
    setTimeout(() => window.open(url, "_blank", "noopener"), 120);
  };

  return (
    <SectionReveal>
      <section id="location" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Find your way to paradise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              Located on a serene lagoon in Tangalle, easily accessible and
              perfectly positioned for exploration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={mapsEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lake View Villa Tangalle Location"
                />
              </div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center text-sm font-medium">
                  <MapPin className="w-4 h-4 text-red-500 mr-2" />
                  Lake View Villa Tangalle
                </div>
              </div>
            </motion.div>

            {/* Directions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-6">How to reach us</h3>
                <div className="space-y-4">
                  {DIRECTIONS.map((direction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-1">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {direction}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  data-magnetic
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions on Google Maps
                </Button>

                <Button
                  onClick={handleCallForLocation}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3 bg-transparent"
                  data-magnetic
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call/WhatsApp for Exact Pin Location
                </Button>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Need assistance?
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Our team is available 24/7 to help with directions, airport
                  transfers, and any questions about reaching the villa. Don't
                  hesitate to contact us!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
