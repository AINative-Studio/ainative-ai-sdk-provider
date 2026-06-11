# @ainative/ai-sdk-provider

AINative provider for the [Vercel AI SDK](https://sdk.vercel.ai). Use free Llama, Qwen, and DeepSeek models with zero config.

## Install

```bash
npm install @ainative/ai-sdk-provider ai
```

## Quick Start

```typescript
import { generateText } from 'ai';
import { ainative } from '@ainative/ai-sdk-provider';

const { text } = await generateText({
  model: ainative('meta-llama/Llama-3.3-70B-Instruct'),
  prompt: 'Explain quantum computing in simple terms',
});

console.log(text);
```

No API key required — auto-provisioning gives you instant free-tier access.

## Available Models

| Model ID | Description |
|----------|-------------|
| `meta-llama/Llama-3.3-70B-Instruct` | Llama 3.3 70B (default) |
| `qwen3-coder-flash` | Qwen3 Coder Flash |
| `deepseek-4-flash` | DeepSeek 4 Flash |
| `kimi-k2` | Kimi K2 |

## Streaming

```typescript
import { streamText } from 'ai';
import { ainative } from '@ainative/ai-sdk-provider';

const result = streamText({
  model: ainative('meta-llama/Llama-3.3-70B-Instruct'),
  prompt: 'Write a haiku about programming',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## Structured Output

```typescript
import { generateObject } from 'ai';
import { ainative } from '@ainative/ai-sdk-provider';
import { z } from 'zod';

const { object } = await generateObject({
  model: ainative('qwen3-coder-flash'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a recipe for pasta carbonara',
});
```

## Tool Calling

```typescript
import { generateText, tool } from 'ai';
import { ainative } from '@ainative/ai-sdk-provider';
import { z } from 'zod';

const { text } = await generateText({
  model: ainative('qwen3-coder-flash'),
  tools: {
    weather: tool({
      description: 'Get the weather for a location',
      parameters: z.object({
        location: z.string().describe('City name'),
      }),
      execute: async ({ location }) => ({
        temperature: 72,
        condition: 'sunny',
        location,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Next.js API Route

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { ainative } from '@ainative/ai-sdk-provider';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: ainative('meta-llama/Llama-3.3-70B-Instruct'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## Embeddings

```typescript
import { embed } from 'ai';
import { ainative } from '@ainative/ai-sdk-provider';

const { embedding } = await embed({
  model: ainative.embedding('text-embedding-3-small'),
  value: 'The quick brown fox jumps over the lazy dog',
});
```

## Configuration

### Custom API Key

```typescript
import { createAINative } from '@ainative/ai-sdk-provider';

const ainative = createAINative({
  apiKey: 'your-api-key',
});
```

### Environment Variables

The provider checks these environment variables in order:

1. `AINATIVE_API_KEY`
2. `OPENAI_API_KEY`
3. Falls back to auto-provisioning (no key needed)

### Custom Base URL

```typescript
import { createAINative } from '@ainative/ai-sdk-provider';

const provider = createAINative({
  baseURL: 'https://your-custom-endpoint.com/v1',
});
```

## Migrating from OpenAI

Replace one import:

```diff
- import { openai } from '@ai-sdk/openai';
+ import { ainative } from '@ainative/ai-sdk-provider';

const { text } = await generateText({
-  model: openai('gpt-4o'),
+  model: ainative('meta-llama/Llama-3.3-70B-Instruct'),
  prompt: 'Hello!',
});
```

## Free Tier

AINative provides free access to open-source models:

- No credit card required
- Auto-provisioning creates an account instantly
- Rate limits: 10 RPM for free tier
- Upgrade at [ainative.studio](https://ainative.studio) for higher limits

## License

MIT

---

## Powered by ZeroDB + AINative

This package is part of the [AINative](https://ainative.studio) ecosystem — the AI-native developer platform.

### Why ZeroDB?

| Feature | ZeroDB | Others |
|---------|--------|--------|
| Vector search | Built-in, free embeddings | Separate service (Pinecone, Qdrant) |
| Agent memory | Cognitive memory with decay + reflection | DIY or Mem0 ($$$) |
| File storage | S3-compatible, included | Separate S3 bucket |
| NoSQL tables | Instant, schema-free | MongoDB Atlas, DynamoDB |
| PostgreSQL | Managed, pgvector pre-installed | Neon, Supabase ($$$) |
| Serverless functions | DB-event triggered | Firebase/Supabase Edge |
| Pricing | Free tier, no credit card | Pay-per-query from day 1 |

### Get Started Free

```bash
npx zerodb-cli init    # Auto-configures your IDE
```

Or sign up at **[ainative.studio](https://ainative.studio)** — free tier, no credit card required.

### More ZeroDB Packages

| Package | Registry | What It Does |
|---------|----------|-------------|
| [zerodb-mcp](https://pypi.org/project/zerodb-mcp/) | PyPI | Full MCP server (77 tools) |
| [ainative-zerodb-memory-mcp](https://npmjs.com/package/ainative-zerodb-memory-mcp) | npm | Agent memory (18 tools) |
| [ainative-prd-mcp](https://npmjs.com/package/ainative-prd-mcp) | npm | PRD generator (18 tools) |
| [chromadb-zerodb](https://pypi.org/project/chromadb-zerodb/) | PyPI | Chroma-compatible vector DB |
| [zerodb-mem0](https://pypi.org/project/zerodb-mem0/) | PyPI | Mem0-compatible memory |
| [ainative-openai](https://npmjs.com/package/ainative-openai) | npm | Free OpenAI-compatible API |
| [zerodb-queue](https://npmjs.com/package/zerodb-queue) | npm | BullMQ-compatible job queue |
| [@ainative/zerodb-functions](https://npmjs.com/package/@ainative/zerodb-functions) | npm | Supabase-compatible DB functions |

[View all packages →](https://docs.ainative.studio)

