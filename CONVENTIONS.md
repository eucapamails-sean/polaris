# CONVENTIONS.md — Polaris Engineering Conventions

> Quick-reference for patterns used throughout the codebase. Claude Code should follow these exactly for consistency.

---

## 1. API Route Pattern

Every API route follows this exact structure:

```typescript
// src/app/api/v1/{resource}/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getUserContext } from '@/lib/auth';
import { hasAccess } from '@/lib/permissions';
import { apiSuccess, apiError, handleApiError } from '@/lib/api';
import { db } from '@/db';

// 1. Define Zod schema for input validation
const querySchema = z.object({
  // ...
});

export async function GET(req: NextRequest) {
  try {
    // 2. Authenticate
    const ctx = await getUserContext();
    if (!ctx) return apiError('UNAUTHORIZED', 'Authentication required', 401);

    // 3. Check feature access (if tier-gated)
    if (!hasAccess(ctx, 'legislative.search')) {
      return apiError('TIER_LIMIT_EXCEEDED', 'Upgrade required', 403);
    }

    // 4. Validate input
    const params = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams)
    );

    // 5. Execute query
    const results = await db.query.bills.findMany({ /* ... */ });

    // 6. Return envelope response
    return apiSuccess(results, {
      page: params.page,
      limit: params.limit,
      total: totalCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## 2. Inngest Function Pattern

```typescript
// src/inngest/functions/{name}.ts
import { inngest } from '@/lib/inngest';
import { db } from '@/db';

export const myFunction = inngest.createFunction(
  {
    id: 'kebab-case-id',           // Unique, stable ID
    name: 'Human Readable Name',   // Displayed in Inngest dashboard
    concurrency: { limit: 5 },     // Optional concurrency control
    retries: 2,                    // Default retry count
  },
  { cron: '0 */2 * * *' },        // OR { event: 'namespace/event.name' }
  async ({ event, step }) => {
    // Always use step.run() for each discrete operation
    // This enables Inngest's durable execution (retry individual steps)
    const data = await step.run('step-name', async () => {
      return await someOperation();
    });

    // Chain steps — each is independently retryable
    await step.run('next-step', async () => {
      await anotherOperation(data);
    });

    return { success: true, processed: data.length };
  }
);
```

## 3. Database Query Patterns

### Standard query (Drizzle relational)
```typescript
const bill = await db.query.bills.findFirst({
  where: eq(bills.id, billId),
});
```

### Upsert (ingestion — idempotent)
```typescript
await db.insert(bills).values(data).onConflictDoUpdate({
  target: [bills.externalId, bills.externalSource],
  set: { ...updatedFields, updatedAt: new Date() },
});
```

### Full-text search (raw SQL required)
```typescript
const results = await db.execute(sql`
  SELECT *, ts_rank(...) AS rank
  FROM bills
  WHERE to_tsvector('english', title || ' ' || coalesce(description, ''))
        @@ to_tsquery('english', ${tsQuery})
  ORDER BY rank DESC
  LIMIT ${limit} OFFSET ${offset}
`);
```

### Semantic search (raw SQL required)
```typescript
const results = await db.execute(sql`
  SELECT *, 1 - (embedding <=> ${vectorString}::vector) AS similarity
  FROM bills
  WHERE embedding IS NOT NULL
  ORDER BY embedding <=> ${vectorString}::vector
  LIMIT ${limit}
`);
```

## 4. AI Call Patterns

### Classification (fast, cheap — Haiku)
```typescript
const response = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }],
});
const text = response.content[0].type === 'text' ? response.content[0].text : '';
const parsed = JSON.parse(text); // Always wrap in try/catch
```

### Summarization (balanced — Sonnet)
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  messages: [{ role: 'user', content: prompt }],
});
```

### Embedding generation
```typescript
const response = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: text.slice(0, 8000), // Truncate to stay within token limit
});
const vector = response.data[0].embedding; // number[] of length 1536
```

