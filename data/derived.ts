// Derived data for existing consumers

import type { BookingFacts } from "@/lib/types";
import { PROPERTY } from "./property";
import { RATES, OFFERS } from "./copy";

export const BOOKING_FACTS: BookingFacts = {
  hero: {
    title: PROPERTY.name,
    tagline: "Two-Bedroom Villa on serene lagoon with beachfront access",
    ctas: ["Book on Booking.com", "Message on WhatsApp"],
  },
  images: (PROPERTY.images_sample ?? []).slice(0, 14).map((src, i) => ({
    src: src.startsWith("/") ? src : `/${src}`,
    alt: `${PROPERTY.name} — Image ${i + 1}`,
    w: 1200,
    h: 800,
  })),
  rooms: PROPERTY.accommodation_types.map((room) => ({
    name: room.name,
    sleeps: room.sleeps,
    features: [
      ...room.bedroom_1?.map((b) => `Bedroom 1: ${b}`),
      ...room.bedroom_2?.map((b) => `Bedroom 2: ${b}`),
      "Private bathroom",
      "Full Equipped Kitchen",
      "Air conditioning",
    ],
  })),
  amenities: [
    "Beachfront location (650m to beach)",
    `${PROPERTY.wifi.speed_mbps}+ Mbps Wi-Fi coverage`,
    "Free private parking",
    "24-hour front desk service",
    "On-site restaurant & bar",
    "Air conditioning in all rooms",
    "Full kitchen facilities",
    "Private terrace & balcony",
    "BBQ facilities",
    "Laundry service",
    "Airport shuttle available",
    "Bicycle rental",
  ],
  reviewMetrics: {
    average: PROPERTY.scores_reviews.overall_score,
    count: PROPERTY.scores_reviews.reviews_count,
  },
  rates: [...RATES],
  offers: [...OFFERS],
};
