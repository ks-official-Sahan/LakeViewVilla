import { updateTag } from "next/cache";

/** Next.js cache tags — assign with `cacheTag()` inside `'use cache'` (or `fetch` `next.tags`); invalidate from mutations via `updateTag()`. */
export const TAG_BLOG = "blog";
export const TAG_MEDIA = "media";
export const TAG_GALLERY = "gallery";
export const TAG_SITEMAP = "sitemap";

export function contentTag(pageSlug: string): string {
  return `content:${pageSlug}`;
}

export function bumpBlogAndSitemapCache(): void {
  updateTag(TAG_BLOG);
  updateTag(TAG_SITEMAP);
}

export function bumpMediaAndGalleryCache(): void {
  updateTag(TAG_MEDIA);
  updateTag(TAG_GALLERY);
}

export function bumpContentPageCache(pageSlug: string): void {
  updateTag(contentTag(pageSlug));
}
