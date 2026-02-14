# POLARIS DESIGN SYSTEM

## Design Philosophy

Polaris is a **professional intelligence platform**, not a consumer SaaS app. The visual language must communicate authority, precision, and institutional trust. Users are lobbyists, policy directors, political strategists, and elected officials — people who work with Bloomberg terminals, Palantir dashboards, and Financial Times subscriptions. The UI must feel like it belongs in that ecosystem.

**Design North Stars:**
- Bloomberg Terminal (data density, dark palette, information hierarchy)
- Linear (clean execution, restrained animations, purposeful whitespace)
- Financial Times (typographic authority, editorial quality)
- Palantir Gotham (analytical depth, dark UI, sophisticated data visualization)

**Anti-patterns — explicitly avoid:**
- Startup-colorful dashboards (Notion, Airtable pastels)
- Generic shadcn/ui default gray zinc aesthetic
- Rounded bubbly components (keep radii tight)
- Emoji or playful iconography
- Excessive whitespace that wastes screen real estate on data pages

---

## 1. COLOR SYSTEM

### 1.1 Dark Mode (Default)

Polaris ships dark mode as the default. This is non-negotiable. Light mode is available but secondary.

**shadcn/ui theme configuration — override these CSS variables in `globals.css`:**

```css
@layer base {
  /* ============================================
     DARK MODE (DEFAULT)
     ============================================ */
  :root {
    /* Base surfaces — deep navy-slate, NOT pure black */
    --background: 222 47% 6%;           /* #0B1120 — deepest background */
    --foreground: 210 20% 92%;          /* #E2E8F0 — primary text */

    /* Card/panel surfaces — subtle elevation via lightness, not shadow */
    --card: 222 40% 8%;                 /* #111827 — card background */
    --card-foreground: 210 20% 92%;

    /* Popover/dropdown surfaces */
    --popover: 222 40% 10%;             /* #151D2E */
    --popover-foreground: 210 20% 92%;

    /* Primary action — cool steel blue */
    --primary: 217 72% 56%;             /* #3B82F6 — primary buttons, links */
    --primary-foreground: 0 0% 100%;

    /* Secondary — muted blue-gray for secondary actions */
    --secondary: 215 20% 16%;           /* #1E293B */
    --secondary-foreground: 210 20% 80%;

    /* Muted — for disabled, placeholder, subtle text */
    --muted: 215 20% 14%;              /* #1A2332 */
    --muted-foreground: 215 15% 50%;   /* #64748B */

    /* Accent — used sparingly for hover states, active items */
    --accent: 215 20% 14%;
    --accent-foreground: 210 20% 92%;

    /* Destructive — for errors, destructive actions */
    --destructive: 0 72% 51%;          /* #DC2626 — muted red, not screaming */
    --destructive-foreground: 0 0% 100%;

    /* Borders — barely visible, structural not decorative */
    --border: 215 20% 16%;             /* #1E293B */
    --input: 215 20% 18%;              /* #212D3F */
    --ring: 217 72% 56%;               /* matches primary */

    /* Border radius — tight, not bubbly */
    --radius: 0.375rem;                /* 6px — sharp but not harsh */

    /* Sidebar — slightly differentiated from main canvas */
    --sidebar-background: 222 47% 5%;  /* #090F1D — darker than main bg */
    --sidebar-foreground: 210 20% 75%;
    --sidebar-primary: 217 72% 56%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 215 20% 12%;
    --sidebar-accent-foreground: 210 20% 92%;
    --sidebar-border: 215 20% 12%;
    --sidebar-ring: 217 72% 56%;

    /* Chart colors — reserved, analytical palette */
    --chart-1: 217 72% 56%;            /* Steel blue */
    --chart-2: 168 56% 45%;            /* Teal */
    --chart-3: 38 80% 55%;             /* Amber */
    --chart-4: 280 50% 55%;            /* Muted purple */
    --chart-5: 0 60% 50%;              /* Muted red */
  }

  /* ============================================
     LIGHT MODE (Secondary — toggle available)
     ============================================ */
  .light {
    --background: 210 20% 98%;          /* #F8FAFC */
    --foreground: 222 47% 11%;          /* #0F172A */

    --card: 0 0% 100%;                  /* Pure white cards */
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    --primary: 217 72% 48%;             /* #2563EB — slightly darker for contrast */
    --primary-foreground: 0 0% 100%;

    --secondary: 210 20% 96%;           /* #F1F5F9 */
    --secondary-foreground: 222 47% 11%;

    --muted: 210 20% 96%;
    --muted-foreground: 215 15% 40%;

    --accent: 210 20% 96%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 214 20% 90%;              /* #E2E8F0 */
    --input: 214 20% 90%;
    --ring: 217 72% 48%;

    --sidebar-background: 210 20% 96%;
    --sidebar-foreground: 222 47% 30%;
    --sidebar-primary: 217 72% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 210 20% 93%;
    --sidebar-accent-foreground: 222 47% 11%;
    --sidebar-border: 214 20% 90%;
    --sidebar-ring: 217 72% 48%;

    --chart-1: 217 72% 48%;
    --chart-2: 168 56% 38%;
    --chart-3: 38 80% 48%;
    --chart-4: 280 50% 48%;
    --chart-5: 0 60% 45%;
  }
}
```

