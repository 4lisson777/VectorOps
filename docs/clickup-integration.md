# ClickUp Integration Plan (v2)

## Project Context

**Product:** Multi-tenant ticket & bug tracking SaaS for tech startups.
**Users:** Support team (opens tickets/bugs) and Development team (works on tickets, assigns, tracks progress).
**Multi-tenancy:** Each organization connects their own ClickUp workspace via OAuth2.
**Goals:**
- Automatically create ClickUp tasks when support files a ticket or bug
- Bi-directional sync of status, assignees, comments, and time tracking
- Track what each dev is working on

**Tech Stack:** Turborepo monorepo, Next.js, Prisma, MySQL.

---

## 1. Authentication: OAuth2 Flow (Multi-Tenant)

Since multiple organizations will connect their own ClickUp workspaces, you **must** use the OAuth2 authorization code flow. Personal API tokens won't work here.

### 1.1 Register Your ClickUp OAuth App

1. Go to ClickUp → Settings → ClickUp API → Create an App
2. Set the redirect URI to `https://your-app.com/api/integrations/clickup/callback`
3. Store the `client_id` and `client_secret` as environment variables

### 1.2 OAuth Flow

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Org Admin   │     │    Your App      │     │  ClickUp     │
│  (browser)   │     │    (backend)     │     │  OAuth       │
└──────┬───────┘     └────────┬─────────┘     └──────┬───────┘
       │  1. Click "Connect   │                       │
       │     ClickUp"         │                       │
       │─────────────────────▶│                       │
       │                      │  2. Redirect to       │
       │◀─────────────────────│     ClickUp auth URL  │
       │                      │                       │
       │  3. User authorizes  │                       │
       │     workspace(s)     │──────────────────────▶│
       │                      │                       │
       │                      │  4. Redirect back     │
       │                      │◀──────────────────────│
       │                      │     with ?code=xxx    │
       │                      │                       │
       │                      │  5. Exchange code     │
       │                      │     for access_token  │
       │                      │──────────────────────▶│
       │                      │                       │
       │                      │  6. Store token       │
       │                      │     per organization  │
       │  7. "Connected!"     │◀──────────────────────│
       │◀─────────────────────│                       │
```

### 1.3 Key OAuth Endpoints

| Step | Method | URL |
|---|---|---|
| Authorize | GET | `https://app.clickup.com/api?client_id={id}&redirect_uri={uri}&state={org_id}` |
| Token exchange | POST | `https://api.clickup.com/api/v2/oauth/token` with `client_id`, `client_secret`, `code` |
| Get authorized workspaces | GET | `https://api.clickup.com/api/v2/team` (with the new token) |

**Important details from the ClickUp API:**
- The `state` parameter is passed through the flow — use it to carry `organizationId` so you know which tenant to store the token for
- Users choose which workspace(s) to authorize during the consent screen
- Access tokens currently do not expire (per ClickUp docs), but you should still handle token invalidation gracefully
- Each webhook is signed with a unique secret, returned at creation time

### 1.4 OAuth Callback Route

```typescript
// app/api/integrations/clickup/callback/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const orgId = url.searchParams.get("state"); // the org that initiated

  // Exchange code for token
  const tokenRes = await fetch("https://api.clickup.com/api/v2/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.CLICKUP_CLIENT_ID,
      client_secret: process.env.CLICKUP_CLIENT_SECRET,
      code,
    }),
  });
  const { access_token } = await tokenRes.json();

  // Fetch authorized workspaces
  const teamsRes = await fetch("https://api.clickup.com/api/v2/team", {
    headers: { Authorization: access_token },
  });
  const { teams } = await teamsRes.json();

  // Store per-org
  await prisma.clickUpIntegration.create({
    data: {
      organizationId: orgId,
      accessToken: encrypt(access_token), // always encrypt
      workspaceId: teams[0].id,           // or let admin pick
      workspaceName: teams[0].name,
    },
  });

  return redirect(`/settings/integrations?success=clickup`);
}
```

---

## 2. Database Schema (Multi-Tenant)

### 2.1 Integration & Config Tables

