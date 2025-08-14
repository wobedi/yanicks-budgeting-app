# Personal Budgeting App

A SvelteKit web app for personal budgeting with Wise bank integration and automatic transaction categorization.

## Features

- **Wise API Integration**: Automatically import transactions from your Wise account
- **AI Categorization**: Uses OpenAI to automatically categorize transactions
- **Manual Categorization**: Edit categories manually in the UI
- **Month Filtering**: Filter transactions and spending by calendar month
- **Spending Analysis**: View spending breakdown by category

## Setup

1. **Install dependencies:**

   ```sh
   pnpm install
   ```

2. **Set up environment variables:**

   ```sh
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   - `WISE_API_KEY`: Get from [Wise Business Developer Portal](https://wise.com/gb/business/developer/)
   - `WISE_PROFILE_ID`: Your Wise profile ID
   - `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

3. **Set up the database:**
   ```sh
   pnpm db:push
   ```

## Development

Start the development server:

```sh
pnpm dev
```

## Usage

1. Click "Import Transactions" to fetch transactions from your Wise account
2. Use the month filter to view transactions for specific months
3. Click on any category field to manually edit transaction categories
4. View spending breakdown by category in the right panel

## Database

The app uses SQLite with Drizzle ORM. Database commands:

- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate migration files
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Building

To create a production build:

```sh
pnpm build
```

Preview the production build:

```sh
pnpm preview
```
