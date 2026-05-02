import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { openRouterChatCompletion } from "@/lib/ai/openrouter-chat";

type GeneratedBlogPayload = {
  title: string;
  excerpt: string;
  content: string;
};

function parseGeneratedBlog(raw: string): GeneratedBlogPayload | null {
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

export async function POST(req: Request) {
  try {
    await requireRole("EDITOR");

    const { prompt, tone = "professional", length = "medium" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const systemPrompt = `You are a professional copywriter for LakeViewVilla, a luxury private villa in Tangalle, Sri Lanka.
Write an engaging, SEO-optimized blog post from the user's prompt.
Tone: ${tone}. Length: ${length}.

Return ONLY valid JSON (no markdown code fences, no prose) with exactly these keys:
- "title": string, concise headline
- "excerpt": string, 2 sentences max for listings
- "content": string, full post body in Markdown only (use ## and ### headings, lists where appropriate). No YAML frontmatter inside this string.`;

    const result = await openRouterChatCompletion(apiKey, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.75,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    if (!result.ok) {
      console.error("OpenRouter Error:", result.detail ?? result.userMessage);
      return NextResponse.json(
        {
          error: result.userMessage,
          ...(result.detail ? { detail: result.detail } : {}),
        },
        { status: result.status },
      );
    }

    const parsed = parseGeneratedBlog(result.content);
    if (!parsed) {
      return NextResponse.json(
        { error: "AI returned invalid blog JSON", detail: result.content.slice(0, 200) },
        { status: 502 },
      );
    }

    return NextResponse.json({ ...parsed, model: result.model });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
