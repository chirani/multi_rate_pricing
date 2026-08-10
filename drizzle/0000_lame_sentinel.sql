CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`title` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `line_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`discount` integer DEFAULT 0 NOT NULL,
	`tax` integer,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "unit_price_min_check" CHECK("line_items"."unit_price" >= 1),
	CONSTRAINT "tax_min_check" CHECK("line_items"."tax" >= 0),
	CONSTRAINT "discount_min_check" CHECK("line_items"."discount" >= 0)
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
