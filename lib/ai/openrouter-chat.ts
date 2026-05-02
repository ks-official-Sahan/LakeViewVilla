/**
 * OpenRouter chat completions with model fallbacks when free tiers hit upstream 429s.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Instruct/chat models suitable for blog copy — avoid code-only models here. */
const DEFAULT_FALLBACK_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
] as const;

export type OpenRouterMessage = { role: "system" | "user" | "assistant"; content: string };

export interface OpenRouterChatOptions {
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
}

function modelChain(): string[] {
  const env = process.env.OPENROUTER_MODEL?.trim();
  const chain = [env, ...DEFAULT_FALLBACK_MODELS].filter((m): m is string => Boolean(m));
  return [...new Set(chain)];
}

function parseOpenRouterError(text: string): {
  code?: number;
  message?: string;
  raw?: string;
} {
  try {
    const j = JSON.parse(text) as {
      error?: { message?: string; code?: number; metadata?: { raw?: string } };
    };
    return {
      code: j.error?.code,
      message: j.error?.message,
      raw: j.error?.metadata?.raw,
    };
  } catch {
    return {};
  }
}

function isRetryable(status: number, errorCode?: number): boolean {
  if (status === 429 || status === 503) return true;
  if (errorCode === 429) return true;
  return false;
}

/**
 * Tries each model in order until one succeeds or a non-retryable error occurs.
 */
export async function openRouterChatCompletion(
  apiKey: string,
  options: OpenRouterChatOptions,
  extraBody?: Record<string, unknown>,
): Promise<
  | { ok: true; content: string; model: string }
  | {
      ok: false;
      status: number;
      userMessage: string;
      detail?: string;
      providerHint?: string;
    }
> {
  const models = modelChain();
  let lastText = "";
  let lastStatus = 502;
  let lastParsed: ReturnType<typeof parseOpenRouterError> = {};

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
        ...extraBody,
      }),
    });

    const text = await res.text();
    lastText = text;
    lastStatus = res.status;
    lastParsed = parseOpenRouterError(text);

    if (res.ok) {
      try {
        const data = JSON.parse(text) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content ?? "";
        return { ok: true, content, model };
      } catch {
        return {
          ok: false,
          status: 502,
          userMessage: "Invalid response from AI provider",
          detail: text.slice(0, 300),
        };
      }
    }

    const canTryNext =
      isRetryable(res.status, lastParsed.code) && i < models.length - 1;
    if (canTryNext) {
      console.warn(
        `[OpenRouter] model ${model} failed (${res.status}, code ${lastParsed.code ?? "n/a"}), trying next model…`,
      );
      continue;
    }

    break;
  }

  const is429 =
    lastStatus === 429 ||
    lastParsed.code === 429 ||
    (lastParsed.raw?.toLowerCase().includes("rate-limit") ?? false);

  if (is429) {
    return {
      ok: false,
      status: 429,
      userMessage:
        "The free AI tier is temporarily rate-limited. Wait a minute and retry, set OPENROUTER_MODEL to another :free model, or add credits / BYOK at openrouter.ai/settings.",
      detail: lastParsed.raw ?? lastParsed.message ?? lastText.slice(0, 400),
      providerHint: "rate_limit",
    };
  }

  return {
    ok: false,
    status: lastStatus >= 400 && lastStatus < 600 ? lastStatus : 502,
    userMessage: "Failed to generate content from AI provider",
    detail: lastParsed.message ?? lastText.slice(0, 400),
  };
}
