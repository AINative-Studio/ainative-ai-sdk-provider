# @ainative/ai-sdk-provider

AINative provider for the Vercel AI SDK. Wraps `@ai-sdk/openai` with AINative's
free OpenAI-compatible endpoint.

## Architecture

- `index.js` — ES module entry point
- `index.cjs` — CommonJS entry point
- `index.d.ts` — TypeScript declarations
- Wraps `createOpenAI` from `@ai-sdk/openai` with AINative base URL
- Auto-provisioning: uses `auto-provision` as API key when none is configured

## API Key Resolution Order

1. Explicit `apiKey` option
2. `AINATIVE_API_KEY` environment variable
3. `OPENAI_API_KEY` environment variable
4. `auto-provision` (instant free-tier access)

## Testing

```bash
npm test
```

Uses Node.js built-in test runner (`node:test`).
