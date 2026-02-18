# Admin API Endpoints & Data Format Spec

## Overview

This document lists every API endpoint and data format required by the admin app (`app/admin`). It is the single source of truth for:

- **Backend:** Implementing or extending APIs in `agent_assist_be`.
- **Frontend:** Replacing hardcoded/mock data in the admin UI with real API calls.

**Conventions:**

- **Base path:** Assume `/api` or `/api/v1` (adjust in implementation).
- **Auth:** All admin endpoints expect authenticated requests (e.g. `Authorization: Bearer <token>`). Tenant/org context may be inferred from the token or passed via header.
- **Content-Type:** `application/json` for request/response unless noted (e.g. file upload, CSV export).
- **Dates:** ISO 8601 strings (e.g. `2024-01-10T10:00:00Z`).
- **Pagination:** Where applicable, list endpoints support optional `page`, `limit` (or `per_page`); response shape is documented per endpoint.

---

## Shared Types

Used across multiple admin areas (Knowledge, Automation, Features, Configuration, Data retention).

### Version

| Field       | Type     | Description                    |
|------------|----------|--------------------------------|
| `id`       | string   | Unique version ID              |
| `version`  | string   | Semantic or display version    |
| `createdAt`| string   | ISO 8601 date                  |
| `createdBy`| string   | User identifier (e.g. email)   |
| `changes`  | string[] | List of change descriptions    |
| `isCurrent`| boolean? | Whether this is the active one |

### AuditTrailEntry

| Field      | Type                    | Description        |
|-----------|-------------------------|--------------------|
| `id`      | string                  | Unique entry ID    |
| `action`  | string                  | e.g. created, updated, deleted, enabled, disabled |
| `userId`  | string                  | Actor user ID      |
| `userName`| string?                 | Actor display name |
| `timestamp` | string               | ISO 8601 date      |
| `details` | string?                 | Human-readable summary |
| `metadata`| Record<string, unknown>? | Resource-specific payload |

---

## Endpoints by Area

### Dashboard

Dashboard data is keyed by widget ID. The UI uses enabled widgets from dashboard configuration and fetches metrics/charts/tables per widget; user overview uses the same user list as the Users area.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/dashboard/metrics` | KPI metrics for enabled metric widgets |
| GET | `/api/dashboard/charts` | Chart data for enabled chart widgets |
| GET | `/api/dashboard/tables` | Table data for enabled table widgets |

**Query (all):** Optional `period` (e.g. `24h`, `7d`, `30d`). Optional widget IDs to scope: `widgetIds=widget1,widget2`.

**Response – Metrics** (array or map keyed by widget id):

```json
{
  "widget1": {
    "id": "widget1",
    "title": "Active Sessions",
    "value": "1.2k",
    "trend": { "value": "+12.5%", "direction": "up", "isPositive": true },
    "comparison": null,
    "icon": "📊",
    "iconColor": "bg-blue-500",
    "progress": null,
    "progressLabel": null,
    "miniChart": [45, 52, 48, 65, 72, 85, 95],
    "status": null
  }
}
```

- `trend`: optional `{ value: string, direction: "up" | "down", isPositive: boolean }`
- `comparison`, `progress`, `progressLabel`, `miniChart`, `status`: optional

**Response – Charts** (map keyed by widget id):

```json
{
  "widget4": {
    "id": "widget4",
    "title": "Sentiment Trend",
    "description": "Emotional trajectory over the last 30 days",
    "type": "line",
    "data": [
      { "label": "JAN 01", "value": 65, "color": "#3b82f6" }
    ],
    "status": "POSITIVE",
    "total": null
  }
}
```

- `type`: `"line"` | `"bar"` | `"pie"` | `"donut"`
- `data`: `{ label: string, value: number, color?: string }[]`

**Response – Tables** (map keyed by widget id):

```json
{
  "widget7": {
    "id": "widget7",
    "title": "Top Automations",
    "description": null,
    "columns": ["Rank", "Automation / Agent", "Success Rate", "Total Calls"],
    "rows": [
      { "rank": 1, "name": "AI Agent Alpha", "successRate": "98.2%", "totalCalls": 1245 }
    ]
  }
}
```

- `rows`: array of objects with keys matching column semantics (snake_case or camelCase consistent).

---

### Users

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/users` | List users with optional relations (manager, team size, status) |
| POST | `/api/users/invite` | Send invites (one or more email + role) |
| PATCH | `/api/users/{userId}` | Update user (e.g. role, status) |
| POST | `/api/users/{userId}/disable` | Disable user (or equivalent) |
| POST | `/api/users/{userId}/reinvite` | Re-send invitation for pending user |

