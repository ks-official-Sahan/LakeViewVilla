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
