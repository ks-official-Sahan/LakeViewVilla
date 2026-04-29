"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateMediaAsset(id: string, data: { title: string; alt: string; category: string }) {
  try {
    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        title: data.title || null,
        alt: data.alt || null,
        category: data.category || "all",
      },
    });

    revalidatePath("/admin/media");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update media asset:", error);
    return { success: false, error: "Failed to update media asset" };
  }
}
