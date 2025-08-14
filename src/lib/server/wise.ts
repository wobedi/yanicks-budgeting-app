import { env } from '$env/dynamic/private';

interface WiseActivity {
	id: string;
	type: string;
	resource: any;
	title: string;
	description: string;
	primaryAmount: string;
	secondaryAmount: string;
	status: string;
	createdOn: string;
	updatedOn: string;
}

interface WiseBalance {
	id: string;
	currency: string;
	type: string;
	name: string;
	amount: {
		value: number;
		currency: string;
	};
}

interface WiseActivitiesResponse {
	cursor: string;
	activities: WiseActivity[];
}

export class WiseAPI {
	private apiKey: string;
	private profileId: string;
	private baseURL = 'https://api.wise.com';

	constructor() {
		if (!env.WISE_API_KEY) throw new Error('WISE_API_KEY is not set');
		if (!env.WISE_PROFILE_ID) throw new Error('WISE_PROFILE_ID is not set');

		this.apiKey = env.WISE_API_KEY;
		this.profileId = env.WISE_PROFILE_ID;
	}

	private async request(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			throw new Error(`Wise API error: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	async getBalances(): Promise<WiseBalance[]> {
		return this.request(`/v4/profiles/${this.profileId}/balances?types=STANDARD`);
	}

	async getActivities(
		options: {
			since?: string;
			until?: string;
			size?: number;
			nextCursor?: string;
		} = {}
	): Promise<WiseActivitiesResponse> {
		const params = new URLSearchParams();
		if (options.since) params.append('since', options.since);
		if (options.until) params.append('until', options.until);
		if (options.size) params.append('size', options.size.toString());
		if (options.nextCursor) params.append('nextCursor', options.nextCursor);

		const query = params.toString() ? `?${params.toString()}` : '';
		return this.request(`/v1/profiles/${this.profileId}/activities${query}`);
	}

	async getBalanceStatement(
		balanceId: string,
		options: {
			currency: string;
			intervalStart: string;
			intervalEnd: string;
			type?: 'COMPACT' | 'FLAT';
		}
	) {
		const params = new URLSearchParams({
			currency: options.currency,
			intervalStart: options.intervalStart,
			intervalEnd: options.intervalEnd,
			type: options.type || 'COMPACT'
		});

		return this.request(
			`/v1/profiles/${this.profileId}/balance-statements/${balanceId}/statement.json?${params.toString()}`
		);
	}

	normalizeActivity(activity: WiseActivity) {
		const parsedAmount = this.parseAmount(activity.primaryAmount, activity.type);
		
		return {
			id: activity.id,
			amount: parsedAmount.value,
			currency: parsedAmount.currency,
			description: activity.description || this.cleanTitle(activity.title) || 'Unknown transaction',
			date: activity.createdOn || new Date().toISOString(),
			type: activity.type,
			status: activity.status,
			rawData: activity
		};
	}

	private parseAmount(amountString: string, activityType?: string): { value: number; currency: string } {
		if (!amountString) {
			return { value: 0, currency: 'EUR' };
		}

		// Handle positive amounts like "<positive>+ 3,413.59 USD</positive>"
		let cleanAmount = amountString.replace(/<\/?positive>/g, '').trim();
		
		// Remove + sign and handle negative amounts
		let isNegative = false;
		if (cleanAmount.startsWith('+')) {
			cleanAmount = cleanAmount.substring(1).trim();
		} else if (cleanAmount.startsWith('-')) {
			isNegative = true;
			cleanAmount = cleanAmount.substring(1).trim();
		}

		// Extract currency (last 3 characters typically)
		const parts = cleanAmount.split(' ');
		const currency = parts[parts.length - 1] || 'EUR';
		
		// Extract numeric value
		const numericPart = parts.slice(0, -1).join(' ').replace(/,/g, '');
		let value = parseFloat(numericPart) || 0;
		
		// Make expenses negative (most transactions are expenses)
		// Positive amounts are explicitly marked or are incoming transfers
		const isPositiveAmount = amountString.includes('<positive>') || 
			(activityType === 'TRANSFER' && amountString.includes('+'));
		
		if (!isPositiveAmount && !isNegative) {
			value = -value;
		} else if (isNegative) {
			value = -value;
		}

		return { value, currency };
	}

	private cleanTitle(title: string): string {
		// Remove HTML tags like <strong>Netflix</strong>
		return title.replace(/<[^>]*>/g, '').trim();
	}
}
