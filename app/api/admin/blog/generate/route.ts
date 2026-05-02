import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { openRouterChatCompletion } from "@/lib/ai/openrouter-chat";
import {
  blogGenerationSystemPrompt,
  buildBlogGenerationUserMessage,
  parseGeneratedBlog,
} from "@/lib/ai/blog-generate-shared";

export async function POST(req: Request) {
  try {
    await requireRole("EDITOR");

    const json = await req.json();
    const prompt = typeof json.prompt === "string" ? json.prompt : "";
    const tone = typeof json.tone === "string" ? json.tone : "professional";
    const length = typeof json.length === "string" ? json.length : "medium";
    const imageDescription =
      typeof json.imageDescription === "string" ? json.imageDescription : "";
    const featuredImageUrl =
      typeof json.featuredImageUrl === "string" ? json.featuredImageUrl : "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const systemPrompt = blogGenerationSystemPrompt(tone, length);
    const userMessage = buildBlogGenerationUserMessage({
      prompt,
      imageDescription,
      featuredImageUrl,
    });

    const result = await openRouterChatCompletion(apiKey, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
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
