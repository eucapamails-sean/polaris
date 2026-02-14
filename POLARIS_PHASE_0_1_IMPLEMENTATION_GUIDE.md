# POLARIS — Phase 0–1 Claude Code Implementation Guide

## Sequential Build Instructions for Claude Code

**Scope:** Project scaffold, auth, database, Stripe billing, UI shell, US Congress + UK Parliament data ingestion, AI bill summarization, monitoring/alerts, politician directory, and search infrastructure.

**Reference:** `POLARIS_PRODUCT_SPEC.md` in project files is the master spec. This guide translates Phase 0 (Weeks 1–4) and Phase 1 (Weeks 5–12) into executable Claude Code instructions.

**Execution model:** Work through each numbered step sequentially. Complete each step fully before moving to the next. After each step, verify the build compiles and tests pass before proceeding.

---

## STEP 0: PROJECT SCAFFOLD

### 0.1 Initialize Next.js Project

```bash
npx create-next-app@latest polaris --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd polaris
```

### 0.2 Install All Phase 0–1 Dependencies

```bash
# Core
npm install @clerk/nextjs @neondatabase/serverless drizzle-orm stripe resend @anthropic-ai/sdk openai inngest pusher pusher-js @upstash/redis recharts date-fns zod posthog-js @sentry/nextjs

# UI
npx shadcn@latest init
npx shadcn@latest add button card input label select tabs dialog sheet badge separator dropdown-menu command popover calendar toast table avatar skeleton switch textarea tooltip scroll-area alert alert-dialog navigation-menu

# Dev
npm install -D drizzle-kit @types/node
```

### 0.3 Create Folder Structure

Create the following directory tree exactly. Empty directories should contain a `.gitkeep` file. Do NOT create any component files yet — only the directory skeleton.

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/
│   │   └── sign-up/[[...sign-up]]/
│   ├── (marketing)/
│   │   ├── pricing/
│   │   └── about/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── legislation/
│   │   │   ├── [id]/
│   │   │   └── monitoring/
│   │   ├── stakeholders/
│   │   │   └── [id]/
│   │   ├── alerts/
│   │   └── settings/
│   │       ├── billing/
│   │       ├── team/
│   │       └── notifications/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── bills/
│   │   │   ├── politicians/
│   │   │   ├── monitoring/
│   │   │   ├── alerts/
│   │   │   └── search/
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   └── clerk/
│   │   ├── inngest/
│   │   └── cron/
│   │       └── daily-digest/
│   └── layout.tsx
├── components/
│   ├── ui/           # shadcn components auto-generated here
│   ├── dashboard/
│   ├── legislation/
│   ├── stakeholders/
│   └── shared/
├── db/
│   ├── schema/
│   └── migrations/
├── lib/
│   ├── ai/
│   │   └── prompts/
│   ├── billing/
│   ├── ingestion/
│   │   └── collectors/
│   ├── notifications/
│   ├── search/
│   └── validators/
├── inngest/
│   └── functions/
├── types/
└── workers/
```

### 0.4 Create `.env.local` Template

Create `.env.example` with all required keys. Create `.env.local` from this template (user fills in real values).

```env
# Auth — Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/overview
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/overview

# Database — Neon
DATABASE_URL=postgresql://...@ep-....neon.tech/polaris?sslmode=require

# AI — Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# AI — OpenAI (embeddings only)
OPENAI_API_KEY=sk-...

# Payments — Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Real-time — Pusher
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# Cache — Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email — Resend
RESEND_API_KEY=re_...

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=

# Data Sources
CONGRESS_GOV_API_KEY=
UK_PARLIAMENT_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 0.5 Configure `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 0.6 Configure `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.clerk.com' },
      { protocol: 'https', hostname: '**.congress.gov' },
      { protocol: 'https', hostname: '**.parliament.uk' },
    ],
  },
};

export default nextConfig;
```

---

## STEP 1: DATABASE SCHEMA

### 1.1 Create Drizzle Client

Create `src/db/index.ts`:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### 1.2 Create All Phase 0–1 Schema Files

Create the following schema files inside `src/db/schema/`. Copy the exact table definitions from the product spec (Section 5). Every table referenced in Phase 0–1 features must be created now — including tables that won't be fully populated until later phases — so foreign key references resolve.

**Files to create:**

1. `src/db/schema/users.ts` — `users` table (spec §5.2)
2. `src/db/schema/organizations.ts` — `organizations`, `orgMemberships` tables (spec §5.2)
3. `src/db/schema/jurisdictions.ts` — `jurisdictions`, `legislativeBodies`, `politicalParties` tables (spec §5.3)
4. `src/db/schema/politicians.ts` — `politicians`, `politicianActivities` tables (spec §5.3)
5. `src/db/schema/legislation.ts` — `bills`, `billVersions`, `billVotes`, `committees`, `committeeEvents` tables (spec §5.4)
6. `src/db/schema/monitoring.ts` — `monitoringTopics`, `savedSearches`, `alerts` tables (spec §5.5)
7. `src/db/schema/subscriptions.ts` — `subscriptions`, `usageRecords` tables (spec §5.9)
8. `src/db/schema/audit.ts` — `auditLog` table (spec §5.10)
9. `src/db/schema/ingestion.ts` — `ingestionJobs`, `ingestionSourceHealth` tables (spec §5.11)
10. `src/db/schema/index.ts` — re-exports all schema modules

**Critical schema notes:**

- The `bills` table MUST include the `embedding` column: `embedding: vector('embedding', { dimensions: 1536 })`. This requires enabling the pgvector extension on Neon first.
- All `id` columns use `uuid('id').primaryKey().defaultRandom()`.
- All tables include `createdAt: timestamp('created_at').defaultNow().notNull()`.
- Use `jsonb` columns for flexible structured data (sponsors, metadata, etc.) with `$type<>()` for TypeScript typing.
- Enum values must match the spec exactly — these propagate to validation layers.

**After creating all schema files:**

```bash
# Enable pgvector on Neon (run via Neon SQL Editor or psql)
# CREATE EXTENSION IF NOT EXISTS vector;

# Generate and apply migration
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 1.3 Create Full-Text Search Indexes

After migration, run these SQL statements on Neon:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX IF NOT EXISTS idx_bills_search
  ON bills USING gin(to_tsvector('english', title || ' ' || coalesce(description, '')));

CREATE INDEX IF NOT EXISTS idx_politicians_search
  ON politicians USING gin(to_tsvector('english', full_name || ' ' || coalesce(constituency, '')));

