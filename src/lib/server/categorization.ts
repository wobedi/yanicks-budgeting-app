import { env } from '$env/dynamic/private';

interface CategorizationRequest {
	description: string;
	amount: number;
	currency: string;
	merchantName?: string;
}

export class CategorizationService {
	private apiKey: string;
	private apiUrl: string;

	constructor() {
		if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
		this.apiKey = env.OPENAI_API_KEY;
		this.apiUrl = 'https://api.openai.com/v1/chat/completions';
	}

	async categorizeTransaction(request: CategorizationRequest): Promise<string> {
		const prompt = `Categorize this financial transaction into one of these categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Income
- Transfers
- Other

Transaction details:
- Description: ${request.description}
- Amount: ${request.amount} ${request.currency}
${request.merchantName ? `- Merchant: ${request.merchantName}` : ''}

Return only the category name, nothing else.`;

		try {
			const response = await fetch(this.apiUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: 'user',
							content: prompt
						}
					],
					max_tokens: 50,
					temperature: 0.1
				})
			});

			if (!response.ok) {
				throw new Error(`OpenAI API error: ${response.status}`);
			}

			const data = await response.json();
			const category = data.choices[0]?.message?.content?.trim() || 'Other';

			return category;
		} catch (error) {
			console.error('Error categorizing transaction:', error);
			return 'Other';
		}
	}

	async categorizeTransactions(transactions: CategorizationRequest[]): Promise<string[]> {
		const categories = [];

		for (const transaction of transactions) {
			const category = await this.categorizeTransaction(transaction);
			categories.push(category);
		}

		return categories;
	}
}
