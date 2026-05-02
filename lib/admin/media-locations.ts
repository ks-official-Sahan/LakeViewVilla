/** Supported CMS placements for media assets (admin picker + queries). */

export type MediaLocationDefinition = {
  readonly pageSlug: string;
  readonly sectionSlug: string;
  readonly label: string;
  /** Max assets recommended for this slot; `null` = no soft limit. */
  readonly hasLimit: number | null;
};

export const MEDIA_LOCATIONS = [
  {
    pageSlug: "gallery",
    sectionSlug: "grid",
    label: "Gallery — Main Grid",
    hasLimit: null,
  },
  {
    pageSlug: "home",
    sectionSlug: "gallery-teaser",
    label: "Home — Gallery Teaser",
    hasLimit: 6,
  },
  {
    pageSlug: "home",
    sectionSlug: "hero",
    label: "Home — Hero Background",
    hasLimit: 3,
  },
  {
    pageSlug: "home",
    sectionSlug: "with-guests",
    label: "Home — With Guests",
    hasLimit: 8,
  },
  {
    pageSlug: "stays",
    sectionSlug: "room-1",
    label: "Stays — Room 1 Gallery",
    hasLimit: null,
  },
  {
    pageSlug: "stays",
    sectionSlug: "room-2",
    label: "Stays — Room 2 Gallery",
    hasLimit: null,
  },
  {
    pageSlug: "visit",
    sectionSlug: "gallery",
    label: "Visit — Gallery",
    hasLimit: null,
  },
] as const satisfies readonly MediaLocationDefinition[];

export function locationKey(pageSlug: string, sectionSlug: string): string {
  return `${pageSlug}:${sectionSlug}`;
}
