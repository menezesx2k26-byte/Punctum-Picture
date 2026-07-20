import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  tagline: text("tagline"),
  aboutText: text("about_text"),
  whatsappE164: text("whatsapp_e164"),
  whatsappMessage: text("whatsapp_message"),
  instagramUrl: text("instagram_url"),
  contactEmail: text("contact_email"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  updatedAt: text("updated_at").notNull(),
});

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("idx_categories_visible_sort").on(table.isVisible, table.sortOrder)],
);

export const albums = sqliteTable(
  "albums",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    location: text("location"),
    shootDate: text("shoot_date"),
    status: text("status", { enum: ["draft", "published", "archived"] }).notNull(),
    coverImageId: text("cover_image_id"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    index("idx_albums_status_published_at").on(table.status, table.publishedAt),
    index("idx_albums_featured_sort").on(table.featured, table.sortOrder),
  ],
);

export const albumCategories = sqliteTable(
  "album_categories",
  {
    albumId: text("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.albumId, table.categoryId] }),
    index("idx_album_categories_category_album").on(table.categoryId, table.albumId),
  ],
);

export const images = sqliteTable(
  "images",
  {
    id: text("id").primaryKey(),
    albumId: text("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    originalKey: text("original_key").notNull().unique(),
    originalFilename: text("original_filename"),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    checksum: text("checksum"),
    altText: text("alt_text"),
    focalX: real("focal_x"),
    focalY: real("focal_y"),
    position: integer("position").notNull(),
    status: text("status", { enum: ["pending", "ready", "failed"] }).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => [index("idx_images_album_position").on(table.albumId, table.position)],
);

export const uploadIntents = sqliteTable(
  "upload_intents",
  {
    id: text("id").primaryKey(),
    albumId: text("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    imageId: text("image_id")
      .notNull()
      .references(() => images.id, { onDelete: "cascade" }),
    objectKey: text("object_key").notNull().unique(),
    originalFilename: text("original_filename").notNull(),
    expectedMime: text("expected_mime").notNull(),
    expectedSize: integer("expected_size").notNull(),
    status: text("status", {
      enum: ["pending", "uploaded", "completed", "expired", "failed"],
    }).notNull(),
    createdBy: text("created_by").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull(),
    completedAt: text("completed_at"),
    errorMessage: text("error_message"),
  },
  (table) => [index("idx_upload_intents_status_expires").on(table.status, table.expiresAt)],
);

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    instagram: text("instagram"),
    service: text("service"),
    desiredDate: text("desired_date"),
    message: text("message").notNull(),
    status: text("status", { enum: ["new", "read", "archived"] })
      .notNull()
      .default("new"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("idx_inquiries_status_created").on(table.status, table.createdAt)],
);

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorEmail: text("actor_email").notNull(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    dataJson: text("data_json"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("idx_audit_log_created_at").on(table.createdAt)],
);

export const rateLimitBuckets = sqliteTable(
  "rate_limit_buckets",
  {
    bucketKey: text("bucket_key").primaryKey(),
    requestCount: integer("request_count").notNull(),
    windowStartedAt: text("window_started_at").notNull(),
    expiresAt: text("expires_at").notNull(),
  },
  (table) => [index("idx_rate_limit_expires").on(table.expiresAt)],
);

export const backupRuns = sqliteTable(
  "backup_runs",
  {
    id: text("id").primaryKey(),
    objectKey: text("object_key").notNull(),
    status: text("status", { enum: ["completed", "failed"] }).notNull(),
    rowCountsJson: text("row_counts_json"),
    createdAt: text("created_at").notNull(),
    errorMessage: text("error_message"),
  },
  (table) => [index("idx_backup_runs_created").on(table.createdAt)],
);

export const adminCredentials = sqliteTable("admin_credentials", {
  id: integer("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  passwordIterations: integer("password_iterations").notNull(),
  updatedAt: text("updated_at").notNull(),
  updatedBy: text("updated_by").notNull(),
});