CREATE INDEX IF NOT EXISTS idx_bills_embedding
  ON bills USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_bills_jurisdiction
  ON bills (jurisdiction_id, status);

CREATE INDEX IF NOT EXISTS idx_bills_introduced
  ON bills (introduced_date DESC);

CREATE INDEX IF NOT EXISTS idx_politician_activities_politician
  ON politician_activities (politician_id, activity_date DESC);

CREATE INDEX IF NOT EXISTS idx_monitoring_topics_owner
  ON monitoring_topics (owner_id, owner_type, is_active);

CREATE INDEX IF NOT EXISTS idx_alerts_user
  ON alerts (user_id, is_read, created_at DESC);
```

---

## STEP 2: AUTHENTICATION (CLERK)

### 2.1 Create Middleware

Create `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/about',
  '/api/webhooks/(.*)',
  '/api/public/(.*)',
  '/api/inngest',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### 2.2 Create Auth Pages

**`src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`:**

```tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
```

**`src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`:**

```tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
```

### 2.3 Create Root Layout

**`src/app/layout.tsx`:**

```tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Polaris — Political Intelligence Platform',
  description: 'Two-sided political intelligence. Municipal to national. Global coverage.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 2.4 Create Clerk Webhook Handler

Create `src/app/api/webhooks/clerk/route.ts`. This syncs Clerk users/orgs to the Polaris database.

```typescript
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { db } from '@/db';
import { users, organizations, orgMemberships } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (evt.type) {
    case 'user.created':
    case 'user.updated':
      await db.insert(users).values({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address ?? '',
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        side: 'org', // default; updated when politician verification occurs
      }).onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: evt.data.email_addresses[0]?.email_address ?? '',
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          updatedAt: new Date(),
        },
      });
      break;

    case 'organization.created':
    case 'organization.updated':
      await db.insert(organizations).values({
        clerkOrgId: evt.data.id,
        name: evt.data.name,
        slug: evt.data.slug,
        country: 'us', // default; updated in onboarding
      }).onConflictDoUpdate({
        target: organizations.clerkOrgId,
        set: {
          name: evt.data.name,
          slug: evt.data.slug,
          updatedAt: new Date(),
        },
      });
      break;

    case 'organizationMembership.created':
      // Resolve user and org IDs, insert membership
      break;
  }

  return new Response('OK', { status: 200 });
}
```

### 2.5 Create Permission Utilities

Create `src/lib/permissions.ts` — copy the full permission model from the spec (§4.3). This includes:

- `UserSide`, `OrgTier`, `PolTier` types
- `UserContext` interface
- `FEATURE_ACCESS` object with all feature-to-tier mappings
- `hasAccess(ctx, feature)` function

### 2.6 Create User Context Helper

Create `src/lib/auth.ts`:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, organizations, orgMemberships } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UserContext } from './permissions';

export async function getUserContext(): Promise<UserContext | null> {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });
  if (!dbUser) return null;

  let orgTier: string | undefined;
  let orgRole: string | undefined;

  if (orgId) {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.clerkOrgId, orgId),
    });
    orgTier = org?.tier;

    const membership = await db.query.orgMemberships.findFirst({
      where: (m, { and, eq: e }) =>
        and(e(m.orgId, org!.id), e(m.userId, dbUser.id)),
    });
    orgRole = membership?.role;
  }

  return {
    userId: dbUser.id,
    side: dbUser.side as UserContext['side'],
    orgId: orgId ?? undefined,
    orgRole: orgRole as UserContext['orgRole'],
    orgTier: orgTier as UserContext['orgTier'],
    polTier: dbUser.politicianId ? 'foundation' : undefined,
    politicianId: dbUser.politicianId ?? undefined,
    jurisdictions: [], // populated from org settings or politician profile
  };
}
```

---

## STEP 3: STRIPE BILLING

### 3.1 Create Stripe Client

Create `src/lib/billing/stripe.ts`:

