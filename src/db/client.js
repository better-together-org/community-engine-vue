import { PGlite } from '@electric-sql/pglite'

// SQL migration inlined to avoid Vite ?raw import complexity
const migrationSql = `
CREATE TABLE IF NOT EXISTS people (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT,
  identifier           TEXT,
  name                 TEXT,
  privacy              TEXT DEFAULT 'public',
  locale               TEXT,
  time_zone            TEXT,
  profile_image_url    TEXT,
  cover_image_url      TEXT,
  email                TEXT,
  handle               TEXT,
  notify_by_email      INTEGER DEFAULT 0,
  receive_messages     INTEGER DEFAULT 0,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS communities (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT,
  identifier           TEXT,
  name                 TEXT,
  description          TEXT,
  privacy              TEXT DEFAULT 'public',
  protected            INTEGER DEFAULT 0,
  host                 INTEGER DEFAULT 0,
  profile_image_url    TEXT,
  cover_image_url      TEXT,
  logo_url             TEXT,
  creator_id           TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT,
  title                TEXT,
  content              TEXT,
  privacy              TEXT DEFAULT 'public',
  published_at         TEXT,
  author_id            TEXT,
  community_id         TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT,
  name                 TEXT,
  description          TEXT,
  starts_at            TEXT,
  ends_at              TEXT,
  privacy              TEXT DEFAULT 'public',
  community_id         TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS conversations (
  id                   TEXT PRIMARY KEY,
  subject              TEXT,
  community_id         TEXT,
  creator_id           TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id                   TEXT PRIMARY KEY,
  content              TEXT,
  conversation_id      TEXT,
  author_id            TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id                   TEXT PRIMARY KEY,
  message              TEXT,
  read                 INTEGER DEFAULT 0,
  notifiable_type      TEXT,
  notifiable_id        TEXT,
  person_id            TEXT,
  created_at           TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS navigation_areas (
  id                   TEXT PRIMARY KEY,
  slug                 TEXT,
  name                 TEXT,
  position             TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id                   TEXT PRIMARY KEY,
  label                TEXT,
  url                  TEXT,
  path                 TEXT,
  external             INTEGER DEFAULT 0,
  sort_order           INTEGER DEFAULT 0,
  navigation_area_id   TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS _schema_versions (
  version    INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

INSERT OR IGNORE INTO _schema_versions (version) VALUES (1);
`

const migration2Sql = `
CREATE TABLE IF NOT EXISTS person_community_memberships (
  id                   TEXT PRIMARY KEY,
  person_id            TEXT NOT NULL,
  community_id         TEXT NOT NULL,
  role                 TEXT DEFAULT 'member',
  joined_at            TEXT,
  left_at              TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

CREATE TABLE IF NOT EXISTS uploads (
  id                   TEXT PRIMARY KEY,
  url                  TEXT,
  content_type         TEXT,
  filename             TEXT,
  filesize             INTEGER,
  attachable_type      TEXT,
  attachable_id        TEXT,
  _sync_status         TEXT NOT NULL DEFAULT 'local',
  _local_updated       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at           TEXT
);

INSERT OR IGNORE INTO _schema_versions (version) VALUES (2);
`

const migration3Sql = `
CREATE TABLE IF NOT EXISTS invitations (
  id              TEXT PRIMARY KEY,
  email           TEXT,
  name            TEXT,
  token           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  message         TEXT,
  community_id    TEXT,
  inviter_id      TEXT,
  invitee_id      TEXT,
  expires_at      TEXT,
  _sync_status    TEXT NOT NULL DEFAULT 'local',
  _local_updated  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at      TEXT
);

CREATE TABLE IF NOT EXISTS pages (
  id              TEXT PRIMARY KEY,
  slug            TEXT,
  title           TEXT,
  content         TEXT,
  privacy         TEXT DEFAULT 'public',
  published_at    TEXT,
  community_id    TEXT,
  author_id       TEXT,
  _sync_status    TEXT NOT NULL DEFAULT 'local',
  _local_updated  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at      TEXT
);

CREATE TABLE IF NOT EXISTS joa_tu_offers (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  time_credits    INTEGER NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'open',
  category        TEXT,
  community_id    TEXT,
  offerer_id      TEXT,
  _sync_status    TEXT NOT NULL DEFAULT 'local',
  _local_updated  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at      TEXT
);

CREATE TABLE IF NOT EXISTS joa_tu_requests (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  time_credits    INTEGER NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'open',
  category        TEXT,
  community_id    TEXT,
  requester_id    TEXT,
  _sync_status    TEXT NOT NULL DEFAULT 'local',
  _local_updated  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at      TEXT
);

CREATE TABLE IF NOT EXISTS joa_tu_agreements (
  id              TEXT PRIMARY KEY,
  time_credits    INTEGER NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'pending',
  notes           TEXT,
  offer_id        TEXT,
  request_id      TEXT,
  provider_id     TEXT,
  receiver_id     TEXT,
  community_id    TEXT,
  agreed_at       TEXT,
  completed_at    TEXT,
  _sync_status    TEXT NOT NULL DEFAULT 'local',
  _local_updated  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  _server_at      TEXT
);

INSERT OR IGNORE INTO _schema_versions (version) VALUES (3);
`

// Extension migrations registered by companion packages before getDb() is first called
const _extensionMigrations = []  // { version: number, sql: string }[]

export function registerExtensionMigration(version, sql) {
  _extensionMigrations.push({ version, sql })
}

let _db = null
let _initPromise = null

async function applyMigrations(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS _schema_versions (
      version    INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `)
  const { rows } = await db.query('SELECT MAX(version) AS v FROM _schema_versions')
  const currentVersion = rows[0]?.v ?? 0

  if (currentVersion < 1) {
    await db.exec(migrationSql)
  }

  if (currentVersion < 2) {
    await db.exec(migration2Sql)
  }

  if (currentVersion < 3) {
    await db.exec(migration3Sql)
  }

  // Extension migrations (sorted by version, registered before first getDb() call)
  const sortedExtMigrations = [..._extensionMigrations].sort((a, b) => a.version - b.version)
  for (const { version, sql } of sortedExtMigrations) {
    if (currentVersion < version) {
      await db.exec(sql)
    }
  }
}

async function initDb() {
  const db = new PGlite('idb://community-engine')
  await applyMigrations(db)
  return db
}

export async function getDb() {
  if (_db) return _db
  if (!_initPromise) _initPromise = initDb()
  _db = await _initPromise
  return _db
}

export function resetDb() {
  _db = null
  _initPromise = null
}
