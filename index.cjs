/**
 * @ainative/ai-sdk-provider — CommonJS entry
 */

'use strict';

const { createOpenAI } = require('@ai-sdk/openai');

const AINATIVE_BASE_URL = 'https://api.ainative.studio/api/v1';

const models = {
  'llama-3.3-70b': 'meta-llama/Llama-3.3-70B-Instruct',
  'qwen3-coder-flash': 'qwen3-coder-flash',
  'deepseek-4-flash': 'deepseek-4-flash',
  'kimi-k2': 'kimi-k2',
};

function createAINative(opts = {}) {
  const apiKey =
    opts.apiKey ||
    process.env.AINATIVE_API_KEY ||
    process.env.OPENAI_API_KEY ||
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

const ainative = createAINative();

module.exports = { createAINative, ainative, models, default: ainative };
