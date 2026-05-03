"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { bumpMediaAndGalleryCache } from "@/lib/cache/tags";
import { prisma } from "@/lib/db/prisma";
import { formatDbError } from "@/lib/db/format-db-error";
import { mediaLocationsTableExists } from "@/lib/db/media-locations-table";
import { requireRole } from "@/lib/auth/rbac";
import { MEDIA_LOCATIONS, locationKey } from "@/lib/admin/media-locations";

const mediaUpdateSchema = z.object({
  id: z.string(),
  title: z.string().max(100).optional().nullable(),
  alt: z.string().max(200).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(60).optional().nullable(),
  seoAlt: z.string().max(160).optional().nullable(),
});

type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;

export async function updateMediaAsset(data: MediaUpdateInput) {
  const session = await requireRole("EDITOR");

  const parsed = mediaUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const media = await prisma.mediaAsset.update({
      where: { id: parsed.data.id },
      data: {
        title: parsed.data.title,
        alt: parsed.data.alt,
        description: parsed.data.description,
        category: parsed.data.category,
        tags: parsed.data.tags,
        featured: parsed.data.featured,
        seoTitle: parsed.data.seoTitle,
        seoAlt: parsed.data.seoAlt,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entityType: "MediaAsset",
        entityId: media.id,
      },
    });

    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    bumpMediaAndGalleryCache();

    return { success: true, data: media };
  } catch (error) {
    const message = formatDbError(error);
    console.error("Failed to update media asset:", message);
    return { success: false, error: message };
  }
}

export async function deleteMediaAsset(id: string) {
  const session = await requireRole("MANAGER");

  try {
    await prisma.$transaction([
      prisma.blogPost.updateMany({
        where: { featuredImageId: id },
        data: { featuredImageId: null },
      }),
      prisma.mediaAsset.delete({ where: { id } }),
    ]);

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entityType: "MediaAsset",
        entityId: id,
      },
    });

    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    bumpMediaAndGalleryCache();

    return { success: true };
  } catch (error) {
    const message = formatDbError(error);
    console.error("Failed to delete media asset:", message);
    return { success: false, error: message };
  }
}

export async function bulkUpdateMedia(params: {
  ids: string[];
  action: "delete" | "recategorize";
  category?: string;
}) {
  const { ids, action } = params;
  if (!ids.length) return { success: true as const };

  try {
    if (action === "delete") {
      const session = await requireRole("MANAGER");
      await prisma.$transaction([
        prisma.blogPost.updateMany({
          where: { featuredImageId: { in: ids } },
          data: { featuredImageId: null },
        }),
        prisma.mediaAsset.deleteMany({ where: { id: { in: ids } } }),
      ]);

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE_BULK",
          entityType: "MediaAsset",
          entityId: null,
          newValue: { ids },
        },
      });
    } else if (action === "recategorize") {
      const cat = params.category?.trim();
      if (!cat) return { success: false as const, error: "Category required" };

      const session = await requireRole("EDITOR");
      await prisma.mediaAsset.updateMany({
        where: { id: { in: ids } },
        data: { category: cat },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "UPDATE_BULK",
          entityType: "MediaAsset",
          entityId: null,
          newValue: { ids, category: cat },
        },
      });
    } else {
      return { success: false as const, error: "Invalid action" };
    }

    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    bumpMediaAndGalleryCache();
    return { success: true as const };
  } catch (error) {
    const message = formatDbError(error);
    console.error("Bulk media update failed:", message);
    return { success: false as const, error: message };
  }
}

const allowedLocationKeys = new Set(
  MEDIA_LOCATIONS.map((l) => locationKey(l.pageSlug, l.sectionSlug)),
);

const mediaLocationsSchema = z
  .array(
    z.object({
      pageSlug: z.string().min(1),
      sectionSlug: z.string().min(1),
      isPrimary: z.boolean().optional(),
      order: z.number().int().optional(),
    }),
  )
  .min(1);

/** Replace all placements for an asset (validated against `MEDIA_LOCATIONS`). */
export async function updateMediaAssetLocations(
  mediaId: string,
  rawLocations: z.infer<typeof mediaLocationsSchema>,
) {
  const session = await requireRole("EDITOR");

  const parsed = mediaLocationsSchema.safeParse(rawLocations);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  for (const row of parsed.data) {
    if (!allowedLocationKeys.has(locationKey(row.pageSlug, row.sectionSlug))) {
      return {
        success: false as const,
        error: `Invalid placement: ${row.pageSlug}/${row.sectionSlug}`,
      };
    }
  }

  try {
    let primaryIdx = parsed.data.findIndex((r) => r.isPrimary);
    if (primaryIdx < 0) primaryIdx = 0;
    const primary = parsed.data[primaryIdx]!;

    const locationRows = parsed.data.map((row, i) => ({
      mediaId,
      pageSlug: row.pageSlug,
      sectionSlug: row.sectionSlug,
      isPrimary: i === primaryIdx,
      order: row.order ?? i,
    }));

    const hasJoinTable = await mediaLocationsTableExists();

    if (!hasJoinTable) {
      await prisma.mediaAsset.update({
        where: { id: mediaId },
        data: {
          pageSlug: primary.pageSlug,
          sectionSlug: primary.sectionSlug,
        },
      });
    } else {
      // Batch ops + bounded waits — avoids P2028 on Neon when an interactive tx can't get a
      // connection quickly (e.g. overlapping updates after long `updateMediaAsset` calls).
      await prisma.$transaction(
        [
          prisma.mediaLocation.deleteMany({ where: { mediaId } }),
          prisma.mediaLocation.createMany({ data: locationRows }),
          prisma.mediaAsset.update({
            where: { id: mediaId },
            data: {
              pageSlug: primary.pageSlug,
              sectionSlug: primary.sectionSlug,
            },
          }),
        ],
        {
          maxWait: 15_000,
          timeout: 25_000,
        },
      );
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_LOCATIONS",
        entityType: "MediaAsset",
        entityId: mediaId,
        newValue: { locations: parsed.data },
      },
    });

    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    bumpMediaAndGalleryCache();

    return {
      success: true as const,
      ...(hasJoinTable ? {} : { legacyLocationsOnly: true as const }),
    };
  } catch (error) {
    const message = formatDbError(error);
    console.error("updateMediaAssetLocations:", message);
    return { success: false as const, error: message };
  }
}

// Media Upload will likely go through a Route Handler (app/api/media/upload)
// or a specialized signed URL function if using Cloudinary/S3.
