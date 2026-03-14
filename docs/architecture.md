# Community Engine Vue — Architecture

## Vision

`@bettertogether/community-engine-vue` is the JavaScript companion to the
`community-engine` Rails engine. It mirrors the Rails data model as a fully
operational **local-first, offline-capable** frontend layer — not just a thin
HTTP client. A user should be able to read posts, compose messages, and
participate in their community on a train with no signal, then have everything
silently sync when they reconnect.

The relationship to the Rails engine is:

```
community-engine (Rails)     community-engine-vue (JS)
─────────────────────        ──────────────────────────
ActiveRecord models    ←→    PGlite local schema
JSON:API resources     ←→    Typed composables + stores
Pundit policies        ←→    Sync filter rules (Electric)
Controller actions     ←→    useResource() + named composables
ActionText / i18n      ←→    Rich text display + vue-i18n
```

---

## Offline-First Principles

1. **Local database is primary.** Every read goes to local PGlite first. The
   network is an optimistic sync channel, never a blocking dependency.
2. **Writes are local-first.** All mutations write locally with a sync-status
   timestamp immediately. The sync layer propagates them to the server
   asynchronously.
3. **Sync state is always visible.** Every item carries a `_syncStatus` field
   (`local` | `syncing` | `synced` | `conflict`). The UI renders this at both
   item level and app level — users always know what is local-only.
4. **CRDT conflict resolution.** Field-level last-write-wins on all scalar
   attributes. No user-facing conflict prompts. The server is not authoritative
   by fiat — the latest timestamp wins.
5. **Graceful degradation.** Auth, read, and write all work fully offline. Only
   initial bootstrap and account creation require connectivity.

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| UI framework | Vue 3 + `<script setup>` | Composition API, tree-shaking |
| Build | Vite 6 | Official Vue successor to Vue CLI |
| State (global) | Pinia 2 | Official Vue 3 store |
| Local database | **PGlite** (WASM Postgres) | Same SQL dialect as Rails/Postgres |
| Real-time sync | **ElectricSQL** | Postgres-to-PGlite shape-based sync |
| Component library | BootstrapVue Next + Bootstrap 5 | BTV compatibility |
| Routing | Vue Router 4 | Community-scoped nested routes |
| HTTP client | axios + devour-client (JSON:API) | Matches CE Rails JSON:API serializers |
| Testing | Vitest + @vue/test-utils 2 | Vite-native |

---

## Source Layout