```prisma
// Stores the OAuth connection per organization
model ClickUpIntegration {
  id              String   @id @default(cuid())
  organizationId  String   @map("organization_id")
  accessToken     String   @map("access_token")           // AES-256 encrypted
  workspaceId     String   @map("workspace_id")
  workspaceName   String?  @map("workspace_name")
  isActive        Boolean  @default(true) @map("is_active")
  commentSyncEnabled Boolean @default(false) @map("comment_sync_enabled") // opt-in per org
  connectedBy     String   @map("connected_by")           // user who connected
  connectedAt     DateTime @default(now()) @map("connected_at")
  disconnectedAt  DateTime? @map("disconnected_at")       // set on disconnect, preserved
  updatedAt       DateTime @updatedAt @map("updated_at")

  organization    Organization @relation(fields: [organizationId], references: [id])
  listMappings    ClickUpListMapping[]
  userMappings    ClickUpUserMapping[]
  webhooks        ClickUpWebhook[]

  @@unique([organizationId])
  @@map("clickup_integrations")
}

// Maps which ClickUp List each entity type syncs to
model ClickUpListMapping {
  id              String   @id @default(cuid())
  integrationId   String   @map("integration_id")
  entityType      String   @map("entity_type")            // "ticket" | "bug"
  clickupListId   String   @map("clickup_list_id")
  clickupListName String?  @map("clickup_list_name")
  clickupSpaceId  String?  @map("clickup_space_id")
  customFieldMappings Json? @map("custom_field_mappings") // JSON of field ID mappings
  statusMapping   Json?    @map("status_mapping")         // JSON: your status → ClickUp status

  integration     ClickUpIntegration @relation(fields: [integrationId], references: [id], onDelete: Cascade)

  @@unique([integrationId, entityType])
  @@map("clickup_list_mappings")
}

// Maps your app users to ClickUp user IDs
model ClickUpUserMapping {
  id              String   @id @default(cuid())
  integrationId   String   @map("integration_id")
  userId          String   @map("user_id")                 // your app's user ID
  clickupUserId   Int      @map("clickup_user_id")
  clickupUsername  String?  @map("clickup_username")
  clickupEmail    String?  @map("clickup_email")

  integration     ClickUpIntegration @relation(fields: [integrationId], references: [id], onDelete: Cascade)

  @@unique([integrationId, userId])
  @@unique([integrationId, clickupUserId])
  @@map("clickup_user_mappings")
}

// Tracks registered webhooks per org
model ClickUpWebhook {
  id              String   @id @default(cuid())
  integrationId   String   @map("integration_id")
  clickupWebhookId String  @map("clickup_webhook_id")
  webhookSecret   String   @map("webhook_secret")          // encrypted
  endpoint        String
  events          Json                                       // array of event names
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")

  integration     ClickUpIntegration @relation(fields: [integrationId], references: [id], onDelete: Cascade)

  @@map("clickup_webhooks")
}
```

### 2.2 Fields to Add to Existing Models

```prisma
// Add to your existing Ticket model
model Ticket {
  // ... existing fields ...

  clickupTaskId       String?   @unique @map("clickup_task_id")
  clickupTaskUrl      String?   @map("clickup_task_url")
  clickupSyncedAt     DateTime? @map("clickup_synced_at")
  clickupSyncError    String?   @map("clickup_sync_error") @db.Text
  clickupLastSyncSource String? @map("clickup_last_sync_source") // "app" | "clickup"

  @@map("tickets")
}

// Add to your existing Bug model
model Bug {
  // ... existing fields ...

  clickupTaskId       String?   @unique @map("clickup_task_id")
  clickupTaskUrl      String?   @map("clickup_task_url")
  clickupSyncedAt     DateTime? @map("clickup_synced_at")
  clickupSyncError    String?   @map("clickup_sync_error") @db.Text
  clickupLastSyncSource String? @map("clickup_last_sync_source")

  @@map("bugs")
}

// NEW: Track synced comments to prevent duplicates
model ClickUpCommentSync {
  id                String   @id @default(cuid())
  organizationId    String   @map("organization_id")
  entityType        String   @map("entity_type")       // "ticket" | "bug"
  entityId          String   @map("entity_id")          // your ticket/bug ID
  localCommentId    String   @map("local_comment_id")   // your app's comment ID
  clickupCommentId  String   @map("clickup_comment_id")
  direction         String                               // "to_clickup" | "from_clickup"
  createdAt         DateTime @default(now()) @map("created_at")

  @@unique([localCommentId])
  @@unique([clickupCommentId])
  @@map("clickup_comment_syncs")
}

// Audit log for sync events
model ClickUpSyncLog {
  id              String   @id @default(cuid())
  organizationId  String   @map("organization_id")
  entityType      String   @map("entity_type")
  entityId        String   @map("entity_id")
  action          String                                // "create_task", "update_task", "sync_comment", etc.
  direction       String                                // "to_clickup" | "from_clickup"
  status          String                                // "success" | "failed"
  payload         String?  @db.Text
  errorMessage    String?  @map("error_message") @db.Text
  createdAt       DateTime @default(now()) @map("created_at")

  @@index([organizationId, createdAt])
  @@map("clickup_sync_logs")
}
```

---

