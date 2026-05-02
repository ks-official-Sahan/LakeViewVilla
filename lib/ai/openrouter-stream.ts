import {
  OPENROUTER_URL,
  modelChain,
  isRetryableOpenRouterError,
  parseOpenRouterError,
  type OpenRouterChatOptions,
} from "@/lib/ai/openrouter-chat";

export type StreamYield =
  | { kind: "delta"; text: string }
  | { kind: "complete"; raw: string; model: string }
  | {
      kind: "error";
      status: number;
      message: string;
      detail?: string;
      providerHint?: string;
    };

/**
 * Streams assistant deltas from OpenRouter (SSE). Tries `modelChain()` fallbacks on retryable errors.
 */
export async function* iterateOpenRouterChatStream(
  apiKey: string,
  options: OpenRouterChatOptions,
): AsyncGenerator<StreamYield, void, undefined> {
  const models = modelChain();

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakeviewvillatangalle.com",
        "X-Title": "LakeViewVilla CMS",
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        ...(options.max_tokens != null ? { max_tokens: options.max_tokens } : {}),
        ...(options.response_format ? { response_format: options.response_format } : {}),
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text();
      const parsed = parseOpenRouterError(text);
      const canTryNext =
        isRetryableOpenRouterError(res.status, parsed.code) && i < models.length - 1;
      if (canTryNext) {
        console.warn(
          `[OpenRouter stream] model ${model} failed (${res.status}), trying next…`,
        );
        continue;
      }

      const is429 =
        res.status === 429 ||
        parsed.code === 429 ||
        (parsed.raw?.toLowerCase().includes("rate-limit") ?? false);

      yield {
        kind: "error",
        status: is429 ? 429 : res.status >= 400 && res.status < 600 ? res.status : 502,
        message: is429
          ? "The free AI tier is temporarily rate-limited. Wait and retry or configure OPENROUTER_MODEL."
          : "Failed to generate content from AI provider",
        detail: parsed.raw ?? parsed.message ?? text.slice(0, 400),
        ...(is429 ? { providerHint: "rate_limit" as const } : {}),
      };
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as {
              choices?: { delta?: { content?: string } }[];
            };
            const piece = json.choices?.[0]?.delta?.content;
            if (piece) {
              full += piece;
              yield { kind: "delta", text: piece };
            }
          } catch {
            /* ignore malformed SSE frames */
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield { kind: "complete", raw: full, model };
    return;
  }

  yield {
    kind: "error",
    status: 502,
    message: "Failed to generate content from AI provider",
    detail: "No models succeeded",
  };
}
