DROP TABLE `todos`;--> statement-breakpoint
ALTER TABLE `documents` ADD `customer` integer DEFAULT (unixepoch());