### 1.2 Semantic Colors (Custom Utilities)

Add these to `tailwind.config.ts` under `extend.colors`:

```typescript
// These are used throughout the app for domain-specific meanings
const polarisColors = {
  // Bill status progression — cool-to-warm gradient as bills advance
  status: {
    introduced:     '#64748B', // Slate gray — early stage, low signal
    inCommittee:    '#3B82F6', // Blue — active, in process
    passedCommittee:'#06B6D4', // Cyan — gaining momentum
    floorVote:      '#8B5CF6', // Purple — high attention
    passedChamber:  '#F59E0B', // Amber — significant milestone
    passedBoth:     '#F97316', // Orange — near-final
    signedIntoLaw:  '#10B981', // Emerald — enacted
    vetoed:         '#EF4444', // Red — blocked
    failed:         '#6B7280', // Gray — dead
    withdrawn:      '#6B7280', // Gray — dead
    expired:        '#6B7280', // Gray — dead
  },

  // Alert priority
  priority: {
    critical: '#EF4444', // Red
    high:     '#F59E0B', // Amber
    medium:   '#3B82F6', // Blue
    low:      '#64748B', // Slate
  },

  // Party colors (US + UK — politically neutral, standard associations)
  party: {
    republican:   '#DC2626', // Red
    democrat:     '#2563EB', // Blue
    independent:  '#7C3AED', // Purple
    conservative: '#1D4ED8', // Deep blue
    labour:       '#DC2626', // Red
    libdem:       '#F59E0B', // Gold/amber
    snp:          '#FBBF24', // Yellow
    green:        '#16A34A', // Green
    other:        '#64748B', // Slate
  },

  // Jurisdiction badges
  jurisdiction: {
    us: '#3B82F6', // Blue
    gb: '#8B5CF6', // Purple
    eu: '#06B6D4', // Cyan
    ca: '#EF4444', // Red
    au: '#F59E0B', // Amber
  },

  // Tier indicators
  tier: {
    starter:      '#64748B', // Slate
    professional: '#3B82F6', // Blue
    enterprise:   '#F59E0B', // Gold
    global:       '#A855F7', // Purple — premium
  },

  // Surface accents
  surface: {
    elevated: 'rgba(255, 255, 255, 0.03)', // Subtle lift
    hover:    'rgba(255, 255, 255, 0.05)', // Hover state
    active:   'rgba(255, 255, 255, 0.08)', // Active/selected
    overlay:  'rgba(0, 0, 0, 0.60)',       // Modal overlay
  },
};
```

### 1.3 Color Rules