```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

### 3.2 Create Product Configuration

Create `src/lib/billing/products.ts` — copy the full `STRIPE_PRODUCTS` object from the spec (§20.1). This defines all tiers, prices (in cents), and feature limits for both org and politician sides.

Important: include a helper function to create these products in Stripe:

```typescript
export async function syncProductsToStripe() {
  for (const [key, product] of Object.entries(STRIPE_PRODUCTS)) {
    // Create or update Stripe product
    // Create or update Stripe prices
    // Store Stripe IDs back in a mapping
  }
}
```

### 3.3 Create Stripe Webhook Handler

Create `src/app/api/webhooks/stripe/route.ts` — implement the webhook handler from the spec (§20.2). Handle these events:

- `customer.subscription.created` / `updated` → update `subscriptions` table
- `customer.subscription.deleted` → set subscription status to `canceled`
- `invoice.payment_failed` → set subscription status to `past_due`
- `invoice.paid` → set subscription status to `active`

```typescript
import { headers } from 'next/headers';
import { stripe } from '@/lib/billing/stripe';
import { db } from '@/db';
import { subscriptions, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const sig = headerPayload.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      // Upsert subscription record
      // Update org tier based on price ID mapping
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      // Set status to canceled, downgrade org to starter
      break;
    }
    case 'invoice.payment_failed': {
      // Set subscription status to past_due
      break;
    }
    case 'invoice.paid': {
      // Confirm active status
      break;
    }
  }

  return new Response('OK', { status: 200 });
}
```

### 3.4 Create Checkout/Portal API Routes

Create `src/app/api/v1/billing/checkout/route.ts`:

```typescript
// POST — Create Stripe checkout session for upgrading tier
// Accepts: { priceId: string, successUrl: string, cancelUrl: string }
// Returns: { url: string } (Stripe checkout URL)
```

Create `src/app/api/v1/billing/portal/route.ts`:

```typescript
// POST — Create Stripe customer portal session for managing subscription
// Returns: { url: string } (Stripe portal URL)
```

---

## STEP 4: UI SHELL

### 4.1 Marketing Layout

Create `src/app/(marketing)/layout.tsx` — public layout with navbar (logo, Pricing, About, Sign In, Get Started buttons). No auth required.

### 4.2 Landing Page

Create `src/app/(marketing)/page.tsx` — marketing landing page. Key sections:

- Hero: "Political intelligence for both sides of the table"
- Value props: Legislative tracking, Stakeholder mapping, AI-powered analysis, Cross-side intelligence
- Two-sided explanation (Organizations vs Politicians)
- CTA buttons to sign up
- Keep it clean, professional, minimal. Use Tailwind + shadcn components.

### 4.3 Pricing Page

Create `src/app/(marketing)/pricing/page.tsx` — display all tiers from the spec (§2.1 and §2.2). Two tabs: "Organizations" and "Politicians". Each tab shows tier cards with features and pricing. CTA buttons link to sign-up or checkout.

### 4.4 Dashboard Layout

Create `src/app/(dashboard)/layout.tsx` — authenticated dashboard shell. Components:

**Sidebar navigation:**
- Overview (home icon)
- Legislation (scroll icon) — links to `/legislation`
- Stakeholders (users icon) — links to `/stakeholders`
- Alerts (bell icon) — links to `/alerts`
- Settings (gear icon) — links to `/settings`

**Top bar:**
- Breadcrumb
- Search input (global search — wired in Step 9)
- Notification bell with unread count
- Clerk `<UserButton />` component

**Sidebar should:**
- Collapse to icons on mobile
- Show org name from Clerk
- Show current tier badge
- Highlight active route

Create the following shared components:

- `src/components/dashboard/sidebar.tsx`
- `src/components/dashboard/topbar.tsx`
- `src/components/dashboard/breadcrumb.tsx`
- `src/components/shared/tier-badge.tsx`
- `src/components/shared/empty-state.tsx`
- `src/components/shared/loading-skeleton.tsx`
- `src/components/shared/pagination.tsx`

### 4.5 Overview Dashboard

Create `src/app/(dashboard)/overview/page.tsx`. This is the main dashboard. Display:

- Welcome message with user's name
- Summary stats cards: bills tracked, alerts this week, monitoring topics active
- Recent alerts feed (last 10)
- Quick actions: "Track a bill", "Add monitoring topic"

For Phase 0, use placeholder data where real data isn't yet available. Wire to real data in Steps 5–8.

### 4.6 Settings Pages

Create `src/app/(dashboard)/settings/page.tsx` — settings overview with links to sub-pages.

Create `src/app/(dashboard)/settings/billing/page.tsx`:
- Current plan display
- Upgrade/downgrade buttons (trigger Stripe checkout)
- "Manage subscription" button (trigger Stripe portal)

Create `src/app/(dashboard)/settings/team/page.tsx`:
- Clerk `<OrganizationProfile />` component for member management

Create `src/app/(dashboard)/settings/notifications/page.tsx`:
- Alert frequency selector (realtime / daily / weekly)
- Channel toggles (email, in-app)
- Quiet hours configuration

---

## STEP 5: DATA INGESTION — US CONGRESS

### 5.1 Create Base Collector

Create `src/lib/ingestion/collectors/base-collector.ts`:

```typescript
export interface RawBill {
  externalId: string;
  externalSource: string;
  billNumber: string;
  title: string;
  shortTitle?: string;
  description?: string;
  fullText?: string;
  fullTextUrl?: string;
  status: string;
  statusDate?: string;
  introducedDate: string;
  sponsors: any[];
  cosponsors: any[];
  committees: string[];
  subjects: string[];
  sourceUrl?: string;
}

export interface RawPolitician {
  externalId: string;
  externalSource: string;
  firstName: string;
  lastName: string;
  fullName: string;
  party: string;
  position: string;
  constituency?: string;
  imageUrl?: string;
  website?: string;
  socialMedia?: Record<string, string>;
}

export abstract class BaseCollector {
  abstract source: string;
  abstract jurisdictionCode: string;

  abstract fetchBills(since?: Date): Promise<RawBill[]>;
  abstract fetchPoliticians(): Promise<RawPolitician[]>;

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    try {
      await this.fetchBills(new Date());
      return { healthy: true };
    } catch (e: any) {
      return { healthy: false, message: e.message };
    }
  }
}
```

### 5.2 Create Congress.gov Collector

Create `src/lib/ingestion/collectors/congress-gov.ts`:

This collector uses the Congress.gov API v3 (`https://api.congress.gov/v3`).

**API key:** `CONGRESS_GOV_API_KEY` env var. Passed as `api_key` query parameter.

**Endpoints to implement:**

| Data | Endpoint | Refresh |
|------|----------|---------|
| Bills | `GET /bill?fromDateTime={since}&sort=updateDate+desc&limit=250` | Every 2 hours |
| Bill detail | `GET /bill/{congress}/{billType}/{billNumber}` | On demand |
| Bill text | `GET /bill/{congress}/{billType}/{billNumber}/text` | On demand |
| Members | `GET /member?limit=250&currentMember=true` | Daily |
| Member detail | `GET /member/{bioguideId}` | On demand |
| Committees | `GET /committee?limit=250` | Daily |

**Implementation notes:**
- Congress.gov API returns paginated results. Implement cursor-based pagination using `offset` parameter.
- Rate limit: 1000 requests/hour. Implement a 100ms delay between requests.
- Bill numbers come in format like `hr1234`, `s567`. Normalize to `HR 1234`, `S 567` for display.
- Map Congress.gov `latestAction.text` to the bill status enum from the schema. Build a mapping function:
  - "Introduced" → `introduced`
  - "Referred to" → `in_committee`
  - "Reported by" → `passed_committee`
  - "Passed House" / "Passed Senate" → `passed_one_chamber`
  - "Resolving differences" → `passed_one_chamber`
  - "Became Public Law" → `signed_into_law`
  - "Vetoed" → `vetoed`
  - Default → `introduced`
- Congress number: calculate from current year. 2025–2026 = 119th Congress.

**`fetchBills(since?: Date)` implementation:**

```typescript
async fetchBills(since?: Date): Promise<RawBill[]> {
  const bills: RawBill[] = [];
  let offset = 0;
  const limit = 250;
  const congress = 119; // 2025-2026

  const sinceStr = since
    ? since.toISOString().replace('Z', '+00:00')
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().replace('Z', '+00:00');

  let hasMore = true;
  while (hasMore) {
    const url = `https://api.congress.gov/v3/bill/${congress}?fromDateTime=${sinceStr}&sort=updateDate+desc&offset=${offset}&limit=${limit}&api_key=${process.env.CONGRESS_GOV_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    for (const bill of data.bills ?? []) {
      bills.push(this.normalizeBill(bill));
    }

    offset += limit;
    hasMore = (data.bills?.length ?? 0) === limit;
    await new Promise(r => setTimeout(r, 100)); // rate limit
  }

  return bills;
}
```

**`fetchPoliticians()` implementation:**

Fetch all current members from `/member?currentMember=true`. Paginate. Normalize to `RawPolitician`.

### 5.3 Create UK Parliament Collector

Create `src/lib/ingestion/collectors/uk-parliament.ts`:

Uses the UK Parliament API (`https://members-api.parliament.uk` for members, `https://bills-api.parliament.uk` for bills).

