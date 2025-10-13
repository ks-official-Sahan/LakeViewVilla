import SeoJsonLd from "@/components/SeoJsonLd";
import { Highlights } from "@/components/sections/highlights";
import { Footer } from "@/components/layout/footer";
import { BelowFold } from "@/components/layout/below-fold";
// import { PinnedHero } from "@/components/sections/pinned-hero";
import { PinnedHero } from "@/components/sections/hero";

export default function HomePage() {
  return (
    <main>
      <SeoJsonLd
        breadcrumb={[
          { name: "Home", url: "https://lakeviewvillatangalle.com" },
        ]}
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
