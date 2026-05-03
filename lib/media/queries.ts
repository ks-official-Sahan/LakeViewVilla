import { prisma } from "@/lib/db/prisma";
import { mediaLocationsTableExists } from "@/lib/db/media-locations-table";
import {
  DEFAULT_MEDIA_PAGE_SLUG,
  DEFAULT_MEDIA_SECTION_SLUG,
} from "@/lib/media/default-gallery-location";
import { Prisma, type MediaAsset, type MediaLocation } from "@prisma/client";

const galleryAssetInclude = {
  uploadedBy: { select: { name: true, email: true } },
  locations: { orderBy: [{ order: "asc" }, { pageSlug: "asc" }] },
} satisfies Prisma.MediaAssetInclude;

const galleryAssetIncludeMinimal = {
  uploadedBy: { select: { name: true, email: true } },
} satisfies Prisma.MediaAssetInclude;

function isMissingMediaLocationsTable(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== "P2021") return false;
  const table = String((error.meta as { table?: string } | undefined)?.table ?? "");
  return table.includes("media_locations");
}

function withEmptyLocations(rows: MediaAsset[]): MediaAssetWithLocations[] {
  return rows.map((r) => ({ ...r, locations: [] as MediaLocation[] }));
}

async function loadGalleryGridWithLocations(limit: number) {
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

async function loadGalleryGridLegacy(limit: number) {
  return prisma.mediaAsset
    .findMany({
      where: {
        type: { in: ["IMAGE", "VIDEO"] },
        OR: [
          {
            pageSlug: DEFAULT_MEDIA_PAGE_SLUG,
            sectionSlug: DEFAULT_MEDIA_SECTION_SLUG,
          },
          { pageSlug: null, sectionSlug: null },
        ],
      },
      include: galleryAssetIncludeMinimal,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: limit,
    })
    .then(withEmptyLocations);
}

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

  try {
    return await prisma.mediaAsset.findMany({
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
  } catch (e) {
    if (!isMissingMediaLocationsTable(e)) throw e;
    return prisma.mediaAsset
      .findMany({
        where: {
          AND: [typeFilter, { pageSlug, sectionSlug }],
        },
        include: galleryAssetIncludeMinimal,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: limit,
      })
      .then(withEmptyLocations);
  }
}

/** Gallery grid: explicit locations OR legacy gallery/grid columns OR assets with no locations yet (full library). */
export async function getGalleryGridAssets(opts?: {
  limit?: number;
}): Promise<MediaAssetWithLocations[]> {
  const { limit = 500 } = opts ?? {};

  const hasLocations = await mediaLocationsTableExists();
  if (!hasLocations) {
    return loadGalleryGridLegacy(limit);
  }

  try {
    return await loadGalleryGridWithLocations(limit);
  } catch (e) {
    if (!isMissingMediaLocationsTable(e)) throw e;
    return loadGalleryGridLegacy(limit);
  }
}