**No API key required** for UK Parliament APIs. They are public.

**Endpoints:**

| Data | Endpoint | Refresh |
|------|----------|---------|
| Bills | `GET https://bills-api.parliament.uk/api/v1/Bills?SortOrder=DateUpdatedDescending&Take=50` | Every 2 hours |
| Bill detail | `GET https://bills-api.parliament.uk/api/v1/Bills/{billId}` | On demand |
| MPs (Commons) | `GET https://members-api.parliament.uk/api/Members/Search?House=1&IsCurrentMember=true` | Daily |
| Lords | `GET https://members-api.parliament.uk/api/Members/Search?House=2&IsCurrentMember=true` | Daily |

**Implementation notes:**
- UK Parliament API uses `skip`/`take` pagination.
- Bill statuses map differently: map `currentStage` to the schema enum.
- Member API returns `value` array with member objects. Each has `nameDisplayAs`, `party`, `memberFrom` (constituency).

### 5.4 Create Inngest Client

Create `src/lib/inngest.ts`:

```typescript
import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'polaris',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
```

### 5.5 Create Inngest Serve Route

Create `src/app/api/inngest/route.ts`:

```typescript
import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest';
import { ingestCongressBills } from '@/inngest/functions/ingest-congress';
import { ingestCongressMembers } from '@/inngest/functions/ingest-congress-members';
import { ingestUKBills } from '@/inngest/functions/ingest-uk-parliament';
import { ingestUKMembers } from '@/inngest/functions/ingest-uk-members';
import { aiBillEnrichment } from '@/inngest/functions/ai-bill-enrichment';
import { notificationDispatch } from '@/inngest/functions/notification-dispatch';
import { dailyDigest } from '@/inngest/functions/daily-digest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    ingestCongressBills,
    ingestCongressMembers,
    ingestUKBills,
    ingestUKMembers,
    aiBillEnrichment,
    notificationDispatch,
    dailyDigest,
  ],
});
```

### 5.6 Create Ingestion Functions

**`src/inngest/functions/ingest-congress.ts`:**

```typescript
import { inngest } from '@/lib/inngest';
import { CongressGovCollector } from '@/lib/ingestion/collectors/congress-gov';
import { db } from '@/db';
import { bills, ingestionJobs, ingestionSourceHealth } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const ingestCongressBills = inngest.createFunction(
  { id: 'ingest-congress-bills', name: 'Ingest US Congress Bills' },
  { cron: '0 */2 * * *' }, // Every 2 hours
  async ({ step }) => {
    const collector = new CongressGovCollector();

    // Step 1: Record job start
    const jobId = await step.run('record-job-start', async () => {
      const [job] = await db.insert(ingestionJobs).values({
        source: 'congress_gov',
        jobType: 'incremental',
        status: 'running',
        startedAt: new Date(),
      }).returning({ id: ingestionJobs.id });
      return job.id;
    });

    // Step 2: Fetch bills updated since last successful run
    const rawBills = await step.run('fetch-bills', async () => {
      const health = await db.query.ingestionSourceHealth.findFirst({
        where: eq(ingestionSourceHealth.source, 'congress_gov'),
      });
      const since = health?.lastSuccessfulRun ?? undefined;
      return collector.fetchBills(since ?? undefined);
    });

    // Step 3: Upsert bills to database
    let processed = 0;
    let failed = 0;
    for (const bill of rawBills) {
      await step.run(`upsert-bill-${bill.externalId}`, async () => {
        try {
          await db.insert(bills).values({
            externalId: bill.externalId,
            externalSource: 'congress_gov',
            jurisdictionId: /* US federal jurisdiction UUID — seeded in Step 1 */,
            billNumber: bill.billNumber,
            title: bill.title,
            shortTitle: bill.shortTitle,
            description: bill.description,
            fullTextUrl: bill.fullTextUrl,
            status: bill.status as any,
            introducedDate: new Date(bill.introducedDate),
            sponsors: bill.sponsors,
            cosponsors: bill.cosponsors,
            committees: bill.committees,
            subjects: bill.subjects,
          }).onConflictDoUpdate({
            target: [bills.externalId, bills.externalSource],
            set: {
              title: bill.title,
              status: bill.status as any,
              sponsors: bill.sponsors,
              cosponsors: bill.cosponsors,
              subjects: bill.subjects,
              updatedAt: new Date(),
            },
          });
          processed++;
        } catch {
          failed++;
        }
      });
    }

    // Step 4: Trigger AI enrichment for new/updated bills
    await step.run('trigger-enrichment', async () => {
      for (const bill of rawBills) {
        await inngest.send({
          name: 'ai/bill.enrich',
          data: { externalId: bill.externalId, source: 'congress_gov' },
        });
      }
    });

    // Step 5: Update job and source health
    await step.run('record-completion', async () => {
      await db.update(ingestionJobs).set({
        status: 'completed',
        completedAt: new Date(),
        recordsProcessed: processed,
        recordsFailed: failed,
      }).where(eq(ingestionJobs.id, jobId));

      await db.insert(ingestionSourceHealth).values({
        source: 'congress_gov',
        lastSuccessfulRun: new Date(),
        consecutiveFailures: 0,
        status: 'healthy',
      }).onConflictDoUpdate({
        target: ingestionSourceHealth.source,
        set: {
          lastSuccessfulRun: new Date(),
          consecutiveFailures: 0,
          status: 'healthy',
          updatedAt: new Date(),
        },
      });
    });

    return { processed, failed };
  }
);
```

**Create equivalent functions for:**
- `src/inngest/functions/ingest-congress-members.ts` — daily cron, fetches current members, upserts to `politicians` table
- `src/inngest/functions/ingest-uk-parliament.ts` — every 2 hours, fetches UK bills, upserts to `bills` table
- `src/inngest/functions/ingest-uk-members.ts` — daily cron, fetches Commons + Lords members, upserts to `politicians` table

### 5.7 Seed Jurisdiction Data

Create `src/db/seed.ts` — a script to seed the `jurisdictions` and `legislativeBodies` tables with initial data:

```typescript
// Jurisdictions to seed:
// { code: 'us', name: 'United States', level: 'national', country: 'US' }
// { code: 'gb', name: 'United Kingdom', level: 'national', country: 'GB' }

// Legislative bodies to seed:
// US Senate, US House of Representatives (linked to 'us' jurisdiction)
// UK House of Commons, UK House of Lords (linked to 'gb' jurisdiction)
```

