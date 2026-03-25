// LLM Service — OpenRouter integration with streaming support

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEFAULT_CONFIG: LLMConfig = {
  apiKey: '',
  baseUrl: 'https://openrouter.ai/api/v1',
  model: 'google/gemini-2.5-flash-preview:thinking',
};

export function getConfig(): LLMConfig {
  try {
    const saved = localStorage.getItem('dj-llm-config');
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<LLMConfig>;
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_CONFIG };
}

export function saveConfig(config: Partial<LLMConfig>): void {
  const current = getConfig();
  const merged = { ...current, ...config };
  localStorage.setItem('dj-llm-config', JSON.stringify(merged));
}

export function isConfigured(): boolean {
  const config = getConfig();
  return config.apiKey.length > 0;
}

/** Stream chat completion from OpenRouter-compatible API */
export async function* streamChat(
  messages: ChatMessage[],
  config?: Partial<LLMConfig>,
  signal?: AbortSignal,
): AsyncGenerator<string, void, undefined> {
  const cfg = { ...getConfig(), ...config };

  if (!cfg.apiKey) {
    throw new Error('API key not configured. Please set your OpenRouter API key in Settings.');
  }

  const response = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Digital Jensen',
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

/** Non-streaming fallback */
export async function chat(
  messages: ChatMessage[],
  config?: Partial<LLMConfig>,
): Promise<string> {
  let result = '';
  for await (const chunk of streamChat(messages, config)) {
    result += chunk;
  }
  return result;
}
