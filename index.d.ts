import type { OpenAIProvider } from '@ai-sdk/openai';

/**
 * Available free models on AINative.
 */
export declare const models: {
  'llama-3.3-70b': string;
  'qwen3-coder-flash': string;
  'deepseek-4-flash': string;
  'kimi-k2': string;
};

export interface AINativeProviderOptions {
  /**
   * API key for AINative. Falls back to AINATIVE_API_KEY or OPENAI_API_KEY
   * environment variables. If none set, uses auto-provisioning for instant
   * free-tier access.
   */
  apiKey?: string;

  /**
   * Base URL for the AINative API.
   * @default 'https://api.ainative.studio/api/v1'
   */
  baseURL?: string;

  /**
   * Additional options passed through to the underlying OpenAI provider.
   */
  [key: string]: unknown;
}

/**
 * Create an AINative provider for the Vercel AI SDK.
 */
export declare function createAINative(
  opts?: AINativeProviderOptions,
): OpenAIProvider;

/**
 * Default AINative provider instance.
 *
 * Use as a function to get a language model:
 *   `ainative('meta-llama/Llama-3.3-70B-Instruct')`
 *
 * Use `.embedding()` to get an embedding model:
 *   `ainative.embedding('text-embedding-3-small')`
 */
export declare const ainative: OpenAIProvider;

export default ainative;