Add a `seed` script to `package.json`:

```json
"scripts": {
  "seed": "npx tsx src/db/seed.ts"
}
```

---

## STEP 6: AI BILL SUMMARIZATION PIPELINE

### 6.1 Create Anthropic Client

Create `src/lib/ai/client.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const AI_MODELS = {
  classification: 'claude-haiku-4-5-20251001',
  summarization: 'claude-sonnet-4-5-20250929',
  analysis: 'claude-sonnet-4-5-20250929',
} as const;
```

### 6.2 Create OpenAI Client (Embeddings Only)

Create `src/lib/ai/openai.ts`:

```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // truncate to fit token limit
  });
  return response.data[0].embedding;
}
```

### 6.3 Create Prompt Templates

**`src/lib/ai/prompts/bill-summary.ts`:**

Copy the exact prompt template from the spec (§19.2). The prompt accepts bill metadata and full text, returns structured JSON with:
- `executiveSummary` (2–3 sentences)
- `detailedSummary` (5–10 paragraphs)
- `keyProvisions` (array)
- `affectedSectors` (array)
- `regulatoryImplications` (string)
- `stakeholderImpact` (object)
- `comparisonToExistingLaw` (string)

**`src/lib/ai/prompts/bill-classification.ts`:**

```typescript
export function buildBillClassificationPrompt(bill: { title: string; description?: string; subjects?: string[] }): string {
  return `You are a non-partisan political classifier. Classify the following bill into topic categories and impacted sectors.

<bill>
  <title>${bill.title}</title>
  <description>${bill.description ?? 'N/A'}</description>
  <existing_subjects>${(bill.subjects ?? []).join(', ')}</existing_subjects>
</bill>

Return JSON:
{
  "topics": ["topic1", "topic2"],
  "sectors": ["sector1", "sector2"],
  "urgency": "low" | "medium" | "high"
}

Use broad standard topic labels: healthcare, defense, education, energy, finance, technology, immigration, environment, infrastructure, trade, agriculture, labor, housing, judiciary, foreign_affairs, civil_rights, taxation, transportation.

Use broad sector labels: healthcare, financial_services, energy, technology, manufacturing, agriculture, real_estate, education, defense, retail, telecommunications, media, pharmaceuticals, insurance, automotive.`;
}
```

### 6.4 Create AI Enrichment Inngest Function

**`src/inngest/functions/ai-bill-enrichment.ts`:**

This function is triggered per-bill via `ai/bill.enrich` events from ingestion functions. It runs the full AI pipeline from the spec (§6.4):

```typescript
import { inngest } from '@/lib/inngest';
import { anthropic, AI_MODELS } from '@/lib/ai/client';
import { generateEmbedding } from '@/lib/ai/openai';
import { buildBillSummaryPrompt } from '@/lib/ai/prompts/bill-summary';
import { buildBillClassificationPrompt } from '@/lib/ai/prompts/bill-classification';
import { db } from '@/db';
import { bills } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const aiBillEnrichment = inngest.createFunction(
  {
    id: 'ai-bill-enrichment',
    name: 'AI Bill Enrichment',
    concurrency: { limit: 5 }, // Control Claude API concurrency
    retries: 2,
  },
  { event: 'ai/bill.enrich' },
  async ({ event, step }) => {
    const { externalId, source } = event.data;

    // Step 1: Load bill from DB
    const bill = await step.run('load-bill', async () => {
      return db.query.bills.findFirst({
        where: and(eq(bills.externalId, externalId), eq(bills.externalSource, source)),
      });
    });
    if (!bill) return { skipped: true, reason: 'Bill not found' };

    // Step 2: Classification (Haiku — fast, cheap)
    const classification = await step.run('classify', async () => {
      const prompt = buildBillClassificationPrompt({
        title: bill.title,
        description: bill.description ?? undefined,
        subjects: bill.subjects as string[] | undefined,
      });
      const response = await anthropic.messages.create({
        model: AI_MODELS.classification,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(text);
    });

    // Step 3: Summarization (Sonnet — only if bill has text or description)
    let summary = null;
    if (bill.fullText || bill.description) {
      summary = await step.run('summarize', async () => {
        const prompt = buildBillSummaryPrompt(bill);
        const response = await anthropic.messages.create({
          model: AI_MODELS.summarization,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        });
        const text = response.content[0].type === 'text' ? response.content[0].text : '';
        return JSON.parse(text);
      });
    }

    // Step 4: Generate embedding
    const embedding = await step.run('embed', async () => {
      const textToEmbed = [bill.title, bill.description, bill.shortTitle]
        .filter(Boolean)
        .join(' ');
      return generateEmbedding(textToEmbed);
    });

    // Step 5: Update bill record
    await step.run('update-bill', async () => {
      await db.update(bills).set({
        aiSummary: summary?.executiveSummary ?? null,
        aiImpactAnalysis: summary ? {
          executiveSummary: summary.executiveSummary,
          affectedSectors: summary.affectedSectors,
          regulatoryImplications: summary.regulatoryImplications,
          stakeholderImpact: summary.stakeholderImpact,
          comparisonToExistingLaw: summary.comparisonToExistingLaw,
        } : null,
        aiTopics: classification.topics,
        embedding: embedding,
        updatedAt: new Date(),
      }).where(eq(bills.id, bill.id));
    });

    // Step 6: Trigger monitoring match
    await step.run('trigger-monitor-match', async () => {
      await inngest.send({
        name: 'monitoring/bill.updated',
        data: { billId: bill.id },
      });
    });

    return { enriched: true, billId: bill.id };
  }
);
```

### 6.5 Create Bill Text Fetcher

Some bills from Congress.gov don't include full text in the list endpoint. Create a utility to fetch full text on demand:

Create `src/lib/ingestion/bill-text-fetcher.ts`:

```typescript
// For Congress.gov: fetch from /bill/{congress}/{type}/{number}/text endpoint
// Returns the text of the latest version in plain text format
// For UK Parliament: fetch from the bill publications endpoint
// Store raw text in bills.fullText, store PDF URL in bills.fullTextUrl
```

---

## STEP 7: MONITORING & ALERTS

### 7.1 Create Monitoring API Routes

**`src/app/api/v1/monitoring/topics/route.ts`:**

```
GET  — Return user's monitoring topics (paginated)
POST — Create new monitoring topic
```

Validation schema (Zod):

