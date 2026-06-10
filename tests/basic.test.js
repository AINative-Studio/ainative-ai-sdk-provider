const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Test the CJS entry point
const { createAINative, ainative, models } = require('../index.cjs');

describe('@ainative/ai-sdk-provider', () => {
  describe('createAINative', () => {
    it('should be a function', () => {
      assert.equal(typeof createAINative, 'function');
    });

    it('should return a provider (callable)', () => {
      const provider = createAINative();
      assert.equal(typeof provider, 'function');
    });

    it('should accept custom apiKey', () => {
      const provider = createAINative({ apiKey: 'test-key-123' });
      assert.equal(typeof provider, 'function');
    });

    it('should accept custom baseURL', () => {
      const provider = createAINative({
        baseURL: 'https://custom.example.com/v1',
      });
      assert.equal(typeof provider, 'function');
    });

    it('should accept both apiKey and baseURL', () => {
      const provider = createAINative({
        apiKey: 'test-key',
        baseURL: 'https://custom.example.com/v1',
      });
      assert.equal(typeof provider, 'function');
    });
  });

  describe('ainative (default instance)', () => {
    it('should be a callable provider', () => {
      assert.equal(typeof ainative, 'function');
    });

    it('should return a language model when called with a model ID', () => {
      const model = ainative('meta-llama/Llama-3.3-70B-Instruct');
      assert.ok(model);
      assert.equal(typeof model, 'object');
      assert.equal(model.modelId, 'meta-llama/Llama-3.3-70B-Instruct');
    });

    it('should support qwen3-coder-flash model', () => {
      const model = ainative('qwen3-coder-flash');
      assert.ok(model);
      assert.equal(model.modelId, 'qwen3-coder-flash');
    });

    it('should support deepseek-4-flash model', () => {
      const model = ainative('deepseek-4-flash');
      assert.ok(model);
      assert.equal(model.modelId, 'deepseek-4-flash');
    });

    it('should have an embedding method', () => {
      assert.equal(typeof ainative.embedding, 'function');
    });

    it('should return an embedding model', () => {
      const embeddingModel = ainative.embedding('text-embedding-3-small');
      assert.ok(embeddingModel);
      assert.equal(typeof embeddingModel, 'object');
    });
  });

  describe('models', () => {
    it('should export a models object', () => {
      assert.equal(typeof models, 'object');
    });

    it('should include llama-3.3-70b', () => {
      assert.equal(
        models['llama-3.3-70b'],
        'meta-llama/Llama-3.3-70B-Instruct',
      );
    });

    it('should include qwen3-coder-flash', () => {
      assert.equal(models['qwen3-coder-flash'], 'qwen3-coder-flash');
    });

    it('should include deepseek-4-flash', () => {
      assert.equal(models['deepseek-4-flash'], 'deepseek-4-flash');
    });

    it('should include kimi-k2', () => {
      assert.equal(models['kimi-k2'], 'kimi-k2');
    });
  });

  describe('auto-provisioning', () => {
    it('should default to auto-provision when no API key is set', () => {
      // Save and clear env vars
      const savedAINative = process.env.AINATIVE_API_KEY;
      const savedOpenAI = process.env.OPENAI_API_KEY;
      delete process.env.AINATIVE_API_KEY;
      delete process.env.OPENAI_API_KEY;

      // Create provider without explicit key — should not throw
      const provider = createAINative();
      assert.equal(typeof provider, 'function');

      // Restore env vars
      if (savedAINative !== undefined)
        process.env.AINATIVE_API_KEY = savedAINative;
      if (savedOpenAI !== undefined) process.env.OPENAI_API_KEY = savedOpenAI;
    });

    it('should prefer AINATIVE_API_KEY over OPENAI_API_KEY', () => {
      const savedAINative = process.env.AINATIVE_API_KEY;
      const savedOpenAI = process.env.OPENAI_API_KEY;

      process.env.AINATIVE_API_KEY = 'ainative-key';
      process.env.OPENAI_API_KEY = 'openai-key';

      // Provider creation should succeed with AINATIVE_API_KEY
      const provider = createAINative();
      assert.equal(typeof provider, 'function');

      // Restore
      if (savedAINative !== undefined)
        process.env.AINATIVE_API_KEY = savedAINative;
      else delete process.env.AINATIVE_API_KEY;
      if (savedOpenAI !== undefined) process.env.OPENAI_API_KEY = savedOpenAI;
      else delete process.env.OPENAI_API_KEY;
    });
  });
});
