// UI copy blocks (unchanged export names for backwards compatibility)

export const HERO_CONTENT = {
  title: "Lake View Villa \n Where Dream Stays Come True.",
  titleParts: ["Lake View Villa", "Where Dream Stays Come True."],
  tagline:
    "Embrace the beauty of Tangalle’s landscapes in a villa that blends elegance, comfort, and serenity. Whether you long for peaceful relaxation or a luxurious space to celebrate life’s moments, Lake View Villa welcomes you with warmth, style, and unforgettable experiences.",
  ctas: ["Book on Booking.com", "Message on WhatsApp"],
} as const;

export const HIGHLIGHTS = [
  "Panoramic lake view",
  "A/C bedrooms",
  "Fast Wi-Fi (~50+ Mbps)",
  "Chef on request",
  "Airport pickups",
  "Free parking",
] as const;

export const EXPERIENCES = [
  "Rekawa turtle beach",
  "Mulkirigala rock temple",
  "Yala safari day trip",
  "Hummanaya blowhole",
] as const;

export const STAYS_INTRO =
  "Message on WhatsApp for the best available rate and instant confirmation.";

export const RATES = [
  {
    season: "Regular Season",
    period: "Jan–Dec",
    nightly: "Contact for rates",
    minNights: 1,
    notes: "Rates vary by dates and length of stay.",
  },
] as const;

export const OFFERS = [
  {
    title: "Direct WhatsApp Enquiry",
    description: "Lowest direct rate with flexible conversation.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Where is the villa located?",
    answer:
      "Located on a serene lagoon in Tangalle, Sri Lanka, with panoramic lake views and easy access to local attractions.",
  },
  {
    question: "How do I book?",
    answer:
      "Message us on WhatsApp for the best available rate and instant confirmation, or book directly on Booking.com.",
  },
  {
    question: "Is there air conditioning?",
    answer:
      "Yes, all bedrooms are equipped with air conditioning for your comfort.",
  },
  {
    question: "Are meals included?",
    answer:
      "We can arrange a chef on request to prepare delicious local and international cuisine.",
  },
  {
    question: "Do you provide airport transfers?",
    answer:
      "Yes, we offer airport pickup services. Please contact us to arrange your transfer.",
  },
  {
    question: "What about Wi-Fi?",
    answer:
      "We provide fast Wi-Fi with speeds of approximately 50+ Mbps throughout the villa.",
  },
] as const;

export const DIRECTIONS = [
  "From Tangalle town, head towards the lagoon area",
  "Follow the coastal road for approximately 3km",
  "Turn left at the Lake View Villa signboard",
  "Call or WhatsApp us for the exact pin location",
] as const;
