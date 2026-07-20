CREATE TABLE rate_limit_buckets (
  bucket_key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL,
  window_started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX idx_rate_limit_expires ON rate_limit_buckets(expires_at);

CREATE TABLE backup_runs (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed','failed')),
  row_counts_json TEXT,
  created_at TEXT NOT NULL,
  error_message TEXT
);

CREATE INDEX idx_backup_runs_created ON backup_runs(created_at);
