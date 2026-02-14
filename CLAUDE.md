# CLAUDE.md — Polaris Project Context

## What This Project Is

Polaris is a two-sided political intelligence SaaS platform. Side A serves organizations (corporates, NGOs, lobbying firms) that monitor political activity. Side B serves politicians (elected officials, candidates, staff) who need competitive intelligence and stakeholder tools. A marketplace layer connects both sides with anonymized cross-side intelligence.

Current phase: **Phase 0–1 build** (project scaffold through core intelligence features).

## Key Documents

- `POLARIS_PRODUCT_SPEC.md` — Master engineering spec. Single source of truth for all data models, API contracts, service definitions, and architecture. **Always reference this before making design decisions.**
- `POLARIS_PHASE_0_1_IMPLEMENTATION_GUIDE.md` — Sequential build instructions for Phase 0–1. Follow steps 0–12 in order.
- `PROGRESS.md` — Current build status. **Read this first on every session** to know where you left off. **Update this after completing each step.**
- `CONVENTIONS.md` — Code patterns, naming conventions, API structure templates, error codes, and unique constraint keys. Follow these exactly for consistency.
- `POLARIS_DESIGN_SYSTEM.md` — Visual design language, color system, typography, component specs, page layouts, and CSS variable overrides. **Read this before building any UI component.** Dark mode is the default. All colors, spacing, and component treatments are defined here.
- `DESIGN_SYSTEM.md` — Visual identity, color palette (CSS variables), typography scale, layout density rules, component patterns, dark mode config, icon mapping. **Reference this before building any UI component.**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, `src/` directory) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Clerk (multi-tenant, orgs + individual) |
| Database | Neon PostgreSQL 16 + pgvector extension |
| ORM | Drizzle ORM |
| Payments | Stripe (subscriptions, webhooks) |
| AI (LLM) | Anthropic Claude API (summarization, classification, analysis) |
| AI (Embeddings) | OpenAI text-embedding-3-small (1536 dims) |
| Background Jobs | Inngest (cron, event-driven workflows) |
| Cache | Upstash Redis |
| Email | Resend |
| Real-time | Pusher |
| Hosting | Vercel |
| Workers | Railway (long-running scrape/AI jobs) |

## Project Structure

```
polaris/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Sign-in, sign-up
│   │   ├── (marketing)/        # Landing, pricing, about
│   │   ├── (dashboard)/        # Authenticated org-side app
│   │   └── api/                # API routes, webhooks, cron
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── dashboard/          # Dashboard shell components
│   │   ├── legislation/        # Bill-related UI
│   │   ├── stakeholders/       # Politician-related UI
│   │   └── shared/             # Reusable components
│   ├── db/
│   │   ├── schema/             # Drizzle schema files (10 modules)
│   │   ├── migrations/         # Generated Drizzle migrations
│   │   ├── index.ts            # DB client
│   │   └── seed.ts             # Seed script for jurisdictions
│   ├── lib/
│   │   ├── ai/                 # Claude/OpenAI clients + prompt templates
│   │   ├── billing/            # Stripe client + product config
│   │   ├── ingestion/          # Data collectors (Congress.gov, UK Parliament)
│   │   ├── notifications/      # Email + Pusher delivery
│   │   ├── search/             # Full-text + semantic + combined search
│   │   ├── validators/         # Zod schemas
│   │   ├── permissions.ts      # RBAC + tier feature gating
│   │   ├── auth.ts             # User context helper
│   │   ├── api.ts              # API response envelope helpers
│   │   ├── redis.ts            # Upstash client
│   │   ├── pusher.ts           # Pusher client
│   │   └── inngest.ts          # Inngest client
│   ├── inngest/
│   │   └── functions/          # Inngest function definitions
│   ├── types/                  # Shared TypeScript types
│   └── workers/                # Railway worker processes
├── drizzle.config.ts
├── next.config.ts
├── CLAUDE.md                   # This file
├── PROGRESS.md                 # Build progress tracker
└── POLARIS_PRODUCT_SPEC.md     # Master spec
```

## Commands

```bash
npm run dev                     # Start dev server (localhost:3000)
npm run build                   # Production build
npx tsc --noEmit                # Type check without emitting
npx drizzle-kit generate        # Generate DB migration from schema changes
npx drizzle-kit migrate         # Apply pending migrations
npx drizzle-kit push            # Push schema directly (dev only)
npx drizzle-kit studio          # Open Drizzle Studio GUI
npm run seed                    # Seed jurisdiction + legislative body data
npx inngest-cli dev             # Start Inngest dev server (localhost:8288)
```

## Code Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `BillCard.tsx`)
- Utilities/lib: `kebab-case.ts` (e.g., `bill-text-fetcher.ts`)
- Schema files: `kebab-case.ts` matching the entity (e.g., `legislation.ts`)
- API routes: `route.ts` inside the appropriate path directory

