import { TransactionService } from '$lib/server/transaction-service';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const { category } = await request.json();
		const transactionId = parseInt(params.id);

		if (!category || isNaN(transactionId)) {
			return json(
				{
					success: false,
					message: 'Invalid category or transaction ID'
				},
				{ status: 400 }
			);
		}

		const transactionService = new TransactionService();
		await transactionService.updateTransactionCategory(transactionId, category);

		return json({
			success: true,
			message: 'Transaction category updated'
		});
	} catch (error) {
		console.error('Update error:', error);
		return json(
			{
				success: false,
				message: 'Failed to update transaction'
			},
			{ status: 500 }
		);
	}
};