```
src/
  db/
    schema.js          ← PGlite schema migrations (mirrors Rails schema)
    client.js          ← singleton PGlite instance + setup
    sync.js            ← ElectricSQL shape subscriptions
    migrations/        ← versioned SQL migrations for local schema

  api/
    client.js          ← axios singleton with auth headers
    resources/
      communities.js   ← JSON:API axios calls for communities
      people.js
      posts.js
      events.js
      conversations.js
      messages.js
      notifications.js
      navigation.js
      uploads.js
      geography.js
      roles.js
      joatu.js         ← offers, requests, agreements
      (one file per JSON:API resource group)

  stores/
    auth.js            ← session, token, persist: true
    currentPerson.js   ← me, preferences, persist: true
    community.js       ← active community context, persist: true
    menus.js           ← navigation items
    sync.js            ← global sync status (online/offline/pending count)
    notifications.js   ← unread count, real-time badge

  composables/
    useResource.js     ← generic CRUD: list, get, create, update, destroy
                          reads from PGlite, writes locally + queues sync
    useSync.js         ← online/offline detection, queue drain
    useSyncStatus.js   ← per-item sync state helper

    # Named wrappers (thin, add resource-specific defaults + transforms)
    usePosts.js
    useEvents.js
    useConversations.js
    useMessages.js
    useMembers.js
    useNotifications.js
    useUploads.js
    useNavigation.js
    useGeography.js
    useJoatu.js

  components/
    sync/
      SyncStatusBar.vue     ← app-wide bar (top): online status + pending count
      SyncBadge.vue         ← per-item badge: local / syncing / synced icons
      OfflineBanner.vue     ← dismissible "you are offline" notification

    layout/
      BtHeader.vue
      BtMainContent.vue
      BtNavBar.vue
      BtNavItem.vue
      BtNavUser.vue
      BtBrandingLogo.vue

    auth/
      BtUserSignInForm.vue
      BtUserSignUpForm.vue
      BtUserResetPasswordForm.vue
      BtUserNewPasswordForm.vue
      BtUserResendConfirmationForm.vue

    community/
      CommunityCard.vue
      CommunityForm.vue
      CommunityList.vue
      CommunityHeader.vue   ← cover image + branding for a community context

    person/
      PersonCard.vue
      PersonAvatar.vue
      BtProfileForm.vue
      MemberList.vue

    post/
      PostCard.vue
      PostList.vue
      PostForm.vue
      PostDetail.vue

    event/
      EventCard.vue
      EventList.vue
      EventForm.vue

    conversation/
      ConversationList.vue
      ConversationThread.vue
      MessageComposer.vue

    notification/
      NotificationBell.vue
      NotificationList.vue

    shared/
      ResourcePrivacyBadge.vue   ← public / private / protected indicator
      LoadingSpinner.vue
      EmptyState.vue
      RichTextDisplay.vue        ← ActionText HTML renderer

  pages/
    Home.vue
    Me.vue
    Communities.vue
    community/
      CommunityHome.vue
      CommunityPosts.vue
      CommunityEvents.vue
      CommunityMembers.vue
      CommunityConversations.vue
    Error404.vue
    UserSignIn.vue
    UserSignUp.vue
    UserPasswordReset.vue
    UserPasswordNew.vue
    UserResendConfirmation.vue

  router/
    index.js           ← platform-level routes
    communityRoutes.js ← exportable community-scoped nested route module

  plugins/
    index.js
    bootstrap-vue.js
    font-awesome.js
    progress.js

  composables/useToaster.js
  mixins/
    error-handling.js
    toaster.js         ← legacy shim

  stylesheets/
    theme.scss
    sync-indicators.scss  ← colour tokens for sync state

  index.js             ← plugin entry point + all exports
  main.js              ← dev app entry
  BtApp.vue
```

---

## Local Database (PGlite)

### Schema strategy

The local schema mirrors the Rails schema for the resources exposed through
the JSON:API layer. It does **not** need to mirror every Rails column — only
what the frontend needs to render and mutate.

Every table gets three system columns added by the client-side schema:

```sql
_sync_status   TEXT    NOT NULL DEFAULT 'local'
               -- 'local' | 'syncing' | 'synced' | 'conflict'
_local_updated TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
_server_at     TEXT    -- last server-confirmed updated_at
```

### Core tables (Phase 2 target)

```sql
CREATE TABLE people (
  id            TEXT PRIMARY KEY,
  slug          TEXT,
  identifier    TEXT,
  name          TEXT,
  privacy       TEXT,
  profile_image_url TEXT,
  cover_image_url   TEXT,
  locale        TEXT,
  time_zone     TEXT,
  _sync_status  TEXT NOT NULL DEFAULT 'local',
  _local_updated TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at    TEXT
);

CREATE TABLE communities (
  id            TEXT PRIMARY KEY,
  slug          TEXT,
  name          TEXT,
  description   TEXT,
  privacy       TEXT,
  profile_image_url TEXT,
  cover_image_url   TEXT,
  creator_id    TEXT,
  _sync_status  TEXT NOT NULL DEFAULT 'local',
  _local_updated TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at    TEXT
);

CREATE TABLE posts (
  id            TEXT PRIMARY KEY,
  slug          TEXT,
  title         TEXT,
  content       TEXT,
  privacy       TEXT,
  published_at  TEXT,
  author_id     TEXT,
  community_id  TEXT,
  _sync_status  TEXT NOT NULL DEFAULT 'local',
  _local_updated TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at    TEXT
);

-- events, messages, conversations, notifications ... (same pattern)
```

### db/client.js

```js
import { PGlite } from '@electric-sql/pglite'
import { migrate } from './migrations'

let _db = null

export async function getDb() {
  if (_db) return _db
  _db = new PGlite('idb://community-engine')  // persists in IndexedDB
  await migrate(_db)
  return _db
}
```

---

## Sync Layer (ElectricSQL)

ElectricSQL connects a running Electric server (sidecar to the Rails app) to
the local PGlite instance via shape-based subscriptions.