### API Routes
- All public API routes live under `src/app/api/v1/`
- Webhooks live under `src/app/api/webhooks/`
- Every route uses the `ApiResponse<T>` / `ApiError` envelope from `src/lib/api.ts`
- Validate all inputs with Zod before processing
- Check feature access with `requireFeature()` from `src/lib/feature-gate.ts`
- Handle errors with `handleApiError()` wrapper

### Database
- All queries go through Drizzle ORM (`src/db/index.ts`)
- Never write raw SQL except for:
  - Full-text search (GIN indexes, `ts_rank`)
  - pgvector similarity search (`<=>` operator)
  - Recursive CTEs (relationship path finding — Phase 3)
- Use `onConflictDoUpdate` for all upserts (ingestion data is idempotent)
- All tables use UUID primary keys via `uuid('id').primaryKey().defaultRandom()`

### AI Calls
- Classification tasks → `claude-haiku-4-5-20251001` (fast, cheap)
- Summarization/analysis → `claude-sonnet-4-5-20250929` (balanced)
- Embeddings → OpenAI `text-embedding-3-small` (1536 dims)
- All AI calls route through Inngest for queue management and retry
- Concurrency limit: 5 for Sonnet, 10 for Haiku
- Always parse AI output as JSON; wrap in try/catch with fallback

### Auth Pattern
```typescript
// In any API route or server component:
const ctx = await getUserContext(); // from src/lib/auth.ts
if (!ctx) return apiError('UNAUTHORIZED', 'Auth required', 401);

// Feature gating:
const gate = await requireFeature('legislative.ai_summaries');
if (gate) return gate; // returns 403 if tier insufficient
```

### Component Patterns
- Use Server Components by default
- Use `'use client'` only when needed (interactivity, hooks, browser APIs)
- Data fetching happens in Server Components or API routes, not in client components
- Use shadcn/ui primitives as base; extend with Tailwind

## Critical Architecture Rules

1. **Politically neutral.** Never classify, label, or frame content with ideological bias. AI prompts must explicitly instruct non-partisan analysis.

2. **Cross-side data is ALWAYS anonymized.** Minimum aggregation threshold: 5 organizations before any signal is surfaced to the politician side. Never expose individual org names, queries, or behavior.

3. **Tier enforcement is server-side.** Never trust the client to enforce feature access. Every API route and server action checks the user's tier before returning data.

4. **Ingestion is idempotent.** Every ingestion run can be safely re-run. Use `onConflictDoUpdate` with `externalId + externalSource` as the conflict key.

5. **AI enrichment is async.** Ingestion functions store raw data immediately, then emit Inngest events for AI processing. Users see raw data fast; AI summaries appear when ready.

6. **pgvector embeddings use 1536 dimensions** (matching OpenAI text-embedding-3-small). The `bills.embedding` column and IVFFlat index are configured for this.

7. **API-first.** Every feature exposed in the UI must have a backing API route under `/api/v1/`. The UI is a consumer of the API, not the only way to access data.

## Tier Limits (Phase 0–1 Relevant)

| Feature | Starter | Professional | Enterprise | Global |
|---------|---------|-------------|------------|--------|
| Saved searches | 5 | 25 | Unlimited | Unlimited |
| Monitoring topics | 5 | 25 | 100 | Unlimited |
| Jurisdictions | 1 national | 1 national + states | Multi-country | All |
| AI summaries | Basic | Full | Full + impact | Full + impact + custom |
| Semantic search | ✗ | ✓ | ✓ | ✓ |
| CRM contacts | ✗ | 100 | Unlimited | Unlimited |
| API access | ✗ | Read | Read/Write | Full |

## Error Handling

- API routes: wrap handler body in try/catch → `handleApiError(error)`
- Inngest functions: use `retries: 2` default; log failures to `ingestionJobs` table
- AI calls: always try/catch JSON.parse of model output; fall back to raw text storage
- Stripe webhooks: verify signature first; return 200 even on processing errors (prevent retries for bad data)

## Environment Variables

All env vars are documented in `POLARIS_PHASE_0_1_IMPLEMENTATION_GUIDE.md` Appendix. The `.env.example` file in the project root lists every required variable. **Never commit `.env.local`.**

## When In Doubt

1. Check `POLARIS_PRODUCT_SPEC.md` for the authoritative answer on data models, API contracts, and feature definitions.
2. Check `PROGRESS.md` for current build state.
3. Check `CONVENTIONS.md` for code patterns, naming rules, and constraint keys.
4. Follow the implementation guide step order — later steps depend on earlier ones.
5. If a decision isn't covered in the spec, make the simplest choice that doesn't preclude future phases. Add a `// TODO: Phase N` comment noting the deferral.
