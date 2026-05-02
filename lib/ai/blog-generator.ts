import { z } from "zod";

export const BlogGenerationInputSchema = z.object({
  title: z.string().min(5).max(200),
  imageDescription: z.string().optional(),
  keywords: z.array(z.string()).max(10).optional(),
  tone: z.enum(["informative", "storytelling", "promotional"]).default("storytelling"),
  wordCount: z.number().min(300).max(2000).default(800),
  category: z.string().optional(),
});

export type BlogGenerationInput = z.infer<typeof BlogGenerationInputSchema>;

export interface BlogGenerationOutput {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  readingTimeMinutes: number;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "meta-llama/llama-3.1-8b-instruct:free";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com";
const SITE_NAME = "Lake View Villa Tangalle";

// Simple in-memory rate limiter
const _log: number[] = [];
function checkRateLimit() {
  const now = Date.now();
  const cutoff = now - 60_000;
  while (_log.length && _log[0] < cutoff) _log.shift();
  if (_log.length >= 5) throw new Error("Rate limit: max 5 AI generations per minute.");
  _log.push(now);
}

function readingTime(content: string) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

export async function generateBlogPost(input: BlogGenerationInput): Promise<BlogGenerationOutput> {
  const data = BlogGenerationInputSchema.parse(input);
  checkRateLimit();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set.");

  const system = `You are a luxury travel writer for ${SITE_NAME} — a private villa on Tangalle Lagoon, Sri Lanka. Write in a warm, evocative, premium tone. Return ONLY valid JSON, no markdown fences.`;

  const user = `Write a ${data.tone} blog post.\nTitle: "${data.title}"\n${data.imageDescription ? `Scene: ${data.imageDescription}\n` : ""}${data.keywords?.length ? `Keywords: ${data.keywords.join(", ")}\n` : ""}Target ~${data.wordCount} words.\n\nReturn JSON: { "title": string, "excerpt": string, "content": string (Markdown), "tags": string[], "seoTitle": string (max 60), "seoDescription": string (max 160) }`;

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_NAME,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response.");

  let result: Omit<BlogGenerationOutput, "readingTimeMinutes">;
  try { result = JSON.parse(raw); }
  catch { throw new Error(`Could not parse AI JSON: ${raw.slice(0, 200)}`); }

  const content = result.content ?? "";

  return {
    title: result.title ?? data.title,
    excerpt: result.excerpt ?? "",
    content,
    tags: Array.isArray(result.tags) ? result.tags.slice(0, 10) : [],
    seoTitle: (result.seoTitle ?? data.title).slice(0, 60),
    seoDescription: (result.seoDescription ?? result.excerpt ?? "").slice(0, 160),
    readingTimeMinutes: readingTime(content),
  };
}
