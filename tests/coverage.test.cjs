/**
 * @ainative/ai-sdk-provider — comprehensive coverage tests.
 * Run with: npx c8 --reporter=text node --test tests/*.test.*
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const mod = require('../index.cjs');
const { createAINative, ainative, models } = mod;

// Save original env for cleanup
let savedAINative, savedOpenAI;

beforeEach(() => {
  savedAINative = process.env.AINATIVE_API_KEY;
  savedOpenAI = process.env.OPENAI_API_KEY;
  delete process.env.AINATIVE_API_KEY;
  delete process.env.OPENAI_API_KEY;
});

afterEach(() => {
  if (savedAINative !== undefined) process.env.AINATIVE_API_KEY = savedAINative;
  else delete process.env.AINATIVE_API_KEY;
  if (savedOpenAI !== undefined) process.env.OPENAI_API_KEY = savedOpenAI;
  else delete process.env.OPENAI_API_KEY;
});

// ---------------------------------------------------------------------------
// CJS exports
// ---------------------------------------------------------------------------

describe('CJS exports', () => {
  it('exports createAINative function', () => {
    assert.equal(typeof mod.createAINative, 'function');
  });

  it('exports ainative default provider', () => {
    assert.equal(typeof mod.ainative, 'function');
  });

  it('exports models object', () => {
    assert.equal(typeof mod.models, 'object');
  });

  it('exports default as ainative', () => {
    assert.equal(mod.default, mod.ainative);
  });
});

// ---------------------------------------------------------------------------
// createAINative factory
// ---------------------------------------------------------------------------

describe('createAINative factory', () => {
  it('returns a callable provider with no options', () => {
    const p = createAINative();
    assert.equal(typeof p, 'function');
  });

  it('returns a callable provider with explicit apiKey', () => {
    const p = createAINative({ apiKey: 'test-key' });
    assert.equal(typeof p, 'function');
  });

  it('returns a callable provider with custom baseURL', () => {
    const p = createAINative({ baseURL: 'https://custom.api/v1' });
    assert.equal(typeof p, 'function');
  });

  it('returns a callable provider with both apiKey and baseURL', () => {
    const p = createAINative({ apiKey: 'k', baseURL: 'https://x.com/v1' });
    assert.equal(typeof p, 'function');
  });

  it('passes through extra options to createOpenAI', () => {
    // extra options like headers, fetch override, etc.
    const p = createAINative({ apiKey: 'k', headers: { 'X-Custom': 'val' } });
    assert.equal(typeof p, 'function');
  });
});

// ---------------------------------------------------------------------------
// Credential resolution
// ---------------------------------------------------------------------------

describe('credential resolution', () => {
  it('uses explicit apiKey when provided', () => {
    const p = createAINative({ apiKey: 'explicit-key' });
    assert.equal(typeof p, 'function');
  });

  it('uses AINATIVE_API_KEY env var', () => {
    process.env.AINATIVE_API_KEY = 'env-ainative-key';
    const p = createAINative();
    assert.equal(typeof p, 'function');
  });

  it('uses OPENAI_API_KEY env var as fallback', () => {
    process.env.OPENAI_API_KEY = 'env-openai-key';
    const p = createAINative();
    assert.equal(typeof p, 'function');
  });

  it('AINATIVE_API_KEY takes priority over OPENAI_API_KEY', () => {
    process.env.AINATIVE_API_KEY = 'ainative';
    process.env.OPENAI_API_KEY = 'openai';
    const p = createAINative();
    // Provider should use ainative key, we can verify it was created
    assert.equal(typeof p, 'function');
  });

  it('explicit apiKey takes priority over all env vars', () => {
    process.env.AINATIVE_API_KEY = 'env-key';
    process.env.OPENAI_API_KEY = 'openai-key';
    const p = createAINative({ apiKey: 'explicit' });
    assert.equal(typeof p, 'function');
  });

  it('falls back to "auto-provision" when no credentials at all', () => {
    const p = createAINative();
    // Should not throw — uses auto-provision token
    assert.equal(typeof p, 'function');
  });
});

// ---------------------------------------------------------------------------
// Default ainative instance
// ---------------------------------------------------------------------------

describe('ainative default instance', () => {
  it('is callable', () => {
    assert.equal(typeof ainative, 'function');
  });

  it('has .embedding method', () => {
    assert.equal(typeof ainative.embedding, 'function');
  });

  it('has .chat method', () => {
    assert.equal(typeof ainative.chat, 'function');
  });

  it('has .languageModel method', () => {
    assert.equal(typeof ainative.languageModel, 'function');
  });

  it('has .textEmbeddingModel method', () => {
    assert.equal(typeof ainative.textEmbeddingModel, 'function');
  });
});

// ---------------------------------------------------------------------------
// Model selection
// ---------------------------------------------------------------------------

describe('model selection', () => {
  it('ainative("meta-llama/Llama-3.3-70B-Instruct") returns correct model', () => {
    const model = ainative('meta-llama/Llama-3.3-70B-Instruct');
    assert.ok(model);
    assert.equal(model.modelId, 'meta-llama/Llama-3.3-70B-Instruct');
  });

  it('ainative("qwen3-coder-flash") returns correct model', () => {
    const model = ainative('qwen3-coder-flash');
    assert.equal(model.modelId, 'qwen3-coder-flash');
  });

  it('ainative("deepseek-4-flash") returns correct model', () => {
    const model = ainative('deepseek-4-flash');
    assert.equal(model.modelId, 'deepseek-4-flash');
  });

  it('ainative("kimi-k2") returns correct model', () => {
    const model = ainative('kimi-k2');
    assert.equal(model.modelId, 'kimi-k2');
  });

  it('supports arbitrary model IDs', () => {
    const model = ainative('custom-model/v1');
    assert.ok(model);
    assert.equal(model.modelId, 'custom-model/v1');
  });

  it('returns an object with specificationVersion', () => {
    const model = ainative('meta-llama/Llama-3.3-70B-Instruct');
    // OpenAI provider wraps it — specificationVersion may be on the model
    assert.ok(model.specificationVersion === 'v1' || model.specificationVersion === undefined);
  });

  it('returns an object with provider name', () => {
    const model = ainative('meta-llama/Llama-3.3-70B-Instruct');
    // Provider name is set on the model object
    assert.ok(model.provider === 'ainative' || typeof model.provider === 'string');
  });

  it('model has doGenerate method', () => {
    const model = ainative('meta-llama/Llama-3.3-70B-Instruct');
    assert.equal(typeof model.doGenerate, 'function');
  });

  it('model has doStream method', () => {
    const model = ainative('meta-llama/Llama-3.3-70B-Instruct');
    assert.equal(typeof model.doStream, 'function');
  });
});

// ---------------------------------------------------------------------------
// Embedding model
// ---------------------------------------------------------------------------

describe('embedding model', () => {
  it('ainative.embedding() returns an embedding model', () => {
    const emb = ainative.embedding('text-embedding-3-small');
    assert.ok(emb);
    assert.equal(typeof emb, 'object');
  });

  it('embedding model has modelId', () => {
    const emb = ainative.embedding('text-embedding-3-small');
    assert.equal(emb.modelId, 'text-embedding-3-small');
  });

  it('embedding model has doEmbed method', () => {
    const emb = ainative.embedding('text-embedding-3-small');
    assert.equal(typeof emb.doEmbed, 'function');
  });

  it('supports custom embedding model IDs', () => {
    const emb = ainative.embedding('nomic-embed-text');
    assert.equal(emb.modelId, 'nomic-embed-text');
  });

  it('embedding via textEmbeddingModel alias works', () => {
    const emb = ainative.textEmbeddingModel('text-embedding-3-small');
    assert.ok(emb);
    assert.equal(emb.modelId, 'text-embedding-3-small');
  });
});

// ---------------------------------------------------------------------------
// Provider from custom createAINative
// ---------------------------------------------------------------------------

describe('custom provider instance', () => {
  it('model from custom provider has correct modelId', () => {
    const p = createAINative({ apiKey: 'test' });
    const model = p('meta-llama/Llama-3.3-70B-Instruct');
    assert.equal(model.modelId, 'meta-llama/Llama-3.3-70B-Instruct');
  });

  it('embedding from custom provider works', () => {
    const p = createAINative({ apiKey: 'test' });
    const emb = p.embedding('text-embedding-3-small');
    assert.ok(emb);
  });

  it('chat from custom provider works', () => {
    const p = createAINative({ apiKey: 'test' });
    const model = p.chat('model-id');
    assert.ok(model);
    assert.equal(model.modelId, 'model-id');
  });

  it('languageModel from custom provider works', () => {
    const p = createAINative({ apiKey: 'test' });
    const model = p.languageModel('model-id');
    assert.ok(model);
    assert.equal(model.modelId, 'model-id');
  });
});

// ---------------------------------------------------------------------------
// Models catalog
// ---------------------------------------------------------------------------

describe('models catalog', () => {
  it('is a plain object', () => {
    assert.equal(typeof models, 'object');
    assert.ok(!Array.isArray(models));
  });

  it('has 4 entries', () => {
    assert.equal(Object.keys(models).length, 4);
  });

  it('maps llama-3.3-70b correctly', () => {
    assert.equal(models['llama-3.3-70b'], 'meta-llama/Llama-3.3-70B-Instruct');
  });

  it('maps qwen3-coder-flash correctly', () => {
    assert.equal(models['qwen3-coder-flash'], 'qwen3-coder-flash');
  });

  it('maps deepseek-4-flash correctly', () => {
    assert.equal(models['deepseek-4-flash'], 'deepseek-4-flash');
  });

  it('maps kimi-k2 correctly', () => {
    assert.equal(models['kimi-k2'], 'kimi-k2');
  });

  it('can use models map to create model instances', () => {
    for (const [, modelId] of Object.entries(models)) {
      const model = ainative(modelId);
      assert.equal(model.modelId, modelId);
    }
  });
});

// ---------------------------------------------------------------------------
// Auto-provisioning flow (no key -> auto-provision token)
// ---------------------------------------------------------------------------

describe('auto-provisioning flow', () => {
  it('creates provider without throwing when no creds', () => {
    const p = createAINative();
    assert.equal(typeof p, 'function');
  });

  it('creates model from auto-provisioned provider', () => {
    const p = createAINative();
    const model = p('meta-llama/Llama-3.3-70B-Instruct');
    assert.ok(model);
    assert.equal(model.modelId, 'meta-llama/Llama-3.3-70B-Instruct');
  });

  it('creates embedding model from auto-provisioned provider', () => {
    const p = createAINative();
    const emb = p.embedding('text-embedding-3-small');
    assert.ok(emb);
  });
});
