-- Phase 4 replaces the mutable SiteConfig singleton with one mutable draft,
-- immutable published snapshots and explicit pointers. The old site_config
-- table remains only as a one-time bootstrap source for existing installs.

CREATE TABLE site_config_versions (
  id TEXT PRIMARY KEY,
  schema_version INTEGER NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('draft', 'published')),
  revision INTEGER NOT NULL CHECK (revision >= 1),
  config_json TEXT NOT NULL,
  based_on_version_id TEXT,
  restored_from_version_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT,
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  published_by TEXT,
  FOREIGN KEY (based_on_version_id) REFERENCES site_config_versions(id) ON DELETE SET NULL,
  FOREIGN KEY (restored_from_version_id) REFERENCES site_config_versions(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_site_config_versions_single_draft
  ON site_config_versions(state)
  WHERE state = 'draft';

CREATE INDEX idx_site_config_versions_published_at
  ON site_config_versions(state, published_at DESC);

CREATE TABLE site_config_pointers (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  draft_version_id TEXT NOT NULL,
  published_version_id TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (draft_version_id) REFERENCES site_config_versions(id),
  FOREIGN KEY (published_version_id) REFERENCES site_config_versions(id)
);

-- Existing Phase 2/3 installs already have a complete SiteConfig in the
-- singleton. Preserve it byte-for-byte as the first published snapshot.
INSERT INTO site_config_versions (
  id, schema_version, state, revision, config_json, based_on_version_id,
  restored_from_version_id, created_at, updated_at, published_at,
  created_by, updated_by, published_by
)
SELECT
  'site-published-initial', schema_version, 'published', 1, config_json, NULL,
  NULL, updated_at, updated_at, updated_at, updated_by, updated_by, updated_by
FROM site_config
WHERE id = 1;

INSERT INTO site_config_versions (
  id, schema_version, state, revision, config_json, based_on_version_id,
  restored_from_version_id, created_at, updated_at, published_at,
  created_by, updated_by, published_by
)
SELECT
  'site-draft-current', schema_version, 'draft', 1, config_json,
  'site-published-initial', NULL, updated_at, updated_at, NULL,
  updated_by, updated_by, NULL
FROM site_config
WHERE id = 1;

INSERT INTO site_config_pointers (
  id, draft_version_id, published_version_id, updated_at
)
SELECT
  1, 'site-draft-current', 'site-published-initial', updated_at
FROM site_config
WHERE id = 1;
