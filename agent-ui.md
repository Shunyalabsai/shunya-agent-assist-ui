# Agent UI Replication Spec (`/agent`)

This document is a source-of-truth blueprint to recreate the current Agent UI from this repo in a different project while preserving the same layout, styles, interactions, and component behavior.

- Source repo commit: `68a0d00`
- Source app type: Next.js App Router (single app)
- Target architecture: Turborepo (`apps/agent`, `packages/ui`, `packages/shared`)

---

## 1. Route Inventory

## Implemented under `/agent`

1. `/agent/live-call`
- Main live assistance experience
- Includes 4 UI states driven by store: `idle`, `incoming`, `active`, `post-call`

2. `/agent/chat`
- Standalone AI chat assistant screen

3. `/agent/sop`
- SOP + knowledge base tools (filter/search/version/steps/docs table)

4. `/agent/post-call/[sessionId]`
- Dedicated post-call analysis route (dynamic session id)

## Notes

- There is currently no `/agent/page.tsx` index page.
- Sidebar menu shows only 3 routes (Live Call, SOP, Chat Assistant).
- Post-call route exists but is not in sidebar nav.

---

## 2. Global Shell for Agent Routes

## Layout file

`app/agent/layout.tsx`

Key layout structure:

- `SidebarProvider` wraps all content.
- Left sidebar: `<AppSidebar type="agent" />`
- Main shell: `<SidebarInset className="h-svh bg-sidebar flex flex-col pt-4 overflow-hidden">`
- Sticky top header with blur: `<Header className="sticky top-0 z-20 rounded-t-xl shadow-sm" />`
- Main panel:
  - `bg-background`
  - `rounded-b-xl`
  - fixed viewport height math: `h-[calc(100vh-theme(spacing.4)-64px)]`
  - vertical scroll only inside main panel
- Content wrapper: `p-6 max-w-7xl w-full mx-auto`

## Sidebar behavior

From `components/layout/AppSidebar.tsx` + `components/ui/sidebar.tsx`:

- Desktop collapsible sidebar (`expanded`/`collapsed`) with icon-only collapse mode
- Mobile switches to Sheet drawer
- Sidebar width constants:
  - desktop: `16rem`
  - mobile sheet: `18rem`
  - icon collapsed: `3rem`
- Keyboard shortcut: `Cmd/Ctrl + b` toggles sidebar
- Active nav logic: exact path match OR nested path starts with item url

## Agent nav items

From `components/layout/navigation-items.tsx`:

1. Live Call -> `/agent/live-call`
2. SOP -> `/agent/sop`
3. Chat Assistant -> `/agent/chat`

## Header behavior

From `components/layout/Header.tsx`:

- Includes `SidebarTrigger`
- Breadcrumbs auto-generated from URL segments using `generateBreadcrumbs(pathname)`
- Uses label mapping from `lib/utils/breadcrumbs.ts`:
  - `live-call` -> `Live Call`
  - `sop` -> `SOP`
  - `chat` -> `Chat Assistant`
  - `post-call` -> `Post Call`

---

## 3. Visual System (Tokens, Theme, Colors)

## Theme bootstrap

From `app/layout.tsx`:

- Fonts: Geist + Geist Mono via `next/font/google`
- Body classes: `antialiased bg-sidebar text-foreground`
- Theme provider: `next-themes` with `defaultTheme="dark"`, `enableSystem`

## CSS token source

From `app/globals.css`:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.5229 0.2247 262.32);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.5229 0.2247 262.32);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

## Style characteristics used heavily in Agent UI

- Rounded cards/panels (`rounded-xl` and `rounded-2xl`)
- Soft borders (`border-*` with transparency)
- Dense card layouts with compact headers
- Frequent color utility overlays like:
  - `bg-primary/5`, `bg-primary/10`
  - `bg-green-500/20`, `bg-red-500/20`, `bg-yellow-500/20`
- Motion classes from `tw-animate-css`:
  - `animate-in`, `fade-in`, `zoom-in`, `slide-in-from-bottom-4`, `animate-ping`, `animate-pulse`

---

## 4. Core Data Contracts

## Chat

```ts
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
```

## Live Call Store Contracts