### AI output parsing (always defensive)
```typescript
let parsed: ExpectedType;
try {
  const raw = response.content[0].type === 'text' ? response.content[0].text : '';
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  parsed = JSON.parse(cleaned);
} catch {
  // Fall back: store raw text, log warning, don't crash
  parsed = { executiveSummary: raw, error: 'Failed to parse structured output' };
}
```

## 5. Component Patterns

### Server Component (default)
```tsx
// No 'use client' directive — this is a Server Component
import { db } from '@/db';
import { bills } from '@/db/schema';

export default async function BillsPage() {
  const data = await db.query.bills.findMany({ limit: 20 });
  return <BillList bills={data} />;
}
```

### Client Component (only when needed)
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function BillFilters({ onFilter }: { onFilter: (f: Filters) => void }) {
  const [status, setStatus] = useState<string[]>([]);
  // ...
}
```

### Data fetching in client components
```tsx
// Use SWR or fetch in useEffect — never import db directly
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function AlertsFeed() {
  const { data, error } = useSWR('/api/v1/alerts?limit=10', fetcher);
  // ...
}
```

## 6. Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| DB table | `snake_case` (plural) | `monitoring_topics` |
| DB column | `snake_case` | `created_at` |
| Drizzle schema export | `camelCase` (plural) | `monitoringTopics` |
| API route path | `kebab-case` | `/api/v1/monitoring/topics` |
| API query param | `camelCase` | `?jurisdictionIds=...&sortDirection=desc` |
| TypeScript interface | `PascalCase` | `BillSearchQuery` |
| TypeScript enum value | `snake_case` string literal | `'in_committee'` |
| React component | `PascalCase` | `BillCard.tsx` |
| Utility file | `kebab-case` | `bill-text-fetcher.ts` |
| Inngest function ID | `kebab-case` | `ingest-congress-bills` |
| Inngest event name | `namespace/entity.action` | `ai/bill.enrich` |
| Environment variable | `SCREAMING_SNAKE_CASE` | `CONGRESS_GOV_API_KEY` |

## 7. Error Codes

Standard error codes used in `ApiError` responses:

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `UNAUTHORIZED` | 401 | No valid auth token |
| `FORBIDDEN` | 403 | Authenticated but insufficient permissions |
| `TIER_LIMIT_EXCEEDED` | 403 | Feature requires higher subscription tier |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `VALIDATION_ERROR` | 400 | Request body/params failed Zod validation |
| `RATE_LIMITED` | 429 | Too many requests |
| `CONFLICT` | 409 | Resource already exists (e.g., duplicate monitoring topic) |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

## 8. Bill Status Enum (Canonical)

Used across all jurisdictions. Ingestion collectors must map source-specific statuses to these values:

```
introduced → in_committee → passed_committee → floor_vote_scheduled →
passed_one_chamber → passed_both_chambers → sent_to_executive →
signed_into_law | vetoed | failed | withdrawn | expired
```

## 9. Jurisdiction Codes

| Code | Name | Level |
|------|------|-------|
| `us` | United States | national |
| `us-{state}` | US State (e.g., `us-ca`) | state |
| `gb` | United Kingdom | national |
| `eu` | European Union | supranational |
| `ca` | Canada | national |
| `au` | Australia | national |

Phase 0–1 only uses `us` and `gb`. Schema supports all.

## 10. Unique Constraint Keys (Ingestion)

All ingested entities use a composite unique key for upserts:

| Table | Unique Key | Purpose |
|-------|-----------|---------|
| `bills` | `(external_id, external_source)` | Prevents duplicate bills across sources |
| `politicians` | `(external_id, external_source)` | Prevents duplicate politician records |
| `politician_activities` | `(politician_id, source_id, type)` | Prevents duplicate activity records |
| `ingestion_source_health` | `(source)` | One health record per source |

Create unique indexes for these after migration if Drizzle doesn't generate them automatically:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_bills_external
  ON bills (external_id, external_source);
CREATE UNIQUE INDEX IF NOT EXISTS idx_politicians_external
  ON politicians (external_id, external_source);
```
