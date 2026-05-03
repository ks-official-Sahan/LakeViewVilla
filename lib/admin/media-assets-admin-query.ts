import { prisma } from "@/lib/db/prisma";
import { mediaLocationsTableExists } from "@/lib/db/media-locations-table";
import type { Prisma } from "@prisma/client";

export type AdminMediaAssetRow = {
  id: string;
  url: string;
  title: string | null;
  alt: string | null;
  tags: string[];
  featured: boolean;
  category: string;
  type: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
  locations: {
    id: string;
    pageSlug: string;
    sectionSlug: string;
    isPrimary: boolean;
    order: number;
  }[];
};

const selectWithLocations = {
  id: true,
  url: true,
  title: true,
  alt: true,
  tags: true,
  featured: true,
  category: true,
  type: true,
  width: true,
  height: true,
  createdAt: true,
  locations: {
    orderBy: [{ order: "asc" }, { pageSlug: "asc" }],
    select: {
      id: true,
      pageSlug: true,
      sectionSlug: true,
      isPrimary: true,
      order: true,
    },
  },
} satisfies Prisma.MediaAssetSelect;

const selectWithoutLocations = {
  id: true,
  url: true,
  title: true,
  alt: true,
  tags: true,
  featured: true,
  category: true,
  type: true,
  width: true,
  height: true,
  createdAt: true,
} satisfies Prisma.MediaAssetSelect;

/**
 * Lists media assets for admin UI/API. If `media_locations` is not migrated yet,
 * skips the relation so Prisma never hits a missing table (run `pnpm prisma migrate deploy`).
 */
export async function findManyMediaAssetsForAdmin(): Promise<AdminMediaAssetRow[]> {
  const hasLocations = await mediaLocationsTableExists();
  if (hasLocations) {
    const rows = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: selectWithLocations,
    });
    return rows as AdminMediaAssetRow[];
  }

  const rows = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: selectWithoutLocations,
  });

  return rows.map((a) => ({
    ...a,
    locations: [],
  }));
}