1. **Never use pure black (#000000) as a background.** Always use the deep navy-slate (`#0B1120`). Pure black feels dead; dark navy feels sophisticated.
2. **Never use pure white (#FFFFFF) for text in dark mode.** Use `#E2E8F0` (the foreground variable). Pure white on dark navy causes eye strain.
3. **Borders should be barely visible.** They define structure but should never be the loudest element on screen. Use `border` variable at 1px.
4. **Color is used for meaning, not decoration.** Every color on screen must communicate something: status, priority, affiliation, or action.
5. **Party colors appear ONLY next to explicit party labels.** Never color entire cards or sections by party — that implies editorial bias.

---

## 2. TYPOGRAPHY

### 2.1 Font Stack

```typescript
// next.config.ts or layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
```

```css
/* globals.css */
body {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* Inter stylistic alternates */
  letter-spacing: -0.011em; /* Slightly tighter tracking — professional, dense feel */
}

code, pre, .font-mono {
  font-family: var(--font-mono), 'Consolas', monospace;
}
```

### 2.2 Type Scale

| Token | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `display` | 36px / 2.25rem | 700 | 1.1 | Marketing hero headlines only |
| `h1` | 24px / 1.5rem | 600 | 1.25 | Page titles |
| `h2` | 20px / 1.25rem | 600 | 1.3 | Section headers |
| `h3` | 16px / 1rem | 600 | 1.4 | Card titles, subsection headers |
| `h4` | 14px / 0.875rem | 600 | 1.4 | Table column headers, label groups |
| `body` | 14px / 0.875rem | 400 | 1.5 | Default body text |
| `body-sm` | 13px / 0.8125rem | 400 | 1.5 | Secondary text, table cells |
| `caption` | 12px / 0.75rem | 400 | 1.4 | Timestamps, metadata, badges |
| `overline` | 11px / 0.6875rem | 600 | 1.3 | ALL CAPS labels, section markers |
| `mono` | 13px / 0.8125rem | 400 | 1.5 | Bill numbers, IDs, code |

**Tailwind class mappings (add to globals.css):**

```css
.text-display { @apply text-4xl font-bold leading-tight tracking-tight; }
.text-h1      { @apply text-2xl font-semibold leading-tight tracking-tight; }
.text-h2      { @apply text-xl font-semibold leading-snug; }
.text-h3      { @apply text-base font-semibold leading-snug; }
.text-h4      { @apply text-sm font-semibold leading-snug; }
.text-body    { @apply text-sm leading-relaxed; }
.text-body-sm { @apply text-[13px] leading-relaxed; }
.text-caption { @apply text-xs leading-snug; }
.text-overline { @apply text-[11px] font-semibold uppercase tracking-widest; }
```

### 2.3 Typography Rules

1. **14px is the base**, not 16px. This platform is data-dense; 16px wastes space without improving readability for professional users.
2. **Use font-semibold (600), not font-bold (700)** for headings inside the dashboard. Bold is for marketing pages only.
3. **Bill numbers always render in monospace**: `<span className="font-mono">HR 1234</span>`.
4. **Never center-align body text.** Left-align everything in the dashboard. Center alignment is only for marketing CTAs and empty states.
5. **Truncate long bill titles with ellipsis**, never let them wrap in table rows or card headers. Show full title on hover via tooltip.

---

## 3. SPACING & LAYOUT

### 3.1 Spacing Scale

Use Tailwind's default scale. Preferred increments for key spacing:

| Context | Spacing | Tailwind |
|---------|---------|----------|
| Between related items in a group | 8px | `gap-2` |
| Between distinct elements in a card | 12px | `gap-3` |
| Card internal padding | 16px | `p-4` |
| Between cards/sections | 16px | `gap-4` |
| Page section separation | 24px | `gap-6` |
| Page edge padding | 24px | `px-6` |
| Major layout regions | 32px | `gap-8` |

### 3.2 Layout Dimensions

```
┌──────────────────────────────────────────────────────────────┐
│ Top Bar (h-14 / 56px, sticky top-0, z-30)                   │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │  Main Content                                     │
│          │  (px-6 py-6, max-w-screen-2xl mx-auto)           │
│ w-64     │                                                   │
│ (256px)  │                                                   │
│          │                                                   │
│ Collapsed│                                                   │
│ w-16     │                                                   │
│ (64px)   │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

| Element | Dimension | Notes |
|---------|-----------|-------|
| Sidebar expanded | `w-64` (256px) | Fixed position, full height |
| Sidebar collapsed | `w-16` (64px) | Icons only, tooltip labels |
| Top bar height | `h-14` (56px) | Sticky, blur backdrop |
| Content max-width | `max-w-screen-2xl` | 1536px, centered |
| Content padding | `px-6 py-6` | 24px all sides |
| Mobile breakpoint | `lg:` (1024px) | Sidebar collapses below this |

### 3.3 Grid System

**Data tables and list views:** Full width, no grid — table stretches to fill.

**Dashboard overview:** 12-column grid for stat cards and widgets.

```tsx
// Stats row — 4 cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// Main content + sidebar widget
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{ /* Primary content */ }</div>
  <div>{ /* Side panel */ }</div>
</div>

// Two equal columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

---

## 4. COMPONENT SPECIFICATIONS

### 4.1 Sidebar Navigation

```
┌──────────────────┐
│  ☆ POLARIS        │  ← Logo mark + wordmark, font-semibold
│  Acme Corp        │  ← Org name, text-caption, muted
│  Professional ◆   │  ← Tier badge (blue dot)
├──────────────────┤
│  ▣ Overview       │  ← Active: bg-accent, text-primary, left-2px border-primary
│  ☰ Legislation    │  ← Inactive: text-muted-foreground
│  ◉ Stakeholders   │
│  ◎ Alerts    ③   │  ← Unread count badge (small, rounded-full)
│                   │
├──────────────────┤  ← Separator, very subtle
│  ▶ Monitoring     │  ← Collapsible section
│    Keywords       │
│    Bills          │
│    Committees     │
├──────────────────┤
│                   │
│                   │  ← Flex spacer
│                   │
├──────────────────┤
│  ⚙ Settings       │  ← Bottom pinned
│  ◈ [UserButton]  │  ← Clerk avatar, bottom of sidebar
└──────────────────┘
```

**Implementation details:**
- Active nav item: `bg-primary/10 text-primary border-l-2 border-primary`
- Inactive nav item: `text-muted-foreground hover:text-foreground hover:bg-accent transition-colors`
- Nav item padding: `px-3 py-2`
- Icon size: `h-4 w-4` (16px)
- Text: `text-body-sm font-medium`
- Unread badge: `bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center`

### 4.2 Top Bar

```
┌──────────────────────────────────────────────────────────────────┐
│  Legislation / Bills           🔍 Search bills, politicians...   🔔③  [Avatar] │
│  ← Breadcrumb (caption, muted)     ← Command palette trigger         Clerk │
└──────────────────────────────────────────────────────────────────┘
```

**Implementation details:**
- Background: `bg-background/80 backdrop-blur-md border-b border-border`
- Height: `h-14`
- Position: `sticky top-0 z-30`
- Search input: styled as a button/trigger for the Command palette (`⌘K`), not a real input. Muted placeholder text, border, subtle rounded.
- Notification bell: relative position, badge overlay for unread count.

### 4.3 Cards

**Standard card:**
```tsx
<Card className="bg-card border border-border rounded-md">
  <CardHeader className="pb-3">
    <CardTitle className="text-h3">{title}</CardTitle>
    <CardDescription className="text-caption text-muted-foreground">{description}</CardDescription>
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>
```

**Stat card (dashboard overview):**
```tsx
<Card className="bg-card border border-border rounded-md p-4">
  <div className="flex items-center justify-between mb-1">
    <span className="text-overline text-muted-foreground">BILLS TRACKED</span>
    <ScrollText className="h-4 w-4 text-muted-foreground" />
  </div>
  <div className="text-h1 text-foreground">247</div>
  <div className="text-caption text-muted-foreground mt-1">
    <span className="text-emerald-500">+12%</span> from last month
  </div>
</Card>
```

**Card rules:**
- Border radius: `rounded-md` (6px) — NOT `rounded-lg` or `rounded-xl`
- Shadow: **none** in dark mode. Elevation is communicated through background lightness, not shadow.
- In light mode: `shadow-sm` only, never `shadow-md` or larger.
- Border: always `border border-border`. Cards must have visible edges.

### 4.4 Tables

Tables are the primary data display pattern. They must be dense, scannable, and professional.

```tsx
<Table>
  <TableHeader>
    <TableRow className="border-b border-border hover:bg-transparent">
      <TableHead className="text-overline text-muted-foreground font-semibold h-10">
        BILL
      </TableHead>
      {/* ... */}
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer">
      <TableCell className="text-body-sm py-3">
        <span className="font-mono text-primary">HR 1234</span>
      </TableCell>
      {/* ... */}
    </TableRow>
  </TableBody>
</Table>
```

**Table rules:**
- Row height: `py-3` (compact, professional)
- Header: `text-overline`, uppercase, muted foreground
- Row hover: `hover:bg-accent/50` — barely visible highlight
- Row borders: `border-border/50` — lighter than card borders
- Never use striped/alternating row colors
- Clickable rows get `cursor-pointer`
- Columns align left by default. Numbers align right. Dates align right.

### 4.5 Badges / Tags

**Bill status badge:**
```tsx
<Badge
  variant="outline"
  className="text-[11px] font-medium border rounded px-1.5 py-0.5"
  style={{
    color: statusColor,
    borderColor: `${statusColor}40`, // 25% opacity border
    backgroundColor: `${statusColor}10`, // 6% opacity fill
  }}
>
  {statusLabel}
</Badge>
```

**Jurisdiction badge:**
```tsx
<Badge variant="secondary" className="text-[11px] font-mono font-medium rounded px-1.5 py-0.5">
  🇺🇸 US  {/* or 🇬🇧 UK — flag emoji + country code */}
</Badge>
```

**Party badge:**
```tsx
<span className="inline-flex items-center gap-1 text-caption">
  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: partyColor }} />
  {partyName}
</span>
```

**Badge rules:**
- Always `rounded` (4px), never `rounded-full` for status badges (pills look casual)
- Unread count badges are the exception — these use `rounded-full`
- Use transparent fills with colored borders, not solid fills. Solid colored badges compete with content.
- Font: `text-[11px]` — badges should be smaller than body text

### 4.6 Buttons

**Primary (CTA):**
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm font-medium rounded-md">
  Track This Bill
</Button>
```

**Secondary:**
```tsx
<Button variant="secondary" className="h-9 px-4 text-sm font-medium rounded-md">
  Export
</Button>
```

**Ghost (inline actions, nav):**
```tsx
<Button variant="ghost" className="h-8 px-2 text-sm font-medium text-muted-foreground hover:text-foreground">
  View All
</Button>
```

**Button rules:**
- Height: `h-9` (36px) for standard, `h-8` (32px) for compact/inline
- Border radius: `rounded-md` — match cards
- Primary buttons are rare. Max 1–2 per visible screen. If everything is primary, nothing is.
- Destructive actions require confirmation dialog. Never a red button alone.

### 4.7 Command Palette (Global Search)

Triggered by `⌘K` or clicking the search bar in the top bar.

```tsx
<CommandDialog>
  <CommandInput placeholder="Search bills, politicians, topics..." />
  <CommandList>
    <CommandGroup heading="Bills">
      <CommandItem>
        <ScrollText className="mr-2 h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-body-sm">HR 1234 — Clean Energy Act</span>
          <span className="text-caption text-muted-foreground">US Congress · In Committee</span>
        </div>
      </CommandItem>
    </CommandGroup>
    <CommandGroup heading="Politicians">
      <CommandItem>
        <User className="mr-2 h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-body-sm">Sen. Jane Smith (D-CA)</span>
          <span className="text-caption text-muted-foreground">US Senate · Energy Committee</span>
        </div>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

### 4.8 Empty States

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <SearchX className="h-6 w-6 text-muted-foreground" />
  </div>
  <p className="text-h3 text-foreground mb-1">No bills found</p>
  <p className="text-body-sm text-muted-foreground max-w-sm">
    Try adjusting your filters or search terms to find what you're looking for.
  </p>
</div>
```

Empty states are NOT playful. No illustrations, no mascots, no emoji. Icon + text + suggestion.

### 4.9 Loading States

Use skeleton loaders that match the exact layout of the content they replace.

```tsx
// Table skeleton
<div className="space-y-2">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center gap-4 px-4 py-3">
      <Skeleton className="h-4 w-24" />  {/* Bill number */}
      <Skeleton className="h-4 w-64" />  {/* Title */}
      <Skeleton className="h-5 w-20" />  {/* Status badge */}
      <Skeleton className="h-4 w-16 ml-auto" />  {/* Date */}
    </div>
  ))}
