"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { auth } from "@/lib/auth/config";
import { audit } from "@/lib/admin/audit";
import { cacheInvalidatePattern } from "@/lib/cache";
import { uploadToCloudinary, deleteFromCloudinary, validateFile } from "@/lib/admin/upload";
import type { MediaType, BlogStatus } from "@prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

// ─── Media Actions ──────────────────────────────────────────────────────────

export async function getMediaAssets(options?: {
  category?: string;
  page?: number;
  limit?: number;
}) {
  const session = await requireAuth();
  const { category, page = 1, limit = 50 } = options ?? {};

  const where = category && category !== "all" ? { category } : {};
  const [items, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { uploadedBy: { select: { name: true, email: true } } },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function uploadMedia(formData: FormData) {
  const session = await requireAuth();
  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "all";
  const alt = (formData.get("alt") as string) || "";
  const title = (formData.get("title") as string) || "";

  if (!file) throw new Error("No file provided");

  const validation = validateFile(file.type, file.size);
  if (!validation.valid) throw new Error(validation.error);

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, {
    folder: `lakeviewvilla/${category}`,
    tags: [category],
  });

  const mediaType: MediaType =
    file.type.startsWith("image/") ? "IMAGE" :
    file.type.startsWith("video/") ? "VIDEO" :
    file.type === "application/pdf" ? "PDF" : "OTHER";

  const asset = await prisma.mediaAsset.create({
    data: {
      url: result.url,
      publicId: result.publicId,
      type: mediaType,
      category,
      alt,
      title,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
      mimeType: file.type,
      uploadedById: session.user.id,
    },
  });

  await audit({
    userId: session.user.id,
    action: "UPLOAD",
    entityType: "MediaAsset",
    entityId: asset.id,
    newValue: { url: result.url, category },
  });

  await cacheInvalidatePattern("media:*");
  return asset;
}

export async function deleteMedia(id: string) {
  const session = await requireRole("MANAGER");

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) throw new Error("Media not found");

  if (asset.publicId) {
    await deleteFromCloudinary(
      asset.publicId,
      asset.type === "VIDEO" ? "video" : "image",
    );
  }

  await prisma.mediaAsset.delete({ where: { id } });

  await audit({
    userId: session.user.id,
    action: "DELETE",
    entityType: "MediaAsset",
    entityId: id,
    oldValue: { url: asset.url, category: asset.category },
  });

  await cacheInvalidatePattern("media:*");
}

export async function updateMediaMetadata(
  id: string,
  data: { alt?: string; title?: string; category?: string; order?: number; featured?: boolean },
) {
  const session = await requireAuth();

  const existing = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!existing) throw new Error("Media not found");

  const updated = await prisma.mediaAsset.update({ where: { id }, data });

  await audit({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "MediaAsset",
    entityId: id,
    oldValue: { alt: existing.alt, title: existing.title, category: existing.category },
    newValue: data,
  });

  await cacheInvalidatePattern("media:*");
  return updated;
}

// ─── Blog Actions ───────────────────────────────────────────────────────────

export async function getBlogPosts(options?: {
  status?: BlogStatus;
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}) {
  const session = await requireAuth();
  const { status, page = 1, limit = 20, category, tag, search } = options ?? {};

  const where: Prisma.BlogPostWhereInput = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (tag) where.tags = { has: tag };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { name: true, email: true } },
        featuredImage: { select: { url: true, alt: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  featuredImageId?: string;
  generatedByAI?: boolean;
}) {
  const session = await requireAuth();

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) throw new Error("A post with this slug already exists");

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      authorId: session.user.id,
      status: "DRAFT",
    },
  });

  await audit({
    userId: session.user.id,
    action: "CREATE",
    entityType: "BlogPost",
    entityId: post.id,
    newValue: { title: post.title, slug: post.slug },
  });

  return post;
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    featuredImageId?: string;
  },
) {
  const session = await requireAuth();

  const post = await prisma.blogPost.update({ where: { id }, data });

  await audit({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "BlogPost",
    entityId: id,
    newValue: data,
  });

  await cacheInvalidatePattern("blog:*");
  return post;
}

export async function publishBlogPost(id: string, publishAt?: string) {
  const session = await requireRole("MANAGER");

  const publishDate = publishAt ? new Date(publishAt) : new Date();
  const status = publishAt && publishDate > new Date() ? "DRAFT" : "PUBLISHED";

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      status,
      publishedAt: publishDate,
    },
  });

  await audit({
    userId: session.user.id,
    action: "PUBLISH",
    entityType: "BlogPost",
    entityId: id,
  });

  await cacheInvalidatePattern("blog:*");
  return post;
}

export async function deleteBlogPost(id: string) {
  const session = await requireRole("MANAGER");

  await prisma.blogPost.delete({ where: { id } });

  await audit({
    userId: session.user.id,
    action: "DELETE",
    entityType: "BlogPost",
    entityId: id,
  });

  await cacheInvalidatePattern("blog:*");
}

// ─── Audit Log Actions ──────────────────────────────────────────────────────

export async function getAuditLogs(options?: {
  page?: number;
  limit?: number;
  entityType?: string;
  userId?: string;
}) {
  const session = await requireRole("MANAGER");
  const { page = 1, limit = 50, entityType, userId } = options ?? {};

  const where: Record<string, unknown> = {};
  if (entityType) where.entityType = entityType;
  if (userId) where.userId = userId;

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

// ─── Settings Actions ───────────────────────────────────────────────────────

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function updateSetting(key: string, value: unknown) {
  const session = await requireRole("MANAGER");

  const old = await prisma.setting.findUnique({ where: { key } });

  await prisma.setting.upsert({
    where: { key },
    update: { value: value as any },
    create: { key, value: value as any },
  });

  await audit({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "Setting",
    entityId: key,
    oldValue: old?.value,
    newValue: value,
  });
}

// ─── User Management ────────────────────────────────────────────────────────

export async function getUsers() {
  await requireRole("MANAGER");

  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
      _count: { select: { blogPosts: true, media: true, auditLogs: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
