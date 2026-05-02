import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";
import { openRouterChatCompletion } from "@/lib/ai/openrouter-chat";

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
Your task is to write an engaging, SEO-optimized blog post based on the user's prompt.
Tone: ${tone}. Length: ${length}.
Output FORMAT: Raw Markdown ONLY. No conversational text, no explanations. 
Include a frontmatter block at the top with:
---
title: "Generated Title"
excerpt: "A short 2-sentence summary"
---

Then provide the content using proper markdown headings (##, ###), bullet points, and formatting.`;

    const result = await openRouterChatCompletion(apiKey, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.75,
      max_tokens: 4096,
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

    return NextResponse.json({ content: result.content, model: result.model });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