</div>
```

Skeleton color: `bg-muted` (matches empty states, barely visible shimmer).

---

## 5. PAGE-SPECIFIC LAYOUTS

### 5.1 Overview Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│ Welcome back, Sean                               Feb 14, 2026│
├──────────┬──────────┬──────────┬──────────────────────────────┤
│ Bills    │ Alerts   │ Topics   │ AI Summaries                 │
│ Tracked  │ This Week│ Active   │ Generated                    │
│  247     │   18     │   12     │   1,429                      │
│ +12%     │ +3       │ —        │ +86 today                    │
├──────────┴──────────┴──────────┴──────────────────────────────┤
│                                                               │
│ ┌─────────────────────────────┐  ┌──────────────────────────┐ │
│ │ Recent Alerts               │  │ Quick Actions            │ │
│ │                             │  │                          │ │
│ │ ⚡ HR 1234 status changed   │  │ [+ Track a Bill]         │ │
│ │   In Committee → Floor Vote │  │ [+ Add Monitoring Topic] │ │
│ │   2 hours ago               │  │ [⚙ Configure Alerts]    │ │
│ │                             │  │                          │ │
│ │ 📋 New match: S 567         │  ├──────────────────────────┤ │
│ │   Matches "clean energy"    │  │ Pipeline Health          │ │
│ │   5 hours ago               │  │                          │ │
│ │                             │  │ Congress.gov  ● Healthy  │ │
│ │ ...                         │  │ UK Parliament ● Healthy  │ │
│ │                             │  │ Last sync: 14m ago       │ │
│ └─────────────────────────────┘  └──────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### 5.2 Legislation Search

```
┌──────────────────────────────────────────────────────────────┐
│ Legislation                                                   │
│                                                               │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search bills by title, number, or keyword...          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                               │
│ ┌────────────┐                                                │
│ │ Filters ▾  │  US  UK  │ All Statuses ▾ │ Date Range ▾ │    │
│ └────────────┘                                                │
│                                                               │
│ ┌──────┬─────────────────────────┬──────────┬──────┬───────┐ │
│ │ BILL │ TITLE                   │ STATUS   │ JUR. │ DATE  │ │
│ ├──────┼─────────────────────────┼──────────┼──────┼───────┤ │
│ │HR1234│ Clean Energy Innovation │In Commit.│🇺🇸 US│Jan 15 │ │
│ │S 567 │ Digital Privacy Rights  │Floor Vote│🇺🇸 US│Feb 02 │ │
│ │HC 89 │ Online Safety (Amend.)  │2nd Read. │🇬🇧 UK│Jan 28 │ │
│ └──────┴─────────────────────────┴──────────┴──────┴───────┘ │
│                                                               │
│ Showing 1–20 of 1,429 bills                  ← 1 2 3 ... →  │
└───────────────────────────────────────────────────────────────┘
```

Filter bar uses a horizontal pill/chip pattern, not a left sidebar. Sidebar filters waste horizontal space on a data-dense table view.

### 5.3 Bill Detail Page

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to Legislation                                         │
│                                                               │
│ HR 1234 — Clean Energy Innovation and Deployment Act   [Track]│
│ 🇺🇸 US Congress  ·  In Committee  ·  Introduced Jan 15, 2026  │
│                                                               │
│ ┌───────────────────────────────────────┐  ┌───────────────┐ │
│ │ AI Summary                            │  │ Status        │ │
│ │                                       │  │               │ │
│ │ This bill establishes federal         │  │ ● Introduced  │ │
│ │ incentives for clean energy           │  │ ● In Committee│ │
│ │ deployment, with particular focus     │  │ ○ Floor Vote  │ │
│ │ on grid modernization and carbon      │  │ ○ Passed      │ │
│ │ capture technology...                 │  │ ○ Signed      │ │
│ │                                       │  │               │ │
│ ├───────────────────────────────────────┤  ├───────────────┤ │
│ │ Affected Sectors                      │  │ Sponsors      │ │
│ │ Energy · Manufacturing · Finance      │  │               │ │
│ │                                       │  │ 👤 Sen. Smith │ │
│ ├───────────────────────────────────────┤  │ 👤 Rep. Jones │ │
│ │ Key Provisions                        │  │ +4 cosponsors │ │
│ │ • Federal tax credit for...           │  │               │ │
│ │ • Grant program for...                │  ├───────────────┤ │
│ │ • Mandate requiring...                │  │ Committees    │ │
│ │                                       │  │ Energy & Comm.│ │
│ └───────────────────────────────────────┘  └───────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

Left 2/3: AI analysis content. Right 1/3: metadata sidebar (status timeline, sponsors, committees).

### 5.4 Politician Profile

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to Directory                                           │
│                                                               │
│ ┌─────┐  Sen. Jane Smith (D-CA)                     [Monitor]│
│ │Photo│  US Senate · California · Energy Committee Chair      │
│ │64x64│  🌐 website  𝕏 twitter                               │
│ └─────┘                                                       │
│                                                               │
│ ┌─────────┬──────────────┬─────────────┐                      │
│ │ Activity│ Sponsored    │ Committees  │                      │
│ ├─────────┴──────────────┴─────────────┤                      │
│ │                                       │                      │
│ │ Tab content here                      │                      │
│ │                                       │                      │
│ └───────────────────────────────────────┘                      │
└───────────────────────────────────────────────────────────────┘
```

