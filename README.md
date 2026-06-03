# Personal CFO Agent

A **Personal CFO** web MVP (v0.1) built with **Next.js** and deployable on **Vercel**. Track monthly cash flow, net worth goals, transaction spending, and download a YTD financial statement — all in the browser with **no database**, **no login**, and **no external APIs**.

## Features

- **Financial Setup** (sidebar): goals, balances, tolerance, current month
- **Dashboard**: income, expenses, cash flow, net worth, goal progress & status (Green / Yellow / Red)
- **CSV upload**: categorize transactions by description rules
- **Spending breakdown**: table + bar chart by category
- **YTD report**: Markdown preview + download

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Client-side state only (like Streamlit `session_state`)

> **Note:** Streamlit cannot run on Vercel. This project was migrated to Next.js for Vercel deployment while keeping the same MVP behavior.

## Project Structure

```
personal-cfo-agent/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── categorizer.ts
│   ├── calculations.ts
│   ├── csv.ts
│   ├── reportGenerator.ts
│   └── types.ts
├── public/
│   └── sample_data/
│       └── sample_transactions.csv
├── package.json
└── README.md
```

## Local Run

```bash
cd personal-cfo-agent
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Upload `public/sample_data/sample_transactions.csv` to test categorization and charts.

## CSV Format

| Column        | Description                          |
|---------------|--------------------------------------|
| `Date`        | Transaction date (e.g. `2025-01-05`) |
| `Description` | Payee or memo text                   |
| `Amount`      | Negative = expense, positive = income |

```csv
Date,Description,Amount
2025-01-05,STARBUCKS COFFEE,-5.75
2025-01-20,PAYROLL DEPOSIT,4500.00
```

- Only rows with **Amount < 0** count as expenses.
- Expense amounts are shown as **positive numbers** in the UI.

## Deploy to Vercel

### Option A: Vercel Dashboard (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** → import `personal-cfo-agent`.
4. Vercel auto-detects **Next.js** — leave defaults and click **Deploy**.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow prompts to link the project. Production URL will look like `https://personal-cfo-agent.vercel.app`.

### Notes

- No environment variables required for this MVP.
- Data lives in browser memory only (resets on refresh).
- Free tier is sufficient for personal demos.

## Goal Status Rules

| Status | Condition                    |
|--------|------------------------------|
| Green  | progress ≥ 100% − tolerance  |
| Yellow | progress ≥ 90% − tolerance   |
| Red    | below Yellow threshold       |

Default tolerance: **5%**.

## License

MIT — use and modify freely for learning and personal finance experiments.
