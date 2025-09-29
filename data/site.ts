// data/site.ts
export const SITE_CONFIG = {
  name: "Lake View Villa Tangalle",
  primaryDomain: "https://lakeviewvillatangalle.com",
  secondaryDomain: "https://www.lakeviewvillatangalle.com",
  // secondaryDomain: "https://lakeviewtangalle.com",
  coordinates: { lat: 6.0172272, lng: 80.7812215 },
  googleMapsUrl: "https://maps.app.goo.gl/wRLkZBxMSvfhd2jZA",
  bookingDeepLink: "https://www.booking.com/Share-bP3aRsK",
  whatsappNumber: "+94701164056",
  whatsappNumberText: "+94 70 116 4056",
  // NEW: official address fragments used in schema
  addressStreet: "19/6 Julgahawalagoda, Kadurupokuna South",
  addressRegion: "Southern Province",
  postalCode: "82200",
  // NEW: sameAs graph for Organization/LodgingBusiness
  sameAs: [
    "https://lakeviewvillatangalle.com",
    "https://www.lakeviewvillatangalle.com",
    "https://lakeviewvilla.vercel.app",
    "https://www.booking.com/hotel/lk/lake-view-tangalle123.html",
    "https://www.facebook.com/p/Lake-view-Homestay-Tangalle-100064155182720/",
    "https://www.instagram.com/lakeviewvillatangalle/",
    "https://www.tripadvisor.com/Hotel_Review-g304142-d24052834-Reviews-Lake_View_Villa_tangalle-Tangalle_Southern_Province.html",
    "https://www.agoda.com/lake-view-h30642043/hotel/tangalle-lk.html",
    "https://www.expedia.com/Tangalle-Hotels-Lake-View-Homestay.h102927826.Hotel-Information",
  ],
} as const;

export const siteConfig = {
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.primaryDomain,
  description:
    "Book your Sri Lankan getaway today. Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi.",
} as const;

export const SEO_CONFIG = {
  title: "Lake View Villa | Tangalle Private Villa",
  description: siteConfig.description,
  keywords:
    "Lake View Villa Tangalle, Lake View, Lake View Tangalle, Lake Tangalle, Tangalle villa, lake view villa, Sri Lanka lagoon stay, private villa Tangalle, Tangalle accommodation, Booking Tangalle, Tangalle Rental, Tangalle, Sri Lanka vacation rental, Booking, Rental, Villa, Lake, Vacation, Coastal Line Tangalle, low budget villas in sri lanka, low budget villas in tangalle, tangalle villas, Villas in Tangalle, Tangalle beachfront villa, Luxury villa Tangalle, Private villa Tangalle, Tangalle holiday villa, Beach villa Tangalle Sri Lanka, Tangalle villa with pool, Ocean view villa Tangalle, Tangalle boutique villa, Family villa Tangalle, vacation rental Tangalle, vacation rental, Tangalle resort villa, Tangalle luxury villa, Tangalle beach villa, Tangalle Vacation rental, Tangalle resorts, Romantic villa Tangalle, Tangalle honeymoon villa, Best villas in Tangalle Sri Lanka, Where to stay in Tangalle, Tangalle accommodation, Tangalle luxury stays, Tangalle resort vs villa, Tangalle Airbnb alternative, Near Tangalle beach, Near Tangalle lagoon, Near Hiriketiya / Goyambokka / Rekawa	, Goyambokka villa, Villas near Goyambokka beach, Goyambokka beach hotels, Goyambokka accommodation, Goyambokka luxury villas, Beachfront villa Goyambokka, Private villa near Goyambokka Tangalle, Goyambokka boutique villa, Luxury Goyambokka beach villa, Goyambokka romantic villa for couples, Family villa near Goyambokka beach, Best villas in Goyambokka Tangalle, Where to stay near Goyambokka beach Sri Lanka, Goyambokka beach villas with pool, Goyambokka Sri Lanka accommodation guide, Things to do near Goyambokka beach",
} as const;
