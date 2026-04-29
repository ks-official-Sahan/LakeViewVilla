"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";

const userUpdateSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(Role),
});

export async function updateUserRole(data: z.infer<typeof userUpdateSchema>) {
  const session = await requireRole("DEVELOPER");

  const parsed = userUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  if (session.user.id === parsed.data.id) {
    return { success: false, error: "Cannot change your own role" };
  }

  try {
    const user = await prisma.user.update({
      where: { id: parsed.data.id },
      data: { role: parsed.data.role },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_ROLE",
        entityType: "User",
        entityId: user.id,
        newValue: { role: user.role },
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteUser(id: string) {
  const session = await requireRole("DEVELOPER");

  if (session.user.id === id) {
    return { success: false, error: "Cannot delete yourself" };
  }

  try {
    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entityType: "User",
        entityId: id,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Internal server error" };
  }
}
