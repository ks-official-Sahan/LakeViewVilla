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
    "Experience tranquility at Lake View Villa Tangalle. Private villa on a serene lagoon with panoramic views, A/C bedrooms, fast Wi-Fi, and chef services. Book your Sri Lankan getaway today.",
} as const;

export const SEO_CONFIG = {
  title: "Lake View Villa Tangalle",
  description: siteConfig.description,
  keywords:
    "Tangalle villa, lake view villa, Sri Lanka lagoon stay, private villa Tangalle, Tangalle accommodation, Sri Lanka vacation rental",
} as const;
