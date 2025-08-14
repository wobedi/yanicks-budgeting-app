import { TransactionService } from '$lib/server/transaction-service';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	try {
		const transactionService = new TransactionService();
		const importedCount = await transactionService.importTransactions();

		return json({
			success: true,
			message: `Imported ${importedCount} new transactions`
		});
	} catch (error) {
		console.error('Import error:', error);
		return json(
			{
				success: false,
				message: 'Failed to import transactions'
			},
			{ status: 500 }
		);
	}
};