```typescript
import { z } from 'zod';

export const createMonitoringTopicSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['bill', 'keyword', 'committee', 'politician', 'policy_area', 'jurisdiction', 'custom_query']),
  config: z.object({
    billIds: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    committeeIds: z.array(z.string()).optional(),
    politicianIds: z.array(z.string()).optional(),
    policyAreas: z.array(z.string()).optional(),
    jurisdictionIds: z.array(z.string()).optional(),
    customQuery: z.string().optional(),
  }),
  alertFrequency: z.enum(['realtime', 'daily', 'weekly']).default('daily'),
});
```

**`src/app/api/v1/monitoring/topics/[id]/route.ts`:**

```
PUT    — Update monitoring topic
DELETE — Delete monitoring topic
```

**`src/app/api/v1/monitoring/feed/route.ts`:**

```
GET — Aggregated feed of activity matching user's monitoring topics
```

**Tier limits enforcement:**
- Starter: 5 monitoring topics, 5 saved searches
- Professional: 25 monitoring topics, 25 saved searches
- Enterprise: 100 monitoring topics, unlimited saved searches
- Global: unlimited

Check limits in POST handler before creating.

### 7.2 Create Alert API Routes

**`src/app/api/v1/alerts/route.ts`:**

```
GET — Return user's alerts (paginated, filterable by read/unread, priority, type)
```

**`src/app/api/v1/alerts/[id]/read/route.ts`:**

```
PUT — Mark alert as read
```

**`src/app/api/v1/alerts/read-all/route.ts`:**

```
PUT — Mark all alerts as read
```

### 7.3 Create Monitoring Match Function

**`src/inngest/functions/notification-dispatch.ts`:**

Triggered by `monitoring/bill.updated` events. Matches updated bills against all active monitoring topics.

```typescript
import { inngest } from '@/lib/inngest';
import { db } from '@/db';
import { monitoringTopics, alerts, bills } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const notificationDispatch = inngest.createFunction(
  { id: 'notification-dispatch', name: 'Monitoring Match & Alert Dispatch' },
  { event: 'monitoring/bill.updated' },
  async ({ event, step }) => {
    const { billId } = event.data;

    // Load the updated bill
    const bill = await step.run('load-bill', async () => {
      return db.query.bills.findFirst({ where: eq(bills.id, billId) });
    });
    if (!bill) return;

    // Find all active monitoring topics that match this bill
    const matchingTopics = await step.run('find-matches', async () => {
      // Match by:
      // 1. Direct bill ID tracking
      // 2. Keyword match against bill title/description
      // 3. Subject/policy area match
      // 4. Jurisdiction match
      // 5. Committee match
      // 6. Politician (sponsor) match

      const topics = await db.query.monitoringTopics.findMany({
        where: eq(monitoringTopics.isActive, true),
      });

      return topics.filter(topic => {
        const config = topic.config as any;
        if (!config) return false;

        // Direct bill tracking
        if (config.billIds?.includes(bill.externalId)) return true;

        // Keyword matching
        if (config.keywords?.some((kw: string) =>
          bill.title.toLowerCase().includes(kw.toLowerCase()) ||
          bill.description?.toLowerCase().includes(kw.toLowerCase())
        )) return true;

        // Policy area matching
        if (config.policyAreas?.some((area: string) =>
          (bill.aiTopics as string[])?.includes(area) ||
          (bill.subjects as string[])?.includes(area)
        )) return true;

        // Jurisdiction matching
        if (config.jurisdictionIds?.includes(bill.jurisdictionId)) return true;

        return false;
      });
    });

    // Create alerts for each matching topic
    await step.run('create-alerts', async () => {
      for (const topic of matchingTopics) {
        await db.insert(alerts).values({
          monitoringTopicId: topic.id,
          userId: topic.ownerId, // assumes user-owned topic for now
          type: 'new_bill_match',
          title: `New match: ${bill.billNumber}`,
          summary: bill.aiSummary ?? bill.title,
          sourceUrl: bill.fullTextUrl,
          relatedEntityId: bill.id,
          relatedEntityType: 'bill',
          priority: 'medium',
        });

        // If realtime alerts enabled, push notification
        if (topic.alertFrequency === 'realtime') {
          // Send via Pusher (in-app) and/or Resend (email)
          await inngest.send({
            name: 'notification/deliver',
            data: {
              userId: topic.ownerId,
              alertId: 'created_above', // simplification
              channels: ['in_app', 'email'],
            },
          });
        }
      }
    });

    return { matchedTopics: matchingTopics.length };
  }
);
```

### 7.4 Create Daily Digest Function

**`src/inngest/functions/daily-digest.ts`:**

Runs via cron at 6 AM UTC. For each user with daily alert frequency:
1. Gather all unread alerts from the last 24 hours
2. Group by monitoring topic
3. Generate a digest summary using Claude Haiku
4. Send via Resend email

### 7.5 Create Email Client

Create `src/lib/notifications/email.ts`:

```typescript
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendAlertEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: 'Polaris Alerts <alerts@polaris.app>',
    to,
    subject,
    html,
  });
}
```

### 7.6 Create Pusher Client

Create `src/lib/pusher.ts`:

```typescript
import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});
```

### 7.7 Create Monitoring UI Pages

**`src/app/(dashboard)/legislation/monitoring/page.tsx`:**
- List of user's monitoring topics with status (active/paused)
- "Create topic" button → dialog form matching the `createMonitoringTopicSchema`
- Each topic shows: name, type, alert frequency, match count
- Edit/delete actions per topic

**`src/app/(dashboard)/alerts/page.tsx`:**
- Alert feed with infinite scroll or pagination
- Filter by: type, priority, read/unread
- "Mark all read" button
- Each alert shows: title, summary, source link, timestamp, priority badge
- Click an alert → navigate to related bill detail page

---

## STEP 8: LEGISLATION UI & POLITICIAN DIRECTORY

### 8.1 Bill Search & List Page

**`src/app/(dashboard)/legislation/page.tsx`:**

Features:
- Search input (full-text search against `bills` table)
- Filters sidebar:
  - Jurisdiction selector (US / UK for Phase 1)
  - Status filter (multi-select from bill status enum)
  - Subject/topic filter
  - Date range (introduced after/before)
  - Sort by: relevance, introduced date, last updated
- Results list: bill number, title, AI summary (truncated), status badge, jurisdiction badge, introduced date
- Pagination component

### 8.2 Bill Detail Page

**`src/app/(dashboard)/legislation/[id]/page.tsx`:**