```js
// src/db/sync.js
import { PGliteElectricDatabase } from '@electric-sql/pglite/electric'
import { ElectricClient } from 'electric-sql/client/model'
import { getDb } from './client'
import { useAuthStore } from '../stores/auth'
import { useSyncStore } from '../stores/sync'

export async function startSync() {
  const db = await getDb()
  const auth = useAuthStore()
  const sync = useSyncStore()

  const electric = await PGliteElectricDatabase.init(db, {
    url: import.meta.env.VITE_ELECTRIC_URL,
    headers: { Authorization: auth.token },
  })

  // Subscribe to shapes — server filters by user's visible scope
  await electric.db.communities.sync({ where: 'privacy != \'private\'' })
  await electric.db.posts.sync()
  await electric.db.people.sync()

  electric.isConnected.subscribe((connected) => {
    sync.setOnline(connected)
  })
}
```

The `_sync_status` field on every row reflects the Electric sync state
automatically. For local-only rows (written while offline), status stays
`'local'` until Electric confirms the write.

---

## useResource — Generic CRUD Composable

All data access flows through this composable. Named composables are thin
wrappers that supply defaults.

```js
// src/composables/useResource.js
import { ref, computed } from 'vue'
import { getDb } from '../db/client'

export function useResource(table, options = {}) {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Read from local PGlite (always fast, works offline)
  async function list(filters = {}) {
    loading.value = true
    const db = await getDb()
    const where = buildWhere({ ...options, ...filters })
    const result = await db.query(`SELECT * FROM ${table} ${where} ORDER BY _local_updated DESC`)
    items.value = result.rows
    loading.value = false
    return result.rows
  }

  async function get(id) {
    const db = await getDb()
    const result = await db.query(`SELECT * FROM ${table} WHERE id = $1`, [id])
    current.value = result.rows[0] ?? null
    return current.value
  }

  // Writes: local-first with sync_status = 'local', Electric syncs async
  async function create(attrs) {
    const db = await getDb()
    const id = crypto.randomUUID()
    const row = { id, ...attrs, _sync_status: 'local', _local_updated: new Date().toISOString() }
    await db.query(buildInsert(table, row), Object.values(row))
    items.value.unshift(row)
    return row
  }

  async function update(id, attrs) {
    const db = await getDb()
    const updates = { ...attrs, _sync_status: 'local', _local_updated: new Date().toISOString() }
    await db.query(buildUpdate(table, id, updates), [...Object.values(updates), id])
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) items.value[idx] = { ...items.value[idx], ...updates }
    return items.value[idx]
  }

  async function destroy(id) {
    const db = await getDb()
    // Soft-delete: mark for sync, Electric sends DELETE to server
    await db.query(`UPDATE ${table} SET _sync_status = 'local', deleted_at = $1 WHERE id = $2`,
      [new Date().toISOString(), id])
    items.value = items.value.filter((i) => i.id !== id)
  }

  const pendingCount = computed(() => items.value.filter((i) => i._sync_status === 'local').length)

  return { items, current, loading, error, pendingCount, list, get, create, update, destroy }
}
```

### Named wrapper example — usePosts

```js
// src/composables/usePosts.js
import { useResource } from './useResource'

export function usePosts(communityId = null) {
  const resource = useResource('posts', communityId ? { community_id: communityId } : {})

  // Post-specific: published only by default
  async function listPublished() {
    return resource.list({ published: true })
  }

  return { ...resource, listPublished }
}
```

---

## Sync Status — Visual Design

### Colour tokens (`stylesheets/sync-indicators.scss`)

```scss
$sync-local:    #f59e0b;   // amber  — local only, not sent
$sync-syncing:  #3b82f6;   // blue   — in flight
$sync-synced:   #10b981;   // green  — confirmed on server
$sync-conflict: #ef4444;   // red    — conflict (shouldn't appear with CRDT)
```

### SyncBadge.vue — per-item indicator

A small dot + tooltip on every card. Renders nothing when `synced` (avoids
visual noise for the normal case — only surfaces when action is needed).

```
●  local        (amber dot)      "Saved locally, will sync when online"
⟳  syncing      (blue spin)      "Syncing..."
✓  synced       (invisible)      — clean state, no badge shown
🔒 needs-auth   (amber lock)     "Sign in to sync this item"
⚠  conflict     (red)            "Conflict — newer version on server"
```

