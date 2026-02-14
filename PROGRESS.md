# PROGRESS.md — Polaris Build Tracker

> **Instructions for Claude Code:** Read this file at the start of every session. After completing any step or sub-step, update the status checkbox and add a completion note. This is the single source of truth for what has and hasn't been built.

---

## Current Phase: 0–1 (Foundation + Core Intelligence)

**Overall Status:** IN PROGRESS

**Last Updated:** 2026-02-14

**Last Completed Step:** Step 3 — Stripe Billing + API Helpers

**Next Action:** Begin Step 4 — UI Shell

---

## Step 0: Project Scaffold

| Sub-step | Status | Notes |
|----------|--------|-------|
| 0.1 Initialize Next.js project | ✅ Done | Next.js 15 with App Router, TypeScript, Tailwind |
| 0.2 Install dependencies | ✅ Done | All Phase 0-1 deps + shadcn/ui primitives (manual) |
| 0.3 Create folder structure | ✅ Done | Full directory tree per spec |
| 0.4 Create `.env.example` + `.env.local` | ✅ Done | .env.example created, .env.local gitignored |
| 0.5 Configure `drizzle.config.ts` | ✅ Done | Points to src/db/schema/index.ts |
| 0.6 Configure `next.config.ts` | ✅ Done | serverActions, image remotePatterns |

**Step 0 Status:** ✅ Complete

---

## Step 1: Database Schema

| Sub-step | Status | Notes |
|----------|--------|-------|
| 1.1 Create Drizzle client (`db/index.ts`) | ✅ Done | neon + drizzle-orm/neon-http |
| 1.2 Create schema files (10 files) | ✅ Done | All tables per spec §5.2-5.11 |
| — `users.ts` | ✅ | users table |
| — `organizations.ts` | ✅ | organizations + orgMemberships |
| — `jurisdictions.ts` | ✅ | jurisdictions + legislativeBodies + politicalParties |
| — `politicians.ts` | ✅ | politicians + politicianActivities |
| — `legislation.ts` | ✅ | bills + billVersions + billVotes + committees + committeeEvents |
| — `monitoring.ts` | ✅ | monitoringTopics + savedSearches + alerts |
| — `subscriptions.ts` | ✅ | subscriptions + usageRecords |
| — `audit.ts` | ✅ | auditLog |
| — `ingestion.ts` | ✅ | ingestionJobs + ingestionSourceHealth |
| — `index.ts` (re-exports) | ✅ | Re-exports all 9 schema modules |
| 1.3 Enable pgvector + create indexes | ⬜ Not started | Requires Neon DB connection — embedding column commented out, add when DB connected |
| 1.3a Generate + apply migration | ⬜ Not started | Requires DATABASE_URL in .env.local |

**Step 1 Status:** ✅ Schema code complete (migration pending DB connection)

---

## Step 2: Authentication (Clerk)

| Sub-step | Status | Notes |
|----------|--------|-------|
| 2.1 Create middleware (`middleware.ts`) | ✅ Done | Public routes + auth protection |
| 2.2 Create auth pages (sign-in, sign-up) | ✅ Done | Clerk components |
| 2.3 Create root layout with ClerkProvider | ✅ Done | Inter font, metadata |
| 2.4 Create Clerk webhook handler | ✅ Done | user.created/updated, org.created/updated, membership.created |
| 2.5 Create permission utilities | ✅ Done | FEATURE_ACCESS map, TIER_LIMITS, hasAccess() |
| 2.6 Create user context helper | ✅ Done | getUserContext() reads from Clerk + DB |

**Step 2 Status:** ✅ Complete

---

## Step 3: Stripe Billing

| Sub-step | Status | Notes |
|----------|--------|-------|
| 3.1 Create Stripe client | ✅ Done | lib/billing/stripe.ts |
| 3.2 Create product configuration | ✅ Done | lib/billing/products.ts — all org + pol tiers |
| 3.3 Create Stripe webhook handler | ✅ Done | Subscription CRUD, org tier sync |
| 3.4 Create checkout + portal API routes | ✅ Done | /api/v1/billing/checkout + portal |

**Step 3 Status:** ✅ Complete

