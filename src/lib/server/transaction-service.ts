import { db } from './db';
import { transactions } from './db/schema';
import { WiseAPI } from './wise';
import { CategorizationService } from './categorization';
import { eq, sql, desc } from 'drizzle-orm';

export class TransactionService {
	private wiseAPI: WiseAPI;
	private categorizationService: CategorizationService;

	constructor() {
		this.wiseAPI = new WiseAPI();
		this.categorizationService = new CategorizationService();
	}

	async importTransactions() {
		try {
			const activitiesResponse = await this.wiseAPI.getActivities({
				size: 100
			});

			const newTransactions = [];

			for (const activity of activitiesResponse.activities) {
				const existingTransaction = await db
					.select()
					.from(transactions)
					.where(eq(transactions.wiseTransactionId, activity.id))
					.limit(1);

				if (existingTransaction.length === 0) {
					// Skip cancelled transactions and card checks
					if (activity.status === 'CANCELLED' || activity.type === 'CARD_CHECK') {
						continue;
					}

					const normalized = this.wiseAPI.normalizeActivity(activity);

					// Skip transactions with invalid data
					if (typeof normalized.amount !== 'number' || !normalized.currency || !normalized.description) {
						console.log('Skipping transaction with missing data:', {
							id: activity.id,
							amount: normalized.amount,
							currency: normalized.currency,
							description: normalized.description,
							originalActivity: activity
						});
						continue;
					}

					// Auto-categorize the transaction
					const category = await this.categorizationService.categorizeTransaction({
						description: normalized.description,
						amount: normalized.amount,
						currency: normalized.currency
					});

					newTransactions.push({
						wiseTransactionId: activity.id,
						amount: normalized.amount,
						currency: normalized.currency,
						description: normalized.description,
						date: normalized.date,
						category,
						rawData: normalized.rawData
					});
				}
			}

			if (newTransactions.length > 0) {
				await db.insert(transactions).values(newTransactions);
				console.log(`Imported ${newTransactions.length} new transactions`);
			}

			return newTransactions.length;
		} catch (error) {
			console.error('Error importing transactions:', error);
			throw error;
		}
	}

	async getTransactions(month?: string) {
		if (month) {
			// Parse YYYY-MM format
			const [year, monthNum] = month.split('-').map(Number);
			const startDate = new Date(year, monthNum - 1, 1);
			const endDate = new Date(year, monthNum, 0); // Last day of the month

			const startDateStr = startDate.toISOString().split('T')[0];
			const endDateStr = endDate.toISOString().split('T')[0];

			return db
				.select()
				.from(transactions)
				.where(sql`DATE(${transactions.date}) BETWEEN ${startDateStr} AND ${endDateStr}`)
				.orderBy(desc(transactions.date));
		}

		return db.select().from(transactions).orderBy(desc(transactions.date));
	}

	async updateTransactionCategory(id: number, category: string) {
		return db
			.update(transactions)
			.set({
				category,
				updatedAt: new Date().toISOString()
			})
			.where(eq(transactions.id, id));
	}

	async getSpendingByCategory(month?: string) {
		const allTransactions = await this.getTransactions(month);

		const spending: Record<string, number> = {};

		for (const transaction of allTransactions) {
			// Only count negative transactions (expenses)
			if (transaction.amount < 0) {
				const category = transaction.category || 'Uncategorized';
				spending[category] = (spending[category] || 0) + Math.abs(transaction.amount);
			}
		}

		return Object.entries(spending)
			.map(([category, amount]) => ({ category, amount }))
			.sort((a, b) => b.amount - a.amount);
	}
}
