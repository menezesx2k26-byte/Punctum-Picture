CREATE TABLE `admin_credentials` (
	`id` integer PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`password_iterations` integer NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL
);
