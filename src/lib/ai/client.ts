import "server-only";
import { AIProvider, AIProviderConfig } from "../types";

// ─── Multi-Provider AI Client ────────────────────────────────────────────────
// Supports Gemini, Groq, OpenAI, and Anthropic with automatic fallback.
// If the primary provider fails, it cascades to the next available provider.

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
}

const PROVIDER_CONFIGS: Record<AIProvider, { baseUrl: string; defaultModel: string }> = {
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-3.6-flash",
  },
  groq_gen: {
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "openai/gpt-oss-120b",
  },
  groq_verify: {
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "qwen/qwen3.6-27b",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
  },
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-sonnet-4-20250514",
  },
};

// ─── Provider Availability Check ─────────────────────────────────────────────

function getAvailableProviders(): AIProviderConfig[] {
  const providers: AIProviderConfig[] = [];

  const envMap: Record<AIProvider, string> = {
    gemini: "GEMINI_API_KEY",
    groq_gen: "GROQ_API_KEY",
    groq_verify: "GROQ_API_KEY",
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
  };

  for (const [provider, envKey] of Object.entries(envMap)) {
    const apiKey = process.env[envKey];
    if (apiKey) {
      const p = provider as AIProvider;
      providers.push({
        provider: p,
        apiKey,
        model: PROVIDER_CONFIGS[p].defaultModel,
        baseUrl: PROVIDER_CONFIGS[p].baseUrl,
      });
    }
  }

  return providers;
}

// ─── Gemini API Call ─────────────────────────────────────────────────────────

async function callGemini(config: AIProviderConfig, messages: ChatMessage[]): Promise<string> {
  const systemPrompt = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const contents = userMessages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── OpenAI-Compatible API Call (Groq, OpenAI) ──────────────────────────────

async function callOpenAICompatible(config: AIProviderConfig, messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.3,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${config.provider} API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── Anthropic API Call ──────────────────────────────────────────────────────

async function callAnthropic(config: AIProviderConfig, messages: ChatMessage[]): Promise<string> {
  const systemPrompt = messages.find((m) => m.role === "system")?.content || "";
  const userMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch(`${config.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: userMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

// ─── Universal Call with Provider Routing ─────────────────────────────────────

async function callProvider(config: AIProviderConfig, messages: ChatMessage[]): Promise<string> {
  switch (config.provider) {
    case "gemini":
      return callGemini(config, messages);
    case "anthropic":
      return callAnthropic(config, messages);
    case "groq_gen":
    case "groq_verify":
    case "openai":
      return callOpenAICompatible(config, messages);
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

// ─── Multi-Provider Call with Automatic Fallback ─────────────────────────────

export async function callAIWithFallback(
  messages: ChatMessage[],
  preferredOrder?: AIProvider[],
  excludeProvider?: AIProvider
): Promise<AIResponse> {
  const available = getAvailableProviders().filter(
    (p) => p.provider !== excludeProvider
  );

  if (available.length === 0) {
    throw new Error(
      "No AI providers configured. Set at least one of: GEMINI_API_KEY, GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY"
    );
  }

  // Sort by preferred order if specified
  const ordered = preferredOrder
    ? [
        ...available.filter((p) => preferredOrder.includes(p.provider)).sort(
          (a, b) => preferredOrder.indexOf(a.provider) - preferredOrder.indexOf(b.provider)
        ),
        ...available.filter((p) => !preferredOrder.includes(p.provider)),
      ]
    : available;

  const errors: string[] = [];

  for (const config of ordered) {
    try {
      console.log(`[AI] Trying ${config.provider} (${config.model})...`);
      const content = await callProvider(config, messages);
      console.log(`[AI] ✓ ${config.provider} succeeded`);
      return { content, provider: config.provider, model: config.model };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[AI] ✗ ${config.provider} failed: ${msg}`);
      errors.push(`${config.provider}: ${msg}`);
    }
  }

  throw new Error(
    `All AI providers failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
  );
}

// ─── Specialized Calls ───────────────────────────────────────────────────────

/** Call for question GENERATION — prefers Gemini, falls back to others */
export async function callForGeneration(messages: ChatMessage[]): Promise<AIResponse> {
  return callAIWithFallback(messages, ["groq_gen", "gemini", "openai", "anthropic", "groq_verify"]);
}

/**
 * Call for question VERIFICATION — prefers a DIFFERENT provider than generation.
 * This ensures cross-model verification as required by the README.
 */
export async function callForVerification(
  messages: ChatMessage[],
  generationProvider: AIProvider
): Promise<AIResponse> {
  // Prefer providers that are different from the generation provider
  const verificationOrder: AIProvider[] = ["groq_verify", "openai", "anthropic", "gemini", "groq_gen"].filter(
    (p) => p !== generationProvider
  ) as AIProvider[];

  // Add the generation provider last as a final fallback
  verificationOrder.push(generationProvider);

  return callAIWithFallback(messages, verificationOrder);
}

export { getAvailableProviders };
export type { ChatMessage, AIResponse };
