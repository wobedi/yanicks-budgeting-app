<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: PageData;

	let isImporting = false;

	async function importTransactions() {
		isImporting = true;
		try {
			const response = await fetch('/api/import', { method: 'POST' });
			const result = await response.json();

			if (result.success) {
				location.reload();
			} else {
				alert('Import failed: ' + result.message);
			}
		} catch (error) {
			alert('Import failed: ' + error);
		} finally {
			isImporting = false;
		}
	}

	async function updateCategory(transactionId: number, newCategory: string) {
		try {
			const response = await fetch(`/api/transactions/${transactionId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ category: newCategory })
			});

			const result = await response.json();
			if (result.success) {
				location.reload();
			} else {
				alert('Update failed: ' + result.message);
			}
		} catch (error) {
			alert('Update failed: ' + error);
		}
	}

	function handleMonthChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const month = target.value;

		if (month) {
			goto(`?month=${month}`);
		} else {
			goto('/');
		}
	}

	// Generate month options for the last 12 months
	function getMonthOptions() {
		const options = [];
		const now = new Date();

		for (let i = 0; i < 12; i++) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const displayStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

			options.push({ value: monthStr, display: displayStr });
		}

		return options;
	}
</script>

<div class="container mx-auto p-6">
	<header class="mb-8">
		<h1 class="mb-4 text-3xl font-bold text-gray-900">Personal Budgeting App</h1>

		<div class="flex items-center gap-4">
			<button
				onclick={importTransactions}
				disabled={isImporting}
				class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isImporting ? 'Importing...' : 'Import Transactions'}
			</button>

			<select
				onchange={handleMonthChange}
				value={data.selectedMonth || ''}
				class="rounded border border-gray-300 px-3 py-2"
			>
				<option value="">All transactions</option>
				{#each getMonthOptions() as option}
					<option value={option.value}>{option.display}</option>
				{/each}
			</select>
		</div>
	</header>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Transactions Table -->
		<section>
			<h2 class="mb-4 text-2xl font-semibold">Transactions</h2>

			{#if data.transactions.length === 0}
				<p class="text-gray-500">No transactions found. Try importing some transactions first.</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full border border-gray-200 bg-white">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
								<th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
								<th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
								<th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
							</tr>
						</thead>
						<tbody>
							{#each data.transactions as transaction}
								<tr class="border-t">
									<td class="px-4 py-2 text-sm">
										{new Date(transaction.date).toLocaleDateString()}
									</td>
									<td class="px-4 py-2 text-sm">{transaction.description}</td>
									<td class="px-4 py-2 font-mono text-sm">
										{transaction.amount.toFixed(2)}
										{transaction.currency}
									</td>
									<td class="px-4 py-2 text-sm">
										<input
											type="text"
											value={transaction.category || ''}
											onblur={(e) =>
												updateCategory(transaction.id, (e.target as HTMLInputElement).value)}
											class="w-full rounded border-none bg-transparent px-2 py-1 focus:border focus:border-gray-300 focus:bg-white"
											placeholder="Enter category"
										/>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<!-- Spending by Category -->
		<section>
			<h2 class="mb-4 text-2xl font-semibold">Spending by Category</h2>

			{#if data.spendingByCategory.length === 0}
				<p class="text-gray-500">No spending data available.</p>
			{:else}
				<div class="rounded border border-gray-200 bg-white">
					<table class="min-w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
								<th class="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
							</tr>
						</thead>
						<tbody>
							{#each data.spendingByCategory as item}
								<tr class="border-t">
									<td class="px-4 py-2 text-sm">{item.category}</td>
									<td class="px-4 py-2 text-right font-mono text-sm">
										{item.amount.toFixed(2)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>
	</div>
</div>