**Also completed:**
- API response helpers (lib/api.ts) — apiSuccess, apiError, handleApiError
- Feature gate (lib/feature-gate.ts) — requireFeature()
- Validators (lib/validators/index.ts) — paginationSchema, parseSearchParams
- Inngest client (lib/inngest.ts)
- Redis client + cache/rateLimit helpers (lib/redis.ts)
- Pusher client (lib/pusher.ts)
- Email utility (lib/notifications/email.ts)

---

## Step 4: UI Shell

| Sub-step | Status | Notes |
|----------|--------|-------|
| 4.1 Marketing layout | ⬜ Not started | |
| 4.2 Landing page | ⬜ Not started | |
| 4.3 Pricing page | ⬜ Not started | |
| 4.4 Dashboard layout (sidebar, topbar) | ⬜ Not started | |
| 4.5 Overview dashboard page | ⬜ Not started | |
| 4.6 Settings pages (billing, team, notifications) | ⬜ Not started | |

**Step 4 Status:** ⬜ Not started

---

## Step 5: Data Ingestion — US Congress + UK Parliament

| Sub-step | Status | Notes |
|----------|--------|-------|
| 5.1 Create base collector class | ⬜ Not started | |
| 5.2 Create Congress.gov collector | ⬜ Not started | |
| 5.3 Create UK Parliament collector | ⬜ Not started | |
| 5.4 Create Inngest client | ⬜ Not started | |
| 5.5 Create Inngest serve route | ⬜ Not started | |
| 5.6 Create ingestion Inngest functions | ⬜ Not started | |
| — `ingest-congress-bills` | ⬜ | |
| — `ingest-congress-members` | ⬜ | |
| — `ingest-uk-bills` | ⬜ | |
| — `ingest-uk-members` | ⬜ | |
| 5.7 Seed jurisdiction data | ⬜ Not started | |

**Step 5 Status:** ⬜ Not started

---

## Step 6: AI Bill Summarization Pipeline

| Sub-step | Status | Notes |
|----------|--------|-------|
| 6.1 Create Anthropic client | ⬜ Not started | |
| 6.2 Create OpenAI client (embeddings) | ⬜ Not started | |
| 6.3 Create prompt templates | ⬜ Not started | |
| — `bill-summary.ts` | ⬜ | |
| — `bill-classification.ts` | ⬜ | |
| 6.4 Create AI enrichment Inngest function | ⬜ Not started | |
| 6.5 Create bill text fetcher utility | ⬜ Not started | |

**Step 6 Status:** ⬜ Not started

---

## Step 7: Monitoring & Alerts

| Sub-step | Status | Notes |
|----------|--------|-------|
| 7.1 Monitoring topic API routes (CRUD) | ⬜ Not started | |
| 7.2 Alert API routes (list, mark read) | ⬜ Not started | |
| 7.3 Monitoring match Inngest function | ⬜ Not started | |
| 7.4 Daily digest Inngest function | ⬜ Not started | |
| 7.5 Email client (Resend) | ⬜ Not started | |
| 7.6 Pusher client | ⬜ Not started | |
| 7.7 Monitoring + alerts UI pages | ⬜ Not started | |

**Step 7 Status:** ⬜ Not started

---

## Step 8: Legislation UI & Politician Directory

| Sub-step | Status | Notes |
|----------|--------|-------|
| 8.1 Bill search + list page | ⬜ Not started | |
| 8.2 Bill detail page | ⬜ Not started | |
| 8.3 Bill API routes | ⬜ Not started | |
| — `GET /api/v1/bills` | ⬜ | |
| — `GET /api/v1/bills/[id]` | ⬜ | |
| — `POST/DELETE /api/v1/bills/[id]/monitor` | ⬜ | |
| 8.4 Politician directory page | ⬜ Not started | |
| 8.5 Politician profile page | ⬜ Not started | |
| 8.6 Politician API routes | ⬜ Not started | |
| — `GET /api/v1/politicians` | ⬜ | |
| — `GET /api/v1/politicians/[id]` | ⬜ | |
| — `GET /api/v1/politicians/[id]/activities` | ⬜ | |