Tabbed layout for politician detail. Header stays fixed; tabs scroll below.

---

## 6. ICONOGRAPHY

Use **Lucide React** exclusively. Already included with shadcn/ui.

**Standard icon mappings:**

| Concept | Icon | Import |
|---------|------|--------|
| Overview/Dashboard | `LayoutDashboard` | `lucide-react` |
| Legislation/Bills | `ScrollText` | `lucide-react` |
| Stakeholders | `Users` | `lucide-react` |
| Alerts | `Bell` | `lucide-react` |
| Settings | `Settings` | `lucide-react` |
| Search | `Search` | `lucide-react` |
| Monitoring | `Eye` | `lucide-react` |
| Add/Create | `Plus` | `lucide-react` |
| Filter | `SlidersHorizontal` | `lucide-react` |
| Calendar/Date | `Calendar` | `lucide-react` |
| External link | `ExternalLink` | `lucide-react` |
| Politician | `User` | `lucide-react` |
| Committee | `Landmark` | `lucide-react` |
| Jurisdiction | `Globe` | `lucide-react` |
| AI/Summary | `Sparkles` | `lucide-react` |
| Export | `Download` | `lucide-react` |
| Status healthy | `CircleCheck` | `lucide-react` |
| Status warning | `CircleAlert` | `lucide-react` |
| Status error | `CircleX` | `lucide-react` |

