import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { MetadataRoute } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { TAG_BLOG, TAG_SITEMAP } from "@/lib/cache/tags";

export type BlogListPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: Date | null;
  generatedByAI: boolean;
  tags: string[];
  featuredImage: { url: string; alt: string | null } | null;
  author: { name: string | null };
};

export type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
  featuredImage: { url: string; alt: string | null } | null;
};

/** Aligns with CMS: posts use `tags[]` only (no separate category column). */
function buildPublishedWhere(
  category: string,
  tag: string,
  q: string,
): Prisma.BlogPostWhereInput {
  const andParts: Prisma.BlogPostWhereInput[] = [{ status: "PUBLISHED" }];
  if (category !== "All") andParts.push({ tags: { has: category } });
  if (tag) andParts.push({ tags: { has: tag } });
  const trimmed = q.trim();
  if (trimmed) {
    andParts.push({
      OR: [
        { title: { contains: trimmed, mode: "insensitive" } },
        { content: { contains: trimmed, mode: "insensitive" } },
        { excerpt: { contains: trimmed, mode: "insensitive" } },
        { tags: { has: trimmed } },
      ],
    });
  }
  return andParts.length === 1 ? andParts[0]! : { AND: andParts };
}

export async function getCachedBlogListPage(
  page: number,
  category: string,
  tag: string,
  q: string,
  limit: number,
): Promise<{ posts: BlogListPost[]; total: number }> {
  "use cache";
  cacheLife("blogList");
  cacheTag(TAG_BLOG);

  const where = buildPublishedWhere(category, tag, q);
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        generatedByAI: true,
        tags: true,
        featuredImage: { select: { url: true, alt: true } },
        author: { select: { name: true } },
      },
      skip: Math.max(0, page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);
  return { posts: items as BlogListPost[], total };
}

export async function getCachedBlogPostMeta(slug: string) {
  "use cache";
  cacheLife("blogPost");
  cacheTag(TAG_BLOG);

  return prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
      ogImage: true,
      featuredImage: { select: { url: true } },
    },
  });
}

export async function getCachedBlogPostFull(slug: string) {
  "use cache";
  cacheLife("blogPost");
  cacheTag(TAG_BLOG);

  return prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      featuredImage: { select: { url: true, alt: true } },
    },
  });
}

export async function getCachedRelatedPosts(
  currentId: string,
  tagsKey: string,
): Promise<RelatedPost[]> {
  "use cache";
  cacheLife("blogPost");
  cacheTag(TAG_BLOG);

  const tags = tagsKey ? tagsKey.split("|").filter(Boolean) : [];
  if (tags.length === 0) {
    return prisma.blogPost.findMany({
      where: { status: "PUBLISHED", id: { not: currentId } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        featuredImage: { select: { url: true, alt: true } },
      },
    });
  }
  return prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: currentId },
      tags: { hasSome: tags },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
      featuredImage: { select: { url: true, alt: true } },
    },
  });
}

export function relatedPostsTagsKey(tags: string[]): string {
  return [...tags].sort().join("|");
}

/** Blog URLs for sitemap — tagged for `updateTag(TAG_BLOG)` / `updateTag(TAG_SITEMAP)`. */
export async function getCachedBlogSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("blogSitemap");
  cacheTag(TAG_BLOG);
  cacheTag(TAG_SITEMAP);

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    "https://lakeviewvillatangalle.com";

  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  return posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}