```ts
type CallStatus = "idle" | "incoming" | "active" | "post-call";

interface SOPStep {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "current" | "pending";
}

interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface UpsellOpportunity {
  id: string;
  productName: string;
  description: string;
  confidence: number;
  estimatedValue?: number;
  reason: string;
}

interface CallData {
  id: string;
  duration: number;
  customerName?: string;
  customerId?: string;
  customerPhone?: string;
  customerDOB?: string;
  isRepeatCaller?: boolean;
  intent?: string;
  confidence?: number;
  sentiment?: "positive" | "neutral" | "negative" | "warning";
  agentSentiment?: "positive" | "neutral" | "negative" | "warning";
  customerSentimentValue?: number;
  agentSentimentValue?: number;
  complianceStatus?: "compliant" | "non-compliant" | "monitoring";
  complianceIssues?: string[];
  sopSteps?: SOPStep[];
  currentStepId?: string;
  suggestedActions?: SuggestedAction[];
  upsellOpportunity?: UpsellOpportunity;
  [key: string]: unknown;
}
```

## SOP / Knowledge Contracts

```ts
interface SOPDocument {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

type DocumentStatus = "Processing" | "Active" | "Failed" | "Archived";

interface KnowledgeArticle {
  id: string;
  title: string;
  type: "pdf" | "doc" | "docx" | "txt";
  process: string;
  queue: string;
  language: string;
  version: string;
  status: DocumentStatus;
  updatedAt: string;
  content?: string;
  category?: string;
  tags?: string[];
}
```

## Post-call contracts

```ts
interface PostCallData {
  sessionId: string;
  summary?: string;
  keyMoments?: KeyMoment[];
  transcript?: string;
  complianceReport?: ComplianceReport;
  metadata?: {
    duration?: number;
    startTime?: string;
    endTime?: string;
    agentName?: string;
    customerName?: string;
  };
}

interface KeyMoment {
  timestamp: number;
  description: string;
  type: "positive" | "negative" | "neutral" | "upsell" | "complaint";
}

interface ComplianceReport {
  status: "compliant" | "non-compliant";
  issues?: string[];
}
```

---

## 5. Stores and Hooks

## `useLiveCallStore` (Zustand)

State:

- `callData: CallData | null`
- `isConnected: boolean`
- `callStatus: CallStatus`

Actions:

- `setCallData(data)`
- `setConnected(connected)`
- `setCallStatus(status)`
- `incomingCall(data)` -> status becomes `incoming`
- `startCall()` -> status becomes `active`
- `endCall()` -> status becomes `post-call`
- `completeCall()` -> status becomes `idle`, clears call data
- `reset()` -> full reset
- `loadSampleData()` -> loads `SAMPLE_CALL_DATA` and activates call

## Feature flags

`useFeatureFlagsStore` defaults:

- `upsell_prompts: true`
- `live_sentiment: true`

`useFeature(featureKey)` returns boolean from store.

Used by:

- `SentimentIndicator` (`live_sentiment`)
- `UpsellPrompt` (`upsell_prompts`)

## Auth dependency in sidebar

`AppSidebar` reads `useAuthStore().user` to filter nav items by permission.
For agent nav there are no permission requirements currently, so all 3 are shown.

---

## 6. Route-by-Route Replication

## A. `/agent/live-call`

File: `app/agent/live-call/page.tsx`

### Page-local state

- `messages: ChatMessage[]`
- `isLoading: boolean`

### Mock chat behavior

- On send: append user message
- Wait 1s (`setTimeout`)
- Append mock assistant reply

### Store-driven call state rendering

1. `incoming`
- Renders `IncomingCallOverlay`
- Blurred/faded background waiting screen

2. `post-call`
- Renders feature component `PostCallScreen`

3. `idle`
- Centered "Ready for calls" screen with pulsing dot

4. `active`
- Full live dashboard

### Active state composition

1. Page heading (`Live Call` + subtitle)
2. Top row:
- `CustomerDetailsCard`
- `LiveCallHeader` (with end-call control)
3. Main grid `lg:grid-cols-3`
- Left 2 columns:
  - Unified "Live Analysis" card containing:
    - `IntentBadge` (`variant="ghost"`)
    - `SentimentIndicator` (`variant="ghost"`)
    - `ComplianceStatus` (`variant="ghost"`)
  - Guidance/actions grid:
    - `SOPFlowPanel`
    - `NextBestActionCard`
    - `UpsellPrompt`
- Right column:
  - Chat card with `ChatHistory` + `ChatInput`

