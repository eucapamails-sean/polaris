# POLARIS — Political Intelligence Platform
## Complete Product Specification & Engineering Reference
### Version 1.0 | February 2026

> **Document Purpose:** This is the master engineering reference for building the Polaris platform. It is designed to be consumed by Claude Code and engineering teams as the single source of truth for all product decisions, data models, API contracts, and implementation details.

> **Document Scope:** Full platform specification covering all 12 services, both marketplace sides (Organizations + Politicians), all pricing tiers, data ingestion pipelines, and deployment architecture.

---

## TABLE OF CONTENTS

1. [Platform Overview](#1-platform-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Database Schema](#5-database-schema)
6. [Service 1: Political Monitoring & Legislative Tracking](#6-service-1-political-monitoring--legislative-tracking)
7. [Service 2: Stakeholder Intelligence & Relationship Mapping](#7-service-2-stakeholder-intelligence--relationship-mapping)
8. [Service 3: Predictive Policy Analytics](#8-service-3-predictive-policy-analytics)
9. [Service 4: Sentiment & Narrative Analysis](#9-service-4-sentiment--narrative-analysis)
10. [Service 5: Competitive Political Intelligence](#10-service-5-competitive-political-intelligence)
11. [Service 6: Constituency & District Intelligence](#11-service-6-constituency--district-intelligence)
12. [Service 7: Issue Positioning & Strategy Engine](#12-service-7-issue-positioning--strategy-engine)
13. [Service 8: Political Stakeholder CRM](#13-service-8-political-stakeholder-crm)
14. [Service 9: Campaign Intelligence Suite](#14-service-9-campaign-intelligence-suite)
15. [Service 10: Promoted Visibility & Policy Matchmaking](#15-service-10-promoted-visibility--policy-matchmaking)
16. [Service 11: Reporting, Compliance & Audit Trail](#16-service-11-reporting-compliance--audit-trail)
17. [Service 12: API & Integration Layer](#17-service-12-api--integration-layer)
18. [Data Ingestion Pipeline](#18-data-ingestion-pipeline)
19. [AI/LLM Integration Layer](#19-aillm-integration-layer)
20. [Pricing & Subscription Engine](#20-pricing--subscription-engine)
21. [Notification System](#21-notification-system)
22. [Search Infrastructure](#22-search-infrastructure)
23. [Deployment & Infrastructure](#23-deployment--infrastructure)
24. [Phase Priorities](#24-phase-priorities)
25. [File & Folder Structure](#25-file--folder-structure)

---

## 1. PLATFORM OVERVIEW

### 1.1 What Polaris Is

Polaris is a two-sided political intelligence platform that serves:

**Side A — Organizations:** Corporates, NGOs, trade associations, lobbying firms, and consultancies that need to monitor political activity, manage stakeholder relationships, and influence policy outcomes.

**Side B — Politicians:** Elected officials (municipal to national), candidates, contenders, and political staff who need competitive intelligence, constituency data, stakeholder management, and strategic positioning tools.

**The Marketplace Layer:** Cross-side features that create network effects — policy matchmaking, promoted visibility, anonymized intelligence sharing, and facilitated connections between both sides.

### 1.2 Core Value Proposition

No existing platform bridges both sides of political engagement. Polaris captures behavioral data from organizations AND politicians, generating cross-side intelligence that neither side can access anywhere else. This data moat deepens with every user on either side.

### 1.3 Platform Principles

- **AI-Native:** LLMs are the core production engine, not a feature bolted on. Every data point is processed, enriched, summarized, and scored by AI before reaching users.
- **API-First:** Every feature is exposed via API. The web app is one consumer of the API, not the only one.
- **Politically Neutral:** The platform serves all parties, all positions, all ideologies. Neutrality is a design constraint enforced at every level.
- **Global by Default:** Data models, ingestion pipelines, and UI are designed for multi-jurisdiction, multi-language operation from day one.
- **Privacy by Architecture:** Cross-side intelligence is always anonymized and aggregated. Raw behavioral data from one side is never exposed to the other.

### 1.4 User Roles

| Role | Side | Description |
|------|------|-------------|
| `org_owner` | A | Organization account owner. Full admin. |
| `org_admin` | A | Can manage members, billing, settings. |
| `org_member` | A | Standard user within an organization. |
| `org_viewer` | A | Read-only access to org dashboards. |
| `politician` | B | Verified elected official or appointed official. |
| `candidate` | B | Verified registered candidate for office. |
| `political_staff` | B | Staff member linked to a politician account. |
| `party_admin` | B | Political party administrator with multi-politician oversight. |
| `consultant` | A/B | PA consultant who may serve both sides. Dual-access with firewalls. |
| `platform_admin` | — | Internal Polaris staff. Super-admin access. |

---

## 2. TECH STACK

### 2.1 Core Application

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | SSR, RSC, routing, middleware |
| Styling | Tailwind CSS + shadcn/ui | Component library, consistent design system |
| Hosting | Vercel | Frontend, API routes, edge functions |
| Auth | Clerk | Multi-tenant auth, RBAC, org management, OAuth |
| Database | Neon (PostgreSQL 16) | Primary relational store |
| Vector Search | pgvector (Neon extension) | Semantic search over legislative documents |
| Graph Queries | Apache AGE (Postgres extension) | Stakeholder relationship mapping |
| Payments | Stripe | Subscriptions, metered billing, Stripe Connect |
| Email | Resend | Transactional email, alert digests |
| AI/LLM | Anthropic Claude API | Summarization, analysis, classification, generation |
| Background Jobs | Inngest | Workflow orchestration, scheduled tasks, event-driven jobs |
| Worker Compute | Railway | Long-running scraping/AI jobs (>60s) |
| Caching | Upstash Redis | Session cache, rate limiting, frequently-accessed data |
| File Storage | Vercel Blob | Raw documents (PDFs, transcripts) |
| Real-Time | Pusher | Live alerts, dashboard updates |
| Analytics | PostHog | Product analytics, feature flags, session replay |
| Error Monitoring | Sentry | Error tracking, performance monitoring |
| CI/CD | GitHub Actions | Automated testing, deployment |

### 2.2 Data Ingestion Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Web Scraping | Playwright + Browserbase | Government website scraping |
| Scraping Framework | Crawlee (Apify) | Anti-bot handling, retries, proxy rotation |
| Proxy Network | Bright Data | Geo-distributed proxies for government sites |
| Event Streaming | Upstash Kafka | Ingestion event pipeline |
| Workflow Orchestration | Inngest | Multi-step ingestion: scrape → clean → AI → store → notify |
| Document Storage | Vercel Blob / S3 | Raw bill text, PDFs, committee transcripts |
| Media Monitoring | GDELT + NewsAPI | Global news and media tracking |

### 2.3 Data Sources (Official APIs — Prioritize Over Scraping)

| Jurisdiction | Source | Type | Coverage |
|-------------|--------|------|----------|
| US Federal | Congress.gov API | Official | Bills, votes, members, committees |
| US States | OpenStates API | Aggregator | All 50 state legislatures |
| US Federal (supplemental) | ProPublica Congress API | Aggregator | Bills, votes, statements |
| US Federal (documents) | GovInfo API | Official | Federal register, reports |
| UK Parliament | UK Parliament API | Official | Bills, debates, votes, members, committees |
| UK (supplemental) | TheyWorkForYou API | Aggregator | Parsed Hansard, votes |
| EU | European Parliament Open Data | Official | MEPs, votes, documents |
| EU (legal) | EUR-Lex API | Official | EU legislation, directives |
| Canada | OpenParliament.ca API | Aggregator | Debates, votes, bills |
| Australia | APH API | Official | Bills, Hansard, committees |
| Global Politicians | EveryPolitician (Wikidata) | Open Data | Politician database, multi-country |
| Global Media | GDELT Project | Open Data | Global media monitoring |
| Global News | NewsAPI / Mediastack | Commercial | News aggregation |

### 2.4 Package Dependencies (package.json core)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "@clerk/nextjs": "^5.0.0",
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.34.0",
    "stripe": "^17.0.0",
    "resend": "^4.0.0",
    "@anthropic-ai/sdk": "^0.30.0",
    "inngest": "^3.0.0",
    "pusher": "^5.0.0",
    "pusher-js": "^8.0.0",
    "@upstash/redis": "^1.34.0",
    "@upstash/kafka": "^1.3.0",
    "recharts": "^2.12.0",
    "reactflow": "^11.0.0",
    "date-fns": "^3.0.0",
    "zod": "^3.22.0",
    "posthog-js": "^1.0.0",
    "@sentry/nextjs": "^8.0.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.25.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "playwright": "^1.45.0"
  }
}
```

---

## 3. ARCHITECTURE OVERVIEW

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     VERCEL (Edge)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Next.js App  │  │  API Routes  │  │  Middleware    │  │
│  │  (App Router) │  │  /api/*      │  │  (Auth/Rate)  │  │
│  └──────────────┘  └──────┬───────┘  └───────────────┘  │
└────────────────────────────┼────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │   Neon PG     │ │ Upstash  │ │   Clerk     │
     │  + pgvector   │ │  Redis   │ │   Auth      │
     │  + Apache AGE │ │  + Kafka │ │             │
     └───────────────┘ └──────────┘ └─────────────┘
              │
     ┌────────▼──────────────────────────────┐
     │           INNGEST (Orchestrator)       │
     │  ┌──────────┐  ┌──────────┐           │
     │  │ Scheduled │  │  Event   │           │
     │  │   Jobs    │  │ Handlers │           │
     │  └──────────┘  └──────────┘           │
     └───────────────────┬───────────────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
     ┌────────▼───┐ ┌───▼────┐ ┌───▼──────────┐
     │  Railway   │ │ Claude │ │  Stripe      │
     │  Workers   │ │  API   │ │  Billing     │
     │ (Scraping) │ │        │ │              │
     └────────────┘ └────────┘ └──────────────┘
              │
     ┌────────▼──────────────────────────────┐
     │         DATA SOURCES                   │
     │  Congress.gov │ UK Parliament │ GDELT  │
     │  OpenStates   │ EUR-Lex      │ NewsAPI │
     │  + 20 more official APIs & scrapers    │
     └────────────────────────────────────────┘
```

### 3.2 Request Flow

1. **User Request** → Vercel Edge → Clerk Auth Middleware (verify JWT, extract org/role)
2. **Middleware** → Inject `userId`, `orgId`, `role`, `tier` into request context
3. **API Route** → Validate request with Zod → Check feature access against tier
4. **Data Layer** → Drizzle ORM → Neon PostgreSQL (with pgvector/AGE as needed)
5. **AI Processing** → If needed, enqueue via Inngest → Claude API → Store results
6. **Response** → JSON response with appropriate pagination/caching headers
7. **Real-Time** → If subscription-relevant, broadcast via Pusher channel

### 3.3 Background Job Flow

1. **Trigger** → Scheduled cron OR webhook from data source OR user action
2. **Inngest** → Route to appropriate function handler
3. **Short Jobs (<60s)** → Execute in Vercel serverless function
4. **Long Jobs (>60s)** → Dispatch to Railway worker via HTTP
5. **Railway Worker** → Scrape/process → Push results to Upstash Kafka
6. **Kafka Consumer** → Process events → Write to Neon → Trigger notifications

---

## 4. AUTHENTICATION & AUTHORIZATION

### 4.1 Clerk Configuration

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/about',
  '/api/webhooks/(.*)',
  '/api/public/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});
```

### 4.2 Organization Model

Clerk Organizations map to Polaris accounts:

- **Organization** = Company, NGO, political party, consultancy
- **Organization Membership** = User's role within that org
- **Personal Account** = Politician's individual account (no org required)

### 4.3 Permission Model

```typescript
// lib/permissions.ts

export type UserSide = 'org' | 'politician' | 'dual';
export type OrgTier = 'starter' | 'professional' | 'enterprise' | 'global';
export type PolTier = 'foundation' | 'professional' | 'strategic' | 'campaign';

export interface UserContext {
  userId: string;
  side: UserSide;
  orgId?: string;
  orgRole?: 'owner' | 'admin' | 'member' | 'viewer';
  orgTier?: OrgTier;
  polTier?: PolTier;
  politicianId?: string;
  jurisdictions: string[]; // country codes or jurisdiction IDs
}

// Feature access matrix
export const FEATURE_ACCESS = {
  // Service 1: Legislative Tracking
  'legislative.search': ['starter', 'professional', 'enterprise', 'global'],
  'legislative.alerts': ['starter', 'professional', 'enterprise', 'global'],
  'legislative.ai_summaries': ['professional', 'enterprise', 'global'],
  'legislative.predictive': ['enterprise', 'global'],
  'legislative.multi_jurisdiction': ['enterprise', 'global'],
  
  // Service 2: Stakeholder Mapping
  'stakeholder.directory': ['professional', 'enterprise', 'global'],
  'stakeholder.graph': ['enterprise', 'global'],
  'stakeholder.relationship_paths': ['enterprise', 'global'],
  
  // Service 3: Predictive Analytics
  'predictive.bill_passage': ['enterprise', 'global'],
  'predictive.policy_momentum': ['enterprise', 'global'],
  'predictive.risk_scoring': ['global'],
  
  // Service 4: Sentiment Analysis
  'sentiment.basic': ['professional', 'enterprise', 'global'],
  'sentiment.multi_layer': ['enterprise', 'global'],
  'sentiment.narrative_tracking': ['enterprise', 'global'],
  
  // Service 8: CRM
  'crm.contacts_100': ['professional'],
  'crm.contacts_unlimited': ['enterprise', 'global'],
  'crm.meeting_logger': ['professional', 'enterprise', 'global'],
  
  // Service 10: Marketplace
  'marketplace.matchmaking': ['enterprise', 'global'],
  'marketplace.promoted_visibility': ['enterprise', 'global'],
  
  // Service 12: API
  'api.read': ['professional', 'enterprise', 'global'],
  'api.write': ['enterprise', 'global'],
  'api.webhooks': ['enterprise', 'global'],
  
  // Politician-side features
  'pol.dashboard': ['foundation', 'professional', 'strategic', 'campaign'],
  'pol.competitive_intel': ['professional', 'strategic'],
  'pol.constituency': ['professional', 'strategic', 'campaign'],
  'pol.issue_positioning': ['strategic'],
  'pol.crm': ['professional', 'strategic'],
  'pol.campaign_suite': ['campaign'],
  'pol.cross_side_intel': ['professional', 'strategic'],
} as const;

export function hasAccess(ctx: UserContext, feature: keyof typeof FEATURE_ACCESS): boolean {
  const allowedTiers = FEATURE_ACCESS[feature];
  if (ctx.side === 'org' || ctx.side === 'dual') {
    if (ctx.orgTier && allowedTiers.includes(ctx.orgTier)) return true;
  }
  if (ctx.side === 'politician' || ctx.side === 'dual') {
    if (ctx.polTier && allowedTiers.includes(ctx.polTier)) return true;
  }
  return false;
}
```

### 4.4 Dual-Access Users

A user can be BOTH an org member and a verified politician. This is common for politicians who also run consultancies, or PA professionals who hold local office.

Implementation: Clerk metadata stores both `orgMemberships[]` and `politicianProfile`. The UI shows a context switcher. API requests include the active context. Data firewalls ensure a user in "politician mode" cannot access their org's monitoring data about themselves, and vice versa.

```typescript
// Clerk user metadata structure
interface UserPublicMetadata {
  side: 'org' | 'politician' | 'dual';
  politicianId?: string;       // If verified politician
  polTier?: PolTier;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  jurisdictions?: string[];
}
```

---

## 5. DATABASE SCHEMA

### 5.1 ORM: Drizzle

All schemas defined with Drizzle ORM for type-safe queries and migrations.

```typescript
// db/schema/index.ts — re-exports all schema modules
export * from './users';
export * from './organizations';
export * from './jurisdictions';
export * from './politicians';
export * from './legislation';
export * from './stakeholders';
export * from './monitoring';
export * from './crm';
export * from './sentiment';
export * from './predictions';
export * from './marketplace';
export * from './subscriptions';
export * from './notifications';
export * from './audit';
export * from './ingestion';
```

### 5.2 Core Tables

```typescript
// db/schema/users.ts
import { pgTable, uuid, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  side: text('side', { enum: ['org', 'politician', 'dual'] }).notNull().default('org'),
  politicianId: uuid('politician_id').references(() => politicians.id),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// db/schema/organizations.ts
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tier: text('tier', { enum: ['starter', 'professional', 'enterprise', 'global'] }).notNull().default('starter'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  industry: text('industry'),
  size: text('size', { enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'] }),
  country: text('country').notNull(),
  settings: jsonb('settings').$type<OrgSettings>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orgMemberships = pgTable('org_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role', { enum: ['owner', 'admin', 'member', 'viewer'] }).notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.3 Jurisdiction & Political Entity Tables

```typescript
// db/schema/jurisdictions.ts
export const jurisdictions = pgTable('jurisdictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),           // e.g., 'us', 'us-ca', 'gb', 'eu'
  name: text('name').notNull(),                     // e.g., 'United States', 'California', 'United Kingdom'
  level: text('level', { enum: ['supranational', 'national', 'state', 'municipal', 'district'] }).notNull(),
  parentId: uuid('parent_id').references(() => jurisdictions.id),
  country: text('country').notNull(),               // ISO 3166-1 alpha-2
  dataSourceConfig: jsonb('data_source_config').$type<DataSourceConfig>(),
  isActive: boolean('is_active').notNull().default(false),
  timezone: text('timezone').notNull().default('UTC'),
  metadata: jsonb('metadata'),
});

export const legislativeBodies = pgTable('legislative_bodies', {
  id: uuid('id').primaryKey().defaultRandom(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  name: text('name').notNull(),                     // e.g., 'US Senate', 'House of Commons'
  type: text('type', { enum: ['upper', 'lower', 'unicameral', 'committee', 'subcommittee'] }).notNull(),
  parentBodyId: uuid('parent_body_id').references(() => legislativeBodies.id),
  totalSeats: integer('total_seats'),
  currentTerm: text('current_term'),
  metadata: jsonb('metadata'),
});

export const politicalParties = pgTable('political_parties', {
  id: uuid('id').primaryKey().defaultRandom(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  color: text('color'),                             // Hex color for UI
  ideology: text('ideology'),                       // e.g., 'centre-left', 'conservative'
  isRuling: boolean('is_ruling').notNull().default(false),
  metadata: jsonb('metadata'),
});

// db/schema/politicians.ts
export const politicians = pgTable('politicians', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id'),                  // ID from source API (e.g., bioguide_id)
  externalSource: text('external_source'),          // e.g., 'congress_gov', 'uk_parliament'
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  fullName: text('full_name').notNull(),
  slug: text('slug').notNull().unique(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id),
  partyId: uuid('party_id').references(() => politicalParties.id),
  position: text('position'),                       // e.g., 'Senator', 'MP', 'Councillor'
  constituency: text('constituency'),
  status: text('status', { enum: ['active', 'former', 'candidate', 'contender'] }).notNull(),
  imageUrl: text('image_url'),
  contactEmail: text('contact_email'),
  website: text('website'),
  socialMedia: jsonb('social_media').$type<SocialMediaLinks>(),
  biography: text('biography'),
  committeeMemberships: jsonb('committee_memberships').$type<CommitteeMembership[]>(),
  userId: uuid('user_id').references(() => users.id), // Linked if politician is a platform user
  polTier: text('pol_tier', { enum: ['foundation', 'professional', 'strategic', 'campaign'] }).default('foundation'),
  verificationStatus: text('verification_status', { enum: ['unlinked', 'pending', 'verified', 'rejected'] }).default('unlinked'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Politician activity records (ingested from official sources)
export const politicianActivities = pgTable('politician_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  politicianId: uuid('politician_id').references(() => politicians.id).notNull(),
  type: text('type', { enum: [
    'vote', 'speech', 'question', 'motion', 'committee_attendance',
    'bill_sponsor', 'bill_cosponsor', 'amendment', 'press_release',
    'media_appearance', 'social_media_post'
  ] }).notNull(),
  title: text('title'),
  description: text('description'),
  sourceUrl: text('source_url'),
  sourceId: text('source_id'),
  relatedBillId: uuid('related_bill_id').references(() => bills.id),
  relatedCommitteeId: uuid('related_committee_id'),
  activityDate: timestamp('activity_date').notNull(),
  aiSummary: text('ai_summary'),
  sentiment: jsonb('sentiment').$type<SentimentScore>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.4 Legislation Tables

```typescript
// db/schema/legislation.ts
export const bills = pgTable('bills', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id').notNull(),        // Source system bill ID
  externalSource: text('external_source').notNull(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id),
  billNumber: text('bill_number').notNull(),         // e.g., 'HR 1234', 'S 567'
  title: text('title').notNull(),
  shortTitle: text('short_title'),
  description: text('description'),
  fullText: text('full_text'),                       // Full bill text (can be large)
  fullTextUrl: text('full_text_url'),
  status: text('status', { enum: [
    'introduced', 'in_committee', 'passed_committee', 'floor_vote_scheduled',
    'passed_one_chamber', 'passed_both_chambers', 'sent_to_executive',
    'signed_into_law', 'vetoed', 'failed', 'withdrawn', 'expired'
  ] }).notNull(),
  statusDate: timestamp('status_date'),
  introducedDate: timestamp('introduced_date').notNull(),
  sponsors: jsonb('sponsors').$type<BillSponsor[]>(),
  cosponsors: jsonb('cosponsors').$type<BillSponsor[]>(),
  committees: jsonb('committees').$type<string[]>(),
  subjects: jsonb('subjects').$type<string[]>(),      // Topic tags
  aiSummary: text('ai_summary'),
  aiImpactAnalysis: jsonb('ai_impact_analysis').$type<ImpactAnalysis>(),
  aiTopics: jsonb('ai_topics').$type<string[]>(),     // AI-classified topics
  passageProbability: real('passage_probability'),     // 0.0 to 1.0
  embedding: vector('embedding', { dimensions: 1536 }), // pgvector for semantic search
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const billVersions = pgTable('bill_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').references(() => bills.id).notNull(),
  versionNumber: integer('version_number').notNull(),
  versionDate: timestamp('version_date').notNull(),
  fullText: text('full_text'),
  changesSummary: text('changes_summary'),           // AI-generated diff summary
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const billVotes = pgTable('bill_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').references(() => bills.id).notNull(),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id).notNull(),
  voteDate: timestamp('vote_date').notNull(),
  result: text('result', { enum: ['passed', 'failed', 'tabled', 'other'] }).notNull(),
  yesCount: integer('yes_count'),
  noCount: integer('no_count'),
  abstainCount: integer('abstain_count'),
  absentCount: integer('absent_count'),
  individualVotes: jsonb('individual_votes').$type<IndividualVote[]>(),
  metadata: jsonb('metadata'),
});

export const committees = pgTable('committees', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: text('external_id'),
  legislativeBodyId: uuid('legislative_body_id').references(() => legislativeBodies.id).notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: ['standing', 'select', 'joint', 'subcommittee', 'ad_hoc'] }).notNull(),
  parentCommitteeId: uuid('parent_committee_id').references(() => committees.id),
  chair: jsonb('chair').$type<{ politicianId: string; name: string }>(),
  members: jsonb('members').$type<CommitteeMember[]>(),
  jurisdiction: text('jurisdiction'),
  metadata: jsonb('metadata'),
});

export const committeeEvents = pgTable('committee_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  committeeId: uuid('committee_id').references(() => committees.id).notNull(),
  type: text('type', { enum: ['hearing', 'markup', 'business_meeting', 'vote', 'other'] }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  scheduledDate: timestamp('scheduled_date').notNull(),
  location: text('location'),
  liveStreamUrl: text('live_stream_url'),
  transcriptUrl: text('transcript_url'),
  aiSummary: text('ai_summary'),
  witnesses: jsonb('witnesses').$type<Witness[]>(),
  relatedBills: jsonb('related_bills').$type<string[]>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.5 Monitoring & Alerts Tables

```typescript
// db/schema/monitoring.ts

// What organizations/politicians are tracking
export const monitoringTopics = pgTable('monitoring_topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull(),              // User or Org ID
  ownerType: text('owner_type', { enum: ['user', 'organization'] }).notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: [
    'bill', 'keyword', 'committee', 'politician', 'policy_area',
    'jurisdiction', 'custom_query'
  ] }).notNull(),
  config: jsonb('config').$type<MonitoringConfig>(), // Specific parameters per type
  jurisdictionIds: jsonb('jurisdiction_ids').$type<string[]>(),
  isActive: boolean('is_active').notNull().default(true),
  alertFrequency: text('alert_frequency', { enum: ['realtime', 'daily', 'weekly'] }).default('daily'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Saved searches
export const savedSearches = pgTable('saved_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  orgId: uuid('org_id').references(() => organizations.id),
  name: text('name').notNull(),
  searchType: text('search_type', { enum: ['legislation', 'politicians', 'media', 'stakeholders'] }).notNull(),
  query: jsonb('query').$type<SearchQuery>(),
  resultCount: integer('result_count'),
  lastRunAt: timestamp('last_run_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Alert deliveries
export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  monitoringTopicId: uuid('monitoring_topic_id').references(() => monitoringTopics.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type', { enum: [
    'bill_status_change', 'new_bill_match', 'committee_event',
    'politician_activity', 'media_mention', 'sentiment_shift',
    'stakeholder_update', 'prediction_change'
  ] }).notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  sourceUrl: text('source_url'),
  relatedEntityId: uuid('related_entity_id'),
  relatedEntityType: text('related_entity_type'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium'),
  isRead: boolean('is_read').notNull().default(false),
  deliveredVia: jsonb('delivered_via').$type<string[]>(), // ['email', 'push', 'slack']
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.6 CRM Tables

```typescript
// db/schema/crm.ts

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: text('owner_type', { enum: ['user', 'organization', 'politician'] }).notNull(),
  // Contact can be a politician, org representative, journalist, etc.
  contactType: text('contact_type', { enum: [
    'politician', 'staff', 'lobbyist', 'journalist', 'industry_contact',
    'constituent', 'donor', 'party_member', 'other'
  ] }).notNull(),
  politicianId: uuid('politician_id').references(() => politicians.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  organization: text('organization'),
  position: text('position'),
  notes: text('notes'),
  tags: jsonb('tags').$type<string[]>(),
  customFields: jsonb('custom_fields').$type<Record<string, string>>(),
  lastContactDate: timestamp('last_contact_date'),
  relationshipStrength: integer('relationship_strength'), // 1-10
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const interactions = pgTable('interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id').references(() => contacts.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type', { enum: [
    'meeting', 'call', 'email', 'event', 'letter', 'social_media',
    'committee_hearing', 'reception', 'briefing', 'other'
  ] }).notNull(),
  title: text('title'),
  description: text('description'),
  date: timestamp('date').notNull(),
  duration: integer('duration'),                    // Minutes
  location: text('location'),
  outcome: text('outcome'),
  followUpDate: timestamp('follow_up_date'),
  followUpAction: text('follow_up_action'),
  relatedBillIds: jsonb('related_bill_ids').$type<string[]>(),
  relatedTopics: jsonb('related_topics').$type<string[]>(),
  attachments: jsonb('attachments').$type<Attachment[]>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.7 Sentiment & Analytics Tables

```typescript
// db/schema/sentiment.ts

export const sentimentRecords = pgTable('sentiment_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type', { enum: ['bill', 'policy_area', 'politician', 'organization', 'topic'] }).notNull(),
  entityId: uuid('entity_id').notNull(),
  source: text('source', { enum: ['parliamentary', 'media', 'social', 'consultation', 'platform_activity'] }).notNull(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id),
  overallScore: real('overall_score').notNull(),     // -1.0 to 1.0
  positiveScore: real('positive_score'),
  negativeScore: real('negative_score'),
  neutralScore: real('neutral_score'),
  volume: integer('volume'),                         // Number of mentions/data points
  topKeywords: jsonb('top_keywords').$type<string[]>(),
  sampleQuotes: jsonb('sample_quotes').$type<SampleQuote[]>(),
  analysisDate: timestamp('analysis_date').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Prediction records for bills and policy outcomes
export const predictions = pgTable('predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id').references(() => bills.id),
  policyArea: text('policy_area'),
  predictionType: text('prediction_type', { enum: [
    'passage_probability', 'amendment_likelihood', 'timeline_estimate',
    'committee_action', 'executive_action', 'impact_score'
  ] }).notNull(),
  value: real('value').notNull(),                    // 0.0 to 1.0 or score
  confidence: real('confidence').notNull(),          // 0.0 to 1.0
  reasoning: text('reasoning'),                      // AI explanation
  factors: jsonb('factors').$type<PredictionFactor[]>(),
  previousValue: real('previous_value'),
  predictionDate: timestamp('prediction_date').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.8 Marketplace Tables

```typescript
// db/schema/marketplace.ts

// Cross-side anonymized monitoring activity (aggregated)
export const monitoringSignals = pgTable('monitoring_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicArea: text('topic_area').notNull(),           // e.g., 'energy_regulation', 'fintech'
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  billId: uuid('bill_id').references(() => bills.id),
  orgCount: integer('org_count').notNull(),          // Number of orgs monitoring this
  sectorBreakdown: jsonb('sector_breakdown').$type<Record<string, number>>(), // Anonymized
  trendDirection: text('trend_direction', { enum: ['rising', 'stable', 'falling'] }),
  signalStrength: real('signal_strength'),           // Normalized 0-1
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Policy matchmaking
export const matchmakingProfiles = pgTable('matchmaking_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: text('owner_type', { enum: ['organization', 'politician'] }).notNull(),
  isActive: boolean('is_active').notNull().default(false),
  policyAreas: jsonb('policy_areas').$type<string[]>(),
  jurisdictions: jsonb('jurisdictions').$type<string[]>(),
  engagementPreferences: jsonb('engagement_preferences').$type<EngagementPrefs>(),
  visibility: text('visibility', { enum: ['public', 'network_only', 'invite_only'] }).default('network_only'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const matchmakingConnections = pgTable('matchmaking_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  initiatorId: uuid('initiator_id').notNull(),
  initiatorType: text('initiator_type', { enum: ['organization', 'politician'] }).notNull(),
  targetId: uuid('target_id').notNull(),
  targetType: text('target_type', { enum: ['organization', 'politician'] }).notNull(),
  status: text('status', { enum: ['suggested', 'requested', 'accepted', 'declined', 'expired'] }).notNull(),
  matchScore: real('match_score'),                   // AI-computed relevance
  matchReason: text('match_reason'),
  policyArea: text('policy_area'),
  stripePaymentId: text('stripe_payment_id'),        // If connection fee applies
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Promoted visibility campaigns
export const promotedVisibility = pgTable('promoted_visibility', {
  id: uuid('id').primaryKey().defaultRandom(),
  politicianId: uuid('politician_id').references(() => politicians.id).notNull(),
  campaignName: text('campaign_name').notNull(),
  policyPositions: jsonb('policy_positions').$type<PolicyPosition[]>(),
  targetSectors: jsonb('target_sectors').$type<string[]>(),
  targetJurisdictions: jsonb('target_jurisdictions').$type<string[]>(),
  budget: integer('budget'),                         // Monthly budget in cents
  status: text('status', { enum: ['draft', 'active', 'paused', 'expired'] }).notNull(),
  impressions: integer('impressions').default(0),
  engagements: integer('engagements').default(0),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.9 Subscription & Billing Tables

```typescript
// db/schema/subscriptions.ts

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull(),
  ownerType: text('owner_type', { enum: ['organization', 'user'] }).notNull(),
  tier: text('tier').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  status: text('status', { enum: ['active', 'past_due', 'canceled', 'trialing', 'paused'] }).notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  seats: integer('seats').default(1),
  jurisdictions: jsonb('jurisdictions').$type<string[]>(),
  addOns: jsonb('add_ons').$type<string[]>(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usageRecords = pgTable('usage_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id).notNull(),
  featureKey: text('feature_key').notNull(),         // e.g., 'api_calls', 'ai_summaries', 'contacts'
  quantity: integer('quantity').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.10 Audit & Compliance Tables

```typescript
// db/schema/audit.ts

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  orgId: uuid('org_id').references(() => organizations.id),
  action: text('action').notNull(),                  // e.g., 'stakeholder.meeting_logged', 'bill.alert_created'
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Lobbying register compliance records
export const complianceRecords = pgTable('compliance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  jurisdictionId: uuid('jurisdiction_id').references(() => jurisdictions.id).notNull(),
  reportType: text('report_type', { enum: ['lobbying_register', 'meeting_disclosure', 'quarterly_report', 'annual_report'] }).notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  status: text('status', { enum: ['draft', 'generated', 'submitted', 'archived'] }).notNull(),
  reportData: jsonb('report_data'),
  fileUrl: text('file_url'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 5.11 Data Ingestion Tables

```typescript
// db/schema/ingestion.ts

export const ingestionJobs = pgTable('ingestion_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: text('source').notNull(),                  // e.g., 'congress_gov', 'uk_parliament'
  jobType: text('job_type', { enum: ['full_sync', 'incremental', 'realtime', 'backfill'] }).notNull(),
  status: text('status', { enum: ['queued', 'running', 'completed', 'failed', 'retrying'] }).notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  recordsProcessed: integer('records_processed').default(0),
  recordsFailed: integer('records_failed').default(0),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ingestionSourceHealth = pgTable('ingestion_source_health', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: text('source').notNull().unique(),
  lastSuccessfulRun: timestamp('last_successful_run'),
  lastFailedRun: timestamp('last_failed_run'),
  consecutiveFailures: integer('consecutive_failures').default(0),
  averageRunTimeMs: integer('average_run_time_ms'),
  status: text('status', { enum: ['healthy', 'degraded', 'down'] }).notNull().default('healthy'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 6. SERVICE 1: POLITICAL MONITORING & LEGISLATIVE TRACKING

### 6.1 Scope

Real-time tracking of bills, debates, committee sessions, amendments, regulatory consultations, ministerial statements, and written questions across all active jurisdictions.

### 6.2 API Endpoints

```
GET    /api/v1/bills                           — Search/filter bills
GET    /api/v1/bills/:id                       — Bill detail + AI summary
GET    /api/v1/bills/:id/versions              — Bill version history with diff summaries
GET    /api/v1/bills/:id/votes                 — Vote records
GET    /api/v1/bills/:id/timeline              — Status change timeline
GET    /api/v1/bills/:id/related               — Related bills (semantic similarity)
GET    /api/v1/bills/:id/impact                — AI impact analysis
POST   /api/v1/bills/:id/monitor               — Add bill to monitoring list
DELETE /api/v1/bills/:id/monitor               — Remove from monitoring

GET    /api/v1/committees                      — List committees
GET    /api/v1/committees/:id                  — Committee detail
GET    /api/v1/committees/:id/events           — Upcoming/past events
GET    /api/v1/committees/:id/members          — Current members

GET    /api/v1/debates                         — Search debates/sessions
GET    /api/v1/debates/:id                     — Debate detail + AI summary
GET    /api/v1/debates/:id/speeches            — Individual speeches

GET    /api/v1/monitoring/topics               — User's monitoring topics
POST   /api/v1/monitoring/topics               — Create monitoring topic
PUT    /api/v1/monitoring/topics/:id           — Update topic
DELETE /api/v1/monitoring/topics/:id           — Delete topic
GET    /api/v1/monitoring/feed                 — Aggregated feed of monitored activity

GET    /api/v1/alerts                          — User's alerts
PUT    /api/v1/alerts/:id/read                 — Mark alert as read
PUT    /api/v1/alerts/read-all                 — Mark all as read
```

### 6.3 Bill Search Query Schema

```typescript
// types/search.ts
interface BillSearchQuery {
  q?: string;                                       // Full-text search
  jurisdictionIds?: string[];
  legislativeBodyIds?: string[];
  status?: BillStatus[];
  subjects?: string[];
  sponsors?: string[];                              // Politician IDs
  introducedAfter?: string;                         // ISO date
  introducedBefore?: string;
  updatedAfter?: string;
  sort?: 'relevance' | 'introduced_date' | 'updated_date' | 'passage_probability';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;                                    // Max 100
  semantic?: boolean;                               // Use vector search
}
```

### 6.4 AI Processing Pipeline (per bill)

```
1. RAW TEXT INGESTION
   └─ Ingest full bill text from source API/scrape
   
2. CLASSIFICATION (Claude Haiku — fast, cheap)
   ├─ Topic classification (multi-label, from taxonomy)
   ├─ Sector impact tags (which industries affected)
   └─ Urgency scoring (based on legislative calendar)
   
3. SUMMARIZATION (Claude Sonnet)
   ├─ Executive summary (2-3 sentences)
   ├─ Detailed summary (5-10 paragraphs)
   ├─ Key provisions list
   └─ Notable changes from previous version (if amendment)
   
4. IMPACT ANALYSIS (Claude Sonnet)
   ├─ Affected sectors and industries
   ├─ Regulatory implications
   ├─ Financial impact estimate (if applicable)
   └─ Comparison with existing law
   
5. EMBEDDING GENERATION (text-embedding model)
   └─ Generate vector embedding → store in pgvector
   
6. PREDICTION SCORING (custom model + Claude)
   ├─ Passage probability (0-1)
   ├─ Timeline estimate
   └─ Committee action likelihood
   
7. NOTIFICATION DISPATCH
   └─ Match against all active monitoring topics → generate alerts
```

### 6.5 Tier Feature Matrix (Service 1)

| Feature | Starter | Professional | Enterprise | Global |
|---------|---------|-------------|------------|--------|
| Bill search | ✅ | ✅ | ✅ | ✅ |
| Bill details | ✅ | ✅ | ✅ | ✅ |
| Saved searches | 5 | 25 | Unlimited | Unlimited |
| Jurisdictions | 1 national | 1 national + states | Multi-country | All |
| AI summaries | Basic | Full | Full + impact | Full + impact + custom |
| Real-time alerts | Email only | Email + Slack | Email + Slack + Teams + API | All + custom |
| Monitoring topics | 5 | 25 | 100 | Unlimited |
| Predictive scoring | ❌ | ❌ | ✅ | ✅ |
| Semantic search | ❌ | ✅ | ✅ | ✅ |
| Version diff | ❌ | ✅ | ✅ | ✅ |
| API access | ❌ | Read | Read/Write | Full |

---

## 7. SERVICE 2: STAKEHOLDER INTELLIGENCE & RELATIONSHIP MAPPING

### 7.1 Scope

Interactive visual mapping of relationships between politicians, committees, party factions, lobbyists, industry groups, and media figures. Graph-based queries for path finding and network analysis.

### 7.2 API Endpoints

```
GET    /api/v1/stakeholders                    — Search stakeholder directory
GET    /api/v1/stakeholders/:id                — Stakeholder profile
GET    /api/v1/stakeholders/:id/network        — Direct connections
GET    /api/v1/stakeholders/:id/path/:targetId — Shortest path between two entities
GET    /api/v1/stakeholders/graph              — Graph query endpoint

GET    /api/v1/politicians                     — Search politicians
GET    /api/v1/politicians/:id                 — Politician full profile
GET    /api/v1/politicians/:id/activities      — Activity feed
GET    /api/v1/politicians/:id/votes           — Voting record
GET    /api/v1/politicians/:id/committees      — Committee memberships
GET    /api/v1/politicians/:id/network         — Network map
```

### 7.3 Graph Data Model (Apache AGE)

```sql
-- Graph nodes
CREATE GRAPH polaris_graph;

-- Node types
SELECT * FROM cypher('polaris_graph', $$
  CREATE (:Politician {id: 'uuid', name: 'string', party: 'string', jurisdiction: 'string'})
  CREATE (:Organization {id: 'uuid', name: 'string', sector: 'string'})
  CREATE (:Committee {id: 'uuid', name: 'string', body: 'string'})
  CREATE (:Party {id: 'uuid', name: 'string'})
  CREATE (:PolicyArea {id: 'uuid', name: 'string'})
  CREATE (:Bill {id: 'uuid', number: 'string', title: 'string'})
$$) AS (result agtype);

-- Edge types
-- MEMBER_OF: Politician → Committee, Politician → Party
-- SPONSORS: Politician → Bill
-- MONITORS: Organization → Bill, Organization → PolicyArea
-- ENGAGED_WITH: Organization → Politician (from CRM data)
-- RELATED_TO: Bill → PolicyArea, Committee → PolicyArea
-- OPPOSES / SUPPORTS: Politician → Bill (from vote records)
```

### 7.4 Path Finding Query Example

```typescript
// Find shortest path between an org's existing contacts and a target politician
async function findConnectionPath(orgId: string, targetPoliticianId: string): Promise<Path[]> {
  const result = await db.execute(sql`
    SELECT * FROM cypher('polaris_graph', $$
      MATCH path = shortestPath(
        (org:Organization {id: ${orgId}})-[*..4]-(target:Politician {id: ${targetPoliticianId}})
      )
      RETURN path
      LIMIT 5
    $$) AS (path agtype)
  `);
  return result.rows;
}
```

---

## 8. SERVICE 3: PREDICTIVE POLICY ANALYTICS

### 8.1 Scope

AI-driven probability scoring for legislative outcomes: bill passage likelihood, amendment trajectories, committee bottleneck analysis, timeline forecasting.

### 8.2 API Endpoints

```
GET    /api/v1/predictions/bills/:id           — Bill passage prediction
GET    /api/v1/predictions/policy-areas/:area  — Policy area momentum
GET    /api/v1/predictions/committees/:id      — Committee action forecast
GET    /api/v1/predictions/risk                — Political risk dashboard (org-specific)
GET    /api/v1/predictions/trends              — Macro trend analysis
```

### 8.3 Prediction Model Architecture

Predictions combine structured signals with LLM reasoning:

```typescript
interface PredictionInput {
  // Structured signals
  billStatus: string;
  sponsorCount: number;
  cosponsorCount: number;
  bipartisanCosponsors: number;
  committeeChairSupport: boolean;
  relatedBillsPassed: number;
  legislativeCalendarPosition: number;        // Days remaining in session
  executiveSupportSignal: number;             // -1 to 1
  
  // Behavioral signals (cross-side, anonymized)
  orgMonitoringCount: number;                 // How many orgs are tracking this
  orgMonitoringTrend: 'rising' | 'stable' | 'falling';
  sectorConcentration: number;               // How concentrated monitoring is by sector
  
  // Sentiment signals
  parliamentarySentiment: number;            // -1 to 1
  mediaSentiment: number;
  publicSentiment: number;
  
  // Historical comparisons
  similarBillPassRate: number;               // Historical rate for similar bills
  sponsorTrackRecord: number;               // Sponsor's historical success rate
}
```

**Scoring Pipeline:**
1. Structured model (logistic regression or gradient boosting) produces base probability from structured features
2. Claude Sonnet receives the structured score + bill text + recent political context → produces adjusted probability with reasoning
3. Final score = weighted blend (60% structured, 40% LLM-adjusted) with confidence interval
4. Scores recalculated: on status change, weekly for active bills, daily for floor-vote-imminent bills

---

## 9. SERVICE 4: SENTIMENT & NARRATIVE ANALYSIS

### 9.1 Scope

Multi-layer sentiment tracking across parliamentary proceedings, media, social platforms, public consultations, and platform activity. Tracks how issues, organizations, and politicians are discussed.

### 9.2 API Endpoints

```
GET    /api/v1/sentiment/entity/:type/:id      — Sentiment for specific entity
GET    /api/v1/sentiment/topic/:topic          — Sentiment for policy topic
GET    /api/v1/sentiment/timeline/:entityId    — Sentiment over time
GET    /api/v1/sentiment/comparison            — Compare sentiment across entities
GET    /api/v1/sentiment/narratives/:topic     — Dominant narratives for topic
```

### 9.3 Sentiment Layers

```typescript
interface MultiLayerSentiment {
  parliamentary: {
    score: number;           // -1 to 1
    volume: number;          // Number of mentions in debates/questions
    topSpeakers: PoliticianSentiment[];
    trend: 'improving' | 'stable' | 'declining';
  };
  media: {
    score: number;
    volume: number;
    topSources: MediaSentiment[];
    framing: string[];       // Dominant narrative frames
    trend: string;
  };
  social: {
    score: number;
    volume: number;
    platformBreakdown: Record<string, number>;
    hashtags: string[];
    trend: string;
  };
  platform: {               // Cross-side signal (anonymized)
    monitoringIntensity: number;  // 0-1, how intensely this topic is being tracked
    sectorInterest: Record<string, number>;
    trend: string;
  };
  composite: {
    score: number;
    confidence: number;
    divergenceAlert: boolean;  // True if layers significantly disagree
  };
}
```

---

## 10. SERVICE 5: COMPETITIVE POLITICAL INTELLIGENCE

### 10.1 Scope

**Politician-side only.** Automated tracking of rival politicians: speeches, voting records, media coverage, stakeholder engagement, committee activity, issue positioning.

### 10.2 API Endpoints

```
GET    /api/v1/pol/competitors                 — Configured competitor list
POST   /api/v1/pol/competitors                 — Add competitor to track
DELETE /api/v1/pol/competitors/:id             — Remove competitor
GET    /api/v1/pol/competitors/:id/profile     — Competitor analysis profile
GET    /api/v1/pol/competitors/:id/activity    — Recent activity feed
GET    /api/v1/pol/competitors/comparison      — Side-by-side comparison
GET    /api/v1/pol/competitors/briefing        — AI-generated competitive briefing
```

### 10.3 Competitor Briefing (AI-Generated)

```typescript
interface CompetitorBriefing {
  generatedAt: string;
  period: { start: string; end: string };
  competitors: CompetitorAnalysis[];
  keyTakeaways: string[];
  suggestedActions: string[];
}

interface CompetitorAnalysis {
  politicianId: string;
  name: string;
  activitySummary: string;
  speechCount: number;
  questionsAsked: number;
  mediaAppearances: number;
  issuesClaimed: string[];        // Topics they're actively owning
  issueGaps: string[];            // Topics you cover that they don't
  sentimentShift: number;         // Change in their public sentiment
  notableActions: string[];       // AI-highlighted significant moves
}
```

### 10.4 Tier Access

| Feature | Foundation (Free) | Professional | Strategic |
|---------|------------------|-------------|-----------|
| Competitor tracking | ❌ | 5 politicians | 20 politicians |
| Activity feed | ❌ | ✅ | ✅ |
| Side-by-side comparison | ❌ | ✅ | ✅ |
| AI competitive briefing | ❌ | Monthly | Weekly |
| Issue gap analysis | ❌ | ❌ | ✅ |

---

## 11. SERVICE 6: CONSTITUENCY & DISTRICT INTELLIGENCE

### 11.1 Scope

**Politician-side.** Hyperlocal intelligence: local media monitoring, planning applications, infrastructure projects, demographic data, local business activity, constituent sentiment.

### 11.2 API Endpoints

```
GET    /api/v1/pol/constituency                — Dashboard overview
GET    /api/v1/pol/constituency/issues         — Top local issues
GET    /api/v1/pol/constituency/media          — Local media monitoring
GET    /api/v1/pol/constituency/demographics   — Demographic data
GET    /api/v1/pol/constituency/projects       — Local projects & planning
GET    /api/v1/pol/constituency/national-impact — National policy impact on constituency
```

### 11.3 National-to-Local Impact Mapping

Key differentiator: when national legislation is being debated, the platform automatically identifies local implications.

```typescript
interface NationalLocalImpact {
  billId: string;
  billTitle: string;
  constituencyImpacts: {
    type: 'planning' | 'business' | 'employment' | 'infrastructure' | 'education' | 'health';
    description: string;              // AI-generated
    affectedEntities: string[];       // Local businesses, schools, hospitals, etc.
    estimatedImpactLevel: 'low' | 'medium' | 'high';
    dataPoints: DataPoint[];          // Supporting evidence
  }[];
}
```

---

## 12. SERVICE 7: ISSUE POSITIONING & STRATEGY ENGINE

### 12.1 Scope

**Politician-side (Strategic tier).** AI-driven analysis of the political landscape showing unclaimed territory, narrative gaps, and positioning opportunities.

### 12.2 API Endpoints

```
GET    /api/v1/pol/positioning/opportunities   — Issue ownership opportunities
GET    /api/v1/pol/positioning/landscape        — Political landscape map
GET    /api/v1/pol/positioning/briefing         — Strategy briefing (AI)
GET    /api/v1/pol/positioning/gap-analysis     — Narrative gap analysis
```

### 12.3 Opportunity Scoring

```typescript
interface PositioningOpportunity {
  policyArea: string;
  opportunityScore: number;          // 0-1
  factors: {
    publicDemand: number;            // Public sentiment/interest level
    corporateAttention: number;      // Cross-side signal: org monitoring intensity
    politicalCompetition: number;    // How many politicians are active on this
    partyAlignment: number;          // Alignment with user's party platform
    timeliness: number;              // Relevance to current legislative calendar
  };
  suggestedAngle: string;            // AI-generated positioning suggestion
  riskAssessment: string;
  relatedBills: string[];
  competitorActivity: string[];      // Who else is working this space
}
```

---

## 13. SERVICE 8: POLITICAL STAKEHOLDER CRM

### 13.1 Scope

Purpose-built CRM for both sides. Organizations track politician relationships. Politicians track industry, constituent, media, and party contacts.

### 13.2 API Endpoints

```
GET    /api/v1/crm/contacts                    — List contacts (filtered)
POST   /api/v1/crm/contacts                    — Create contact
GET    /api/v1/crm/contacts/:id                — Contact detail
PUT    /api/v1/crm/contacts/:id                — Update contact
DELETE /api/v1/crm/contacts/:id                — Delete contact

POST   /api/v1/crm/interactions                — Log interaction
GET    /api/v1/crm/interactions                — List interactions
GET    /api/v1/crm/interactions/:id            — Interaction detail

GET    /api/v1/crm/dashboard                   — CRM overview metrics
GET    /api/v1/crm/follow-ups                  — Upcoming follow-ups
GET    /api/v1/crm/timeline/:contactId         — Full relationship timeline
```

### 13.3 CRM Intelligence Layer

When a user logs a meeting with a politician or stakeholder, the system automatically:

1. Surfaces relevant pending legislation related to the meeting topics
2. Shows recent activity by the contact (votes, speeches, media)
3. Suggests follow-up actions based on legislative calendar
4. Updates relationship strength score
5. Feeds anonymized engagement data into the cross-side monitoring signals

### 13.4 Contact Limits by Tier

| Tier | Org Contacts | Pol Contacts |
|------|-------------|-------------|
| Starter | ❌ (no CRM) | — |
| Professional | 100 | 200 |
| Enterprise | Unlimited | — |
| Global | Unlimited | — |
| Foundation (Free) | — | ❌ |
| Pol Professional | — | 200 |
| Pol Strategic | — | Unlimited |

---

## 14. SERVICE 9: CAMPAIGN INTELLIGENCE SUITE

### 14.1 Scope

Election-cycle tools for candidates: constituency analysis, swing data, issue mapping, opponent tracking, messaging gap analysis. Designed to complement (not replace) campaign tools like NGP VAN and NationBuilder.

### 14.2 API Endpoints

```
GET    /api/v1/campaign/overview               — Campaign dashboard
GET    /api/v1/campaign/constituency-analysis   — Constituency data package
GET    /api/v1/campaign/issues                 — Local issue priority map
GET    /api/v1/campaign/opponents              — Opponent analysis
GET    /api/v1/campaign/messaging-gaps         — Messaging opportunity analysis
GET    /api/v1/campaign/timeline               — Key dates & deadlines
```

### 14.3 Campaign Pricing (Jurisdiction-Scaled)

```typescript
const CAMPAIGN_PRICING = {
  municipal: { monthlyPrice: 29900, features: ['local_intelligence', 'ward_data', 'opponent_basic'] },
  state: { monthlyPrice: 59900, features: ['constituency_analysis', 'regional_stakeholders', 'opponent_full'] },
  national: { monthlyPrice: 99900, features: ['full_national_suite', 'media_analysis', 'donor_mapping'] },
} as const; // Prices in cents
```

---

## 15. SERVICE 10: PROMOTED VISIBILITY & POLICY MATCHMAKING

### 15.1 Scope

The marketplace layer. Politicians surface policy positions to relevant organizations. Organizations signal interest in policy areas to relevant politicians. Both sides opt in.

### 15.2 API Endpoints

```
# Matchmaking
GET    /api/v1/marketplace/profile             — Own matchmaking profile
PUT    /api/v1/marketplace/profile             — Update profile
GET    /api/v1/marketplace/suggestions         — AI-suggested connections
POST   /api/v1/marketplace/connect/:targetId   — Request connection
PUT    /api/v1/marketplace/connections/:id      — Accept/decline

# Promoted Visibility (Politician-side)
POST   /api/v1/marketplace/visibility          — Create visibility campaign
GET    /api/v1/marketplace/visibility          — List campaigns
PUT    /api/v1/marketplace/visibility/:id      — Update campaign
GET    /api/v1/marketplace/visibility/:id/stats — Campaign performance

# Cross-Side Intelligence
GET    /api/v1/marketplace/signals             — Monitoring signals (anonymized)
GET    /api/v1/marketplace/signals/:topic      — Topic-specific signals
GET    /api/v1/marketplace/heatmap             — Sector interest heatmap
```

### 15.3 Privacy Controls

```typescript
// CRITICAL: Cross-side data is ALWAYS anonymized and aggregated
// Minimum aggregation threshold: 5 organizations before any signal is surfaced
// Never expose: individual org names, specific monitoring queries, individual user behavior
// Always expose: sector-level aggregates, topic-level trends, volume indicators

interface CrossSideSignal {
  topicArea: string;
  sectorBreakdown: Record<string, number>;     // Only sectors with 5+ orgs
  totalOrgsMonitoring: number;                 // Rounded to nearest 5
  trend: 'rising' | 'stable' | 'falling';
  signalStrength: number;                      // 0-1
  // NEVER includes: org names, org IDs, user IDs, specific queries
}
```

---

## 16. SERVICE 11: REPORTING, COMPLIANCE & AUDIT TRAIL

### 16.1 Scope

Automated report generation for both sides. Corporate: board reports, ROI dashboards, lobbying register filings. Politicians: transparency reports, engagement summaries.

### 16.2 API Endpoints

```
GET    /api/v1/reports/templates               — Available report templates
POST   /api/v1/reports/generate                — Generate report
GET    /api/v1/reports/:id                     — Report detail/download
GET    /api/v1/reports                         — Report history

GET    /api/v1/compliance/records              — Compliance filing records
POST   /api/v1/compliance/generate             — Generate compliance filing
GET    /api/v1/compliance/requirements/:jurisdiction — Jurisdiction requirements

GET    /api/v1/audit/log                       — Audit trail (admin)
```

### 16.3 Report Types

```typescript
type ReportType =
  // Organization reports
  | 'org_executive_summary'          // Monthly/quarterly PA activity overview
  | 'org_board_report'               // Board-level political risk summary
  | 'org_stakeholder_engagement'     // Engagement activity report
  | 'org_legislative_tracker'        // Status of all monitored bills
  | 'org_roi_dashboard'              // Engagement ROI metrics
  | 'org_lobbying_register'          // Jurisdiction-specific compliance filing
  // Politician reports
  | 'pol_activity_summary'           // Activity report for party leadership
  | 'pol_engagement_transparency'    // Public transparency report
  | 'pol_constituency_update'        // Constituency newsletter content
  | 'pol_campaign_progress';         // Campaign metrics report
```

---

## 17. SERVICE 12: API & INTEGRATION LAYER

### 17.1 Scope

RESTful API with webhook support. Integrations with Salesforce, HubSpot, Slack, Microsoft Teams, and custom systems.

### 17.2 API Authentication

```typescript
// API keys managed per organization
// Rate limits by tier:
const API_RATE_LIMITS = {
  professional: { requestsPerMinute: 60, requestsPerDay: 5000 },
  enterprise: { requestsPerMinute: 300, requestsPerDay: 50000 },
  global: { requestsPerMinute: 1000, requestsPerDay: 200000 },
} as const;
```

### 17.3 Webhook Events

```typescript
type WebhookEvent =
  | 'bill.created' | 'bill.status_changed' | 'bill.vote_recorded'
  | 'committee.event_scheduled' | 'committee.event_completed'
  | 'politician.activity' | 'politician.statement'
  | 'alert.triggered' | 'alert.critical'
  | 'sentiment.shift' | 'sentiment.divergence'
  | 'prediction.changed'
  | 'connection.requested' | 'connection.accepted';
```

### 17.4 Integration Configs

```typescript
// Slack integration
interface SlackIntegration {
  type: 'slack';
  webhookUrl: string;
  channels: { alertType: string; channelId: string }[];
  filters: { jurisdictions?: string[]; topics?: string[]; priority?: string[] };
}

// Salesforce integration
interface SalesforceIntegration {
  type: 'salesforce';
  instanceUrl: string;
  accessToken: string;          // OAuth
  refreshToken: string;
  syncConfig: {
    contacts: boolean;          // Sync CRM contacts to Salesforce
    interactions: boolean;      // Sync meeting logs
    alerts: boolean;           // Push alerts as Salesforce tasks
  };
}
```

---

## 18. DATA INGESTION PIPELINE

### 18.1 Architecture

```
┌──────────────┐     ┌─────────────┐     ┌────────────────┐
│  Data Source  │────▶│  Collector   │────▶│  Upstash Kafka │
│  (API/Scrape) │     │  (Railway)   │     │  (Event Queue) │
└──────────────┘     └─────────────┘     └───────┬────────┘
                                                  │
                     ┌────────────────────────────┼────────────────────┐
                     │                            │                    │
              ┌──────▼──────┐  ┌─────────▼───────┐  ┌────────▼───────┐
              │  Normalizer  │  │  AI Enrichment   │  │  Entity Linker │
              │  (Clean/Map) │  │  (Claude API)    │  │  (Dedup/Match) │
              └──────┬──────┘  └─────────┬───────┘  └────────┬───────┘
                     │                   │                    │
                     └───────────────────┼────────────────────┘
                                         │
                                  ┌──────▼──────┐
                                  │   Neon PG    │
                                  │  + pgvector  │
                                  │  + AGE graph │
                                  └──────┬──────┘
                                         │
                                  ┌──────▼──────┐
                                  │ Notification │
                                  │   Matcher    │
                                  └─────────────┘
```

### 18.2 Ingestion Job Definitions (Inngest)

```typescript
// inngest/functions/ingest-congress.ts
import { inngest } from '@/lib/inngest';

export const ingestCongressBills = inngest.createFunction(
  { id: 'ingest-congress-bills', name: 'Ingest US Congress Bills' },
  { cron: '0 */2 * * *' },  // Every 2 hours
  async ({ step }) => {
    // Step 1: Fetch new/updated bills from Congress.gov API
    const bills = await step.run('fetch-bills', async () => {
      const response = await fetch('https://api.congress.gov/v3/bill?...');
      return response.json();
    });

    // Step 2: Process each bill
    for (const bill of bills.results) {
      await step.run(`process-bill-${bill.number}`, async () => {
        // Normalize data format
        const normalized = normalizeBill(bill, 'congress_gov');
        
        // Upsert to database
        await db.insert(bills).values(normalized).onConflictDoUpdate({
          target: [bills.externalId, bills.externalSource],
          set: normalized,
        });
      });

      // Step 3: AI enrichment (only for new or significantly changed bills)
      if (bill.isNew || bill.hasSignificantChanges) {
        await step.run(`ai-enrich-${bill.number}`, async () => {
          const summary = await generateBillSummary(bill);
          const topics = await classifyBillTopics(bill);
          const impact = await analyzeBillImpact(bill);
          const embedding = await generateEmbedding(bill.fullText);
          
          await db.update(bills)
            .set({ aiSummary: summary, aiTopics: topics, aiImpactAnalysis: impact, embedding })
            .where(eq(bills.externalId, bill.externalId));
        });
      }
    }

    // Step 4: Match against monitoring topics
    await step.run('match-monitors', async () => {
      await matchAndNotify(bills.results);
    });
  }
);
```

### 18.3 Source-Specific Collectors

Each data source has a dedicated collector module:

```
/lib/ingestion/collectors/
├── congress-gov.ts          — US Congress (official API)
├── openstates.ts            — US State legislatures
├── uk-parliament.ts         — UK Parliament (official API)
├── they-work-for-you.ts     — UK supplemental
├── eu-parliament.ts         — EU Parliament
├── eur-lex.ts               — EU legislation
├── open-parliament-ca.ts    — Canada
├── aph-au.ts                — Australia
├── gdelt.ts                 — Global media monitoring
├── newsapi.ts               — News aggregation
└── base-collector.ts        — Abstract base class
```

### 18.4 Collector Interface

```typescript
// lib/ingestion/base-collector.ts
export abstract class BaseCollector {
  abstract source: string;
  abstract jurisdictionCode: string;
  
  abstract fetchBills(since?: Date): Promise<RawBill[]>;
  abstract fetchPoliticians(): Promise<RawPolitician[]>;
  abstract fetchVotes(since?: Date): Promise<RawVote[]>;
  abstract fetchCommitteeEvents(since?: Date): Promise<RawCommitteeEvent[]>;
  abstract fetchDebates(since?: Date): Promise<RawDebate[]>;
  
  async healthCheck(): Promise<SourceHealth> { /* ... */ }
  
  // Normalize raw data to common schema
  abstract normalizeBill(raw: unknown): NormalizedBill;
  abstract normalizePolitician(raw: unknown): NormalizedPolitician;
}
```

---

## 19. AI/LLM INTEGRATION LAYER

### 19.1 Claude API Configuration

```typescript
// lib/ai/client.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model selection by task
export const AI_MODELS = {
  classification: 'claude-haiku-4-5-20251001',      // Fast, cheap
  summarization: 'claude-sonnet-4-5-20250929',      // Balanced
  analysis: 'claude-sonnet-4-5-20250929',           // Balanced
  strategy: 'claude-sonnet-4-5-20250929',           // Complex reasoning
  embedding: 'voyage-3',                             // Via Voyage AI or alternative
} as const;
```

### 19.2 Prompt Templates

```typescript
// lib/ai/prompts/bill-summary.ts
export function buildBillSummaryPrompt(bill: NormalizedBill): string {
  return `You are a non-partisan political analyst. Summarize the following legislative bill.

<bill>
  <number>${bill.billNumber}</number>
  <title>${bill.title}</title>
  <jurisdiction>${bill.jurisdiction}</jurisdiction>
  <status>${bill.status}</status>
  <introduced>${bill.introducedDate}</introduced>
  <text>${bill.fullText}</text>
</bill>

Provide your analysis in the following JSON format:
{
  "executiveSummary": "2-3 sentence overview",
  "detailedSummary": "5-10 paragraph analysis",
  "keyProvisions": ["provision 1", "provision 2", ...],
  "affectedSectors": ["sector1", "sector2"],
  "regulatoryImplications": "paragraph",
  "stakeholderImpact": {
    "businesses": "impact description",
    "consumers": "impact description",
    "government": "impact description"
  },
  "comparisonToExistingLaw": "paragraph"
}

Be factual, balanced, and avoid political bias. Focus on practical implications.`;
}
```

### 19.3 AI Processing Queue

All AI calls go through a managed queue to handle rate limits and cost control:

```typescript
// lib/ai/queue.ts
export async function queueAITask(task: AITask): Promise<string> {
  return await inngest.send({
    name: 'ai/task.queued',
    data: {
      taskId: generateId(),
      taskType: task.type,
      model: AI_MODELS[task.type],
      input: task.input,
      priority: task.priority || 'normal',
      callbackUrl: task.callbackUrl,
    },
  });
}

// Rate limit tracking
const AI_BUDGET = {
  daily: { haiku: 100000, sonnet: 10000 },          // Max tokens per day by model
  perRequest: { haiku: 4096, sonnet: 8192 },
  concurrency: { haiku: 50, sonnet: 10 },
} as const;
```

---

## 20. PRICING & SUBSCRIPTION ENGINE

### 20.1 Stripe Product Configuration

```typescript
// lib/billing/products.ts

export const STRIPE_PRODUCTS = {
  // Organization tiers
  org_starter: {
    name: 'Polaris Starter',
    prices: {
      monthly: 9900,           // $99/month
      annual: 99000,           // $990/year (2 months free)
    },
    features: { seats: 1, jurisdictions: 1, savedSearches: 5, monitoringTopics: 5 },
  },
  org_professional: {
    name: 'Polaris Professional',
    prices: {
      monthly: 49900,          // $499/month per seat
      annual: 499000,
    },
    features: { seats: 10, jurisdictions: 1, savedSearches: 25, monitoringTopics: 25, crmContacts: 100 },
  },
  org_enterprise: {
    name: 'Polaris Enterprise',
    prices: { custom: true },  // $2,500-8,000/month per seat
    features: { seats: 100, jurisdictions: 'multi', savedSearches: 'unlimited', monitoringTopics: 100, crmContacts: 'unlimited' },
  },
  org_global: {
    name: 'Polaris Global',
    prices: { custom: true },  // $150,000-500,000+/year
    features: { seats: 'unlimited', jurisdictions: 'all', everything: 'unlimited' },
  },
  
  // Politician tiers
  pol_foundation: {
    name: 'Polaris Foundation',
    prices: { monthly: 0 },
    features: { dashboard: true, mediaMentions: true, calendar: true },
  },
  pol_professional: {
    name: 'Polaris Professional (Politician)',
    prices: { monthly: 14900, annual: 149000 },
    features: { competitors: 5, crmContacts: 200, sentimentAnalysis: true, constituency: true },
  },
  pol_strategic: {
    name: 'Polaris Strategic',
    prices: { monthly: 49900, annual: 499000 },
    features: { competitors: 20, crmContacts: 'unlimited', positioning: true, predictions: true },
  },
  
  // Campaign tiers
  campaign_municipal: { name: 'Campaign - Municipal', prices: { monthly: 29900 } },
  campaign_state: { name: 'Campaign - State', prices: { monthly: 59900 } },
  campaign_national: { name: 'Campaign - National', prices: { monthly: 99900 } },
} as const;
```

### 20.2 Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'invoice.paid':
      await handlePaymentSucceeded(event.data.object);
      break;
  }
  
  return new Response('OK', { status: 200 });
}
```

---

## 21. NOTIFICATION SYSTEM

### 21.1 Multi-Channel Delivery

```typescript
// lib/notifications/channels.ts

export type NotificationChannel = 'email' | 'push' | 'slack' | 'teams' | 'webhook' | 'in_app';

export interface NotificationConfig {
  channels: NotificationChannel[];
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  quietHours?: { start: string; end: string; timezone: string };
  filters?: { minPriority: 'low' | 'medium' | 'high' | 'critical' };
}

// Notification delivery pipeline
export async function deliverNotification(alert: Alert, userConfig: NotificationConfig) {
  for (const channel of userConfig.channels) {
    switch (channel) {
      case 'email':
        await resend.emails.send({ /* ... */ });
        break;
      case 'slack':
        await fetch(userConfig.slackWebhookUrl, { method: 'POST', body: JSON.stringify(formatSlack(alert)) });
        break;
      case 'in_app':
        await pusher.trigger(`user-${alert.userId}`, 'alert', formatInApp(alert));
        break;
      case 'webhook':
        await fetch(userConfig.webhookUrl, { method: 'POST', body: JSON.stringify(alert) });
        break;
    }
  }
}
```

---

## 22. SEARCH INFRASTRUCTURE

### 22.1 Full-Text Search (PostgreSQL)

```sql
-- GIN indexes for full-text search
CREATE INDEX idx_bills_search ON bills USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
CREATE INDEX idx_politicians_search ON politicians USING gin(to_tsvector('english', full_name || ' ' || coalesce(constituency, '')));
```

### 22.2 Semantic Search (pgvector)

```typescript
// lib/search/semantic.ts
export async function semanticBillSearch(query: string, limit: number = 20): Promise<Bill[]> {
  const queryEmbedding = await generateEmbedding(query);
  
  const results = await db.execute(sql`
    SELECT *, embedding <=> ${queryEmbedding}::vector AS distance
    FROM bills
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${queryEmbedding}::vector
    LIMIT ${limit}
  `);
  
  return results.rows;
}
```

### 22.3 Combined Search Strategy

1. If `semantic: true` in query → pgvector similarity search → re-rank with full-text relevance
2. If `semantic: false` → PostgreSQL full-text search with GIN indexes
3. Filters (jurisdiction, status, date range) applied as WHERE clauses in both paths
4. Results merged and deduplicated with reciprocal rank fusion

---

## 23. DEPLOYMENT & INFRASTRUCTURE

### 23.1 Environment Configuration

```
# .env.local
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Database
DATABASE_URL=postgresql://...@neon.tech/polaris?sslmode=require

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Real-time
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...

# Cache
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Kafka
UPSTASH_KAFKA_REST_URL=...
UPSTASH_KAFKA_REST_USERNAME=...
UPSTASH_KAFKA_REST_PASSWORD=...

# Email
RESEND_API_KEY=re_...

# Monitoring
SENTRY_DSN=...
NEXT_PUBLIC_POSTHOG_KEY=...

# Ingestion
CONGRESS_GOV_API_KEY=...
UK_PARLIAMENT_API_KEY=...
NEWSAPI_KEY=...
```

### 23.2 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1", "lhr1", "sin1"],
  "crons": [
    { "path": "/api/cron/daily-digest", "schedule": "0 6 * * *" },
    { "path": "/api/cron/weekly-report", "schedule": "0 8 * * 1" },
    { "path": "/api/cron/prediction-refresh", "schedule": "0 */6 * * *" }
  ]
}
```

### 23.3 Database Migrations

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate

# Push schema (dev only)
npx drizzle-kit push
```

---

## 24. PHASE PRIORITIES

### Phase 0 — Foundation (Weeks 1-4)

**Priority: P0 (Must Have)**

- [ ] Next.js project scaffold with App Router
- [ ] Clerk auth integration (org + individual accounts)
- [ ] Neon database setup + Drizzle ORM + core schema
- [ ] Stripe subscription integration (Starter + Professional org tiers)
- [ ] Basic UI shell: dashboard layout, navigation, settings
- [ ] Landing page + pricing page

### Phase 1 — Core Intelligence (Weeks 5-12)

**Priority: P0**

- [ ] US Congress data ingestion (Congress.gov API)
- [ ] UK Parliament data ingestion (UK Parliament API)
- [ ] Bill search + detail pages
- [ ] AI bill summarization pipeline (Claude Sonnet)
- [ ] Monitoring topics + email alerts
- [ ] Politician directory + profiles
- [ ] Basic saved searches

### Phase 2 — Politician Side + CRM (Weeks 13-20)

**Priority: P1**

- [ ] Politician account verification flow
- [ ] Politician dashboard (Foundation tier features)
- [ ] CRM: contacts + interaction logging
- [ ] Activity tracking (votes, speeches, questions)
- [ ] Basic sentiment analysis
- [ ] Slack/Teams alert integration
- [ ] Politician Professional tier features

### Phase 3 — Advanced Analytics (Weeks 21-28)

**Priority: P1**

- [ ] Stakeholder relationship mapping (Apache AGE)
- [ ] Predictive policy analytics (passage probability)
- [ ] Competitive political intelligence
- [ ] Constituency intelligence dashboard
- [ ] Multi-layer sentiment analysis
- [ ] Enterprise tier launch

### Phase 4 — Marketplace (Weeks 29-36)

**Priority: P2**

- [ ] Cross-side monitoring signals (anonymized)
- [ ] Matchmaking profiles + suggestions
- [ ] Promoted visibility campaigns
- [ ] Connection request workflow
- [ ] Marketplace billing (Stripe Connect)

### Phase 5 — Global Expansion (Weeks 37-48)

**Priority: P2**

- [ ] EU Parliament ingestion
- [ ] Canada Parliament ingestion
- [ ] Australia Parliament ingestion
- [ ] Multi-jurisdiction dashboards
- [ ] Compliance/reporting engine
- [ ] Full API + webhook system
- [ ] Global tier launch

### Phase 6 — Advanced Features (Weeks 49+)

**Priority: P3**

- [ ] Issue positioning engine
- [ ] Campaign intelligence suite
- [ ] Party-level admin dashboards
- [ ] Data products / licensing
- [ ] White-label options
- [ ] Mobile app (React Native)

---

## 25. FILE & FOLDER STRUCTURE

```
polaris/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth routes (sign-in, sign-up)
│   │   ├── sign-in/[[...sign-in]]/
│   │   └── sign-up/[[...sign-up]]/
│   ├── (marketing)/                  # Public pages
│   │   ├── page.tsx                  # Landing page
│   │   ├── pricing/
│   │   ├── about/
│   │   └── layout.tsx
│   ├── (dashboard)/                  # Authenticated app
│   │   ├── layout.tsx                # Dashboard shell
│   │   ├── overview/                 # Main dashboard
│   │   ├── legislation/              # Service 1
│   │   │   ├── page.tsx              # Bill search
│   │   │   ├── [id]/                 # Bill detail
│   │   │   └── monitoring/           # Monitoring topics
│   │   ├── stakeholders/             # Service 2
│   │   │   ├── page.tsx              # Directory
│   │   │   ├── [id]/                 # Profile
│   │   │   └── graph/                # Relationship map
│   │   ├── analytics/                # Service 3 + 4
│   │   │   ├── predictions/
│   │   │   └── sentiment/
│   │   ├── crm/                      # Service 8
│   │   │   ├── contacts/
│   │   │   ├── interactions/
│   │   │   └── dashboard/
│   │   ├── marketplace/              # Service 10
│   │   │   ├── profile/
│   │   │   ├── connections/
│   │   │   └── visibility/
│   │   ├── reports/                  # Service 11
│   │   ├── alerts/                   # Notification center
│   │   ├── settings/                 # Org/user settings
│   │   │   ├── billing/
│   │   │   ├── integrations/
│   │   │   ├── team/
│   │   │   └── notifications/
│   │   └── api-keys/                 # Service 12
│   ├── (politician)/                 # Politician-side dashboard
│   │   ├── layout.tsx
│   │   ├── overview/
│   │   ├── competitive/              # Service 5
│   │   ├── constituency/             # Service 6
│   │   ├── positioning/              # Service 7
│   │   ├── crm/                      # Politician CRM
│   │   ├── campaign/                 # Service 9
│   │   └── settings/
│   ├── api/
│   │   ├── v1/                       # Versioned public API
│   │   │   ├── bills/
│   │   │   ├── politicians/
│   │   │   ├── stakeholders/
│   │   │   ├── monitoring/
│   │   │   ├── alerts/
│   │   │   ├── crm/
│   │   │   ├── sentiment/
│   │   │   ├── predictions/
│   │   │   ├── marketplace/
│   │   │   ├── reports/
│   │   │   └── compliance/
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   └── clerk/
│   │   ├── inngest/                  # Inngest webhook handler
│   │   └── cron/
│   │       ├── daily-digest/
│   │       ├── weekly-report/
│   │       └── prediction-refresh/
│   └── layout.tsx                    # Root layout
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── dashboard/                    # Dashboard-specific components
│   ├── legislation/                  # Bill-related components
│   ├── stakeholders/                 # Stakeholder components
│   ├── crm/                          # CRM components
│   ├── charts/                       # Recharts wrappers
│   ├── graph/                        # React Flow wrappers
│   └── shared/                       # Shared components
├── db/
│   ├── index.ts                      # Drizzle client
│   ├── schema/                       # All schema files (as defined above)
│   └── migrations/                   # Generated migrations
├── lib/
│   ├── ai/
│   │   ├── client.ts                 # Anthropic client
│   │   ├── prompts/                  # All prompt templates
│   │   │   ├── bill-summary.ts
│   │   │   ├── bill-classification.ts
│   │   │   ├── impact-analysis.ts
│   │   │   ├── sentiment-analysis.ts
│   │   │   ├── competitor-briefing.ts
│   │   │   ├── positioning-analysis.ts
│   │   │   └── report-generation.ts
│   │   └── queue.ts                  # AI task queue
│   ├── billing/
│   │   ├── stripe.ts                 # Stripe client
│   │   ├── products.ts              # Product/price config
│   │   └── usage.ts                 # Usage tracking
│   ├── ingestion/
│   │   ├── collectors/               # Source-specific collectors
│   │   ├── normalizers/              # Data normalization
│   │   ├── enrichment/               # AI enrichment pipeline
│   │   └── base-collector.ts
│   ├── notifications/
│   │   ├── channels.ts               # Multi-channel delivery
│   │   ├── templates/                # Notification templates
│   │   └── digest.ts                 # Digest aggregation
│   ├── search/
│   │   ├── full-text.ts              # PostgreSQL FTS
│   │   ├── semantic.ts               # pgvector search
│   │   └── combined.ts              # Hybrid search
│   ├── permissions.ts                # Feature access control
│   ├── inngest.ts                    # Inngest client
│   ├── pusher.ts                     # Pusher client
│   ├── redis.ts                      # Upstash Redis client
│   └── utils.ts                      # Shared utilities
├── inngest/
│   ├── client.ts                     # Inngest instance
│   └── functions/
│       ├── ingest-congress.ts
│       ├── ingest-uk-parliament.ts
│       ├── ingest-media.ts
│       ├── ai-bill-enrichment.ts
│       ├── ai-sentiment-analysis.ts
│       ├── ai-prediction-refresh.ts
│       ├── notification-dispatch.ts
│       ├── monitoring-signal-aggregation.ts
│       ├── daily-digest.ts
│       └── weekly-report.ts
├── types/
│   ├── api.ts                        # API request/response types
│   ├── bill.ts
│   ├── politician.ts
│   ├── search.ts
│   ├── sentiment.ts
│   ├── prediction.ts
│   ├── marketplace.ts
│   └── common.ts
├── workers/                          # Railway worker processes
│   ├── scraper/
│   │   ├── index.ts                  # Entry point
│   │   └── targets/                  # Per-site scraping configs
│   └── processor/
│       └── index.ts                  # Heavy AI processing
├── public/
├── .env.local
├── .env.example
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## APPENDIX A: TYPE DEFINITIONS

```typescript
// types/common.ts

interface SocialMediaLinks {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

interface CommitteeMembership {
  committeeId: string;
  committeeName: string;
  role: 'chair' | 'vice_chair' | 'ranking_member' | 'member';
  startDate: string;
  endDate?: string;
}

interface BillSponsor {
  politicianId: string;
  name: string;
  party: string;
  role: 'sponsor' | 'cosponsor';
}

interface IndividualVote {
  politicianId: string;
  name: string;
  party: string;
  vote: 'yes' | 'no' | 'abstain' | 'absent';
}

interface SentimentScore {
  overall: number;          // -1 to 1
  positive: number;
  negative: number;
  neutral: number;
}

interface ImpactAnalysis {
  executiveSummary: string;
  affectedSectors: string[];
  regulatoryImplications: string;
  stakeholderImpact: Record<string, string>;
  comparisonToExistingLaw: string;
}

interface PredictionFactor {
  factor: string;
  weight: number;
  value: number;
  direction: 'positive' | 'negative' | 'neutral';
}

interface SampleQuote {
  text: string;
  source: string;
  author?: string;
  date: string;
  sentiment: number;
}

interface DataSourceConfig {
  type: 'api' | 'scrape' | 'hybrid';
  endpoint?: string;
  apiKey?: string;
  scrapeTargets?: string[];
  refreshIntervalMinutes: number;
  lastSync?: string;
}

interface MonitoringConfig {
  billIds?: string[];
  keywords?: string[];
  committeeIds?: string[];
  politicianIds?: string[];
  policyAreas?: string[];
  jurisdictionIds?: string[];
  customQuery?: string;
}

interface SearchQuery {
  q?: string;
  filters: Record<string, unknown>;
  sort?: string;
  semantic?: boolean;
}

interface OrgSettings {
  defaultJurisdiction?: string;
  alertDefaults?: NotificationConfig;
  integrations?: Record<string, unknown>;
  branding?: { logo?: string; primaryColor?: string };
}

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

interface CommitteeMember {
  politicianId: string;
  name: string;
  party: string;
  role: string;
}

interface Witness {
  name: string;
  organization: string;
  title: string;
}

interface PolicyPosition {
  area: string;
  position: string;
  description: string;
}

interface EngagementPrefs {
  meetingFormats: string[];
  policyAreas: string[];
  availableDays?: string[];
}
```

---

## APPENDIX B: API RESPONSE FORMATS

All API responses follow this envelope:

```typescript
// Success
interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Error
interface ApiError {
  error: {
    code: string;              // e.g., 'FORBIDDEN', 'NOT_FOUND', 'TIER_LIMIT_EXCEEDED'
    message: string;
    details?: Record<string, unknown>;
  };
}

// HTTP Status Codes
// 200 — Success
// 201 — Created
// 400 — Bad Request (validation error)
// 401 — Unauthorized (not authenticated)
// 403 — Forbidden (insufficient tier/permissions)
// 404 — Not Found
// 429 — Rate Limited
// 500 — Internal Server Error
```

---

## APPENDIX C: ENVIRONMENT SETUP (LOCAL DEV)

```bash
# Clone and install
git clone https://github.com/your-org/polaris.git
cd polaris
npm install

# Set up environment
cp .env.example .env.local
# Fill in API keys

# Set up database
npx drizzle-kit push

# Seed development data
npm run seed

# Start development server
npm run dev

# Run ingestion workers locally
npm run worker:dev
```

---

*End of Document. This specification is version-controlled and should be updated as architecture decisions evolve. All changes should be tracked with date and author.*
