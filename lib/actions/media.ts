"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { MediaType } from "@prisma/client";

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

    return { success: true, data: media };
  } catch (error) {
    console.error("Failed to update media asset:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteMediaAsset(id: string) {
  const session = await requireRole("MANAGER");

  try {
    await prisma.mediaAsset.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entityType: "MediaAsset",
        entityId: id,
      },
    });

    revalidatePath("/admin/media");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete media asset:", error);
    return { success: false, error: "Internal server error" };
  }
}

// Media Upload will likely go through a Route Handler (app/api/media/upload)
// or a specialized signed URL function if using Cloudinary/S3.