### Debug controls included

Fixed top-right test controls:

- Sim Incoming
- Sim Answer/Start
- Sim End Call
- Sim Idle

### Live-call feature components and props

1. `LiveCallHeader`
- Props: `className?`, `onEndCall?`
- Behavior:
  - Call duration timer
  - Mute toggle
  - Hold toggle
  - Transfer/help action placeholders
  - End call action

2. `CustomerDetailsCard`
- Props: `className?`
- Reads customer fields from `callData`

3. `IntentBadge`
- Props: `className?`, `variant?: "card" | "ghost"`
- Intent + confidence progress

4. `SentimentIndicator`
- Props: `className?`, `variant?: "card" | "ghost"`
- Customer/agent sentiment split
- Hidden when feature flag disabled

5. `ComplianceStatus`
- Props: `className?`, `variant?: "card" | "ghost"`
- Compliant/non-compliant/pending mapping

6. `SOPFlowPanel`
- Props: `className?`
- Vertical step timeline with current/completed/pending visuals

7. `NextBestActionCard`
- Props: `className?`, `onActionSelect?(actionId)`
- Prioritized action selection UI

8. `UpsellPrompt`
- Props: `className?`, `onDismiss?`, `onApply?(id)`
- Hidden unless feature flag enabled and confidence >= 0.7

9. `IncomingCallOverlay`
- Props: `onAnswer`, `onDecline`
- Full-screen modal-like overlay with call CTA

10. `PostCallScreen`
- No props
- Reads `callData` and `completeCall()` from store

11. `AgentChatDock`
- Optional floating chat widget (currently commented out in page)

---

## B. `/agent/chat`

File: `app/agent/chat/page.tsx`

### Layout

- Top title/subtitle
- 4-column desktop grid
  - left (3 cols): Chat card
  - right (1 col): suggested prompts + safety notice

### Components

1. `ChatHistory`
- Props: `messages?`, `className?`
- Auto-scroll to latest
- Empty state text

2. `ChatInput`
- Props:
  - `onSendMessage?`
  - `placeholder?`
  - `disabled?`
  - `isLoading?`
  - `className?`
- Enter sends, Shift+Enter newline

3. `SuggestedPrompts`
- Props: `prompts?`, `onPromptSelect?`, `className?`
- Default grouped prompts by category:
  - Product
  - Support
  - Sales
  - Technical

4. `SafetyNotice`
- Props: `className?`, `variant?: default|warning|info`
- Compliance/guidelines informational panel

### Data behavior

- Same mocked chat response pattern as live-call page
- No backend call wired yet

---

## C. `/agent/sop`

File: `app/agent/sop/page.tsx`

### Page-local state

- `documents: SOPDocument[]`
- `selectedCategory: string`
- `selectedTags: string[]`
- `searchQuery: string`

### Data bootstrapping

- `useEffect` seeds 3 mock SOP documents
- Categories and tags computed from current documents
- Filter logic applies category, tags, and text search

### Layout

- Title/subtitle
- `KnowledgeFilterBar`
- Main grid `lg:grid-cols-3`
  - left 2 columns:
    - `KnowledgeSearch`
    - `DocumentList`
  - right column:
    - `VersionSelector`
    - `SOPStepViewer`

### SOP feature components

1. `KnowledgeFilterBar`
- Search + category select + clickable tags
- Clear-all filter action

2. `KnowledgeSearch`
- Local debounced search (300ms)
- Searches title/content/category/tags
- List with category/tags badges

3. `VersionSelector`
- Version dropdown + metadata panel

4. `SOPStepViewer`
- SOP document context + ordered steps timeline
- Optional step complete callbacks

### Knowledge table component

`DocumentList` from `features/knowledge/components/DocumentList.tsx`:

- TanStack table columns:
  - Document Name
  - Type
  - Process
  - Queue/Campaign
  - Language
  - Version
  - Status
  - Actions (view/edit/delete)
- Tab filters:
  - All Documents
  - SOPs
  - Knowledge Base
  - QA Frameworks
  - Governance & Guardrails

### Important data mismatch to preserve or fix

Current `/agent/sop` casts `SOPDocument[]` to `KnowledgeArticle[]` when passing into `DocumentList`.
That means fields like `type`, `process`, `queue`, `language`, `version`, `status` are missing in runtime data.

