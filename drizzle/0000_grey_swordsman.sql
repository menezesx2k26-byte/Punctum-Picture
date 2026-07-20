CREATE TABLE `album_categories` (
	`album_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`album_id`, `category_id`),
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_album_categories_category_album` ON `album_categories` (`category_id`,`album_id`);--> statement-breakpoint
CREATE TABLE `albums` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`description` text,
	`location` text,
	`shoot_date` text,
	`status` text NOT NULL,
	`cover_image_id` text,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `albums_slug_unique` ON `albums` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_albums_status_published_at` ON `albums` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_albums_featured_sort` ON `albums` (`featured`,`sort_order`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`data_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_log_created_at` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `backup_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`status` text NOT NULL,
	`row_counts_json` text,
	`created_at` text NOT NULL,
	`error_message` text
);
--> statement-breakpoint
CREATE INDEX `idx_backup_runs_created` ON `backup_runs` (`created_at`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_categories_visible_sort` ON `categories` (`is_visible`,`sort_order`);--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`album_id` text NOT NULL,
	`original_key` text NOT NULL,
	`original_filename` text,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`width` integer,
	`height` integer,
	`checksum` text,
	`alt_text` text,
	`focal_x` real,
	`focal_y` real,
	`position` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `images_original_key_unique` ON `images` (`original_key`);--> statement-breakpoint
CREATE INDEX `idx_images_album_position` ON `images` (`album_id`,`position`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`instagram` text,
	`service` text,
	`desired_date` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_status_created` ON `inquiries` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limit_buckets` (
	`bucket_key` text PRIMARY KEY NOT NULL,
	`request_count` integer NOT NULL,
	`window_started_at` text NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rate_limit_expires` ON `rate_limit_buckets` (`expires_at`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`brand_name` text NOT NULL,
	`tagline` text,
	`about_text` text,
	`whatsapp_e164` text,
	`whatsapp_message` text,
	`instagram_url` text,
	`contact_email` text,
	`seo_title` text,
	`seo_description` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `upload_intents` (
	`id` text PRIMARY KEY NOT NULL,
	`album_id` text NOT NULL,
	`image_id` text NOT NULL,
	`object_key` text NOT NULL,
	`original_filename` text NOT NULL,
	`expected_mime` text NOT NULL,
	`expected_size` integer NOT NULL,
	`status` text NOT NULL,
	`created_by` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	`completed_at` text,
	`error_message` text,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `upload_intents_object_key_unique` ON `upload_intents` (`object_key`);--> statement-breakpoint
CREATE INDEX `idx_upload_intents_status_expires` ON `upload_intents` (`status`,`expires_at`);--> statement-breakpoint
INSERT INTO `site_settings` (
	`id`,
	`brand_name`,
	`tagline`,
	`about_text`,
	`whatsapp_message`,
	`seo_title`,
	`seo_description`,
	`updated_at`
) VALUES (
	1,
	'Punctum Picture',
	'Fotografia autoral de pessoas, ritos, palcos e movimento.',
	'O trabalho de Maria Helena se aproxima sem invadir. Busca a textura dos lugares, a verdade dos gestos e o instante em que uma pessoa deixa de posar para simplesmente estar.',
	'Olá, Maria Helena! Gostaria de conversar sobre um ensaio.',
	'Punctum Picture — fotografia autoral',
	'Fotografias de Maria Helena que preservam presença, gesto e movimento.',
	'2026-07-20T00:00:00.000Z'
);--> statement-breakpoint
INSERT INTO `categories` (
	`id`, `name`, `slug`, `description`, `sort_order`, `is_visible`, `created_at`, `updated_at`
) VALUES
	('seed-casamentos', 'Casamentos', 'casamentos', 'Histórias de casamento e celebrações.', 1000, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
	('seed-ensaios', 'Ensaios', 'ensaios', 'Retratos, casais e narrativas pessoais.', 2000, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z');
