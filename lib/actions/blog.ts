"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { BlogStatus } from "@prisma/client";

// Zod schema for Blog Post
const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().max(300).optional().nullable(),
  status: z.nativeEnum(BlogStatus).default(BlogStatus.DRAFT),
  generatedByAI: z.boolean().default(false),
  seoTitle: z.string().max(60).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  seoKeywords: z.array(z.string()).default([]),
  ogImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  featuredImageId: z.string().optional().nullable(),
});

type BlogPostInput = z.infer<typeof blogPostSchema>;

export async function createBlogPost(data: BlogPostInput) {
  const session = await requireRole("EDITOR");

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  // Only MANAGERS/DEVELOPERS can publish directly
  if (parsed.data.status === BlogStatus.PUBLISHED) {
    await requireRole("MANAGER");
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
        publishedAt: parsed.data.status === BlogStatus.PUBLISHED ? new Date() : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entityType: "BlogPost",
        entityId: post.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, data: post };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A post with this slug already exists." };
    }
    console.error("Failed to create blog post:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  const session = await requireRole("EDITOR");

  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  // Only MANAGERS/DEVELOPERS can publish
  if (parsed.data.status === BlogStatus.PUBLISHED) {
    await requireRole("MANAGER");
  }

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Post not found" };

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...parsed.data,
        publishedAt:
          parsed.data.status === BlogStatus.PUBLISHED && existing.status !== BlogStatus.PUBLISHED
            ? new Date()
            : existing.publishedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entityType: "BlogPost",
        entityId: post.id,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true, data: post };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "A post with this slug already exists." };
    }
    console.error("Failed to update blog post:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await requireRole("MANAGER");

  try {
    await prisma.blogPost.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DELETE",
        entityType: "BlogPost",
        entityId: id,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return { success: false, error: "Internal server error" };
  }
}