**Step 8 Status:** ⬜ Not started

---

## Step 9: Search Infrastructure

| Sub-step | Status | Notes |
|----------|--------|-------|
| 9.1 Full-text search module | ⬜ Not started | |
| 9.2 Semantic search module (pgvector) | ⬜ Not started | |
| 9.3 Combined search module | ⬜ Not started | |
| 9.4 Global search API route | ⬜ Not started | |
| 9.5 Wire search to topbar UI (command palette) | ⬜ Not started | |

**Step 9 Status:** ⬜ Not started

---

## Step 10: Redis Caching & Rate Limiting

| Sub-step | Status | Notes |
|----------|--------|-------|
| 10.1 Create Redis client | ⬜ Not started | |
| 10.2 Create rate limiter | ⬜ Not started | |
| 10.3 Add caching to frequent queries | ⬜ Not started | |

**Step 10 Status:** ⬜ Not started

---

## Step 11: API Response Envelope & Validation

| Sub-step | Status | Notes |
|----------|--------|-------|
| 11.1 API response helpers | ⬜ Not started | |
| 11.2 Validation middleware pattern | ⬜ Not started | |
| 11.3 Feature gate helper | ⬜ Not started | |

**Step 11 Status:** ⬜ Not started

---

## Step 12: Final Wiring & Verification

| Sub-step | Status | Notes |
|----------|--------|-------|
| 12.1 Full build verification (`tsc`, `npm run build`) | ⬜ Not started | |
| 12.2 Smoke tests | ⬜ Not started | |
| — Auth flow | ⬜ | |
| — Billing flow | ⬜ | |
| — Ingestion (Congress.gov) | ⬜ | |
| — Ingestion (UK Parliament) | ⬜ | |
| — AI enrichment pipeline | ⬜ | |
| — Bill search | ⬜ | |
| — Monitoring + alerts | ⬜ | |
| — Politician directory | ⬜ | |

**Step 12 Status:** ⬜ Not started

---

## Blockers & Issues

| # | Issue | Severity | Status | Resolution |
|---|-------|----------|--------|------------|
| — | None yet | — | — | — |

---

## Decisions Made During Build

Log any implementation decisions that deviate from or aren't covered by the spec.

| Date | Decision | Rationale |
|------|----------|-----------|
| — | — | — |

---

## Files Created

Track every file created during the build. Helps with debugging and understanding what exists.

| Step | File Path | Purpose |
|------|-----------|---------|
| — | — | — |

---

## External Service Setup Status

These services require manual account creation and API key generation before the corresponding step can run.

| Service | Account Created | API Key in `.env.local` | Tested |
|---------|----------------|------------------------|--------|
| Clerk | ⬜ | ⬜ | ⬜ |
| Neon (PostgreSQL) | ⬜ | ⬜ | ⬜ |
| Stripe | ⬜ | ⬜ | ⬜ |
| Anthropic (Claude API) | ⬜ | ⬜ | ⬜ |
| OpenAI (Embeddings) | ⬜ | ⬜ | ⬜ |
| Inngest | ⬜ | ⬜ | ⬜ |
| Upstash Redis | ⬜ | ⬜ | ⬜ |
| Resend | ⬜ | ⬜ | ⬜ |
| Pusher | ⬜ | ⬜ | ⬜ |
| Congress.gov API | ⬜ | ⬜ | ⬜ |
| PostHog | ⬜ | ⬜ | ⬜ |
| Sentry | ⬜ | ⬜ | ⬜ |
| Vercel (deploy) | ⬜ | ⬜ | ⬜ |

---

## Phase 2+ Backlog (Do NOT build yet)

Items explicitly deferred from Phase 0–1. Listed here so they aren't accidentally started.

- Politician-side dashboard and accounts
- CRM contacts and interactions
- Sentiment analysis
- Stakeholder relationship mapping / graph
- Predictive analytics
- Competitive intelligence
- Constituency intelligence
- Marketplace / cross-side features
- EU, Canada, Australia ingestion
- Campaign suite
- Slack/Teams integrations
- Full external API key management
- Mobile app
- White-label options
- Data products / licensing