**Query – GET /api/users:** Optional `page`, `limit`, `role` (admin | manager | agent), `status` (active | inactive | pending).

**Response – List:** Array of `UserWithRelations`:

```json
{
  "users": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@shunya.ai",
      "role": "admin",
      "status": "active",
      "createdAt": "2024-01-10T10:00:00Z",
      "managerName": null,
      "teamSize": null
    }
  ],
  "total": 42
}
```

- `User`: `id`, `email`, `name`, `role` (`"agent"` | `"manager"` | `"admin"`), `permissions?`, `tenantId?`, `createdAt?`, `updatedAt?`
- `UserWithRelations`: extends `User` with `status` (`"active"` | `"inactive"` | `"pending"`), `managerName?`, `teamSize?`

**Request – POST /api/users/invite:**

```json
{
  "invites": [
    { "email": "newuser@example.com", "role": "agent" },
    { "email": "manager@example.com", "role": "manager" }
  ]
}
```

- `role`: `"manager"` | `"agent"`

**Response:** 201 with created pending user(s) or invite record(s); or 4xx with validation errors.

---

### Audit Logs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/audit-logs` | List audit logs with filters |
| GET | `/api/audit-logs/export` | Export audit logs (e.g. CSV) |

**Query – GET /api/audit-logs:** Optional `page`, `limit`, `resource` (knowledge | intent | document | feature | user), `action`, `userId`, `from`, `to` (ISO dates).

**Response – List:** Array of `AuditLog`:

```json
{
  "logs": [
    {
      "id": "log1",
      "userId": "user1",
      "action": "created",
      "resource": "knowledge",
      "timestamp": "2024-02-18T12:00:00Z",
      "metadata": {
        "documentId": "1",
        "title": "Customer Service SOP",
        "changes": [{ "field": "name", "old": "x", "new": "y" }]
      }
    }
  ],
  "total": 100
}
```

- `AuditLog`: `id`, `userId`, `action`, `resource`, `timestamp`, `metadata?` (optional `changes`, `documentId`, `title`, `intentId`, `featureId`, `enabled`, etc.)

**Audit trail entries:** Some admin panels (e.g. Knowledge, Automation) show a slice of “audit trail” for a given resource. Use either the same `GET /api/audit-logs` with `resource`/resourceId filters or a dedicated resource-scoped endpoint, e.g. `GET /api/audit-logs?resourceType=knowledge&resourceId=1`, returning the same `AuditLog` shape (or a view that matches `AuditTrailEntry`: id, action, userId, userName, timestamp, details, metadata).

---

### Automation & Webhooks

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/automations` | List automations |
| POST | `/api/automations` | Create automation |
| PATCH | `/api/automations/{id}` | Update automation |
| DELETE | `/api/automations/{id}` | Delete automation |
| PATCH | `/api/automations/{id}/status` | Toggle active (body: `{ "active": true }`) |
| GET | `/api/webhooks` | List webhook configs |
| POST | `/api/webhooks` | Create webhook |
| PATCH | `/api/webhooks/{id}` | Update webhook |
| DELETE | `/api/webhooks/{id}` | Delete webhook |
| GET | `/api/webhooks/{id}/versions` | Version history for webhook config |
| GET | `/api/webhooks/{id}/audit` | Audit trail for webhook |

**Automation body (POST/PATCH):**

```json
{
  "name": "Post-Call Survey",
  "description": "Send survey when call result is Sale",
  "active": true,
  "trigger": {
    "type": "CALL_OUTCOME",
    "config": { "value": "sale", "label": "Sale Made" }
  },
  "actions": [
    {
      "id": "act1",
      "type": "WEBHOOK",
      "config": { "webhookUrl": "https://surveys.example.com/send" }
    }
  ]
}
```

- `trigger.type`: `SOP_STEP` | `CALL_OUTCOME` | `COMPLIANCE_EVENT`
- `actions[].type`: `TICKET_CREATION` | `CRM_UPDATE` | `WEBHOOK`
- `config`: may include `targetSystem`, `webhookUrl`, `templateId`, `headers`

**Response – Automation:** Same shape with `id`, `createdAt`, `lastRun?` (ISO string).

**WebhookConfig (GET/POST/PATCH):**

```json
{
  "id": "webhook1",
  "name": "Production Webhook",
  "url": "https://api.example.com/webhooks/calls",
  "events": ["call.started", "call.ended", "call.transcribed"],
  "headers": { "Authorization": "Bearer token123" },
  "active": true,
  "createdAt": "2024-02-18T12:00:00Z"
}
```

**Version / Audit for webhooks:** Response arrays of shared `Version` and `AuditTrailEntry` types.

---

### Knowledge

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/knowledge/documents` | List knowledge articles |
| POST | `/api/knowledge/documents` | Create/upload document (metadata + optional file) |
| GET | `/api/knowledge/documents/{id}` | Get single document |
| PATCH | `/api/knowledge/documents/{id}` | Update document metadata |
| DELETE | `/api/knowledge/documents/{id}` | Delete/archive document |
| GET | `/api/knowledge/documents/{id}/versions` | Version history |
| GET | `/api/knowledge/documents/{id}/audit` | Audit trail for document |

