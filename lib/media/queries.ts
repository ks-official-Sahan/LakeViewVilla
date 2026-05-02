import { prisma } from "@/lib/db/prisma";
import {
  DEFAULT_MEDIA_PAGE_SLUG,
  DEFAULT_MEDIA_SECTION_SLUG,
} from "@/lib/media/default-gallery-location";
import type { MediaAsset, MediaLocation, Prisma } from "@prisma/client";

const galleryAssetInclude = {
  uploadedBy: { select: { name: true, email: true } },
  locations: { orderBy: [{ order: "asc" }, { pageSlug: "asc" }] },
} satisfies Prisma.MediaAssetInclude;

export type MediaAssetWithLocations = MediaAsset & {
  locations: MediaLocation[];
};

/**
 * Assets placed at `(pageSlug, sectionSlug)` via MediaLocation,
 * plus legacy rows where `MediaAsset.pageSlug` / `sectionSlug` match and no join rows exist.
 */
export async function getMediaAssetsByLocation(
  pageSlug: string,
  sectionSlug: string,
  opts?: { limit?: number; types?: Array<MediaAsset["type"]> },
): Promise<MediaAssetWithLocations[]> {
  const { limit = 200, types } = opts ?? {};

  const typeFilter = types?.length ? { type: { in: types } } : {};

  return prisma.mediaAsset.findMany({
    where: {
      AND: [
        typeFilter,
        {
          OR: [
            {
              locations: {
                some: { pageSlug, sectionSlug },
              },
            },
            {
              locations: { none: {} },
              pageSlug,
              sectionSlug,
            },
          ],
        },
      ],
    },
    include: galleryAssetInclude,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

/** Gallery grid: explicit locations OR legacy gallery/grid columns OR assets with no locations yet (full library). */
export async function getGalleryGridAssets(opts?: {
  limit?: number;
}): Promise<MediaAssetWithLocations[]> {
  const { limit = 500 } = opts ?? {};

  return prisma.mediaAsset.findMany({
    where: {
      OR: [
        {
          locations: {
            some: {
              pageSlug: DEFAULT_MEDIA_PAGE_SLUG,
              sectionSlug: DEFAULT_MEDIA_SECTION_SLUG,
            },
          },
        },
        {
          locations: { none: {} },
          pageSlug: DEFAULT_MEDIA_PAGE_SLUG,
          sectionSlug: DEFAULT_MEDIA_SECTION_SLUG,
        },
        {
          locations: { none: {} },
          pageSlug: null,
          sectionSlug: null,
        },
      ],
      type: { in: ["IMAGE", "VIDEO"] },
    },
    include: galleryAssetInclude,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}
