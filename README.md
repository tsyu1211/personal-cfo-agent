# Personal CFO Agent

A local-first **Personal CFO** web MVP (v0.1) built with Streamlit. Track monthly cash flow, net worth goals, transaction spending, and download a YTD financial statement — all in the browser with **no database**, **no login**, and **no external APIs**.

## Features

- **Financial Setup** (sidebar): goals, balances, tolerance, current month
- **Dashboard**: income, expenses, cash flow, net worth, goal progress & status (Green / Yellow / Red)
- **CSV upload**: categorize transactions by description rules
- **Spending breakdown**: table + bar chart by category
- **YTD report**: Markdown preview + download

## Project Structure

```
personal-cfo-agent/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── sample_data/
│   └── sample_transactions.csv
└── src/
    ├── categorizer.py
    ├── calculations.py
    └── report_generator.py
```

## Local Run

1. **Clone or download** this repository.

2. **Create a virtual environment** (recommended):

   ```bash
   cd personal-cfo-agent
   python3 -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the app**:

   ```bash
   streamlit run app.py
   ```

5. Open the URL shown in the terminal (usually `http://localhost:8501`).

6. Try uploading `sample_data/sample_transactions.csv` to see categorization and charts.

## CSV Format

Your CSV must include these columns:

| Column      | Description                          |
|------------|--------------------------------------|
| `Date`     | Transaction date (e.g. `2025-01-05`) |
| `Description` | Payee or memo text              |
| `Amount`   | Negative = expense, positive = income |

**Example:**

```csv
Date,Description,Amount
2025-01-05,STARBUCKS COFFEE,-5.75
2025-01-20,PAYROLL DEPOSIT,4500.00
```

- Only rows with **Amount < 0** are counted as expenses.
- Expense amounts are shown as **positive numbers** in the UI.

## Deploy to GitHub

1. Create a new repository on GitHub (e.g. `personal-cfo-agent`).

2. From the project folder:

   ```bash
   git init
   git add .
   git commit -m "Initial Personal CFO Agent MVP v0.1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/personal-cfo-agent.git
   git push -u origin main
   ```

## Deploy to Streamlit Community Cloud

1. Push this repo to GitHub (see above).

2. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub.

3. Click **New app**.

4. Select your repository, branch (`main`), and main file path: **`app.py`**.

5. Click **Deploy**. Streamlit will install `requirements.txt` automatically.

6. After deploy, share the public URL. Session data stays in the browser per visit (no persistent server-side storage).

### Notes for Cloud

- No secrets or API keys are required for this MVP.
- Uploaded CSVs and sidebar values live in **session state** only; they reset when the session ends.
- For a permanent demo, users can re-upload the sample CSV each session.

## Goal Status Rules

Progress is compared to annual goals with a **tolerance** (default 5%):

| Status  | Condition                                      |
|---------|------------------------------------------------|
| Green   | progress ≥ 100% − tolerance                    |
| Yellow  | progress ≥ 90% − tolerance                     |
| Red     | below Yellow threshold                         |

## License

MIT — use and modify freely for learning and personal finance experiments.
