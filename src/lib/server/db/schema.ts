import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
	id: integer('id').primaryKey(),
	wiseTransactionId: text('wise_transaction_id').unique(),
	amount: real('amount').notNull(),
	currency: text('currency').notNull(),
	description: text('description').notNull(),
	date: text('date').notNull(),
	category: text('category'),
	merchantName: text('merchant_name'),
	merchantCategory: text('merchant_category'),
	rawData: text('raw_data', { mode: 'json' }),
	createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
	updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP')
});