**Icon rules:**
- Dashboard icons: `h-4 w-4` (16px)
- Inline with text: `h-4 w-4` with `mr-2` or `gap-2`
- Empty state icons: `h-6 w-6`
- Marketing page icons: `h-5 w-5`
- Never use filled icon variants. Outline (stroke) only.
- Icon color defaults to `text-muted-foreground`. Active/primary states get `text-primary` or `text-foreground`.

---

## 7. MOTION & TRANSITIONS

Animations are minimal and functional. This is a data platform, not a portfolio site.

```css
/* globals.css — base transitions */
@layer utilities {
  .transition-default {
    @apply transition-colors duration-150 ease-in-out;
  }
  .transition-transform-fast {
    @apply transition-transform duration-100 ease-out;
  }
}
```

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Hover state (buttons, rows, nav items) | Color change only | 150ms |
| Sidebar collapse/expand | Width + opacity | 200ms ease-out |
| Dialog/modal open | Fade in + scale from 95% | 150ms ease-out |
| Dialog/modal close | Fade out | 100ms ease-in |
| Dropdown open | Fade in + translateY(-4px) | 150ms |
| Toast notification | Slide in from right | 200ms |
| Page transitions | None — instant | — |
| Skeleton shimmer | Subtle pulse | 2s infinite |

