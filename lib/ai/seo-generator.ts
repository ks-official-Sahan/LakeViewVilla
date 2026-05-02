import { openRouterChatCompletion } from "@/lib/ai/openrouter-chat";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";
const SITE_NAME = "Lake View Villa Tangalle";

export interface SEOMetadata {
  title: string;       // max 60 chars
  description: string; // max 160 chars
  keywords: string[];  // 5–10 keywords
  altText?: string;    // for image
}

async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set.");

  const result = await openRouterChatCompletion(apiKey, {
    messages: [
      {
        role: "system",
        content: `You are an SEO expert for ${SITE_NAME}, a luxury private villa in Tangalle, Sri Lanka. Return ONLY valid JSON, no markdown fences.`,
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  if (!result.ok) {
    throw new Error(result.detail ? `${result.userMessage}: ${result.detail}` : result.userMessage);
  }

  return result.content;
}

/** Generate SEO metadata from blog post content */
export async function generateSEOMeta(opts: {
  title: string;
  content: string;
  category?: string;
}): Promise<SEOMetadata> {
  const prompt = `Given this blog post title and excerpt, generate SEO metadata.
Title: "${opts.title}"
Content preview: "${opts.content.slice(0, 500)}"
${opts.category ? `Category: ${opts.category}` : ""}

Return JSON: { "title": string (max 60 chars), "description": string (max 160 chars), "keywords": string[] (5-8 terms) }`;

  const raw = await callAI(prompt);
  try {
    const parsed = JSON.parse(raw);
    return {
      title: String(parsed.title ?? opts.title).slice(0, 60),
      description: String(parsed.description ?? "").slice(0, 160),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : [],
    };
  } catch {
    return { title: opts.title.slice(0, 60), description: "", keywords: [] };
  }
}

/** Generate alt text for an image given context */
export async function generateAltText(opts: {
  imageUrl: string;
  context?: string;
}): Promise<string> {
  const prompt = `Generate concise, descriptive alt text for an image from ${SITE_NAME}.
${opts.context ? `Context: ${opts.context}` : ""}
Image URL (for reference only, do not describe the URL itself): ${opts.imageUrl}

Return JSON: { "altText": string (max 125 chars, descriptive and natural) }`;

  const raw = await callAI(prompt);
  try {
    const parsed = JSON.parse(raw);
    return String(parsed.altText ?? "Lake View Villa Tangalle, Sri Lanka").slice(0, 125);
  } catch {
    return "Lake View Villa Tangalle, Tangalle Lagoon, Sri Lanka";
  }
}

/** Extract keywords from text */
export async function extractKeywords(text: string): Promise<string[]> {
  const prompt = `Extract 5-8 SEO keywords from this text about a luxury villa in Sri Lanka:
"${text.slice(0, 600)}"

Return JSON: { "keywords": string[] }`;

  const raw = await callAI(prompt);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 10) : [];
  } catch {
    return ["Lake View Villa", "Tangalle", "Sri Lanka", "luxury villa", "lagoon"];
  }
}