## 3. Architecture (Multi-Tenant)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Your Monorepo                              │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  Next.js App  │───▶│  packages/clickup │───▶│  ClickUp API    │  │
│  │  (frontend)   │    │  (shared lib)     │    │  (per-org token) │  │
│  └──────┬───────┘    └────────┬─────────┘    └──────┬───────────┘  │
│         │                     │                      │              │
│  ┌──────▼───────┐    ┌───────▼──────────┐           │              │
│  │  API Routes   │    │  Prisma + MySQL   │◀──────────┘              │
│  │  /api/...     │    │                   │   (webhooks from         │
│  │  /webhooks/.. │    │  Per-org config   │    each org's ClickUp)   │
│  └──────────────┘    └──────────────────┘                           │
│                                                                     │
│  Key: Every API call to ClickUp uses the organization's             │
│  stored OAuth token, not a global token.                            │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.1 Package Structure

```
packages/clickup/
├── src/
│   ├── client.ts          # HTTP client (takes token per-call)
│   ├── types.ts           # TypeScript types
│   ├── tasks.ts           # CRUD tasks
│   ├── comments.ts        # CRUD comments
│   ├── members.ts         # Get workspace members
│   ├── time-tracking.ts   # Get time entries
│   ├── webhooks.ts        # Register + verify webhooks
│   ├── mapper.ts          # Your models ↔ ClickUp payloads
│   ├── sync-engine.ts     # Orchestrates sync with loop prevention
│   └── index.ts
├── package.json
└── tsconfig.json
```

### 3.2 Multi-Tenant Client

```typescript
// The client is always instantiated with a specific org's token
export class ClickUpClient {
  private baseUrl = "https://api.clickup.com/api/v2";

  constructor(private accessToken: string) {}

  // Factory: create client for a specific organization
  static async forOrganization(orgId: string): Promise<ClickUpClient> {
    const integration = await prisma.clickUpIntegration.findUnique({
      where: { organizationId: orgId },
    });
    if (!integration || !integration.isActive) {
      throw new ClickUpNotConnectedError(orgId);
    }
    return new ClickUpClient(decrypt(integration.accessToken));
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: this.accessToken,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      throw new ClickUpTokenInvalidError();
    }
    if (res.status === 429) {
      throw new ClickUpRateLimitError(res.headers.get("X-RateLimit-Reset"));
    }
    if (!res.ok) {
      throw new ClickUpApiError(res.status, await res.text(), path);
    }
    return res.json();
  }
}
```

---

## 4. API Endpoints Reference

### 4.1 Task Management (V2)

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| Create task | POST | `/list/{list_id}/task` | Ticket/bug → ClickUp task |
| Get task | GET | `/task/{task_id}` | Fetch latest state |
| Update task | PUT | `/task/{task_id}` | Sync status/assignee changes |
| Delete task | DELETE | `/task/{task_id}` | Ticket cancelled |
| Get tasks in list | GET | `/list/{list_id}/task` | Dev workload dashboard |
| Get filtered tasks | GET | `/team/{team_id}/task` | Filter by assignee/status |
| Set custom field | POST | `/task/{task_id}/field/{field_id}` | Internal ID, severity |

### 4.2 Comments (V2) — Bidirectional Sync

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| Get task comments | GET | `/task/{task_id}/comment` | Pull comments from ClickUp |
| Create task comment | POST | `/task/{task_id}/comment` | Push comment to ClickUp |
| Update comment | PUT | `/comment/{comment_id}` | Edit synced comment |
| Delete comment | DELETE | `/comment/{comment_id}` | Remove synced comment |

### 4.3 Time Tracking (V2)

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| Get time entries | GET | `/team/{team_id}/time_entries?start_date=X&end_date=Y` | Per-dev time data |
| Get running entry | GET | `/team/{team_id}/time_entries/running` | Who's actively working |
| Get task time entries | GET | `/task/{task_id}/time` | Time per ticket/bug |

### 4.4 Workspace & Members

| Operation | Method | Endpoint | Purpose |
|---|---|---|---|
| Get workspaces | GET | `/team` | List authorized workspaces |
| Get spaces | GET | `/team/{team_id}/space` | Let admin pick target space |
| Get folders | GET | `/space/{space_id}/folder` | Let admin pick target folder |
| Get lists | GET | `/folder/{folder_id}/list` | Let admin pick target list |
| Get list fields | GET | `/list/{list_id}/field` | Discover custom field IDs |

### 4.5 Webhooks

| Operation | Method | Endpoint |
|---|---|---|
| Create webhook | POST | `/team/{team_id}/webhook` |
| Get webhooks | GET | `/team/{team_id}/webhook` |
| Update webhook | PUT | `/webhook/{webhook_id}` |
| Delete webhook | DELETE | `/webhook/{webhook_id}` |

---

## 5. Integration Flows

### 5.1 Setup Flow (Org Admin)

```
1. Admin goes to Settings → Integrations → ClickUp
2. Clicks "Connect ClickUp" → OAuth2 redirect
3. Admin authorizes workspace → callback stores token
4. App fetches Spaces → Folders → Lists from the authorized workspace
5. Admin maps:
   - "Tickets" → a ClickUp List
   - "Bugs" → a ClickUp List
   - Status mapping (your statuses → ClickUp statuses)
6. App auto-fetches custom field IDs for selected lists
7. App fetches workspace members → admin maps app users → ClickUp users
8. App registers webhook for the selected space
9. Integration is live
```

### 5.2 Ticket/Bug Creation → ClickUp

```
1. Support creates ticket in your app
2. After DB insert, check if org has active ClickUp integration
3. If yes:
   a. Get org's ClickUp client (with their OAuth token)
   b. Get list mapping for "ticket" entity type
   c. Map ticket payload → ClickUp task payload
   d. POST /list/{list_id}/task
   e. POST /task/{task_id}/field/{field_id} for custom fields
   f. Store clickupTaskId + clickupTaskUrl on ticket
   g. Set clickupLastSyncSource = "app"
4. If ClickUp call fails:
   a. Store error in clickupSyncError
   b. Log to ClickUpSyncLog
   c. Ticket still exists — sync is non-blocking
   d. Retry later via cron
```

### 5.3 Status/Assignee Sync (Bidirectional)

```
YOUR APP → CLICKUP:
1. User changes status/assignee in your app
2. API handler updates DB
3. Check if ticket has clickupTaskId
4. If yes: PUT /task/{task_id} with mapped changes
5. Set clickupLastSyncSource = "app"
6. Set a "sync cooldown" timestamp (now + 10 seconds)

CLICKUP → YOUR APP (via webhook):
1. ClickUp fires taskUpdated / taskStatusUpdated webhook
2. Webhook handler:
   a. Verify signature
   b. Look up ticket by clickupTaskId
   c. Check cooldown: if clickupLastSyncSource = "app"
      AND synced within last 10 seconds → ignore (prevents loop)
   d. Otherwise, apply changes to DB
   e. Set clickupLastSyncSource = "clickup"
```

### 5.4 Comment Sync (Bidirectional, Opt-In)

Comment sync is **disabled by default**. Each org must explicitly enable it in Settings → Integrations → ClickUp → "Enable comment sync". This is controlled by `ClickUpIntegration.commentSyncEnabled`.

```
YOUR APP → CLICKUP:
1. User adds comment on a ticket in your app
2. Check if org has commentSyncEnabled = true
3. Check if ticket has clickupTaskId
4. If both yes: POST /task/{task_id}/comment
   Body: { "comment_text": "...", "notify_all": false }
5. Store mapping in ClickUpCommentSync:
   { localCommentId, clickupCommentId, direction: "to_clickup" }
6. If commentSyncEnabled = false: skip silently (no error)

CLICKUP → YOUR APP (via webhook):
1. ClickUp fires taskCommentPosted event
2. Webhook handler:
   a. Check if org has commentSyncEnabled = true → skip if false
   b. Check if clickupCommentId exists in ClickUpCommentSync → skip (we sent it)
   c. If not found: create local comment on the ticket
   d. Store mapping with direction: "from_clickup"
```

### 5.5 Time Tracking Display

```
1. Dashboard page requests GET /api/dev/workload?orgId=xxx
2. Backend:
   a. Get org's ClickUp client
   b. GET /team/{team_id}/time_entries?start_date={weekStart}&end_date={now}
   c. Group by assignee (using ClickUpUserMapping to resolve names)
   d. Also query your DB for ticket/bug counts per assignee
3. Return combined view:
   - Per dev: active tickets, bugs, total hours tracked this week
   - Per ticket: time entries, current status in ClickUp
```

---

## 6. Webhook Handler (Multi-Tenant)

### 6.1 Routing Webhooks to the Right Org

Since all orgs' webhooks hit the same endpoint, you need to identify which org a webhook belongs to.

```typescript
// app/api/webhooks/clickup/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const payload = JSON.parse(body);

  // Identify org by webhook_id in payload
  const webhook = await prisma.clickUpWebhook.findFirst({
    where: { clickupWebhookId: payload.webhook_id },
    include: { integration: true },
  });

  if (!webhook) {
    return new Response("Unknown webhook", { status: 404 });
  }

  // Verify signature
  const signature = req.headers.get("x-signature") ?? "";
  if (!verifySignature(body, signature, decrypt(webhook.webhookSecret))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const orgId = webhook.integration.organizationId;

  // Acknowledge immediately, process async
  processWebhookAsync(orgId, payload).catch((err) => {
    logSyncError(orgId, payload, err);
  });

  return new Response("OK", { status: 200 });
}
```

### 6.2 Webhook Events to Subscribe

```typescript
const WEBHOOK_EVENTS = [
  "taskCreated",            // task created directly in ClickUp
  "taskUpdated",            // general task update
  "taskDeleted",            // task removed
  "taskStatusUpdated",      // status change
  "taskAssigneeUpdated",    // assignee change
  "taskCommentPosted",      // new comment
  "taskTimeTrackedUpdated", // time entry added/updated
  "taskMoved",              // moved between lists
];
```

### 6.3 Loop Prevention

```typescript
async function shouldProcessWebhook(
  entityId: string,
  entityType: string
): Promise<boolean> {
  const entity = await getEntity(entityType, entityId);
  if (!entity) return false;

  // If we just synced TO clickup within the last 10 seconds, skip
  if (
    entity.clickupLastSyncSource === "app" &&
    entity.clickupSyncedAt &&
    Date.now() - entity.clickupSyncedAt.getTime() < 10_000
  ) {
    return false; // this is our own echo
  }

  return true;
}
```

---

## 7. Admin Settings UI

The org admin needs a settings page to configure the integration. This is the most important UI piece — everything else flows from it.

### 7.1 Settings Page Sections

**Section 1: Connection Status**
- Show connected workspace name, connected by whom, connected date
- "Disconnect" button (deactivates integration, preserves existing ClickUp links on tickets)
- "Reconnect" button (re-run OAuth flow; clears old mappings, keeps ticket references)
- If disconnected: show banner explaining existing ClickUp links are preserved but no new sync occurs

**Section 2: List Mapping (uses ClickUpHierarchyPicker)**
- Dropdown: Select ClickUp Space → Folder → List for tickets
- Dropdown: Select ClickUp Space → Folder → List for bugs
- Both use the reusable `<ClickUpHierarchyPicker>` component (see Section 7.3)

**Section 3: Status Mapping**
- Two-column table: Your app status ↔ ClickUp status
- Auto-populated from your app's statuses + ClickUp list's statuses (fetched via API)
- Admin manually maps each pair

**Section 4: User Mapping**
- Table: App user name | ClickUp user (dropdown)
- ClickUp users fetched from `GET /team/{team_id}` → members array
- Auto-match by email where possible

**Section 5: Feature Toggles**
- Toggle: "Enable comment sync" (default: OFF)
  - Description: "Sync comments bidirectionally between your app and ClickUp"
  - Maps to `ClickUpIntegration.commentSyncEnabled`
- Toggle: "Show time tracking" (default: ON when connected)

**Section 6: Sync Log**
- Filterable table of recent sync events from ClickUpSyncLog
- Shows: timestamp, entity, action, direction, status, error (if any)

### 7.2 Reconnect UX

When an admin clicks "Reconnect":

```
1. Show confirmation modal:
   "Reconnecting will require you to reconfigure list mappings,
    status mappings, and user mappings. Existing tickets will
    keep their ClickUp links but won't be re-synced.
    Continue?"
2. If confirmed → redirect to OAuth flow
3. On callback → clear old mappings, store new token
4. Redirect to setup wizard (list picker → status mapping → user mapping)
5. Register new webhook
6. Show success: "ClickUp reconnected. New tickets will sync automatically."
```

### 7.3 Reusable Component: `<ClickUpHierarchyPicker>`

This is a cascading dropdown component that fetches Space → Folder → List from the ClickUp API. It's built as a reusable component in your shared UI package so it can be used in list mapping, future features, and anywhere you need a user to select a ClickUp location.

**Props:**
```typescript
interface ClickUpHierarchyPickerProps {
  organizationId: string;               // to resolve the OAuth token
  value?: {                              // current selection
    spaceId?: string;
    folderId?: string;
    listId?: string;
  };
  onChange: (selection: {                // fired when user picks a list
    spaceId: string;
    spaceName: string;
    folderId: string;
    folderName: string;
    listId: string;
    listName: string;
  }) => void;
  disabled?: boolean;
  showFolderlessList?: boolean;          // include lists not in any folder
  label?: string;                        // e.g. "Select list for tickets"
}
```

**Behavior:**
```
1. On mount: fetch spaces via GET /api/clickup/spaces?orgId={orgId}
   (your backend proxies to ClickUp: GET /team/{team_id}/space)
2. User selects a space → fetch folders via GET /api/clickup/folders?spaceId={id}
   (backend: GET /space/{space_id}/folder)
3. User selects a folder → fetch lists via GET /api/clickup/lists?folderId={id}
   (backend: GET /folder/{folder_id}/list)
4. User selects a list → fire onChange with full selection
5. Each dropdown shows loading spinner while fetching
6. Each dropdown resets children when parent changes
```

**Backend API routes (proxy to ClickUp):**
```typescript
// app/api/clickup/spaces/route.ts
export async function GET(req: Request) {
  const orgId = getOrgIdFromSession(req);
  const client = await ClickUpClient.forOrganization(orgId);
  const integration = await getIntegration(orgId);
  const data = await client.request("GET",
    `/team/${integration.workspaceId}/space?archived=false`
  );
  return Response.json(data.spaces);
}

// app/api/clickup/folders/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spaceId = searchParams.get("spaceId");
  const orgId = getOrgIdFromSession(req);
  const client = await ClickUpClient.forOrganization(orgId);
  const data = await client.request("GET",
    `/space/${spaceId}/folder?archived=false`
  );
  return Response.json(data.folders);
}

// app/api/clickup/lists/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");
  const orgId = getOrgIdFromSession(req);
  const client = await ClickUpClient.forOrganization(orgId);
  const data = await client.request("GET",
    `/folder/${folderId}/list?archived=false`
  );
  return Response.json(data.lists);
}
```

**Why this is reusable:**
- List mapping for tickets needs it
- List mapping for bugs needs it
- Any future feature that targets a ClickUp location (e.g. "sync feature requests to this list") reuses it
- Can be extended with a "folderless lists" option for spaces that don't use folders

---

## 8. Error Handling & Resilience

### 8.1 Token Invalidation

```typescript
// If any API call returns 401, mark integration as inactive
// and notify org admin
async function handleTokenInvalid(orgId: string) {
  await prisma.clickUpIntegration.update({
    where: { organizationId: orgId },
    data: { isActive: false },
  });

  await notifyOrgAdmin(orgId,
    "Your ClickUp integration was disconnected. " +
    "Please reconnect in Settings → Integrations."
  );
}
```

### 8.2 Rate Limiting

ClickUp rate limits vary by plan (100 req/min on free). Since each org has their own token, rate limits are per-org.

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof ClickUpRateLimitError && attempt < maxRetries) {
        const resetTime = err.resetTimestamp;
        const waitMs = resetTime
          ? Math.max(0, resetTime - Date.now())
          : Math.pow(2, attempt) * 1000;
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}
```

### 8.3 Retry Queue (Failed Syncs)

```typescript
// Cron job: runs every 5 minutes per org
// Route: GET /api/cron/clickup-retry
async function retryFailedSyncs() {
  const failedTickets = await prisma.ticket.findMany({
    where: {
      clickupTaskId: null,
      clickupSyncError: { not: null },
      createdAt: { gte: subHours(new Date(), 24) },
      organization: {
        clickUpIntegration: { isActive: true },
      },
    },
    include: { organization: { include: { clickUpIntegration: true } } },
  });

  for (const ticket of failedTickets) {
    try {
      await syncTicketToClickUp(ticket);
    } catch (err) {
      // Update error, continue with next
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { clickupSyncError: err.message },
      });
    }
  }
}
```

### 8.4 Disconnect & Reconnect Behavior

**On disconnect:** existing `clickupTaskId` references on tickets/bugs are preserved (not cleared). This means the ClickUp task URL link remains visible in the ticket detail UI as a historical reference, but no new syncing occurs.

**On reconnect:** the org goes through the OAuth + setup flow again. Existing tickets keep their old `clickupTaskId` — they are NOT re-synced to ClickUp. Only new tickets/bugs created after reconnection will sync. This avoids duplicate tasks and stale data conflicts.

```typescript
async function disconnectClickUp(orgId: string) {
  const integration = await prisma.clickUpIntegration.findUnique({
    where: { organizationId: orgId },
    include: { webhooks: true },
  });

  if (!integration) return;

  // Delete webhooks from ClickUp (best effort)
  const client = new ClickUpClient(decrypt(integration.accessToken));
  for (const webhook of integration.webhooks) {
    try {
      await client.request("DELETE", `/webhook/${webhook.clickupWebhookId}`);
    } catch {
      // Webhook may already be gone
    }
  }

  // Soft-delete: deactivate + clear token, but preserve the record
  // and all list/user/webhook mappings for audit trail
  await prisma.clickUpIntegration.update({
    where: { id: integration.id },
    data: {
      isActive: false,
      accessToken: "",
      disconnectedAt: new Date(),
    },
  });

  // DO NOT clear clickupTaskId on tickets/bugs.
  // They remain as historical references.
  // The UI should show: "ClickUp link (from previous connection)"
  // with the link still clickable but sync badge grayed out.
}

