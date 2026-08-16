PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_line_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_id` integer NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`discount` text DEFAULT '0' NOT NULL,
	`tax` text DEFAULT '0' NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "unit_price_min_check" CHECK("__new_line_items"."unit_price" >= 1)
);
--> statement-breakpoint
INSERT INTO `__new_line_items`("id", "document_id", "description", "quantity", "unit_price", "discount", "tax") SELECT "id", "document_id", "description", "quantity", "unit_price", "discount", "tax" FROM `line_items`;--> statement-breakpoint
DROP TABLE `line_items`;--> statement-breakpoint
ALTER TABLE `__new_line_items` RENAME TO `line_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;