/**
 * LLM calls for the game. Prefers Groq (fast, simple browser fetch); falls back to Anthropic if only that key is set.
 *
 * Groq: https://console.groq.com/docs/api-reference — OpenAI-compatible chat completions
 *   VITE_GROQ_API_KEY
 *   VITE_GROQ_MODEL (default: llama-3.3-70b-versatile)
 *
 * Anthropic: VITE_ANTHROPIC_API_KEY, VITE_ANTHROPIC_MODEL (see ./anthropic.js)
 */

import { createMessage as createAnthropicMessage, getAnthropicApiKey } from './anthropic.js';

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

export function getGroqApiKey() {
  return (import.meta.env.VITE_GROQ_API_KEY || '').trim();
}

export function getGroqModel() {
  return (import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile').trim();
}

/** Set VITE_ENABLE_LLM=false on public deploys to skip API calls (saves quota + hides key). */
export function isLlmDisabledForDeploy() {
  const v = (import.meta.env.VITE_ENABLE_LLM || '').trim().toLowerCase();
  return v === 'false' || v === '0' || v === 'off' || v === 'no';
}

/** True if either Groq or Anthropic key is configured and LLM is not explicitly disabled */
export function hasLlmKey() {
  if (isLlmDisabledForDeploy()) return false;
  return Boolean(getGroqApiKey() || getAnthropicApiKey());
}

/**
 * @param {string} prompt
 * @param {number} maxTokens
 */
async function createGroqMessage(prompt, maxTokens) {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY');
  }

  const res = await fetch(GROQ_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getGroqModel(),
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.6,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (typeof data?.error?.message === 'string' && data.error.message) ||
      (typeof data?.message === 'string' && data.message) ||
      res.statusText ||
      'Groq request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  const raw = data.choices?.[0]?.message?.content;
  return typeof raw === 'string' ? raw : '';
}

/** User-friendly message when an LLM request fails (rate limits, outages, etc.) */
export function getLlmErrorMessage(err) {
  const status = err?.status;
  const msg = typeof err?.message === 'string' ? err.message.toLowerCase() : '';
  if (status === 429 || msg.includes('rate limit') || msg.includes('quota')) {
    return 'AI mentor is temporarily unavailable (API limit reached). The lesson above is your full feedback for now.';
  }
  if (status === 401 || status === 403) {
    return 'AI mentor is unavailable right now. You can keep playing — all scenarios work without it.';
  }
  return 'Could not load AI analysis. Continue below — the lesson and principle are complete without it.';
}

/**
 * @param {string} prompt
 * @param {number} [maxTokens=1024]
 * @returns {Promise<string>}
 */
export async function createMessage(prompt, maxTokens = 1024) {
  if (isLlmDisabledForDeploy()) {
    throw new Error('LLM disabled for this deployment');
  }
  if (getGroqApiKey()) {
    return createGroqMessage(prompt, maxTokens);
  }
  if (getAnthropicApiKey()) {
    return createAnthropicMessage(prompt, maxTokens);
  }
  throw new Error('Add VITE_GROQ_API_KEY or VITE_ANTHROPIC_API_KEY to .env');
}
