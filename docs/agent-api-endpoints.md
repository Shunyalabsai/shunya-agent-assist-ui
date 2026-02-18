# Agent API Endpoints & Data Format Spec

## Overview

This document lists every API endpoint and data format required by the agent app (`app/agent`). It is the single source of truth for:

- **Backend:** Implementing or extending APIs in `agent_assist_be`.
- **Frontend:** Replacing hardcoded/mock data in the agent UI with real API calls.

The agent app currently uses mock/hardcoded data in four areas; this spec defines the real endpoints and payloads to replace them.

**Conventions:**

- **Base path:** Assume `/api` or `/api/agent` (adjust in implementation).
- **Auth:** All agent endpoints expect authenticated requests (e.g. `Authorization: Bearer <token>`). Tenant/org and agent context may be inferred from the token or passed via header.
- **Content-Type:** `application/json` for request/response unless noted.
- **Dates:** ISO 8601 strings (e.g. `2024-01-10T10:00:00Z`).
- **Pagination:** Where applicable, list endpoints support optional `page`, `limit` (or `per_page`); response shape is documented per endpoint.

---

## Shared Types

Used across multiple agent features (Chat, Live call, Post-call, SOP & Knowledge).

### ChatMessage

| Field      | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `id`      | string | Unique message ID                    |
| `role`    | string | `"user"` or `"assistant"`             |
| `content` | string | Message body                         |
| `timestamp` | number | Unix timestamp (ms)                |

### Pagination (optional)

For list endpoints that support pagination:

| Field        | Type   | Description                |
|-------------|--------|----------------------------|
| `page`      | number | 1-based page index         |
| `limit`     | number | Items per page             |
| `total`     | number | Total count of items       |
| `hasMore`   | boolean| Whether more pages exist   |

---

## Endpoints by Feature

### Chat (AI Assistant)

Used by `/agent/chat` and the in-page chat on `/agent/live-call`. Currently uses a `setTimeout` mock; replace with a real completion API.

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/agent/chat` or `/api/agent/chat/completion` | Send user message and receive assistant reply |

**Request body:**

```json
{
  "message": "How do I handle a billing dispute?",
  "conversationId": "conv-abc123",
  "context": {
    "callId": "call-456"
  }
}
```

| Field             | Type   | Required | Description                                    |
|-------------------|--------|----------|------------------------------------------------|
| `message`         | string | yes      | User message text                              |
| `conversationId`  | string | no       | Thread/conversation ID for multi-turn context  |
| `context.callId`  | string | no       | Active call ID when chat is used during a call |

**Response:** Assistant message (200 OK).

```json
{
  "message": {
    "id": "msg-789",
    "role": "assistant",
    "content": "For billing disputes, first verify the customer's identity...",
    "timestamp": 1707654321000
  }
}
```

- Response may be wrapped as `{ message: ChatMessage }` or return `ChatMessage` at top level. Frontend expects a single assistant `ChatMessage` to append to the thread.

---

### Live Call

Used by `/agent/live-call`. Currently uses mock `CallData` in the store and debug buttons to simulate incoming/answer/end. Replace with real call events and active-call state API (or WebSocket).

#### Incoming call (event payload)

When a call arrives, the UI may be driven by a CTI integration or webhook rather than a REST call. The overlay expects at least:

| Field           | Type   | Description                          |
|-----------------|--------|--------------------------------------|
| `customerName`  | string | Display name for incoming call      |
| `queueName`    | string | Queue or skill name                  |
| `callId`       | string | Optional; used to fetch active state |

No dedicated “incoming call” endpoint is required if the frontend receives this payload via event (e.g. WebSocket or server-sent event) and updates the store (e.g. `incomingCall({ customerName, queueName })`).

#### Active call state

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/agent/calls/{callId}` | Fetch full live-call state for the active call |
| POST | `/api/agent/calls/{callId}/actions` | Optional: acknowledge “next best action” selected by agent |

**GET `/api/agent/calls/{callId}`**