Sections:
- Header: bill number, title, status badge, jurisdiction
- AI Summary card (executive summary)
- Status timeline (visual timeline of status changes)
- Sponsors & cosponsors list (link to politician profiles)
- Subjects/topics tags
- AI Impact Analysis (if available):
  - Affected sectors
  - Regulatory implications
  - Stakeholder impact
- Actions: "Monitor this bill" button (adds to monitoring topics), "View full text" link

### 8.3 Bill API Routes

**`src/app/api/v1/bills/route.ts`:**

```
GET — Search/filter bills
```

Query parameters matching `BillSearchQuery` from spec (§6.3):

```typescript
const billSearchSchema = z.object({
  q: z.string().optional(),
  jurisdictionIds: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
  sponsors: z.array(z.string()).optional(),
  introducedAfter: z.string().optional(),
  introducedBefore: z.string().optional(),
  updatedAfter: z.string().optional(),
  sort: z.enum(['relevance', 'introduced_date', 'updated_date']).default('relevance'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  semantic: z.coerce.boolean().default(false),
});
```

Implementation:
- If `semantic: true` and `q` is provided → use pgvector semantic search (Step 9)
- Otherwise → PostgreSQL full-text search with `to_tsvector`/`to_tsquery`
- Apply all filters as WHERE clauses
- Return paginated results with `ApiResponse<Bill[]>` envelope

**`src/app/api/v1/bills/[id]/route.ts`:**

```
GET — Bill detail with full AI summary and impact analysis
```

**`src/app/api/v1/bills/[id]/monitor/route.ts`:**

```
POST   — Add bill to user's monitoring (creates a monitoring topic of type 'bill')
DELETE — Remove bill from monitoring
```

### 8.4 Politician Directory Page

**`src/app/(dashboard)/stakeholders/page.tsx`:**

Features:
- Search input (search by name, constituency, party)
- Filters:
  - Jurisdiction (US / UK)
  - Legislative body (Senate, House, Commons, Lords)
  - Party filter
  - Status (active, former)
- Results grid: photo, name, party, position, constituency, legislative body
- Pagination

### 8.5 Politician Profile Page

**`src/app/(dashboard)/stakeholders/[id]/page.tsx`:**

Sections:
- Header: photo, name, party, position, constituency
- Contact info: website, social media links
- Committee memberships list
- Recent activity feed (from `politicianActivities` table — populated by ingestion)
- Sponsored bills list (from `bills` table via sponsor data)
- "Monitor this politician" button

### 8.6 Politician API Routes

**`src/app/api/v1/politicians/route.ts`:**

```
GET — Search/filter politicians
```

**`src/app/api/v1/politicians/[id]/route.ts`:**

```
GET — Full politician profile with activity feed
```

**`src/app/api/v1/politicians/[id]/activities/route.ts`:**

```
GET — Paginated activity feed for a politician
```

---

## STEP 9: SEARCH INFRASTRUCTURE

### 9.1 Full-Text Search

Create `src/lib/search/full-text.ts`:

```typescript
import { db } from '@/db';
import { bills, politicians } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function searchBillsFullText(
  query: string,
  filters: {
    jurisdictionIds?: string[];
    status?: string[];
    introducedAfter?: Date;
    introducedBefore?: Date;
  },
  page: number = 1,
  limit: number = 20
) {
  const offset = (page - 1) * limit;
  const tsQuery = query.split(/\s+/).join(' & '); // AND search

  const results = await db.execute(sql`
    SELECT *,
      ts_rank(to_tsvector('english', title || ' ' || coalesce(description, '')),
              to_tsquery('english', ${tsQuery})) AS rank
    FROM bills
    WHERE to_tsvector('english', title || ' ' || coalesce(description, ''))
          @@ to_tsquery('english', ${tsQuery})
      ${filters.jurisdictionIds?.length
        ? sql`AND jurisdiction_id = ANY(${filters.jurisdictionIds}::uuid[])`
        : sql``}
      ${filters.status?.length
        ? sql`AND status = ANY(${filters.status}::text[])`
        : sql``}
      ${filters.introducedAfter
        ? sql`AND introduced_date >= ${filters.introducedAfter}`
        : sql``}
      ${filters.introducedBefore
        ? sql`AND introduced_date <= ${filters.introducedBefore}`
        : sql``}
    ORDER BY rank DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);

  return results.rows;
}

export async function searchPoliticiansFullText(query: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  const tsQuery = query.split(/\s+/).join(' & ');

  const results = await db.execute(sql`
    SELECT *,
      ts_rank(to_tsvector('english', full_name || ' ' || coalesce(constituency, '')),
              to_tsquery('english', ${tsQuery})) AS rank
    FROM politicians
    WHERE to_tsvector('english', full_name || ' ' || coalesce(constituency, ''))
          @@ to_tsquery('english', ${tsQuery})
    ORDER BY rank DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `);

  return results.rows;
}
```

### 9.2 Semantic Search

Create `src/lib/search/semantic.ts`:

```typescript
import { generateEmbedding } from '@/lib/ai/openai';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function searchBillsSemantic(query: string, limit: number = 20) {
  const queryEmbedding = await generateEmbedding(query);

  // pgvector cosine distance search
  const results = await db.execute(sql`
    SELECT *,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity
    FROM bills
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${limit}
  `);

  return results.rows;
}
```

### 9.3 Combined Search

Create `src/lib/search/combined.ts`:

Implements the combined search strategy from spec (§22.3):

```typescript
import { searchBillsFullText } from './full-text';
import { searchBillsSemantic } from './semantic';

export async function searchBills(
  query: string,
  options: {
    semantic?: boolean;
    jurisdictionIds?: string[];
    status?: string[];
    introducedAfter?: Date;
    introducedBefore?: Date;
    page?: number;
    limit?: number;
  }
) {
  const { semantic = false, page = 1, limit = 20, ...filters } = options;

  if (semantic && query) {
    // Semantic search → re-rank with full-text relevance
    const semanticResults = await searchBillsSemantic(query, limit * 2);
    // Apply filters in-memory (or extend semantic search to include WHERE clauses)
    return semanticResults.slice(0, limit);
  }

  // Full-text search with filters
  return searchBillsFullText(query, filters, page, limit);
}
```

### 9.4 Global Search API Route

**`src/app/api/v1/search/route.ts`:**

```
GET — Unified search across bills and politicians
Query: { q: string, type?: 'bills' | 'politicians' | 'all', semantic?: boolean, ...filters }
Returns: { bills: Bill[], politicians: Politician[] }
```

### 9.5 Wire Global Search to UI

Update `src/components/dashboard/topbar.tsx`:
- Search input uses `Command` (shadcn/ui command palette)
- On keystroke, debounce 300ms, call `/api/v1/search?q={query}&type=all`
- Show results in dropdown: bills section, politicians section
- Click result → navigate to detail page

---

## STEP 10: REDIS CACHING & RATE LIMITING

### 10.1 Create Redis Client

Create `src/lib/redis.ts`:

```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

