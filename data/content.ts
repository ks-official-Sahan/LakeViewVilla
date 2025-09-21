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
    "villa/villa_img_02.jpeg",
    "villa/beach_img_01.jpeg",
    "villa/with_guests_01.jpeg",
    "villa/with_guests_04_dinning.jpeg",
    "villa/room_02_img_01.jpeg",
    "villa/villa_outside_01.jpeg",
    "villa/villa_img_01.jpeg",
    "villa/drone_view_villa.jpg",
    "villa/garden_img_01.jpeg",
    "villa/garden_img_02.jpeg",
    "villa/garden_img_03.jpeg",
    "villa/garden_img_04.jpeg",
    "villa/garden_img_05.jpeg",
    "villa/kitchen_img_01",
    "villa/kitchen_img_02",
    "villa/kitchen_img_03",
    "villa/kitchen_img_04",
    "villa/lake_img_01.jpeg",
    "villa/lake_img_02.jpeg",
    "villa/room_01_img_01.jpeg",
    "villa/room_01_img_02.jpeg",
    "villa/room_01_img_03_cot.jpeg",
    "villa/room_01_img_04_bathroom.jpeg",
    "villa/room_01_img_05_bathroom.jpeg",
    "villa/room_02_img_02.jpeg",
    "villa/room_02_img_03.jpeg",
    "villa/room_02_img_04_bathroom.jpeg",
    "villa/room_img_01.jpeg",
    "villa/with_guests_02.jpeg",
    "villa/with_guests_03.jpeg",
    "villa/with_guests_05_dinning.jpeg",
    "villa/villa_outside_02.jpeg",
    "villa/villa_outside_03.jpeg",
    "villa/villa_outside_04.jpeg",
    "villa/villa_outside_05.jpeg",
    "villa/villa_outside_06.jpeg",
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

// -------- Facilities (Landing Section) --------
export type Facility = {
  id: string;
  title: string;
  description: string;
  image: string; // public path starting with "/"
  alt?: string;
  badge?: string; // small emoji badge (optional)
};

export const FACILITIES: Facility[] = [
  {
    id: "bedroom-1",
    badge: "🛏",
    title: "Bedroom 1",
    description:
      "A spacious super king bedroom with air-conditioning and a cooling fan, designed for restful sleep. Bright, airy, and elegantly furnished for your comfort.",
    image: "/villa/room_01_img_01.jpeg",
    alt: "Super king Bedroom 1 with canopy net",
  },
  {
    id: "bedroom-2",
    badge: "🛏",
    title: "Bedroom 2",
    description:
      "Another super king bedroom offering the same comfort, complete with modern amenities, fresh linens, and a calming atmosphere — perfect for families or friends.",
    image: "/villa/room_02_img_01.jpeg",
    alt: "Super king Bedroom 2 with four-poster bed",
  },
  {
    id: "kitchen",
    badge: "🍳",
    title: "Kitchen",
    description:
      "A fully equipped modern kitchen with a stove, fridge, washing machine, and all essentials — cook home-style meals or fresh local dishes with ease.",
    image: "/villa/kitchen_img_02.jpeg",
    alt: "Modern kitchen essentials",
  },
  {
    id: "outdoor",
    badge: "🌿",
    title: "Outdoor",
    description:
      "Relax on the wide veranda overlooking the private garden and tranquil lake. Sunrise views, bird watching, and peaceful greenery await.",
    // image: "/villa_outside_01.jpeg",
    image: "/villa/villa_img_01.jpeg",
    alt: "Wide veranda and private garden",
  },
  {
    id: "bathroom-1",
    badge: "🚿",
    title: "Bathroom 1",
    description:
      "Spacious and well-designed with a refreshing hot-water shower — perfect after a day at the beach or exploring Tangalle.",
    image: "/villa/room_01_img_04_bathroom.jpeg",
    alt: "Bathroom with hot water shower",
  },
  {
    id: "bathroom-2",
    badge: "🚿",
    title: "Bathroom 2",
    description:
      "Equally comfortable and modern, ensuring every guest has easy access to private facilities.",
    image: "/villa/room_02_img_04_bathroom.jpeg",
    alt: "Second bathroom",
  },
  {
    id: "cot",
    badge: "🛏",
    title: "Cot",
    description:
      "A baby cot is available for families traveling with little ones — a child-friendly getaway made easy.",
    image: "/villa/room_01_img_03_cot.jpeg",
    alt: "Baby cot in master bedroom",
  },
  {
    id: "balcony",
    badge: "🌅",
    title: "Balcony",
    description:
      "Step onto the balcony for serene lake views, morning sunshine, and soothing sounds of nature — perfect for coffee, reading, or quiet reflection.",
    image: "/villa/villa_outside_01.jpeg",
    alt: "Balcony with lake view at sunrise",
  },
];

