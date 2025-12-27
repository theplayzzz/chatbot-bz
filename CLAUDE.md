# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server (turbo mode, localhost:3000)
pnpm build            # Run migrations then build
pnpm lint             # Check code with ultracite/biome
pnpm format           # Fix code with ultracite/biome
pnpm db:migrate       # Apply database migrations
pnpm db:generate      # Generate new migration from schema changes
pnpm db:studio        # Open Drizzle Studio for database inspection
pnpm test             # Run Playwright E2E tests (requires dev server)
```

## Architecture

This is the **Chat SDK** - an AI chatbot template built with Next.js 16 App Router and Vercel AI SDK.

### Route Groups

- `app/(auth)/` - Authentication pages (login, register) and auth API routes
- `app/(chat)/` - Main chat interface and API routes for chat, documents, files, history, suggestions, votes

### AI Module (`lib/ai/`)

- `models.ts` - Available chat models from multiple providers (Anthropic, OpenAI, Google, xAI) via Vercel AI Gateway
- `prompts.ts` - System prompts for chat, code generation, spreadsheets, and artifacts
- `providers.ts` - AI Gateway provider configuration
- `tools/` - AI tools: `createDocument`, `updateDocument`, `requestSuggestions`, `getWeather`

### Database (`lib/db/`)

- Uses **Drizzle ORM** with PostgreSQL (Neon)
- Schema in `lib/db/schema.ts`: User, Chat, Message_v2, Vote_v2, Document, Suggestion, Stream
- Migrations in `lib/db/migrations/`

### Artifacts System (`artifacts/`)

Documents rendered in a side panel, supporting four kinds:
- `text/` - Markdown/prose editing with ProseMirror
- `code/` - Python code with CodeMirror editor and server-side execution
- `sheet/` - CSV spreadsheets with react-data-grid
- `image/` - Image generation

### Components

- `components/ai-elements/` - AI-specific UI components (reasoning, chain-of-thought, tool displays, canvas, etc.)
- `components/elements/` - Core chat elements (message, prompt-input, code-block, etc.)
- `components/ui/` - shadcn/ui primitives (excluded from linting)

## Environment Variables

Required (see `.env.example`):
- `AUTH_SECRET` - Auth.js secret key
- `AI_GATEWAY_API_KEY` - For non-Vercel deployments (Vercel uses OIDC tokens)
- `POSTGRES_URL` - Neon PostgreSQL connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `REDIS_URL` - Redis for streaming state

## Code Style

- Uses **Ultracite** (Biome wrapper) for linting/formatting
- No TypeScript enums, prefer `as const`
- Use `import type` for type-only imports
- Avoid `any` type
- Use arrow functions over function expressions
- Use `for...of` instead of `Array.forEach`