**Query – List:** Optional `page`, `limit`, `status`, `category`, `process`, `queue`, `language`.

**Response – List/Item:** `KnowledgeArticle`:

```json
{
  "id": "1",
  "title": "Customer Service SOP",
  "content": "Standard operating procedures...",
  "category": "SOP",
  "tags": ["customer-service", "procedures"],
  "type": "pdf",
  "process": "Customer Support",
  "queue": "General Inquiries",
  "language": "en",
  "version": "1.0",
  "status": "Active",
  "updatedAt": "2024-02-18T12:00:00Z"
}
```

- `type`: `pdf` | `doc` | `docx` | `txt`
- `status`: `Processing` | `Active` | `Failed` | `Archived`
- `content`: optional in list view

**Version / Audit:** Same shared `Version` and `AuditTrailEntry` structures.

---

### Intents

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/intents` | List intents |
| POST | `/api/intents` | Create intent |
| PATCH | `/api/intents/{id}` | Update intent |
| DELETE | `/api/intents/{id}` | Delete intent |
| POST | `/api/intents/import` | Import intents (e.g. file upload or JSON body) |
| POST | `/api/intents/approve-activate` | Approve and activate pending intents (body: optional intent ids or “all”) |

**Response – List/Item:** `Intent`:

```json
{
  "id": "intent1",
  "name": "Customer Support Request",
  "description": "Customer needs help with a product or service issue",
  "keywords": ["help", "support", "issue", "problem", "assistance"],
  "confidenceThreshold": 0.75,
  "enabled": true,
  "createdAt": "2024-02-18T12:00:00Z",
  "updatedAt": null
}
```

**Import:** Either multipart file (e.g. CSV/JSON) or JSON array of intent payloads; response: created/updated count and list of intents.

---

### Features (Feature flags)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/features` | List feature flag configs |
| PATCH | `/api/features` | Bulk update (e.g. toggles) |
| POST | `/api/features/reset` | Reset to defaults |
| GET | `/api/features/versions` | Version history for feature config |
| GET | `/api/features/audit` | Audit trail for feature changes |

**Response – List:** Array of `FeatureFlagConfig`:

```json
{
  "features": [
    {
      "id": "feat1",
      "key": "live_sentiment",
      "name": "Live Sentiment Analysis",
      "description": "Real-time sentiment analysis during live calls",
      "category": "real-time",
      "enabled": true,
      "defaultValue": true
    }
  ]
}
```

- `category`: `real-time` | `analytics` | `ai` | `automation` | `other`

**Request – PATCH /api/features:** e.g. `{ "updates": [ { "id": "feat1", "enabled": true } ] }` or full array. Response: updated list.

**Version / Audit:** Shared `Version` and `AuditTrailEntry`.

---

### Onboarding (Organization setup)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/onboarding/setup` | Submit full org setup (single or multi-step payload) |
| GET | `/api/onboarding/status` | Get current onboarding step/status (optional) |

**Request – POST /api/onboarding/setup:** Payload aligned with `CleanOrgSetupForm`:

```json
{
  "companyName": "Acme Inc",
  "regions": ["na", "eu"],
  "languages": ["en", "es"],
  "agreeToTerms": true,
  "industry": "technology",
  "features": ["live_sentiment", "ai_chat_assistant"],
  "inviteEmail": "first.manager@example.com",
  "inviteRole": "manager",
  "telephonyProvider": "twilio",
  "apiKey": "optional-secure-key",
  "documentCategory": "SOP",
  "documents": []
}
```

