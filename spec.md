# Spec

## 1. Background

Yanick wants to create a personal budgeting web app for himself.

The web app should show him his spending by category over time, using data from his Wise bank account (and in the future also other accounts).

## 2. Scope

### Version 1

- Automatically (maybe periodically) import transactions from his Wise account via API and save them in a databaser
- Automatically categorize each transaction using a simple LLM AI API call
- Display transactions in a table, support filtering by calendar month
- Display "spend by category over time" in a table, support filtering by calendar month
- Allow manual (re-)categorization in the UI (free text)
- Run locally (cloud deployment comes later)

### Later (dont code yet)

- Get data from other accounts, like N26 bank and PayPal
- Graphs/Visualization
- Cloud deployment
- Weekly & Monthly Digest email
- Email alerts (e.g. thresholds per % of month or dynamic based on last x months)
- UI flow to add a transaction

## 3. System Design

### Stack

- SvelteKit with Svelte 5
- TypeScript, latest version
- Tailwind, latest version
- DB: SQLite (local only for Version 1, later maybe something like Turso for cloud sync)
- ORM: Drizzle
