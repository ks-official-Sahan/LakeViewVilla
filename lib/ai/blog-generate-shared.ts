export type GeneratedBlogPayload = {
  title: string;
  excerpt: string;
  content: string;
};

export function blogGenerationSystemPrompt(tone: string, length: string): string {
  return `You are a professional copywriter for LakeViewVilla, a luxury private villa in Tangalle, Sri Lanka.
Write an engaging, SEO-optimized blog post from the user's prompt.
Tone: ${tone}. Length: ${length}.

Return ONLY valid JSON (no markdown code fences, no prose) with exactly these keys:
- "title": string, concise headline
- "excerpt": string, 2 sentences max for listings
- "content": string, full post body in Markdown only (use ## and ### headings, lists where appropriate). No YAML frontmatter inside this string.`;
}

export function buildBlogGenerationUserMessage(input: {
  prompt: string;
  imageDescription?: string;
  featuredImageUrl?: string;
}): string {
  const chunks = [input.prompt.trim()];
  if (input.imageDescription?.trim()) {
    chunks.push(
      `Featured image / scene context (weave into the story only where natural): ${input.imageDescription.trim()}`,
    );
  }
  if (input.featuredImageUrl?.trim()) {
    chunks.push(
      `Hero image URL for editorial context only — do not paste raw URLs into the article unless editorially necessary: ${input.featuredImageUrl.trim()}`,
    );
  }
  return chunks.join("\n\n");
}

export function parseGeneratedBlog(raw: string): GeneratedBlogPayload | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const j = JSON.parse(trimmed) as Record<string, unknown>;
    const title = typeof j.title === "string" ? j.title.trim() : "";
    const excerpt = typeof j.excerpt === "string" ? j.excerpt.trim() : "";
    const content =
      typeof j.content === "string"
        ? j.content.trim()
        : typeof j.markdown === "string"
          ? j.markdown.trim()
          : typeof j.body === "string"
            ? j.body.trim()
            : "";
    if (!title || !content) return null;
    return { title, excerpt, content };
  } catch {
    return null;
  }
}