If you want an exact visual clone including behavior quality, you should provide full `KnowledgeArticle` objects for table usage.

---

## D. `/agent/post-call/[sessionId]`

File: `app/agent/post-call/[sessionId]/page.tsx`

### Behavior

- Reads `sessionId` from async route params
- Loads mocked `PostCallData` using that id
- Shows loading state until data exists

### Layout

- Title + session id subtitle
- Main grid `lg:grid-cols-3`
  - left 2 columns:
    - `CallSummary`
    - `KeyMomentsTimeline`
    - `TranscriptViewer`
  - right:
    - `ComplianceReport`
    - `TicketDraftPanel`

### Components

1. `CallSummary`
- Metadata + AI summary text

2. `KeyMomentsTimeline`
- Sorted timestamp timeline with type badges/icons

3. `TranscriptViewer`
- Searchable transcript with `<mark>` highlighting

4. `ComplianceReport`
- Compliant/non-compliant + issue list

5. `TicketDraftPanel`
- Draft ticket form with save callback

---

## 7. Shared UI Primitives Required for Pixel-Equivalent Replication

All of these are currently in `components/ui/*` and should move to `packages/ui` in your new monorepo.

Needed primitives for `/agent` routes:

- `button`
- `card`
- `badge`
- `input`
- `textarea`
- `progress`
- `scroll-area`
- `select`
- `table`
- `tabs`
- `dropdown-menu`
- `avatar`
- `tooltip`
- `separator`
- `sheet`
- `sidebar`

Utilities:

- `cn` utility (tailwind-merge + clsx)

Critical variant baselines to keep unchanged:

- `Button`:
  - default: `bg-primary text-primary-foreground hover:bg-primary/90`
  - secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
  - destructive: `bg-destructive text-white ...`
- `Card`: `rounded-xl border py-6 shadow-sm`
- `Badge`:
  - default: `bg-primary text-primary-foreground`
  - secondary: `bg-secondary text-secondary-foreground`
  - destructive: `bg-destructive`
- `Progress`:
  - root: `h-2 rounded-full bg-secondary`
  - indicator: `bg-primary`

Libraries used by primitives/features:

- Radix UI packages
- `class-variance-authority`
- `tailwind-merge`
- `clsx`
- `lucide-react`
- `motion` (sidebar label animations)
- `@tanstack/react-table` (DocumentList)
- `zustand` (state)

---

## 8. API Layer and Real-time Layer (Current State)

## Current UI integration state

The agent pages are currently mocked client-side:

- `/agent/live-call` chat responses via `setTimeout`
- `/agent/sop` documents seeded in `useEffect`
- `/agent/post-call/[sessionId]` mock data seeded in `useEffect`

## API client available

From `lib/api/client.ts`:

- `apiClient.get/post/put/delete`
- Base URL from `NEXT_PUBLIC_API_URL` (fallback `http://localhost:8000`)

From `lib/api/endpoints.ts`:

```ts
API_ENDPOINTS.AUTH.*
API_ENDPOINTS.SESSIONS.*
API_ENDPOINTS.REALTIME.*
```

## API route handlers in this repo

- `app/api/auth/route.ts`
- `app/api/sessions/route.ts`
- `app/api/realtime/route.ts`

All currently return placeholder JSON messages.

Shared API typing already available:

