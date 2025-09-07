import type { BookingFacts } from "@/lib/types"

export const SITE_CONFIG = {
  name: "Lake View Villa Tangalle",
  primaryDomain: "https://lakeviewvillatangalle.com",
  secondaryDomain: "https://lakeviewtangalle.com",
  coordinates: {
    lat: 6.0172272,
    lng: 80.7812215,
  },
  googleMapsUrl: "https://maps.app.goo.gl/wRLkZBxMSvfhd2jZA",
  bookingDeepLink: "https://www.booking.com/Share-bP3aRsK",
  whatsappNumber: "+94717448391",
  whatsappNumberText: "+94 71 744 8391",
}

export const siteConfig = {
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.primaryDomain,
  description:
    "Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi, and chef services. Book your Sri Lankan getaway today.",
}

export const HERO_CONTENT = {
  title: "Private villa on a serene lagoon in Tangalle",
  tagline: "Sunrise over still water, palms in silhouette, and your day moves at lagoon speed.",
  ctas: ["Book on Booking.com", "Message on WhatsApp"],
}

export const HIGHLIGHTS = [
  "Panoramic lake view",
  "A/C bedrooms",
  "Fast Wi-Fi (~50+ Mbps)",
  "Chef on request",
  "Airport pickups",
  "Free parking",
]

export const EXPERIENCES = [
  "Rekawa turtle beach",
  "Mulkirigala rock temple",
  "Yala safari day trip",
  "Hummanaya blowhole",
]

export const STAYS_INTRO = "Message on WhatsApp for the best available rate and instant confirmation."

export const RATES = [
  {
    season: "Regular Season",
    period: "Jan–Dec",
    nightly: "Contact for rates",
    minNights: 1,
    notes: "Rates vary by dates and length of stay.",
  },
]

export const OFFERS = [
  {
    title: "Direct WhatsApp Enquiry",
    description: "Lowest direct rate with flexible conversation.",
  },
]

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
    answer: "Yes, all bedrooms are equipped with air conditioning for your comfort.",
  },
  {
    question: "Are meals included?",
    answer: "We can arrange a chef on request to prepare delicious local and international cuisine.",
  },
  {
    question: "Do you provide airport transfers?",
    answer: "Yes, we offer airport pickup services. Please contact us to arrange your transfer.",
  },
  {
    question: "What about Wi-Fi?",
    answer: "We provide fast Wi-Fi with speeds of approximately 50+ Mbps throughout the villa.",
  },
]

export const DIRECTIONS = [
  "From Tangalle town, head towards the lagoon area",
  "Follow the coastal road for approximately 3km",
  "Turn left at the Lake View Villa signboard",
  "Call or WhatsApp us for the exact pin location",
]

export const SEO_CONFIG = {
  title: "Lake View Villa Tangalle — Private Villa on a Serene Lagoon",
  description:
    "Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi, and chef services. Book your Sri Lankan getaway today.",
  keywords:
    "Tangalle villa, lake view villa, Sri Lanka lagoon stay, private villa Tangalle, Tangalle accommodation, Sri Lanka vacation rental",
}

export const BOOKING_FACTS: BookingFacts = {
  hero: {
    title: "Lake View Villa - Tangalle",
    tagline: "Two-Bedroom Villa on serene lagoon with beachfront access",
    ctas: ["Book on Booking.com", "Message on WhatsApp"],
  },
  images: [
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/651402121.jpg?k=85535494b0d6a9d2c7159b8812bb9b8d8a038a9463a44351ab07310810770bd9&o=",
      alt: "Lake View Villa exterior with lagoon and ocean views",
      w: 1200,
      h: 800,
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max500/730695105.jpg?k=91ddbd8433416cb13a2fde0276e0996a9661bb34d2e5698de51edaf0f8903370&o=",
      alt: "Spacious living area with modern amenities",
      w: 1200,
      h: 800,
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max300/725040298.jpg?k=d31717f3b8f548b6d0e95e20543c5ef1e7ce6f60bffe3c0913d200968a1ffcc9&o=",
      alt: "Master bedroom with king bed and air conditioning",
      w: 1200,
      h: 800,
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max300/725025129.jpg?k=74d2f8f6779b24b28bf08eff0a9c975502535b7d3625a222819b96c2a32c332b&o=",
      alt: "Private terrace with outdoor dining area",
      w: 1200,
      h: 800,
    },
  ],
  rooms: [
    {
      name: "Master Bedroom",
      sleeps: 2,
      features: ["1 king bed", "Air conditioning", "Private bathroom", "Lagoon view", "Extra long bed"],
    },
    {
      name: "Second Bedroom",
      sleeps: 2,
      features: ["1 twin bed", "1 king bed", "Air conditioning", "Garden view", "Shared bathroom"],
    },
  ],
  amenities: [
    "Beachfront location (650m to beach)",
    "52+ Mbps Wi-Fi coverage",
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
    average: 9.9,
    count: 22,
  },
  rates: [
    {
      season: "Year Round",
      period: "Jan–Dec",
      nightly: "Contact for best rates",
      minNights: 1,
      notes: "Rates vary by season, length of stay, and booking method. Direct bookings get best rates.",
    },
  ],
  offers: [
    {
      title: "Direct WhatsApp Booking",
      description: "Message us directly for lowest rates and flexible terms",
    },
    {
      title: "Extended Stay Discount",
      description: "Stay 5+ nights and receive special pricing",
    },
  ],
}
