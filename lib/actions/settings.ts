"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";

const settingUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
});

export async function updateSetting(data: z.infer<typeof settingUpdateSchema>) {
  const session = await requireRole("DEVELOPER");

  const parsed = settingUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key: parsed.data.key },
      update: { value: parsed.data.value },
      create: { key: parsed.data.key, value: parsed.data.value },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_SETTING",
        entityType: "Setting",
        entityId: setting.key,
      },
    });

    revalidatePath("/admin/settings");
    return { success: true, data: setting };
  } catch (error) {
    console.error("Failed to update setting:", error);
    return { success: false, error: "Internal server error" };
  }
}
