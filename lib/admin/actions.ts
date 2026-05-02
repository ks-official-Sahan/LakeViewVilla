"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/rbac";
import { auth } from "@/lib/auth/config";
import { audit } from "@/lib/admin/audit";
import { cacheInvalidatePattern } from "@/lib/cache";
import {
  bumpBlogAndSitemapCache,
  bumpMediaAndGalleryCache,
} from "@/lib/cache/tags";
import { uploadToCloudinary, deleteFromCloudinary, validateFile } from "@/lib/admin/upload";
import type { MediaType, BlogStatus, Prisma } from "@prisma/client";
import { generateSEOMeta } from "@/lib/ai/seo-generator";

function optionalStr(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

function normalizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdownPreview(md: string, maxLen: number): string {
  const plain = md
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/^#+\s+.*/gm, "")
    .replace(/[*_`#\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.slice(0, maxLen);
}

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
  bumpMediaAndGalleryCache();
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
  bumpMediaAndGalleryCache();
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
  bumpMediaAndGalleryCache();
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
  const tagFilter =
    tag || (category && category !== "All" ? category : undefined);
  if (tagFilter) where.tags = { has: tagFilter };
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

export async function createBlogPost(raw: Record<string, unknown>) {
  const session = await requireAuth();

  const title = String(raw.title ?? "").trim();
  const slug = normalizeSlug(String(raw.slug ?? ""));
  const content = String(raw.content ?? "");

  if (!title || !slug || !content) {
    throw new Error("Title, slug, and content are required.");
  }

  const publishAtRaw =
    typeof raw.publishAt === "string" ? raw.publishAt.trim() : "";

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) throw new Error("A post with this slug already exists");

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt: optionalStr(raw.excerpt) ?? null,
      tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
      seoTitle: optionalStr(raw.seoTitle) ?? null,
      seoDescription: optionalStr(raw.seoDescription) ?? null,
      featuredImageId: optionalStr(raw.featuredImageId) ?? null,
      generatedByAI: Boolean(raw.generatedByAI),
      authorId: session.user.id,
      status: "DRAFT",
      publishedAt: publishAtRaw ? new Date(publishAtRaw) : null,
    },
  });

  await audit({
    userId: session.user.id,
    action: "CREATE",
    entityType: "BlogPost",
    entityId: post.id,
    newValue: { title: post.title, slug: post.slug },
  });

  bumpBlogAndSitemapCache();
  return post;
}

export async function updateBlogPost(id: string, raw: Record<string, unknown>) {
  const session = await requireAuth();

  const data: Prisma.BlogPostUpdateInput = {};

  if (typeof raw.title === "string") data.title = raw.title.trim();
  if (typeof raw.slug === "string") data.slug = normalizeSlug(raw.slug);
  if (typeof raw.content === "string") data.content = raw.content;
  if (raw.excerpt !== undefined) {
    data.excerpt = optionalStr(raw.excerpt) ?? null;
  }
  if (Array.isArray(raw.tags)) data.tags = raw.tags as string[];
  if (raw.seoTitle !== undefined) data.seoTitle = optionalStr(raw.seoTitle) ?? null;
  if (raw.seoDescription !== undefined) {
    data.seoDescription = optionalStr(raw.seoDescription) ?? null;
  }
  if (Array.isArray(raw.seoKeywords)) data.seoKeywords = raw.seoKeywords as string[];
  if (raw.featuredImageId !== undefined) {
    const fid = optionalStr(raw.featuredImageId);
    data.featuredImage = fid
      ? { connect: { id: fid } }
      : { disconnect: true };
  }

  if (raw.status === "DRAFT" || raw.status === "PUBLISHED" || raw.status === "ARCHIVED") {
    data.status = raw.status;
  }

  const publishAtRaw =
    typeof raw.publishAt === "string" ? raw.publishAt.trim() : "";
  if (publishAtRaw) {
    data.publishedAt = new Date(publishAtRaw);
  }

  const post = await prisma.blogPost.update({ where: { id }, data });

  await audit({
    userId: session.user.id,
    action: "UPDATE",
    entityType: "BlogPost",
    entityId: id,
    newValue: data as Record<string, unknown>,
  });

  await cacheInvalidatePattern("blog:*");
  bumpBlogAndSitemapCache();
  return post;
}

/** Fill excerpt + SEO from title/content via AI with offline fallback. */
export async function enrichBlogPostSeo(id: string) {
  await requireAuth();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  const fallbackExcerpt = stripMarkdownPreview(post.content, 280);
  try {
    const seo = await generateSEOMeta({
      title: post.title,
      content: post.content.slice(0, 4000),
    });

    const data: Prisma.BlogPostUpdateInput = {
      seoTitle: seo.title || post.title.slice(0, 60),
      seoDescription: seo.description || fallbackExcerpt.slice(0, 160),
    };
    if (!post.excerpt?.trim()) data.excerpt = fallbackExcerpt || null;
    if (seo.keywords?.length) data.seoKeywords = seo.keywords;

    const updated = await prisma.blogPost.update({ where: { id }, data });
    await cacheInvalidatePattern("blog:*");
    bumpBlogAndSitemapCache();
    return updated;
  } catch {
    const data: Prisma.BlogPostUpdateInput = {
      seoTitle: post.title.slice(0, 60),
      seoDescription: fallbackExcerpt.slice(0, 160),
    };
    if (!post.excerpt?.trim()) data.excerpt = fallbackExcerpt || null;
    const updated = await prisma.blogPost.update({ where: { id }, data });
    await cacheInvalidatePattern("blog:*");
    bumpBlogAndSitemapCache();
    return updated;
  }
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
  bumpBlogAndSitemapCache();
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
  bumpBlogAndSitemapCache();
}

// ─── Audit Log Actions ──────────────────────────────────────────────────────

export async function getAuditLogs(options?: {
  page?: number;
  limit?: number;
  entityType?: string;
  userId?: string;
}) {
  const session = await requireRole("DEVELOPER");
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