async function reconnectClickUp(orgId: string, newAccessToken: string, newWorkspaceId: string) {
  const existing = await prisma.clickUpIntegration.findUnique({
    where: { organizationId: orgId },
  });

  if (existing) {
    // Clear old mappings (they belong to the old workspace)
    await prisma.clickUpListMapping.deleteMany({
      where: { integrationId: existing.id },
    });
    await prisma.clickUpUserMapping.deleteMany({
      where: { integrationId: existing.id },
    });
    await prisma.clickUpWebhook.deleteMany({
      where: { integrationId: existing.id },
    });

    // Reactivate with new token
    await prisma.clickUpIntegration.update({
      where: { id: existing.id },
      data: {
        accessToken: encrypt(newAccessToken),
        workspaceId: newWorkspaceId,
        isActive: true,
        disconnectedAt: null,
        connectedAt: new Date(),
      },
    });
  } else {
    // First-time connect
    await prisma.clickUpIntegration.create({ ... });
  }

  // Admin must redo: list mapping, user mapping, status mapping
  // Then webhook registration
}
```

---

## 9. Implementation Phases

### Phase 1 — OAuth + One-Way Sync (Week 1-2)

| Task | Estimate | Priority |
|---|---|---|
| Create `packages/clickup` with client, types, error classes | 4h | P0 |
| Prisma migration: all new tables + fields (incl. `commentSyncEnabled`, `disconnectedAt`) | 3h | P0 |
| Token encryption utility (AES-256-GCM) | 2h | P0 |
| OAuth flow: authorize URL, callback, token storage | 6h | P0 |
| Settings UI: connection status + connect/disconnect/reconnect | 5h | P0 |
| Reusable `<ClickUpHierarchyPicker>` component (Space → Folder → List) | 6h | P0 |
| Backend proxy routes: `/api/clickup/spaces`, `/folders`, `/lists` | 3h | P0 |
| List mapping configuration (uses `<ClickUpHierarchyPicker>` x2) | 3h | P0 |
| User mapping: auto-match by email + manual override | 4h | P0 |
| Ticket creation → ClickUp task creation | 5h | P0 |
| Bug creation → ClickUp task creation | 3h | P0 |
| ClickUp task URL displayed in ticket/bug detail view | 2h | P1 |
| Sync error display + retry button | 3h | P1 |
| **Total** | **~49h** | |

**Definition of Done:**
- Any org can connect their ClickUp workspace via OAuth2
- Admin can configure which lists tickets and bugs sync to using the cascading picker
- `<ClickUpHierarchyPicker>` is a standalone, reusable component in the shared UI package
- When support creates a ticket or bug, a ClickUp task appears in the configured list
- If ClickUp is down, tickets are still created and errors are logged

### Phase 2 — Bidirectional Sync + Opt-In Comments (Week 3-4)

| Task | Estimate | Priority |
|---|---|---|
| Webhook registration during setup flow | 4h | P0 |
| Webhook handler: routing by `webhook_id`, signature verification | 5h | P0 |
| Handle `taskStatusUpdated` → update ticket status | 4h | P0 |
| Handle `taskAssigneeUpdated` → update ticket assignee | 3h | P0 |
| Loop prevention mechanism (cooldown + `lastSyncSource`) | 3h | P0 |
| Status mapping configuration UI | 4h | P0 |
| Sync status changes: your app → ClickUp | 3h | P0 |
| Sync assignee changes: your app → ClickUp | 3h | P0 |
| Comment sync toggle in settings UI | 2h | P0 |
| Comment sync: your app → ClickUp (with opt-in check) | 4h | P1 |
| Comment sync: ClickUp → your app (webhook, with opt-in check) | 5h | P1 |
| Comment deduplication (ClickUpCommentSync table) | 3h | P1 |
| Disconnect flow: preserve ticket refs, clear token | 3h | P0 |
| Reconnect flow: clear mappings, re-setup, preserve old refs | 4h | P0 |
| Retry queue (cron job for failed syncs) | 4h | P1 |
| Sync log viewer in admin settings | 3h | P1 |
| **Total** | **~57h** | |

**Definition of Done:**
- Status and assignee changes flow both directions without loops
- Comment sync is off by default; when enabled, comments appear in both systems
- No duplicate comments when sync is enabled
- Admin can disconnect and reconnect without losing historical ClickUp links
- On reconnect, only new tickets sync; old ones keep their references
- Failed syncs are retried automatically

### Phase 3 — Time Tracking + Dev Dashboard (Week 5)

| Task | Estimate | Priority |
|---|---|---|
| Time tracking API integration (fetch entries) | 4h | P0 |
| Dev workload API endpoint | 5h | P0 |
| Dashboard UI: per-dev task/bug count + hours | 6h | P0 |
| Filter by status, priority, type, date range | 4h | P1 |
| "Currently working on" indicator (running time entry) | 3h | P2 |
| Time entries displayed on ticket/bug detail page | 3h | P2 |
| **Total** | **~25h** | |

### Phase 4 — Hardening + Polish (Week 6)

| Task | Estimate | Priority |
|---|---|---|
| Token invalidation handling + admin notification | 3h | P0 |
| Rate limit handling per org | 3h | P0 |
| Graceful degradation when ClickUp is down | 3h | P0 |
| Health check: validate ClickUp list structure matches config | 4h | P1 |
| Integration tests for all sync flows | 8h | P0 |
| Bulk backfill tool (sync existing tickets to ClickUp) | 5h | P2 |
| Documentation for org admins (how to set up) | 3h | P1 |
| Edge case: org changes ClickUp list structure after setup | 3h | P1 |
| **Total** | **~32h** | |

---

## 10. Gap Analysis & Risks

### Critical Gaps

1. **Token encryption is mandatory.** You're storing OAuth tokens for multiple organizations. Use AES-256-GCM with a per-environment encryption key. Never store tokens in plaintext.

2. **Webhook endpoint is shared across all orgs.** A single `/api/webhooks/clickup` route handles events from every connected org. The `webhook_id` in the payload is how you route to the correct org. This must be reliable — if routing fails, you lose sync events silently.

3. **Status mapping is org-specific.** Each ClickUp workspace can have different custom statuses per list. Your admin UI must fetch available statuses from the selected list and let the admin map them. There is no universal default.

4. **Comment sync must be idempotent.** ClickUp webhooks do not guarantee exactly-once delivery. The `ClickUpCommentSync` table with unique constraints on both `localCommentId` and `clickupCommentId` prevents duplicates.

### Important Gaps

5. ~~**Org disconnects then reconnects.**~~ **RESOLVED:** On disconnect, existing `clickupTaskId` references are preserved as historical links. On reconnect, old mappings are cleared but ticket references remain. Only new tickets sync after reconnection.

6. **Multiple workspace authorization.** During OAuth, users can authorize multiple workspaces. Your setup flow should let the admin choose which workspace to use if multiple are authorized.

7. **Custom field IDs are per-list and per-workspace.** You cannot hardcode them. The setup flow must discover them via `GET /list/{list_id}/field` and store them in `ClickUpListMapping.customFieldMappings`.

8. **Time tracking may not be enabled.** Not all ClickUp plans or workspaces have time tracking enabled. Your time tracking features should gracefully handle empty responses.

9. ~~**Comment sync noise.**~~ **RESOLVED:** Comment sync is opt-in per org (default: off). Controlled by `commentSyncEnabled` flag in the integration settings.

10. **ClickUp Hierarchy Picker must handle edge cases.** Some spaces have no folders (folderless lists). Some folders are archived. The `<ClickUpHierarchyPicker>` component must handle: empty states (no spaces, no folders, no lists), archived items filtering, and API errors at each level of the cascade.

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Org's ClickUp token gets revoked | All sync stops silently | Detect 401, mark inactive, notify admin |
| ClickUp changes webhook payload format | Sync breaks for all orgs | Defensive parsing, log unexpected payloads, alerting |
| High-volume org hits rate limits | Sync delays | Per-org rate limit tracking, queuing |
| Admin deletes ClickUp list that tickets sync to | Task creation fails | Validate list exists on each sync, clear error messaging |
| Webhook endpoint downtime | Missed events from all orgs | ClickUp retries for ~1h15m; add periodic full-sync as fallback |
| Admin reconnects to different workspace | Old ticket links point to inaccessible tasks | UI shows "from previous connection" label, links still work if user has access |
| Folderless lists not shown in picker | Admin can't select correct list | `<ClickUpHierarchyPicker>` supports `showFolderlessList` prop |

---

## 11. Environment Variables

```env
# ClickUp OAuth App (global — same for all tenants)
CLICKUP_CLIENT_ID=xxxxxxxxxxxx
CLICKUP_CLIENT_SECRET=xxxxxxxxxxxx
CLICKUP_REDIRECT_URI=https://your-app.com/api/integrations/clickup/callback

