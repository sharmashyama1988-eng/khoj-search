// ─────────────────────────────────────────────────────────────────────────────
// OPENROUTER MULTI-KEY FAILOVER & ROUND-ROBIN POOL MANAGER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dynamically extracts all configured OpenRouter API keys from environment variables.
 * Supports multiple standard naming formats:
 * - OPENROUTER_API_KEY (single key or comma/semicolon/newline-separated list of keys)
 * - OPENROUTER_API_KEYS (comma/semicolon/newline-separated list of keys)
 * - OPENROUTER_API_KEY_1, OPENROUTER_API_KEY_2, OPENROUTER_API_KEY_3, OPENROUTER_API_KEY_4, OPENROUTER_API_KEY_5
 * - OPENROUTER_KEY, OPENROUTER_KEY_2
 */
export function getOpenRouterKeyPool(): string[] {
  const keys: string[] = [];

  const addKey = (val?: string) => {
    if (!val) return;
    const parts = val
      .split(/[,\s;\n\r]+/)
      .map((k) => k.trim())
      .filter((k) => k.startsWith('sk-or-') && k.length > 20);
    keys.push(...parts);
  };

  // Primary & secondary environment variables
  addKey(process.env.OPENROUTER_API_KEY);
  addKey(process.env.OPENROUTER_API_KEYS);
  addKey(process.env.OPENROUTER_API_KEY_1);
  addKey(process.env.OPENROUTER_API_KEY_2);
  addKey(process.env.OPENROUTER_API_KEY_3);
  addKey(process.env.OPENROUTER_API_KEY_4);
  addKey(process.env.OPENROUTER_API_KEY_5);
  addKey(process.env.OPENROUTER_KEY);
  addKey(process.env.OPENROUTER_KEY_2);

  // Deduplicate keys
  return Array.from(new Set(keys));
}

let activeKeyIndex = 0;

export interface OpenRouterChatPayload {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  max_tokens?: number;
  temperature?: number;
}

export interface OpenRouterChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string; code?: number };
}

/**
 * Executes an OpenRouter API request with automatic rate-limit failover across all keys.
 * If Key 1 exhausts its rate limit (HTTP 429 / 402 / 401), it instantly fails over to Key 2,
 * Key 3, and loops through the active pool seamlessly.
 */
export async function fetchOpenRouterChat(
  payload: OpenRouterChatPayload,
  timeoutMs: number = 6000
): Promise<{ data: OpenRouterChatResponse | null; usedKeyMasked: string; model: string }> {
  const pool = getOpenRouterKeyPool();
  if (pool.length === 0) {
    return { data: null, usedKeyMasked: 'None', model: payload.model };
  }

  const attemptsCount = pool.length;

  for (let attempt = 0; attempt < attemptsCount; attempt++) {
    // Current key in round-robin loop
    const keyIdx = (activeKeyIndex + attempt) % pool.length;
    const currentKey = pool[keyIdx];
    const maskedKey = `${currentKey.slice(0, 12)}...${currentKey.slice(-6)}`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://khoj-dun.vercel.app',
          'X-Title': 'Khoj Search Engine',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Handle Quota/Rate Exhaustion (429 = Rate Limit, 402 = Insufficient Balance, 401 = Expired/Invalid)
      if (res.status === 429 || res.status === 402 || res.status === 401) {
        console.warn(`[OpenRouter Key Pool] Key ${maskedKey} returned HTTP ${res.status}. Switching to next key in pool...`);
        continue; // Immediately fail over to next key
      }

      if (res.ok) {
        const json = (await res.json()) as OpenRouterChatResponse;
        if (json && json.choices && json.choices.length > 0) {
          // Advance index for next call to distribute load evenly
          activeKeyIndex = (keyIdx + 1) % pool.length;
          return { data: json, usedKeyMasked: maskedKey, model: payload.model };
        }
      }
    } catch {
      console.warn(`[OpenRouter Key Pool] Key ${maskedKey} connection timed out/failed. Switching to next key...`);
    }
  }

  return { data: null, usedKeyMasked: 'Exhausted', model: payload.model };
}