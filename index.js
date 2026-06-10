/**
 * @ainative/ai-sdk-provider
 *
 * AINative provider for the Vercel AI SDK.
 * Routes to AINative's free OpenAI-compatible API — Llama, Qwen, DeepSeek
 * models with zero config and auto-provisioning.
 *
 * Usage:
 *   import { ainative } from '@ainative/ai-sdk-provider';
 *   import { generateText } from 'ai';
 *
 *   const { text } = await generateText({
 *     model: ainative('meta-llama/Llama-3.3-70B-Instruct'),
 *     prompt: 'Hello!',
 *   });
 */

import { createOpenAI } from '@ai-sdk/openai';

/** Default AINative API base URL */
const AINATIVE_BASE_URL = 'https://api.ainative.studio/api/v1';

/** Default model when none specified */
const DEFAULT_MODEL = 'meta-llama/Llama-3.3-70B-Instruct';

/** Available free models */
export const models = {
  'llama-3.3-70b': 'meta-llama/Llama-3.3-70B-Instruct',
  'qwen3-coder-flash': 'qwen3-coder-flash',
  'deepseek-4-flash': 'deepseek-4-flash',
  'kimi-k2': 'kimi-k2',
};

/**
 * Create an AINative provider for the Vercel AI SDK.
 *
 * @param {object} [opts] - Configuration options
 * @param {string} [opts.apiKey] - API key. Falls back to AINATIVE_API_KEY or OPENAI_API_KEY env vars.
 *   If none set, uses 'auto-provision' for instant free-tier access.
 * @param {string} [opts.baseURL] - Base URL for the API. Defaults to https://api.ainative.studio/api/v1
 * @returns A Vercel AI SDK provider instance
 *
 * @example
 * ```typescript
 * import { createAINative } from '@ainative/ai-sdk-provider';
 *
 * const provider = createAINative({ apiKey: 'your-key' });
 * const model = provider('meta-llama/Llama-3.3-70B-Instruct');
 * ```
 */
export function createAINative(opts = {}) {
  const apiKey =
    opts.apiKey ||
    (typeof process !== 'undefined' && process.env?.AINATIVE_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) ||
    'auto-provision';

  const baseURL = opts.baseURL || AINATIVE_BASE_URL;

  const { apiKey: _apiKey, baseURL: _baseURL, ...rest } = opts;

  return createOpenAI({
    apiKey,
    baseURL,
    compatibility: 'compatible',
    name: 'ainative',
    ...rest,
  });
}

/**
 * Default AINative provider instance.
 *
 * Use as a function to get a language model:
 *   ainative('meta-llama/Llama-3.3-70B-Instruct')
 *
 * Use .embedding() to get an embedding model:
 *   ainative.embedding('text-embedding-3-small')
 *
 * @example
 * ```typescript
 * import { ainative } from '@ainative/ai-sdk-provider';
 * import { generateText } from 'ai';
 *
 * const { text } = await generateText({
 *   model: ainative('meta-llama/Llama-3.3-70B-Instruct'),
 *   prompt: 'Explain quantum computing',
 * });
 * ```
 */
export const ainative = createAINative();

export default ainative;
