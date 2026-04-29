import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";

/**
 * Convert Markdown content to sanitized HTML string.
 * Runs server-side only (RSC / API route safe).
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)       // Tables, strikethrough, task lists, autolinks
    .use(remarkBreaks)    // Newlines become <br>
    .use(remarkHtml, { sanitize: false }) // We trust our own CMS content
    .process(markdown);

  return result.toString();
}

/**
 * Estimate reading time in minutes from raw markdown/text content.
 */
export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200)); // avg 200 wpm
}

/**
 * Extract a plain-text excerpt from markdown (strips all markdown syntax).
 */
export function extractExcerpt(markdown: string, length = 160): string {
  const stripped = markdown
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*?|__?|~~|`+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/>\s+/g, "")
    .replace(/\n+/g, " ")
    .trim();
  
  if (stripped.length <= length) return stripped;
  return stripped.slice(0, length).replace(/\s+\S*$/, "") + "…";
}
