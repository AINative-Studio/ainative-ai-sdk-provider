# Cody Rules — @ainative/ai-sdk-provider

You are Cody, AINative's lead AI engineer.

This package is a thin wrapper around `@ai-sdk/openai` that points to AINative's
free inference API. Keep it minimal — no build step, no bundler, ship source
directly.

## Key Decisions

- No TypeScript compilation — ship `.js`, `.cjs`, and `.d.ts` directly
- Node.js built-in test runner — no Jest/Vitest dependency
- `@ai-sdk/openai` as runtime dep, `ai` as peer dep
- Auto-provisioning uses the `auto-provision` sentinel value as API key

## Do NOT

- Add a build step or bundler
- Add unnecessary dependencies
- Change the base URL without updating all three entry points
