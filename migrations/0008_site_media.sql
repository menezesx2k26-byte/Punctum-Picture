CREATE TABLE IF NOT EXISTS site_media (
  id TEXT PRIMARY KEY NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('hero')),
  storage_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'ready', 'failed')),
  width INTEGER,
  height INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_media_role_status_created
  ON site_media(role, status, created_at DESC);
