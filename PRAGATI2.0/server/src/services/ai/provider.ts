import { IAIProvider, AIProviderConfig } from './types.js';

/**
 * Strips markdown code fence blocks if the model wrapped JSON output in ```json ... ```
 */
function cleanJsonText(raw: string): string {
  let text = raw.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return text.trim();
}

/**
 * Google Gemini Provider using official Generative Language REST API
 */
export class GeminiProvider implements IAIProvider {
  name = 'Gemini';
  model: string;
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-3.6-flash';
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    this.timeoutMs = config.timeoutMs || 20000;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.includes('your_'));
  }

  async generateStructuredCompletion<T>(prompt: string, systemInstruction?: string): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured or contains placeholder value.');
    }

    const candidateModels = Array.from(new Set([this.model, 'gemini-3.6-flash', 'gemini-3.5-flash']));
    let lastError: any = null;

    for (const modelName of candidateModels) {
      const endpoint = `${this.baseUrl}/models/${modelName}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      const body: any = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.15,
          topP: 0.95
        }
      };

      if (systemInstruction) {
        body.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey
          },
          body: JSON.stringify(body),
          signal: controller.signal
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastError = new Error(`Gemini API error (${modelName}) [${response.status}]: ${errorText.substring(0, 300)}`);
          if (response.status === 503 || response.status === 404) {
            continue;
          }
          throw lastError;
        }

        const result = await response.json();
        const candidateText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidateText) {
          throw new Error('Gemini response did not contain text content.');
        }

        const cleaned = cleanJsonText(candidateText);
        return JSON.parse(cleaned) as T;
      } catch (err: any) {
        lastError = err;
        continue;
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError || new Error('Gemini API call failed across all candidate models.');
  }
}

/**
 * OpenAI-Compatible Provider (OpenAI, Groq, OpenRouter, Local Ollama)
 */
export class OpenAICompatibleProvider implements IAIProvider {
  name: string;
  model: string;
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;

  constructor(config: AIProviderConfig) {
    this.name = config.provider === 'groq' ? 'Groq' : 'OpenAI-Compatible';
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.timeoutMs = config.timeoutMs || 20000;

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl.replace(/\/$/, '');
    } else if (config.provider === 'groq') {
      this.baseUrl = 'https://api.groq.com/openai/v1';
      this.model = config.model || 'llama-3.3-70b-versatile';
    } else {
      this.baseUrl = 'https://api.openai.com/v1';
      this.model = config.model || 'gpt-4o-mini';
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.includes('your_'));
  }

  async generateStructuredCompletion<T>(prompt: string, systemInstruction?: string): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error(`${this.name} API key is not configured or contains placeholder value.`);
    }

    const endpoint = `${this.baseUrl}/chat/completions`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const messages: any[] = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.15,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${this.name} API error [${response.status}]: ${errorText.substring(0, 300)}`);
      }

      const result = await response.json();
      const content = result?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error(`${this.name} response did not contain content.`);
      }

      const cleaned = cleanJsonText(content);
      return JSON.parse(cleaned) as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Factory to create configured provider based on environment variables
 */
export function getAIProvider(): IAIProvider | null {
  // Support AI_PROVIDER, or fallback to GEMINI_API_KEY / OPENAI_API_KEY if present
  const explicitProvider = process.env.AI_PROVIDER?.toLowerCase().trim();
  const apiKey = process.env.AI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.OPENAI_API_KEY || 
                 process.env.GROQ_API_KEY || '';

  if (!apiKey || apiKey.trim().length === 0 || apiKey.includes('your_')) {
    return null;
  }

  const model = process.env.AI_MODEL || '';
  const baseUrl = process.env.AI_BASE_URL;

  // Determine provider type
  let providerType: AIProviderConfig['provider'] = 'gemini';
  if (explicitProvider === 'openai' || process.env.OPENAI_API_KEY) {
    providerType = 'openai';
  } else if (explicitProvider === 'groq' || process.env.GROQ_API_KEY) {
    providerType = 'groq';
  } else if (explicitProvider === 'custom') {
    providerType = 'custom';
  }

  const config: AIProviderConfig = {
    provider: providerType,
    apiKey,
    model: model || (providerType === 'gemini' ? 'gemini-3.6-flash' : providerType === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini'),
    baseUrl
  };

  if (config.provider === 'gemini') {
    return new GeminiProvider(config);
  }

  return new OpenAICompatibleProvider(config);
}