### SyncStatusBar.vue — app-wide bar

Thin bar at top of `BtHeader`:
- **Online, all synced**: invisible (doesn't steal space)
- **Online, N pending**: blue bar "Syncing 3 items…"
- **Offline**: amber bar "You are offline. Changes will sync when you reconnect. (12 pending)"

---

## Routing Architecture

### Platform-level routes (always registered)

```
/                          Home
/me                        My profile
/communities               Community list
/users/sign-in             Auth
/users/sign-up
/users/password/reset
/users/password/new
/users/confirmation
/users/confirmation/resend
/:pathMatch(.*)*           Error404
```

### Community-scoped route module (optional, addable by host app)

```js
// src/router/communityRoutes.js
export const communityRoutes = [
  {
    path: '/communities/:communitySlug',
    component: CommunityLayout,          // sets active community in store on enter
    children: [
      { path: '',         name: 'CommunityHome',          component: CommunityHome },
      { path: 'posts',    name: 'CommunityPosts',         component: CommunityPosts },
      { path: 'posts/:id',name: 'CommunityPost',          component: PostDetail },
      { path: 'events',   name: 'CommunityEvents',        component: CommunityEvents },
      { path: 'members',  name: 'CommunityMembers',       component: CommunityMembers },
      { path: 'conversations', name: 'CommunityConversations', component: CommunityConversations },
    ],
  },
]
```

`CommunityLayout` is a wrapper that reads `:communitySlug`, fetches from local
PGlite, and sets `communityStore.activeCommunity` — all downstream child pages
just read the store.

Host apps add it like:
```js
import { BtRoutes, communityRoutes } from '@bettertogether/community-engine-vue'
const router = createRouter({ routes: [...BtRoutes, ...communityRoutes] })
```

---

## Plugin Export Contract

`src/index.js` exports everything a host app might need:

```js
// Stores
export { useAuthStore, useCommunityStore, useMenuStore, usePeopleStore, useSyncStore }

// Composables
export { useResource, usePosts, useEvents, useConversations, useMessages,
         useMembers, useNotifications, useGeography, useJoatu, useSyncStatus }

// Components (individually tree-shakeable)
export { BtHeader, BtNavBar, BtNavItem, BtNavUser, BtBrandingLogo,
         BtMainContent, SyncStatusBar, SyncBadge, OfflineBanner,
         PostCard, PostList, CommunityCard, CommunityList, PersonCard,
         PersonAvatar, NotificationBell, ... }

// Router modules
export { BtRoutes, communityRoutes, BtRouter }

// Plugin install (app.use(CommunityEngineVue))
export default CommunityEngineVue
```

---

## Data Flow Diagram

```
User action
    │
    ▼
composable.create(attrs)
    │
    ├─► write to PGlite (sync_status='local')   ◄── instant, works offline
    │       │
    │       └─► UI re-renders from local query
    │
    └─► Electric detects new local row
            │
            ├─► [online]  POST to Rails JSON:API → server persists
            │               └─► Electric confirms → sync_status='synced'
            │                       └─► SyncBadge disappears
            │
            └─► [offline] row queued in PGlite
                            └─► drain when connection restored
```

---

## Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **1** | Vue 3 + Vite + Pinia + BVN migration. Axios-only. | ✅ done |
| **2** | PGlite schema + migrations. `useResource`. SyncBadge + SyncStatusBar. | ✅ done |
| **3** | Offline auth additions. `person_community_memberships` + `uploads` schema. ElectricSQL integration. Plugin install options + extensibility API. | 🔄 current |
| **4** | Post + Event components/pages. Community route module complete. | pending |
| **5** | Conversations, Messages, Invitations, Pages. JoaTU. | pending |
| **6** | Roles, Geography composable. `better-together-vue` Vue 3 migration. | pending |
| **7** | PWA manifest + service worker. Full offline bootstrap. | pending |

---

## Offline Authentication Model

### Principle: local reads never require a token

The local PGlite database is readable without authentication. A user who has
previously signed in has a full local copy of their data. Reopening the app
offline — or with an expired token — must not block read access.

### Four-state auth model

| State | Token | Local reads | Server sync |
|-------|-------|-------------|-------------|
| Signed in + online | Valid | ✅ | ✅ |
| Signed in + offline | Valid (not checked) | ✅ | ⏸ queued |
| Token expired + online | Expired | ✅ | 🔒 refreshing |
| Not signed in | None | ✅ (read-only) | ❌ |

### Auth store additions (`stores/auth.js`)

```js
// Persistent refs
const token = ref(null)             // JWT access token
const refreshToken = ref(null)      // JWT refresh token
const tokenIssuedAt = ref(null)     // ISO timestamp

// Computed
const tokenIsExpired = computed(() =>
  tokenIssuedAt.value &&
  Date.now() - new Date(tokenIssuedAt.value).getTime() > TOKEN_TTL_MS
)
const canSync = computed(() => !!token.value && !tokenIsExpired.value)
const hasLocalAccess = computed(() => true)  // always

// Methods
async function refreshTokenIfNeeded() {
  // No-op until CE Rails adds POST /bt/api/auth/refresh (Deck #955)
  if (!canSync.value && refreshToken.value) {
    // POST /bt/api/auth/refresh → new token
    // On success: set token, tokenIssuedAt
    // On failure: dispatch needs-auth event
  }
}
```

### `needs-auth` sync status

When a write is made with `_sync_status = 'local'` and the token subsequently
expires before sync completes, the useSyncStore calls
`markPendingAsNeedsAuth()` — changing `_sync_status = 'needs-auth'` on all
local rows. The SyncBadge renders a 🔒 amber lock. The SyncStatusBar shows
"Sign in to sync N items". Normal writes resume when the user re-authenticates.

```
_sync_status values:
  'local'       — written locally, not yet sent
  'syncing'     — currently in flight
  'synced'      — confirmed on server
  'needs-auth'  — token expired, write is blocked
  'conflict'    — conflict (CRDT resolution failed — should be rare)
```

### Auth data never enters PGlite

Tokens, session data, and credentials are stored in Pinia only (with
`persist: true` to localStorage). Never in PGlite tables. This keeps the
local database shareable between sessions without leaking auth material.

---

## Component Slot API

### Three levels of customization

Consumers of CEV components can customize at three levels of depth, in
ascending order of invasiveness:

**Level 1 — CSS custom properties (zero JS)**
All colour, spacing, and typography decisions are exposed as CSS tokens:
```css
:root {
  --bt-primary: #4f46e5;
  --bt-accent: #10b981;
  --bt-font-family: 'Inter', sans-serif;
  --bt-radius: 0.5rem;
  --bt-card-padding: 1.25rem;
}
```

**Level 2 — Named + scoped slots (template customization)**
Every content component exposes a standard slot vocabulary. The default
slot content is always sensible; slots just let host apps override parts.

**Level 3 — Page ejection (full ownership)**
Any page component can be replaced entirely by pointing Vue Router at a
host app's own component instead. No special plugin API needed — just
provide a route with the same name and a different component.

### Standard slot vocabulary

All content components (PostCard, EventCard, CommunityCard, PersonCard, etc.)
expose the same named slot set:

```
#header       — top of card (image, cover)
#title        — title + subtitle area
#meta         — date, author, community, category
#body         — main content area (text, rich text)
#footer       — action buttons, links
#sync-badge   — sync status indicator (default: <SyncBadge>)
```

Scoped slot payloads:
- Single-item slots expose `{ item }` or `{ item, loading, error }`
- List-level `#item` slot exposes `{ item, index }`

List components additionally expose:
```
#item         — scoped: { item, index }
#empty        — rendered when list is empty
#loading      — rendered while loading
#header       — above the list
#footer       — below the list (pagination, load-more)
```

### Plugin install options

Full API for `app.use(CommunityEngineVue, options)`:

```js
app.use(CommunityEngineVue, {
  // Which Tier 2+ modules to enable (default: 'all')
  modules: ['posts', 'events', 'conversations'],  // or 'all'

  // Install-time theme object (maps to CSS custom properties)
  theme: {
    primary:    '#4f46e5',
    accent:     '#10b981',
    background: '#ffffff',
    text:       '#111827',
    fontFamily: 'Inter, sans-serif',
  },

  // Whether communities can override theme values
  communityTheme: {
    allowAccentOverride:     true,   // communities can set their own accent colour
    allowCoverImage:         true,   // community cover image shown in layout
    allowBackgroundOverride: false,  // communities cannot override global background
  },

  // Router integration
  routes: {
    includeCommunityRoutes: true,   // add /communities/:slug/... routes
    basePath: '/',                  // prefix for all CEV routes
  },

  // Sync configuration
  sync: {
    enabled:     true,
    electricUrl: import.meta.env.VITE_ELECTRIC_URL,
  },

  // Companion package extensions (see Companion Package Extensibility below)
  extensions: [],
})
```

---

## Data Model Tiers

The data model is organized into tiers by scope and optionality. Tier 1 is
always present; higher tiers are opt-in via the `modules:` install option.

### Tier 1 — Foundation (always present)

Core identity and navigation. Cannot be disabled. Always in PGlite schema.

| Resource | Rails model | Key fields |
|----------|-------------|------------|
| Auth | User / Devise | token, refreshToken, currentPerson |
| Person | `BetterTogether::Person` | slug, name, locale, time_zone, privacy |
| Community | `BetterTogether::Community` | slug, name, description, privacy |
| PersonCommunityMembership | `BetterTogether::PersonCommunityMembership` | person_id, community_id, role |
| NavigationArea | `BetterTogether::NavigationArea` | identifier, position |
| NavigationItem | `BetterTogether::NavigationItem` | label, url, icon, position |
| Upload | `BetterTogether::Upload` | url, content_type, attachable |
| Notification | `BetterTogether::Notification` | read_at, notifiable |

### Tier 2 — Content (opt-in modules)

Community-specific content. Each is a named module: `'posts'`, `'events'`,
`'conversations'`, `'messages'`, `'pages'`, `'invitations'`.

| Module | Resources | Key fields |
|--------|-----------|------------|
| `posts` | Post | title, content, privacy, published_at, community_id |
| `events` | Event | title, starts_at, ends_at, location, community_id |
| `conversations` | Conversation, Message | title, body, author_id, thread |
| `pages` | Page | title, body, slug, community_id |
| `invitations` | Invitation | email, community_id, role, expires_at |

### Tier 3 — Participation

Social mechanics. Opt-in modules: `'joatu'`, `'roles'`, `'blocks'`.

| Module | Resources | Description |
|--------|-----------|-------------|
| `joatu` | Offer, Request, Agreement | Mutual-aid offers/requests, time-banking |
| `roles` | Role, RolePermission | RBAC permission assignments |
| `blocks` | PersonBlock | Block/mute between people |

### Tier 4 — Geography (read-only)

Loaded once per session from local PGlite. Never mutated on the client.
Continent → Country → Region/State → Settlement hierarchy.

Used for address selectors and filtering by location. No sync badge (these
rows are effectively static reference data).

Module: `'geography'`

### Tier 5 — Platform infrastructure (composables only)

Low-level resources with no default UI components. Exposed as composables
for host apps that need them:

| Resource | Composable | Use |
|----------|-----------|-----|
| WebhookEndpoint | `useWebhooks()` | Register/manage outbound webhooks |
| Registration | `useRegistrations()` | Event / page registration records |
| MetricsSummary | `useMetrics()` | Aggregate stats (no UI) |

### Out of scope (not in CEV)

The following Rails models are intentionally excluded — they are
infrastructure or safety-critical concerns that should not be managed from
the JS layer:

- `AI/*` — all machine learning / recommendation models
- `Safety/*` — moderation, reporting, toxicity filtering
- `Infrastructure/*` — server config, feature flags
- `JwtDenylist` — token revocation (server-side only)
- `Wizard`, `WizardStep` — multi-step onboarding (too host-app specific)
- `OauthApplication` — OAuth provider (admin-only)
- `Sitemap`, `GuestAccess` — SEO/access infrastructure

---

## Companion Package Extensibility

`community-engine-vue` is the foundation. Companion packages extend it
without forking it. The extensibility model is modelled on Rails engines
mounting into a host app — companions are structurally identical to host app
local extensions.

### The three mechanisms

**1. Plugin context singleton** — CEV writes its live instances (`app`,
`pinia`, `router`, `db`) to a module-level singleton that companions read.
No Vue `inject()` needed — plain JS import.

```js
// src/context.js (exported from the package)
let _context = null
export function setCevContext(ctx) { _context = ctx }
export function getCevContext() {
  if (!_context) throw new Error(
    '[@bettertogether/community-engine-vue] not installed — call app.use(CommunityEngineVue) first'
  )
  return _context
}
```

**2. `defineExtension()` declaration API** — companions describe everything
they need as a plain object; CEV orchestrates the lifecycle.

```js
// In @bettertogether/community-commerce-vue:
import { defineExtension } from '@bettertogether/community-engine-vue'

export const CommunityCommerceVue = defineExtension({
  name: 'community-commerce',

  // PGlite migrations — CEV reserves 1–9; companions use 10+
  migrations: [
    {
      version: 10,
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY, name TEXT, price_cents INTEGER,
          community_id TEXT, slug TEXT,
          _sync_status TEXT NOT NULL DEFAULT 'local',
          _local_updated TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          _server_at TEXT
        );
        INSERT OR IGNORE INTO _schema_versions (version) VALUES (10);
      `,
    },
  ],

  // Routes to add to the platform-level router
  routes: commerceRoutes,

  // Injected as children of /communities/:slug
  communityRoutes: [
    { path: 'shop', name: 'CommunityShop', component: () => import('./pages/CommunityShop.vue') },
  ],

  // Globally registered components
  components: { BtProductCard: ProductCard, BtCartWidget: CartWidget },

  // Inject UI into CEV component slots without host app wiring
  slotInjections: [
    {
      target: 'BtHeader',
      slot: 'nav-append',
      component: CartNavBadge,
    },
    {
      target: 'CommunityHome',
      slot: 'sidebar',
      component: FeaturedProducts,
      props: ({ community }) => ({ communityId: community.id }),
    },
  ],

  // Called once after CEV is fully initialized
  setup({ app, router, db, pinia }) { /* imperative setup */ },
})
```

Host apps install companions as extensions:
```js
app.use(CommunityEngineVue, {
  extensions: [CommunityCommerceVue],
})
// or independently (auto-detects CEV context):
app.use(CommunityEngineVue, options)
app.use(CommunityCommerceVue)
```

**3. Slot injection registry** — companions register UI into named slot
positions; CEV's `ExtensionSlot` component renders them in the default slot
fallback of each component. Host apps that provide their own slot content
naturally suppress injections.

```js
// src/slot-registry.js
const registry = {}
export function registerSlotInjection({ target, slot, component, props }) {
  const key = `${target}:${slot}`
  if (!registry[key]) registry[key] = []
  registry[key].push({ component, props: props ?? {} })
}
export function getSlotInjections(target, slot) {
  return registry[`${target}:${slot}`] ?? []
}
```

```vue
<!-- src/components/shared/ExtensionSlot.vue -->
<template>
  <component
    :is="inj.component"
    v-for="(inj, i) in injections"
    :key="i"
    v-bind="typeof inj.props === 'function' ? inj.props(context) : inj.props"
  />