**Motion rules:**
- No bounce effects
- No spring physics
- No slide-in page transitions
- No parallax
- Loading spinners: use `animate-spin` on a minimal Lucide `Loader2` icon, never a branded spinner

---

## 8. MARKETING PAGES (Landing, Pricing, About)

Marketing pages use a different density and treatment than the dashboard.

**Key differences from dashboard:**
- More whitespace (`py-24` between sections, `max-w-screen-xl`)
- Larger type scale: `display` for hero, `h1` for section titles
- Dark background with subtle gradient: `bg-gradient-to-b from-background to-card`
- CTA buttons are larger: `h-11 px-6 text-base`
- Subtle grid or dot pattern as background texture (CSS only, no image)

**Hero section pattern:**
```tsx
<section className="relative overflow-hidden py-24 lg:py-32">
  {/* Subtle radial gradient accent */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

  <div className="relative max-w-screen-xl mx-auto px-6 text-center">
    <p className="text-overline text-primary mb-4">POLITICAL INTELLIGENCE PLATFORM</p>
    <h1 className="text-display max-w-3xl mx-auto mb-6">
      Intelligence for both sides of the political table
    </h1>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
      Monitor legislation, map stakeholder relationships, and surface
      AI-powered insights across jurisdictions — in real time.
    </p>
    <div className="flex items-center justify-center gap-4">
      <Button size="lg">Start Free Trial</Button>
      <Button size="lg" variant="outline">View Pricing</Button>
    </div>
  </div>
</section>
```