// ---------- Value/Benefits (Accordion) ----------
export const VALUES_META = {
  eyebrow: "Our Values",
  title: "The Value We Provide to You..",
  sublines: ["Closest Beach: Goyambokka Beach (less than 1 km)"],
} as const;

export type ValueItem = {
  id: string;
  title: string;
  body: string;
  icon: "car" | "waves" | "utensils" | "wind" | "trees" | "shower";
};

export const VALUES_ITEMS: ValueItem[] = [
  {
    id: "transport",
    title: "Easy & Comfortable Transport",
    body: "Make your journey stress-free with our reliable transport options at Lake View Villa Tangalle. Whether you prefer the charm of a local tuk-tuk, the convenience of a private car, or the comfort of our air-conditioned KDH van that seats up to seven passengers, exploring Tangalle and its stunning surroundings has never been easier. Enjoy seamless travel experiences and focus on creating unforgettable memories.",
    icon: "car",
  },
  {
    id: "beach",
    title: "Peaceful Stay Near the Beach",
    body: "Tucked away in a serene location surrounded by lush greenery, Lake View Villa Tangalle is just 550 meters from the seaside — a leisurely 5–10 minute walk. Here, you can immerse yourself in the soothing sounds of nature, the fresh ocean breeze, and the calming ambiance of a private retreat, offering the perfect balance of peace and coastal charm.",
    icon: "waves",
  },
  {
    id: "kitchen",
    title: "Fully Equipped Modern Kitchen",
    body: "Feel at home in our modern, fully equipped kitchen at Lake View Villa Tangalle. Complete with a stove, fridge, and washing machine, it’s ideal for guests who love the comfort of home-cooked meals or wish to try their hand at preparing fresh local seafood. Whether you’re a culinary enthusiast or simply looking for convenience, our kitchen has everything you need.",
    icon: "utensils",
  },
  {
    id: "ac",
    title: "Spacious Bedrooms with A/C",
    body: "Experience true relaxation in our spacious villa featuring two super king bedrooms, each fitted with air conditioning and ceiling fans for your comfort. The bright, airy design of Lake View Villa Tangalle ensures a restful night’s sleep and a refreshing atmosphere throughout your stay — the perfect setting for unforgettable moments.",
    icon: "wind",
  },
  {
    id: "garden",
    title: "Relaxing Garden & Veranda",
    body: "Step outside to discover your own private oasis at Lake View Villa Tangalle. The spacious veranda and dining areas open to a lush garden filled with fruit trees, offering the perfect blend of natural beauty and comfort. Wake up to the golden glow of the morning sun reflecting over the peaceful lake, and enjoy the magical experience of bird watching as colorful local species flutter around the garden. Whether you’re sharing an alfresco meal, relaxing with loved ones, or simply soaking in the tranquil scenery, every moment here is designed for pure serenity and connection with nature.",
    icon: "trees",
  },
  {
    id: "shower",
    title: "Refreshing Hot Water Shower",
    body: "After a day of sun, sand, and exploration, indulge in the comfort of our spacious bathroom featuring a rejuvenating hot water shower. At Lake View Villa Tangalle, every detail has been designed to refresh your body and mind, ensuring your stay is as relaxing and comfortable as possible.",
    icon: "shower",
  },
] as const;
