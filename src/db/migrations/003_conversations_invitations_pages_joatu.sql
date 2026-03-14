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
