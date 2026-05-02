/** Canonical admin CMS page definitions (sections per route). */

export type ContentPageDef = {
  slug: string;
  label: string;
  sections: string[];
};

export const ADMIN_CONTENT_PAGES: ContentPageDef[] = [
  {
    slug: "home",
    label: "Home Page",
    sections: [
      "hero",
      "highlights",
      "experiences",
      "stays-teaser",
      "gallery-teaser",
      "facilities",
      "values",
      "faq",
    ],
  },
  {
    slug: "stays",
    label: "Stays Page",
    sections: ["hero", "rooms", "pricing", "amenities"],
  },
  {
    slug: "gallery",
    label: "Gallery Page",
    sections: ["hero", "grid"],
  },
  {
    slug: "visit",
    label: "Visit Page",
    sections: ["hero", "map", "directions", "nearby"],
  },
  {
    slug: "faq",
    label: "FAQ Page",
    sections: ["hero", "questions"],
  },
];

export function getContentPage(slug: string): ContentPageDef | undefined {
  return ADMIN_CONTENT_PAGES.find((p) => p.slug === slug);
}
