PRAGMA foreign_keys = ON;

CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  brand_name TEXT NOT NULL,
  tagline TEXT,
  about_text TEXT,
  whatsapp_e164 TEXT,
  whatsapp_message TEXT,
  instagram_url TEXT,
  contact_email TEXT,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  location TEXT,
  shoot_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft','published','archived')),
  cover_image_id TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE TABLE album_categories (
  album_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (album_id, category_id),
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE images (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL,
  original_key TEXT NOT NULL UNIQUE,
  original_filename TEXT,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  checksum TEXT,
  alt_text TEXT,
  focal_x REAL,
  focal_y REAL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','ready','failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

CREATE TABLE upload_intents (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL,
  image_id TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  expected_mime TEXT NOT NULL,
  expected_size INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','uploaded','completed','expired','failed')),
  created_by TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  error_message TEXT,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  service TEXT,
  desired_date TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','archived')),
  created_at TEXT NOT NULL
);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  data_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_albums_status_published_at ON albums(status, published_at);
CREATE INDEX idx_albums_featured_sort ON albums(featured, sort_order);
CREATE INDEX idx_images_album_position ON images(album_id, position);
CREATE INDEX idx_album_categories_category_album ON album_categories(category_id, album_id);
CREATE INDEX idx_categories_visible_sort ON categories(is_visible, sort_order);
CREATE INDEX idx_upload_intents_status_expires ON upload_intents(status, expires_at);
CREATE INDEX idx_inquiries_status_created ON inquiries(status, created_at);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
