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
    image: "/villa/room_01_img_01.webp",
    alt: "Super king Bedroom 1 with canopy net",
  },
  {
    id: "bedroom-2",
    badge: "🛏",
    title: "Bedroom 2",
    description:
      "Another super king bedroom offering the same comfort, complete with modern amenities, fresh linens, and a calming atmosphere — perfect for families or friends.",
    image: "/villa/room_02_img_01.webp",
    alt: "Super king Bedroom 2 with four-poster bed",
  },
  {
    id: "kitchen",
    badge: "🍳",
    title: "Kitchen",
    description:
      "A fully equipped modern kitchen with a stove, fridge, washing machine, and all essentials — cook home-style meals or fresh local dishes with ease.",
    image: "/villa/kitchen_img_02.webp",
    alt: "Modern kitchen essentials",
  },
  {
    id: "outdoor",
    badge: "🌿",
    title: "Outdoor",
    description:
      "Relax on the wide veranda overlooking the private garden and tranquil lake. Sunrise views, bird watching, and peaceful greenery await.",
    image: "/villa/villa_img_01.webp",
    alt: "Wide veranda and private garden",
  },
  {
    id: "bathroom-1",
    badge: "🚿",
    title: "Bathroom 1",
    description:
      "Spacious and well-designed with a refreshing hot-water shower — perfect after a day at the beach or exploring Tangalle.",
    image: "/villa/room_01_img_04_bathroom.webp",
    alt: "Bathroom with hot water shower",
  },
  {
    id: "bathroom-2",
    badge: "🚿",
    title: "Bathroom 2",
    description:
      "Equally comfortable and modern, ensuring every guest has easy access to private facilities.",
    image: "/villa/room_02_img_04_bathroom.webp",
    alt: "Second bathroom",
  },
  {
    id: "cot",
    badge: "🛏",
    title: "Cot",
    description:
      "A baby cot is available for families traveling with little ones — a child-friendly getaway made easy.",
    image: "/villa/room_01_img_03_cot.webp",
    alt: "Baby cot in master bedroom",
  },
  {
    id: "balcony",
    badge: "🌅",
    title: "Balcony",
    description:
      "Step onto the balcony for serene lake views, morning sunshine, and soothing sounds of nature — perfect for coffee, reading, or quiet reflection.",
    image: "/villa/villa_outside_01.webp",
    alt: "Balcony with lake view at sunrise",
  },
];
