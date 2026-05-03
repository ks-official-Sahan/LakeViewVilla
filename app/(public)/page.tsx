import SeoJsonLd from "@/components/SeoJsonLd";
import { PinnedHero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { Footer } from "@/components/layout/footer";
import { BelowFold } from "@/components/layout/below-fold";
import { FAQ_ITEMS } from "@/data/content";

export default function HomePage() {
  const homepageFaq = FAQ_ITEMS.map((item) => ({
    q: item.question,
    a: item.answer,
  }));

  return (
    <main>
      <SeoJsonLd
        breadcrumb={[{ name: "Home", url: "https://lakeviewvillatangalle.com" }]}
        faq={homepageFaq}
      />
      <PinnedHero nextSectionId="highlights" />
      <section id="highlights">
        <Highlights />
      </section>
      <BelowFold />
      <Footer />
    </main>
  );
}
