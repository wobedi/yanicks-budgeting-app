CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`wise_transaction_id` text,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`category` text,
	`merchant_name` text,
	`merchant_category` text,
	`raw_data` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_wise_transaction_id_unique` ON `transactions` (`wise_transaction_id`);