# Webhook (global endpoint — all orgs share this)
CLICKUP_WEBHOOK_ENDPOINT=https://your-app.com/api/webhooks/clickup

# Encryption key for storing OAuth tokens
ENCRYPTION_KEY=your-256-bit-key-here
```

Note: Per-org config (workspace ID, list IDs, tokens, webhook secrets, comment sync toggle) is stored in the database, not in environment variables. Only the OAuth app credentials and the encryption key are global. Comment sync is controlled per-org via `ClickUpIntegration.commentSyncEnabled`.

---

## 12. Summary: What Changed from v1

| Area | v1 (Single Tenant) | v2 (Multi-Tenant) |
|---|---|---|
| Auth | Single API token in env var | OAuth2 per org, tokens in DB (encrypted) |
| Config | Env vars for list IDs | DB-driven config per org with admin UI |
| Webhooks | One webhook, one secret | One webhook endpoint, many registrations with per-org secrets |
| User mapping | One mapping table | Scoped to org via integrationId |
| Comments | Not planned | Bidirectional sync, **opt-in per org** (default: off) |
| Time tracking | Not planned | Fetch from ClickUp API, display in dashboard |
| Disconnect/Reconnect | Not planned | Preserves old task links, clears mappings, only new tickets sync |
| UI Components | Ad-hoc pickers | Reusable `<ClickUpHierarchyPicker>` component |
| Complexity | ~89h | **~163h** |
| New tables | 3 | 7 |

### Decisions Log

| # | Decision | Rationale |
|---|---|---|
| 1 | ClickUp link in ticket detail (no embedded board) | Simpler, avoids iframe complexity and ClickUp CSP issues |
| 2 | Comment sync is opt-in per org | Prevents noise; orgs enable when they're ready |
| 3 | ClickUp native notifications (no custom notifications) | Devs already use ClickUp; avoid notification fatigue |
| 4 | No custom task templates | Simplifies mapper; can be added later as enhancement |
| 5 | Multi-tenant OAuth2 (not personal tokens) | Required for multi-org SaaS |
| 6 | Time tracking enabled, displayed in dashboard | Gives visibility into dev effort per ticket |
| 7 | On disconnect: preserve old `clickupTaskId` refs | Historical traceability; links still work if user has access |
| 8 | On reconnect: clear mappings, don't re-sync old tickets | Prevents duplicates and stale data conflicts |
| 9 | `<ClickUpHierarchyPicker>` as reusable component | Used in 2+ places now, more in the future |