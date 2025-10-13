"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Star } from "lucide-react";
import { RATES, STAYS_INTRO, BOOKING_FACTS, SITE_CONFIG } from "@/data/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { SectionReveal } from "@/components/motion/section-reveal";
import { trackContact } from "@/lib/analytics";
import {
  IconBrandAirbnb,
  IconBrandBooking,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

export function StaysTeaser() {
  const [selectedRoom, setSelectedRoom] = useState(0);

  const handleWhatsAppEnquiry = () => {
    const message = `Hi! I'd like to enquire about availability and rates for Lake View Villa Tangalle. 
    Could you please share the best available rate and confirm availability?`;

    const url = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, message);
    trackContact("whatsapp", url, "Chat on WhatsApp");
    setTimeout(() => window.open(url, "_blank", "noopener"), 120);
  };

  return (
    <SectionReveal>
      <section
        id="stays"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Your perfect stay awaits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty mb-8">
              {STAYS_INTRO}
            </p>

            <div className="flex items-center justify-center gap-2 text-lg">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">
                  {BOOKING_FACTS?.reviewMetrics?.average}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {BOOKING_FACTS?.reviewMetrics?.count} reviews
              </span>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Room Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {BOOKING_FACTS?.rooms?.map((room, index) => (
                <motion.div
                  key={room.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedRoom === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRoom(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedRoom(index);
                    }
                  }}
                  aria-label={`Select ${room.name}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold">{room.name}</h3>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{room.sleeps}</span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {room.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Rates Table Preview */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            >
              <div className="p-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                <h3 className="text-2xl font-semibold mb-2">Rates & Availability</h3>
                <p className="text-blue-100">Contact us for the best available rates</p>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Season</th>
                        <th className="text-left py-3 px-4 font-semibold">Period</th>
                        <th className="text-left py-3 px-4 font-semibold">Rate</th>
                        <th className="text-left py-3 px-4 font-semibold">Min Nights</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RATES.map((rate, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 px-4 font-medium">{rate.season}</td>
                          <td className="py-3 px-4 text-gray-600">{rate.period}</td>
                          <td className="py-3 px-4 text-gray-600">{rate.nightly}</td>
                          <td className="py-3 px-4 text-gray-600">{rate.minNights}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{RATES[0].notes}</p>
                </div>
              </div>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center flex flex-col gap-2"
            >
              <Button
                size="lg"
                onClick={handleWhatsAppEnquiry}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                data-magnetic
              >
                <IconBrandWhatsapp className="w-6 h-6 mr-2" />
                Get Best Rate on WhatsApp
              </Button>

              <div className="flex sm:flex-col md:flex-row lg:flex-row justify-evenly gap-3">
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://www.airbnb.com/l/CfK96vPd",
                      "_blank",
                      "noopener"
                    )
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                  data-magnetic
                >
                  <IconBrandAirbnb size={8} className="w-8 h-8 mr-2" />
                  AirBNB
                </Button>
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://www.booking.com/Pulse-81UlHU",
                      "_blank",
                      "noopener"
                    )
                  }
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 text-lg font-semibold"
                  data-magnetic
                >
                  <IconBrandBooking size={8} className="w-8 h-8 mr-2" />
                  Booking.com
                </Button>
              </div>

              <div className="flex sm:flex-col md:flex-row lg:flex-row justify-evenly gap-3">
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/lakeviewvillatangalle",
                      "_blank",
                      "noopener"
                    )
                  }
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg font-semibold"
                  data-magnetic
                >
                  <IconBrandInstagram size={8} className="w-8 h-8 mr-2" />
                  Instagram
                </Button>
                <Button
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/share/17M3VXHKbZ/?mibextid=wwXIfr",
                      "_blank",
                      "noopener"
                    )
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  data-magnetic
                >
                  <IconBrandFacebook size={8} className="w-8 h-8 mr-2" />
                  Facebook
                </Button>
              </div>

              <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">
                Message us directly for personalized rates, instant
                confirmation, and flexible booking terms.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