```ts
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Real-time utilities available

- `lib/realtime/socket-client.ts`
- `lib/realtime/sse-client.ts`
- `lib/realtime/event-types.ts`

Event contracts include:

- `call.update`
- `sentiment.update`
- `intent.detected`
- `alert.*`

---

## 9. Sample Data to Seed in New Project

## Live call sample (`SAMPLE_CALL_DATA`)

Use this as initial active-call payload when replicating:

```ts
{
  id: "call-123",
  duration: 45,
  customerName: "Sarah Jenkins",
  customerId: "CUST-8842",
  customerPhone: "+1 (555) 123-4567",
  customerDOB: "1985-04-12",
  isRepeatCaller: true,
  intent: "Billing Dispute",
  confidence: 0.92,
  sentiment: "negative",
  agentSentiment: "neutral",
  customerSentimentValue: 0.3,
  agentSentimentValue: 0.6,
  complianceStatus: "non-compliant",
  complianceIssues: [
    "Missed required disclosure: \"Call recording\"",
    "Did not verify customer identity with partial DOB"
  ],
  sopSteps: [
    { id: "step-1", title: "Greet & authenticate", status: "completed" },
    { id: "step-2", title: "Analyze Bill", status: "current" },
    { id: "step-3", title: "Propose Adjustment", status: "pending" },
    { id: "step-4", title: "Closing", status: "pending" }
  ],
  currentStepId: "step-2",
  upsellOpportunity: {
    id: "upsell-1",
    productName: "Premium Fiber Internet",
    confidence: 0.85,
    estimatedValue: 120,
    description: "Upgrade to 1Gbps speed for only $10 more/month",
    reason: "Customer mentioned slow internet and high data usage"
  },
  suggestedActions: [
    {
      id: "action-1",
      title: "Offer Late Fee Waiver",
      description: "Customer eligible for one-time waiver of $15.00",
      priority: "high"
    }
  ]
}
```

## Chat suggested prompts

- Explain Product Feature
- Handle Complaint
- Upsell Opportunity
- Technical Support

## SOP seed docs

- Customer Onboarding Process (Process)
- Product Return Policy (Policy)
- Escalation Procedures (Process)

---

## 10. Turborepo Migration Mapping

Use this mapping to recreate in your target monorepo layout.

Routing note:

- Current source app uses URL prefix `/agent/*` because admin/manager/agent live in one app.
- If `apps/agent` runs as standalone app in Turborepo, routes can be unprefixed (`/live-call`, `/chat`, `/sop`) unless your gateway keeps the `/agent` prefix.

## Move to `apps/agent`

- `app/agent/*` route pages and layout
- `features/live-call/*`
- `features/chat-assistant/*`
- `features/sop/*`
- `features/post-call/*`
- `features/knowledge/components/DocumentList.tsx`
- `features/knowledge/types.ts` (or local slice type copy)
- `stores/live-call.store.ts`

## Move to `packages/ui` (`@agent-assist/ui`)

- `components/ui/*` primitives
- `components/layout/AppSidebar.tsx`
- `components/layout/Header.tsx`
- `components/layout/navigation-items.tsx`
- `components/layout/theme-provider.tsx` (or keep app-local if preferred)
- `lib/utils/cn.ts`
- Shared global stylesheet with tokens used by all apps

## Move to `packages/shared` (`@agent-assist/shared`)

- `constants/routes.ts`
- `stores/auth.store.ts` (or convert to shared auth provider)
- `stores/feature-flags.store.ts`
- `hooks/useFeature.ts`
- `lib/feature-flags/*`
- `lib/api/*`
- `lib/realtime/*`
- `types/api.ts`, `types/auth.ts`

---

## 11. Thin-Page Pattern for New `apps/agent`

In your target architecture (thin pages + feature slices), keep route files minimal:

```tsx
// apps/agent/app/live-call/page.tsx
import { LiveCallScreen } from "@/features/live-call/screens/live-call-screen";

export default function Page() {
  return <LiveCallScreen />;
}
```

Repeat for:

- `app/chat/page.tsx`
- `app/sop/page.tsx`
- `app/post-call/[sessionId]/page.tsx`

Keep route shell in:

- `apps/agent/app/layout.tsx`

---

## 12. Replication Checklist (Do This In Order)

1. Create global tokens/theme exactly as defined in section 3.
2. Port all required primitives listed in section 7 to `@agent-assist/ui`.
3. Port sidebar/header shell and route constants.
4. Port stores/hooks in section 5.
5. Port feature slices route-by-route from section 6.
6. Seed sample data from section 9.
7. Confirm these visual acceptance points:
- Sidebar collapses and mobile sheet works.
- Header breadcrumbs resolve correctly.
- Live-call state machine renders all 4 states.
- Active live-call has 3-column desktop composition.
- Chat and SOP pages match card/grid spacing and typography.
8. Then replace mocked data calls with real API/WebSocket integrations.

---

## 13. Known Gaps To Decide During Rebuild

1. `/agent/sop` currently casts `SOPDocument[]` to `KnowledgeArticle[]` for table data.
- Recommended: normalize to full `KnowledgeArticle` shape to avoid undefined cells.

2. `/agent/live-call` and `/agent/chat` currently share almost identical mock chat behavior.
- Recommended: extract a shared chat service hook in `packages/shared`.

3. API routes are placeholders.
- Recommended: define concrete backend contracts before wiring agent pages.