</template>
<script setup>
import { computed } from 'vue'
import { getSlotInjections } from '../../slot-registry'
const props = defineProps({
  target: { type: String, required: true },
  slot:   { type: String, required: true },
  context: { type: Object, default: () => ({}) },
})
const injections = computed(() => getSlotInjections(props.target, props.slot))
</script>
```

Content components use `ExtensionSlot` in their default slot fallbacks:
```vue
<!-- PostCard.vue -->
<template>
  <slot name="footer">
    <div class="post-actions"><!-- default actions --></div>
    <ExtensionSlot target="PostCard" slot="footer" :context="{ item: post }" />
  </slot>
</template>
```

### PGlite migration version ranges

| Range | Owner |
|-------|-------|
| 1 – 9 | CEV core |
| 10 – 19 | `community-commerce-vue` |
| 20 – 29 | `community-events-vue` (if split) |
| 30 – 39 | future companion packages |
| 50+ | host app custom migrations |

### Peer version contract

Companions declare their CEV peer dependency and version requirement.
`defineExtension()` validates at install time:

```json
{ "peerDependencies": { "@bettertogether/community-engine-vue": "^0.2.0" } }
```

If the installed CEV version doesn't satisfy the companion's declared range,
`defineExtension()` throws a clear error at app startup — no silent failures.
