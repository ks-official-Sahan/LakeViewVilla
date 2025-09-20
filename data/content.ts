// data/content.ts
// Canonical site + property data (single source of truth)

import type { BookingFacts } from "@/lib/types";

/** ===== Site-level config (kept stable for existing imports) ===== */
export const SITE_CONFIG = {
  name: "Lake View Villa Tangalle",
  primaryDomain: "https://lakeviewvillatangalle.com",
  secondaryDomain: "https://lakeviewtangalle.com",
  coordinates: { lat: 6.0172272, lng: 80.7812215 },
  googleMapsUrl: "https://maps.app.goo.gl/wRLkZBxMSvfhd2jZA",
  bookingDeepLink: "https://www.booking.com/Share-bP3aRsK",
  whatsappNumber: "+94701164056",
  whatsappNumberText: "+94 70 116 4056",
} as const;

export const siteConfig = {
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.primaryDomain,
  description:
    "Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi, and chef services. Book your Sri Lankan getaway today.",
} as const;

/** ===== UI copy (unchanged names for backwards compatibility) ===== */
export const HERO_CONTENT = {
  title: "Lake View Villa \n Where Dream Stays Come True.",
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

export const SEO_CONFIG = {
  title: "Lake View Villa Tangalle — Private Villa on a Serene Lagoon",
  description:
    "Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi, and chef services. Book your Sri Lankan getaway today.",
  keywords:
    "Tangalle villa, lake view villa, Sri Lanka lagoon stay, private villa Tangalle, Tangalle accommodation, Sri Lanka vacation rental",
} as const;

/** ===== Canonical PROPERTY (merged from old data/booking.ts) ===== */
export const PROPERTY = {
  name: "Lake View Villa - Tangalle",
  type: "Two-Bedroom Villa (entire place)",
  address: {
    line1: "19/6, Julgahawalagoda, Kadurupokuna South, Tangalle.",
    postal_code: "82200",
    city: "Tangalle",
    country: "Sri Lanka",
  },
  location: {
    beachfront: true,
    distance_to_center_mi: 1.1,
    nearest_beach_distance_ft: 1950,
    noted_nearby: [
      { place: "Red Beach", distance_mi: 0.6 },
      { place: "Tangalle Lagoon", distance_mi: 2.1 },
    ],
    coordinates: { lat: 6.0172272, lng: 80.7812215 },
    google_maps_url: "https://maps.app.goo.gl/wRLkZBxMSvfhd2jZA",
  },
  size: { area_sqft: 2099, area_sqm_est: 195.0 },
  occupancy: {
    max_guests: 4,
    bedrooms: 2,
    beds: [
      { bedroom: 1, configuration: ["1 king bed"] },
      { bedroom: 2, configuration: ["1 king bed"] },
    ],
    bathrooms: 2,
  },
  wifi: { available: true, speed_mbps: 52, coverage: "All areas" },
  parking: {
    free_private_on_site: true,
    accessible_parking: true,
    reservation_needed: false,
  },
  pets: { allowed: true, extra_charges: false },
  house_rules: {
    checkin: "Available 24 hours (inform property of arrival time)",
    checkout: "07:00–11:00",
    children_welcome: true,
    crib_policy: { ages: "0–2 years", cost: 0, on_request: true },
    smoking_allowed: false,
    age_restriction: false,
    payment: "Cash only",
  },
  restaurant_on_site: {
    name: "Tangalle Villa – Fresh & Tasty Meals (On-Request)",
    cuisines: ["Seafood", "Local", "Asian", "International", "Grill/BBQ"],
    open_for: ["Breakfast", "Lunch", "Dinner"],
    ambience: ["Family-friendly", "Traditional", "Romantic"],
    dietary_options: ["Vegetarian", "Vegan", "Gluten-free"],
  },
  activities_services: {
    activities: [
      "Tour or class about local culture",
      "Bike tours (add. charge)",
      "Walking tours",
      "Beach",
      "Snorkeling (add. charge, off-site)",
      "Diving (add. charge, off-site)",
      "Cycling (off-site)",
      "Hiking (off-site)",
      "Fishing (add. charge, off-site)",
    ],
    transportation: [
      "Bicycle rental (add. charge)",
      "Shuttle service (add. charge)",
      "Public transit tickets (add. charge)",
      "Car rental",
      "Airport shuttle (add. charge)",
    ],
    front_desk: [
      "Invoice provided",
      "Lockers",
      "Baggage storage",
      "Currency exchange",
      "24-hour front desk",
    ],
    cleaning: [
      "Daily housekeeping",
      "Ironing service (add. charge)",
      "Laundry (add. charge)",
    ],
    family: ["Baby safety gates", "Board games/puzzles", "Playground"],
    shops: ["Convenience store on site"],
    misc: ["Air conditioning", "Heating", "Soundproof rooms", "Family rooms"],
    safety_security: [
      "CCTV outside property",
      "CCTV in common areas",
      "Security alarm",
      "Key access",
      "24-hour security",
      "Safe",
    ],
    languages_spoken: ["English"],
  },
  amenities_in_unit: {
    kitchen: [
      "Shared kitchen",
      "High chair",
      "Dining table",
      "Cleaning products",
      "Toaster",
      "Stovetop",
      "Oven",
      "Dryer",
      "Kitchenware",
      "Electric kettle",
      "Kitchen",
      "Washing machine",
      "Dishwasher",
      "Microwave",
      "Refrigerator",
      "Kitchenette",
    ],
    bedroom: [
      "Linens",
      "Wardrobe or closet",
      "Alarm clock",
      "Extra long beds (> 6.5 ft)",
    ],
    bathroom: [
      "Toilet paper",
      "Towels",
      "Bidet",
      "Towels/Sheets (extra fee)",
      "Guest bathroom",
      "Bathtub or shower",
      "Slippers",
      "Private bathroom",
      "Toilet",
      "Free toiletries",
      "Bathrobe",
      "Hairdryer",
      "Bathtub",
      "Shower",
    ],
    living_area: ["Dining area", "Sitting area", "Desk"],
    room_amenities: [
      "Socket near the bed",
      "Drying rack for clothing",
      "Clothes rack",
      "Mosquito net",
      "Tile/Marble floor",
      "Private entrance",
      "Carpeted",
      "Fan",
      "Ironing facilities",
      "Suit press",
      "Iron",
    ],
    outdoors: [
      "Picnic area",
      "Outdoor furniture",
      "Beachfront",
      "Outdoor dining area",
      "Barbecue",
      "BBQ facilities (add. charge)",
      "Patio",
      "Balcony",
      "Terrace",
      "Garden",
    ],
    common_areas: ["Shared lounge/TV area"],
    spa: ["Locker rooms"],
    food_and_drink: [
      "Fruit (add. charge)",
      "Wine/Champagne (add. charge)",
      "Kid-friendly buffet",
      "Kids' meals",
      "Grocery deliveries (add. charge)",
      "Packed lunches",
      "Breakfast in the room",
      "Bar",
      "Room service",
      "Minibar",
      "Restaurant",
      "Tea/Coffee maker",
    ],
  },
  property_highlights: {
    top_location_score: 10,
    breakfast_info: ["Vegetarian", "Vegan", "Asian", "Breakfast to go"],
    free_private_parking_on_site: true,
  },
  faqs: {
    has_balcony: true,
    has_terrace: true,
    checkin_time: "from 00:00",
    checkout_time: "until 11:00",
    bedrooms_count: 2,
    guests_supported: 4,
    family_friendly: true,
  },
  accommodation_types: [
    {
      name: "Villa Room 1",
      sleeps: 2,
      bedroom_1: ["1 King Bed"],
      bedroom_2: [],
    },
    {
      name: "Villa Room 2",
      sleeps: 2,
      bedroom_1: [],
      bedroom_2: ["1 King Bed"],
    },
  ],
  scores_reviews: {
    overall_score: 10,
    reviews_count: 22,
    category_scores: {
      staff: 10.0,
      facilities: 9.5,
      cleanliness: 9.8,
      comfort: 10.0,
      value_for_money: 10.0,
      location: 9.9,
    },
  },
  images_sample: [
    "room_01_img_01.jpeg",
    "room_02_img_01.jpeg",
    "lake_img_01.jpeg",
    "villa_outside_01.jpeg",
    "with_guests_01.jpeg",
    "with_guests_02.jpeg",
    "with_guests_03.jpeg",
    "with_guests_04_dinning.jpeg",
    "garden_img_01.jpeg",
    "garden_img_02.jpeg",
    "drone-aerial-footage-of-tropical-lagoon-and-villa.jpg",
    "room_01_img_02.jpeg",
    "room_02_img_02.jpeg",
    "room_01_img_03_cot.jpeg",
  ],
} as const;

/** ===== BOOKING_FACTS derived from PROPERTY (for existing consumers) ===== */
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
      "Shared Full Equipped Kitchen",
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
