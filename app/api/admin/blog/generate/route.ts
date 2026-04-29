import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/rbac";

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://lakeviewvillatangalle.com",
        "X-Title": "LakeViewVilla CMS",
      },
      body: JSON.stringify({
        // model: "mistralai/mistral-7b-instruct",
        // model: "google/gemini-3-pro-preview",
        model: "qwen/qwen3-coder:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter Error:", err);
      return NextResponse.json({ error: "Failed to generate content from AI provider" }, { status: 502 });
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ content: generatedText });

  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
