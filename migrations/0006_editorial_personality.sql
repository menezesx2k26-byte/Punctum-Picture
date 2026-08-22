-- Phase 2 keeps the complete presentation contract in one validated unit.
-- This is intentionally a mutable singleton until immutable snapshots and
-- draft/publish pointers are introduced in a later phase.

CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  schema_version INTEGER NOT NULL,
  config_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);
