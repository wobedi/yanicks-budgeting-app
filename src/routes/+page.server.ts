import { TransactionService } from '$lib/server/transaction-service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const transactionService = new TransactionService();

	const month = url.searchParams.get('month') || undefined;

	const transactions = await transactionService.getTransactions(month);
	const spendingByCategory = await transactionService.getSpendingByCategory(month);

	return {
		transactions,
		spendingByCategory,
		selectedMonth: month
	};
};
