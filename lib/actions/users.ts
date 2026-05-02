"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";

const userUpdateSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(Role),
});

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  password: z.string().min(8).max(128),
  role: z.nativeEnum(Role),
});

const updateUserProfileSchema = z.object({
  id: z.string(),
  name: z.string().max(120).optional().nullable(),
});

export async function createUser(data: z.infer<typeof createUserSchema>) {
  const session = await requireRole("DEVELOPER");

  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      return { success: false as const, error: "A user with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name?.trim() || null,
        passwordHash,
        role: parsed.data.role,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entityType: "User",
        entityId: user.id,
        newValue: { email: user.email, role: user.role },
      },
    });

    revalidatePath("/admin/users");
    return { success: true as const, data: user };
  } catch (error) {
    console.error("createUser:", error);
    return { success: false as const, error: "Could not create user" };
  }
}

export async function updateUserProfile(data: z.infer<typeof updateUserProfileSchema>) {
  const session = await requireRole("DEVELOPER");

  const parsed = updateUserProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await prisma.user.update({
      where: { id: parsed.data.id },
      data: { name: parsed.data.name?.trim() || null },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entityType: "User",
        entityId: user.id,
        newValue: { name: user.name },
      },
    });

    revalidatePath("/admin/users");
    return { success: true as const, data: user };
  } catch (error) {
    console.error("updateUserProfile:", error);
    return { success: false as const, error: "Could not update user" };
  }
}

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
