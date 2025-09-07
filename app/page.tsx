import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { ExperiencesReel } from "@/components/sections/experiences-reel";
import { GalleryTeaser } from "@/components/sections/gallery-teaser";
import { StaysTeaser } from "@/components/sections/stays-teaser";
import { MapDirections } from "@/components/sections/map-directions";
import { FAQ } from "@/components/sections/faq";
import { Footer } from "@/components/layout/footer";
import { PinnedHero } from "@/components/sections/pinned-hero";

export default function HomePage() {
  return (
    <main>
      {/* <Hero /> */}
      <PinnedHero nextSectionId="highlights" />
      <section id="highlights">
        <Highlights />
      </section>
      <ExperiencesReel />
      <GalleryTeaser />
      <StaysTeaser />
      <MapDirections />
      <FAQ />
      <Footer />
    </main>
  );
}