- `documents`: optional array of file references or base64/document IDs after upload.
- All fields except those required by validation can be optional depending on step.

**Response:** 200/201 with org id and next step or completion status.

---

### Configuration (Dashboard widgets)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/configuration/dashboard/widgets` | List available widgets (catalog) |
| GET | `/api/configuration/dashboard` | Get current dashboard config (selected widgets) |
| PUT | `/api/configuration/dashboard` | Save dashboard config (selected widgets) |
| GET | `/api/configuration/dashboard/versions` | Version history |
| GET | `/api/configuration/dashboard/audit` | Audit trail |

**Response – Available widgets:** Array of `AvailableWidget`:

```json
{
  "widgets": [
    {
      "id": "widget1",
      "type": "kpi-card",
      "name": "Active Sessions",
      "description": "Total number of active sessions",
      "category": "metrics"
    }
  ]
}
```

- `category`: `metrics` | `charts` | `tables` | `other`

**Request/Response – Dashboard config:** Array of `Widget`:

```json
{
  "widgets": [
    {
      "id": "widget1",
      "type": "kpi-card",
      "name": "Active Sessions",
      "enabled": true,
      "config": {}
    }
  ]
}
```

---

### Data Retention

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/data-retention/policies` | List retention policies |
| PUT | `/api/data-retention/policies` | Replace policies (full array) |
| PATCH | `/api/data-retention/policies/{id}` | Update one policy |
| GET | `/api/data-retention/policies/versions` | Version history |
| GET | `/api/data-retention/policies/audit` | Audit trail |

**Response – List/Item:** `RetentionPolicy`:

```json
{
  "policies": [
    {
      "id": "policy1",
      "dataType": "calls",
      "retentionPeriodDays": 90,
      "action": "archive",
      "enabled": true
    }
  ]
}
```

- `dataType`: `calls` | `transcripts` | `logs` | `analytics` | `other`
- `action`: `delete` | `archive`

**Version / Audit:** Shared `Version` and `AuditTrailEntry`.

---

## Pagination

For list endpoints that support pagination, use:

- **Query:** `page` (1-based) and `limit` (or `per_page`). Defaults: e.g. `page=1`, `limit=20`.
- **Response:** Include `total` (total count) and optionally `page`, `limit` in the body or headers. Example:

```json
{
  "users": [...],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

Applicable to: Users, Audit logs, Knowledge documents, Intents (if many). Dashboard metrics/charts/tables may return all requested widgets in one response without pagination.

---

## Export

**GET /api/audit-logs/export**

- **Query:** `format=csv` (or `json`), same filters as `GET /api/audit-logs` (`resource`, `action`, `userId`, `from`, `to`).
- **Response:** 
  - CSV: `Content-Type: text/csv`, filename in `Content-Disposition`.
  - Rows: id, userId, action, resource, timestamp, and key metadata columns as desired.

---

## Reference: Current mock/usage locations

| Area | Mock / data source |
|------|---------------------|
| Dashboard | `features/dashboards/data/mock-dashboard-data.ts`, `features/shared/data/mock-users-data.ts`, `stores/use-dashboard-config.ts` |
| Users | `features/shared/data/mock-users-data.ts`, `features/shared/components/invite-users-dialog.tsx` |
| Audit logs | `app/admin/audit-logs/page.tsx` (inline mock) |
| Automation | `app/admin/automation/page.tsx` (inline mock) |
| Knowledge | `app/admin/knowledge/page.tsx` (inline mock) |
| Intents | `app/admin/intents/page.tsx` (inline mock) |
| Features | `app/admin/features/page.tsx` (inline mock) |
| Onboarding | `features/onboarding/components/CleanOrgSetupForm.tsx`, `OrgSetupForm.tsx` |
| Configuration | `app/admin/configuration/page.tsx`, `features/dashboards/data/mock-widgets.ts`, `stores/use-dashboard-config.ts` |
| Data retention | `app/admin/data-retention/page.tsx` (inline mock) |

TypeScript types live in `features/*/types.ts` and `components/layout/VersionHistoryPanel.tsx`, `AuditTrailViewer.tsx`, and `types/auth.ts`.