**Pricing cards:**
- Current tier highlighted with `border-primary ring-1 ring-primary` and a "Most Popular" or "Current Plan" badge
- Enterprise/Global tiers show "Contact Sales" instead of price
- Feature lists use checkmarks (`Check` icon in `text-primary`), not bullets

---

## 9. RESPONSIVE BEHAVIOR

| Breakpoint | Sidebar | Content | Tables |
|------------|---------|---------|--------|
| `< 768px` (mobile) | Hidden, hamburger menu | Full width, `px-4` | Horizontal scroll or card view |
| `768–1023px` (tablet) | Collapsed (icons only) | Full width, `px-6` | Horizontal scroll |
| `1024px+` (desktop) | Expanded (256px) | Remaining width, `px-6` | Full table |
| `1536px+` (wide) | Expanded | Capped at `max-w-screen-2xl`, centered | Full table |

**Mobile table strategy:** For bill search and politician directory, tables on mobile transform into card-based lists. Each row becomes a compact card showing bill number, truncated title, status badge, and date. Do NOT use horizontal scroll tables on mobile.

---

## 10. DARK/LIGHT MODE TOGGLE

Place in the settings page AND as a secondary action in the top bar (sun/moon icon).

```tsx
// Use next-themes for toggle
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

Default theme is `dark`. Persist preference in localStorage. Respect `prefers-color-scheme` for first-time visitors.

**Install dependency:**
```bash
npm install next-themes
```

Add `<ThemeProvider>` in root layout wrapping children, with `defaultTheme="dark"` and `attribute="class"`.

---

## 11. ACCESSIBILITY BASELINE

Not a full WCAG audit, but these are minimum requirements:

1. All interactive elements must be keyboard-accessible (`tabindex`, focus rings via `ring` variable)
2. Focus ring: `ring-2 ring-ring ring-offset-2 ring-offset-background`
3. Color contrast: all text meets WCAG AA (4.5:1 for body, 3:1 for large text). The defined palette has been selected to meet this.
4. All images and icons used as buttons must have `aria-label`
5. Tables must use proper `<thead>`, `<th scope="col">` markup (shadcn handles this)
6. Modals trap focus and are dismissible with `Escape`
7. Toast notifications include `role="alert"` for screen readers

---

## SUMMARY: KEY INSTRUCTIONS FOR CLAUDE CODE

When building any UI component for Polaris:

1. **Dark mode first.** Always develop and verify in dark mode. Light mode is secondary.
2. **Use the CSS variables above**, not hardcoded hex colors.
3. **`rounded-md` everywhere.** Not `rounded-lg`, not `rounded-xl`, not `rounded-full` (except badges/avatars).
4. **14px base font.** `text-sm` is the body default.
5. **No shadows in dark mode.** Use border + subtle background lightness for elevation.
6. **Monospace for bill numbers and IDs.** Always `font-mono`.
7. **Status colors use the semantic palette.** Never reuse status colors for decoration.
8. **Tables over cards for list views.** Cards are for detail pages and dashboard widgets. Lists are tables.
9. **1–2 primary buttons per screen max.** Everything else is secondary, outline, or ghost.
10. **No emoji in the dashboard.** Lucide icons only. Exception: flag emoji for jurisdiction badges.
11. **Install `next-themes` for dark/light toggle.**
12. **The `polarisColors` object must be added to `tailwind.config.ts` under `extend.colors.polaris`.**
