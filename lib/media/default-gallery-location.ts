/** Default placement for newly uploaded library assets (admin + Cloudinary pipeline). */

export const DEFAULT_MEDIA_PAGE_SLUG = "gallery" as const;
export const DEFAULT_MEDIA_SECTION_SLUG = "grid" as const;

/** Nested write fragment for `MediaAssetCreateInput.locations` (mutable for Prisma typings). */
export const defaultGalleryLocationCreate = {
  create: [
    {
      pageSlug: DEFAULT_MEDIA_PAGE_SLUG,
      sectionSlug: DEFAULT_MEDIA_SECTION_SLUG,
      isPrimary: true,
      order: 0,
    },
  ],
};

/** Keeps legacy single-slot columns aligned with the primary gallery placement. */
export const legacyGallerySlugFields = {
  pageSlug: DEFAULT_MEDIA_PAGE_SLUG,
  sectionSlug: DEFAULT_MEDIA_SECTION_SLUG,
} as const;