### 10.2 Create Rate Limiter

Create `src/lib/rate-limit.ts`:

```typescript
import { redis } from './redis';

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
```

### 10.3 Add Caching to Frequent Queries

Cache these in Redis with appropriate TTLs:

| Data | Key Pattern | TTL |
|------|------------|-----|
| Bill detail | `bill:{id}` | 5 min |
| Politician profile | `politician:{id}` | 15 min |
| Search results | `search:{hash(query)}` | 2 min |
| User alert count | `alerts:unread:{userId}` | 30 sec |

Implement a generic cache-aside helper:

```typescript
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}
```

---

## STEP 11: API RESPONSE ENVELOPE & VALIDATION

### 11.1 Create API Response Helpers

Create `src/lib/api.ts`:

```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function apiSuccess<T>(data: T, meta?: { page: number; limit: number; total: number }) {
  return NextResponse.json({
    data,
    meta: meta ? { ...meta, hasMore: meta.page * meta.limit < meta.total } : undefined,
  });
}

export function apiError(code: string, message: string, status: number, details?: Record<string, unknown>) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError('VALIDATION_ERROR', 'Invalid request', 400, {
      issues: error.issues,
    });
  }
  console.error(error);
  return apiError('INTERNAL_ERROR', 'Internal server error', 500);
}
```

### 11.2 Create Validation Middleware Pattern

Create `src/lib/validators/index.ts`:

```typescript
import { z } from 'zod';

// Reusable pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Parse query params from URL
export function parseSearchParams<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const params: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });
  return schema.parse(params);
}
```

### 11.3 Create Feature Gate Helper

Create `src/lib/feature-gate.ts`:

```typescript
import { getUserContext } from './auth';
import { hasAccess, FEATURE_ACCESS } from './permissions';
import { apiError } from './api';

export async function requireFeature(feature: keyof typeof FEATURE_ACCESS) {
  const ctx = await getUserContext();
  if (!ctx) {
    return apiError('UNAUTHORIZED', 'Authentication required', 401);
  }
  if (!hasAccess(ctx, feature)) {
    return apiError('TIER_LIMIT_EXCEEDED', `Feature '${feature}' requires a higher tier`, 403);
  }
  return null; // access granted
}
```

---

## STEP 12: FINAL WIRING & VERIFICATION

### 12.1 Verify Complete Build

Run these checks after completing all steps:

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Verify database connection
npx drizzle-kit push

# Verify Inngest functions are registered
# Visit http://localhost:3000/api/inngest (in dev mode with Inngest dev server)
```

### 12.2 Manual Smoke Tests

1. **Auth flow:** Sign up → create org → verify user appears in Neon `users` table
2. **Billing flow:** Navigate to pricing → click upgrade → verify Stripe checkout session creation
3. **Ingestion:** Trigger Congress.gov ingestion manually via Inngest dev UI → verify bills appear in DB
4. **AI pipeline:** Verify at least one bill gets an AI summary and embedding
5. **Search:** Search for a bill by keyword → verify results return
6. **Monitoring:** Create a keyword monitoring topic → verify alert is generated when matching bill is ingested
7. **Politician directory:** Verify US Congress + UK Parliament members appear in directory
8. **Alerts:** Verify alerts appear in alerts page, can be marked as read

### 12.3 Known Deferred Items (Phase 2+)

These items are referenced in the spec but NOT included in this Phase 0–1 guide:

- Politician-side dashboard and accounts (Phase 2)
- CRM contacts and interactions (Phase 2)
- Sentiment analysis (Phase 2–3)
- Stakeholder relationship mapping / graph (Phase 3)
- Predictive analytics (Phase 3)
- Competitive intelligence (Phase 3)
- Constituency intelligence (Phase 3)
- Marketplace / cross-side features (Phase 4)
- EU, Canada, Australia ingestion (Phase 5)
- Campaign suite (Phase 6)
- Mobile app (Phase 6)
- Slack/Teams integrations (Phase 2)
- Full API key management and external API access (Phase 5)

---

## APPENDIX: INNGEST CRON SCHEDULE SUMMARY

| Function | Cron | Description |
|----------|------|-------------|
| `ingest-congress-bills` | `0 */2 * * *` | US Congress bills every 2h |
| `ingest-congress-members` | `0 4 * * *` | US Congress members daily 4 AM UTC |
| `ingest-uk-bills` | `30 */2 * * *` | UK Parliament bills every 2h (offset) |
| `ingest-uk-members` | `0 5 * * *` | UK Parliament members daily 5 AM UTC |
| `daily-digest` | `0 6 * * *` | Daily alert digest 6 AM UTC |

## APPENDIX: ENV VARS REQUIRED FOR PHASE 0–1

| Variable | Service | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | Yes |
| `CLERK_SECRET_KEY` | Clerk | Yes |
| `CLERK_WEBHOOK_SECRET` | Clerk | Yes |
| `DATABASE_URL` | Neon | Yes |
| `ANTHROPIC_API_KEY` | Claude AI | Yes |
| `OPENAI_API_KEY` | Embeddings | Yes |
| `STRIPE_SECRET_KEY` | Stripe | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | Yes |
| `CONGRESS_GOV_API_KEY` | Congress.gov | Yes |
| `INNGEST_EVENT_KEY` | Inngest | Yes |
| `INNGEST_SIGNING_KEY` | Inngest | Yes |
| `PUSHER_APP_ID` | Pusher | Yes |
| `PUSHER_KEY` | Pusher | Yes |
| `PUSHER_SECRET` | Pusher | Yes |
| `PUSHER_CLUSTER` | Pusher | Yes |
| `UPSTASH_REDIS_REST_URL` | Redis | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Redis | Yes |
| `RESEND_API_KEY` | Email | Yes |

## APPENDIX: FILE COUNT ESTIMATE

Phase 0–1 produces approximately:

- 10 schema files
- 6 Inngest functions
- 12 API route files
- 15 page/layout files
- 12 shared component files
- 10 lib utility files
- 3 prompt template files
- 3 collector files

**~70 files total.** Build sequentially. Do not scaffold empty files — implement each fully before moving to the next step.
