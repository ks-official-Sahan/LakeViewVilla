import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import { Highlights } from "@/components/sections/highlights";
import { Footer } from "@/components/layout/footer";
import { BelowFold } from "@/components/layout/below-fold";
// import { PinnedHero } from "@/components/sections/pinned-hero";
import { PinnedHero } from "@/components/sections/hero";

import { FAQ_ITEMS } from "@/data/content";

export const metadata: Metadata = {
  title: "Private Villa Tangalle — Lagoon Stay | Lake View Villa Tangalle",
  description: "Book Lake View Villa Tangalle. A private vacation rental and lodging business offering panoramic lake views, comfortable A/C bedrooms, fast Wi-Fi, and chef services in Sri Lanka.",
  keywords: [
    "private villa Tangalle",
    "Lake View Villa Tangalle",
    "lagoon stay",
    "Sri Lanka vacation rental"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Private Villa Tangalle | Lake View Villa Tangalle",
    description: "Lake View Villa Tangalle is a private vacation rental in Sri Lanka. It helps travelers relax with A/C rooms, fast Wi-Fi, and scenic lagoon views.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/villa/optimized/drone_view_villa.webp",
        width: 1200,
        height: 630,
        alt: "Private villa Tangalle — Lake View Villa",
      },
    ],
  },
};

export default function HomePage() {
  const homepageFaq = FAQ_ITEMS.map((item) => ({ q: item.question, a: item.answer }));

  return (
    <main>
      <SeoJsonLd
        breadcrumb={[
          { name: "Home", url: "https://lakeviewvillatangalle.com" },
        ]}
        faq={homepageFaq}
      />
      <PinnedHero nextSectionId="highlights" />
      <section id="highlights">
        <Highlights />
      </section>

      {/* Everything below is deferred until near viewport and then client-rendered */}
      <BelowFold />
      <Footer />
    </main>
  );
}

// import dynamic from "next/dynamic";
// import SeoJsonLd from "@/components/SeoJsonLd";
// import { PinnedHero } from "@/components/sections/pinned-hero";
// import { Highlights } from "@/components/sections/highlights";
// import { Footer } from "@/components/layout/footer";

// const ExperiencesReel = dynamic(() =>
//   import("@/components/sections/experiences-reel").then(
//     (mod) => mod.ExperiencesReel
//   )
// );
// const GalleryTeaser = dynamic(() =>
//   import("@/components/sections/gallery-teaser").then(
//     (mod) => mod.GalleryTeaser
//   )
// );
// const FacilitiesSection = dynamic(
//   () => import("@/components/sections/facilities")
// );

// const StaysTeaser = dynamic(() =>
//   import("@/components/sections/stays-teaser").then((mod) => mod.StaysTeaser)
// );
// const MapDirections = dynamic(() =>
//   import("@/components/sections/map-directions").then(
//     (mod) => mod.MapDirections
//   )
// );
// const ValuesSection = dynamic(() =>
//   import("@/components/sections/values").then((mod) => mod.ValuesSection)
// );
// const FAQ = dynamic(() =>
//   import("@/components/sections/faq").then((mod) => mod.FAQ)
// );

// export default function HomePage() {
//   return (
//     <main>
//       <SeoJsonLd
//         breadcrumb={[
//           { name: "Home", url: "https://lakeviewvillatangalle.com" },
//         ]}
//       />
//       <PinnedHero nextSectionId="highlights" />
//       <section id="highlights">
//         <Highlights />
//       </section>
//       {/* below-the-fold (split) */}
//       <ExperiencesReel />
//       <GalleryTeaser />
//       <FacilitiesSection />
//       <StaysTeaser />
//       <MapDirections />
//       <ValuesSection />
//       <FAQ />
//       <Footer />
//     </main>
//   );
// }
