import { requireRole } from "@/lib/auth/rbac";
import { iterateOpenRouterChatStream } from "@/lib/ai/openrouter-stream";
import {
  blogGenerationSystemPrompt,
  buildBlogGenerationUserMessage,
  parseGeneratedBlog,
} from "@/lib/ai/blog-generate-shared";

export async function POST(req: Request) {
  try {
    await requireRole("EDITOR");
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OpenRouter API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const tone = typeof body.tone === "string" ? body.tone : "professional";
  const length = typeof body.length === "string" ? body.length : "medium";
  const imageDescription =
    typeof body.imageDescription === "string" ? body.imageDescription : "";
  const featuredImageUrl =
    typeof body.featuredImageUrl === "string" ? body.featuredImageUrl : "";

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const sse = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      try {
        const userContent = buildBlogGenerationUserMessage({
          prompt,
          imageDescription,
          featuredImageUrl,
        });
        const systemContent = blogGenerationSystemPrompt(tone, length);

        let full = "";
        let usedModel = "";

        for await (const ev of iterateOpenRouterChatStream(apiKey, {
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent },
          ],
          temperature: 0.75,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        })) {
          if (ev.kind === "delta") {
            full += ev.text;
            send({ type: "delta", text: ev.text });
          } else if (ev.kind === "complete") {
            full = ev.raw;
            usedModel = ev.model;
          } else if (ev.kind === "error") {
            send({
              type: "error",
              message: ev.message,
              ...(ev.detail ? { detail: ev.detail } : {}),
              ...(ev.providerHint ? { providerHint: ev.providerHint } : {}),
            });
            controller.close();
            return;
          }
        }

        const parsed = parseGeneratedBlog(full.trim());
        if (!parsed) {
          send({
            type: "error",
            message: "AI returned invalid blog JSON",
            detail: full.slice(0, 280),
          });
        } else {
          send({ type: "done", ...parsed, model: usedModel });
        }
      } catch (e) {
        console.error("Blog stream error:", e);
        send({
          type: "error",
          message: "Internal Server Error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