**Response:** Full `CallData` (200 OK). See [Data formats: CallData](#calldata) below.

**POST `/api/agent/calls/{callId}/actions`** (optional)

**Request body:**

```json
{
  "actionId": "action-1"
}
```

**Response:** 200 OK or 204 No Content.

---

### Post-Call

Used by `/agent/post-call/[sessionId]`. Currently uses mock `PostCallData` and `console.log` for ticket save. Replace with GET post-call and POST create ticket.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/agent/sessions/{sessionId}/post-call` | Fetch post-call analysis for a session |
| POST | `/api/agent/sessions/{sessionId}/tickets` | Create a ticket (draft) linked to the session |

**GET `/api/agent/sessions/{sessionId}/post-call`**

**Response:** `PostCallData` (200 OK). See [Data formats: PostCallData](#postcalldata) below.

**POST `/api/agent/sessions/{sessionId}/tickets`**

**Request body:**

```json
{
  "title": "Follow-up: pricing inquiry",
  "description": "Customer asked about enterprise pricing. Send quote by EOD.",
  "priority": "medium",
  "category": "Sales"
}
```

| Field         | Type   | Required | Description        |
|---------------|--------|----------|--------------------|
| `title`       | string | yes      | Ticket title       |
| `description` | string | yes      | Ticket description |
| `priority`    | string | no       | e.g. `low`, `medium`, `high`, `urgent` |
| `category`    | string | no       | Category label     |

**Response:** 201 Created with ticket id or full ticket object.

```json
{
  "id": "ticket-001",
  "title": "Follow-up: pricing inquiry",
  "description": "Customer asked about enterprise pricing...",
  "priority": "medium",
  "category": "Sales",
  "sessionId": "session-123",
  "createdAt": "2024-01-10T10:00:00Z"
}
```

---

### SOP & Knowledge

Used by `/agent/sop`. Currently uses mock `SOPDocument[]` and hardcoded `VersionSelector` and `SOPStepViewer` data. Replace with document list, optional document detail, and versions.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/agent/knowledge/documents` | List SOP/knowledge documents with optional filters |
| GET | `/api/agent/knowledge/documents/{documentId}` | Optional: single document with optional `steps` for SOPStepViewer |
| GET | `/api/agent/knowledge/documents/{documentId}/versions` | List versions for VersionSelector |

**GET `/api/agent/knowledge/documents`**

**Query:**

| Param      | Type   | Description                                  |
|------------|--------|----------------------------------------------|
| `category` | string | Filter by category                           |
| `tags`     | string | Comma-separated tags, or repeated param      |
| `q`        | string | Search query (title/content)                  |
| `page`     | number | Optional pagination                          |
| `limit`    | number | Optional page size                           |

**Response:** Array of `SOPDocument` (or mappable to it). See [Data formats: SOPDocument](#sopdocument) below. If backend uses `KnowledgeArticle`, document the mapping (e.g. map `content`, `category`, `tags` so the agent UI receives `SOPDocument`-shaped items).

**GET `/api/agent/knowledge/documents/{documentId}`** (optional)

**Response:** Single document. May include optional `steps: SOPStep[]` for SOPStepViewer. See [Data formats: SOPStep (viewer)](#sopstep-viewer).

**GET `/api/agent/knowledge/documents/{documentId}/versions`**

**Response:** Array of `DocumentVersion`. See [Data formats: DocumentVersion](#documentversion).

---

## Data Formats

### ChatMessage

| Field      | Type   | Description                |
|-----------|--------|----------------------------|
| `id`      | string | Unique message ID          |
| `role`    | string | `"user"` \| `"assistant"`  |
| `content` | string | Message body               |
| `timestamp` | number | Unix timestamp (ms)      |

---

### CallData

Used for active call state (live-call store). All fields except `id` and `duration` are optional.

| Field                    | Type     | Description |
|--------------------------|----------|-------------|
| `id`                     | string   | Call ID     |
| `duration`               | number   | Call duration (seconds) |
| `customerName`           | string?  | Customer display name |
| `customerId`             | string?  | Customer identifier |
| `customerPhone`          | string?  | Phone number |
| `customerDOB`             | string?  | Partial DOB for verification |
| `isRepeatCaller`         | boolean? | Repeat caller flag |
| `intent`                 | string?  | Detected intent (e.g. "Billing Dispute") |
| `confidence`             | number?  | Intent confidence 0–1 |
| `sentiment`              | string?  | `"positive"` \| `"neutral"` \| `"negative"` \| `"warning"` (customer) |
| `agentSentiment`         | string?  | Same set (agent) |
| `customerSentimentValue` | number?  | Numeric sentiment (e.g. 0–1) |
| `agentSentimentValue`    | number?  | Numeric sentiment (e.g. 0–1) |
| `complianceStatus`       | string?  | `"compliant"` \| `"non-compliant"` \| `"monitoring"` |
| `complianceIssues`       | string[]?| List of issue descriptions |
| `sopSteps`               | SOPStep[]? | Current SOP steps (live-call shape) |
| `currentStepId`          | string?  | ID of current SOP step |
| `suggestedActions`       | SuggestedAction[]? | Next best actions |
| `upsellOpportunity`      | UpsellOpportunity? | Single upsell suggestion |
| `queueName`              | string?  | Queue/skill (e.g. for incoming overlay) |

#### SOPStep (live call)

Used inside `CallData.sopSteps`.

| Field         | Type   | Description |
|---------------|--------|-------------|
| `id`          | string | Step ID     |
| `title`       | string | Step title  |
| `description`| string?| Step description |
| `status`      | string | `"completed"` \| `"current"` \| `"pending"` |

#### SuggestedAction

| Field         | Type   | Description |
|---------------|--------|-------------|
| `id`          | string | Action ID   |
| `title`       | string | Action title |
| `description` | string | Action description |
| `priority`    | string | `"high"` \| `"medium"` \| `"low"` |

#### UpsellOpportunity

| Field            | Type   | Description |
|------------------|--------|-------------|
| `id`             | string | Opportunity ID |
| `productName`    | string | Product name |
| `description`    | string | Short description |
| `confidence`     | number | 0–1 confidence |
| `estimatedValue`| number?| Optional value (e.g. revenue) |
| `reason`         | string | Why suggested |

---

### PostCallData

| Field             | Type            | Description |
|-------------------|-----------------|-------------|
| `sessionId`      | string          | Session ID  |
| `summary`        | string?         | Call summary text |
| `keyMoments`     | KeyMoment[]?    | Notable moments |
| `transcript`     | string?         | Full or segment transcript |
| `complianceReport` | ComplianceReport? | Compliance result |
| `metadata`       | object?         | See below   |

#### KeyMoment

| Field         | Type   | Description |
|---------------|--------|-------------|
| `timestamp`   | number | Offset in seconds from start |
| `description` | string | Moment description |
| `type`        | string | `"positive"` \| `"negative"` \| `"neutral"` \| `"upsell"` \| `"complaint"` |

#### ComplianceReport

| Field   | Type     | Description |
|---------|----------|-------------|
| `status`| string   | `"compliant"` \| `"non-compliant"` |
| `issues`| string[]?| List of issue descriptions |

#### PostCallData.metadata

| Field          | Type   | Description |
|----------------|--------|-------------|
| `duration`    | number?| Call duration (seconds) |
| `startTime`   | string?| ISO 8601    |
| `endTime`     | string?| ISO 8601    |
| `agentName`   | string?| Agent name  |
| `customerName`| string?| Customer name |

---

### Ticket create (request / response)

Request: see [POST sessions/{sessionId}/tickets](#post-apiagentsessionssessionidtickets).

Response: at minimum `id`; optionally full ticket object with `id`, `title`, `description`, `priority`, `category`, `sessionId`, `createdAt` (ISO 8601).

---

### SOPDocument

Used for document list and detail in SOP & Knowledge.

| Field      | Type     | Description |
|------------|----------|-------------|
| `id`       | string   | Document ID |
| `title`    | string   | Title       |
| `content`  | string   | Body/content |
| `category` | string?  | Category    |
| `tags`     | string[]?| Tags        |

If the backend exposes `KnowledgeArticle` (with `type`, `process`, `queue`, `language`, `version`, `status`, `updatedAt`), the agent API layer should map to this shape for the agent UI, or the frontend may accept a union and normalize.

---

### DocumentVersion

Used for VersionSelector.

| Field        | Type    | Description |
|-------------|---------|-------------|
| `id`        | string  | Version ID  |
| `version`   | string  | Semantic or display version |
| `createdAt` | string  | ISO 8601    |
| `createdBy` | string? | User identifier |
| `isCurrent` | boolean?| Whether this is the active version |
| `changeLog` | string? | Change description |

---

### SOPStep (viewer)

Used by SOPStepViewer for a selected document (distinct from live-call `SOPStep` which has `status`). Can be returned as `steps` on document detail.

| Field         | Type    | Description |
|---------------|---------|-------------|
| `id`          | string  | Step ID     |
| `title`       | string  | Step title  |
| `description` | string  | Step description |
| `order`       | number  | Display order |
| `required`    | boolean?| Whether step is required |
| `completed`   | boolean?| Completion state (if tracked) |

---

## Optional / Future

- **WebSocket for live call:** Real-time push of `CallData` updates (intent, sentiment, compliance, SOP steps, suggested actions) so the agent UI does not need to poll `GET /api/agent/calls/{callId}`.
- **Streaming chat:** POST chat endpoint may support streaming (e.g. SSE or WebSocket) for incremental assistant content.
- **Suggested prompts:** GET (or embedded in chat config) for suggested prompts shown beside the chat input.
- **Incoming call via WebSocket:** If not using CTI/webhook, a dedicated WebSocket or SSE channel for “incoming call” events carrying `customerName`, `queueName`, `callId`.

These can be added to this doc as the backend evolves.
