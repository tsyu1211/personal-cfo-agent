"""Personal CFO Agent — Streamlit MVP v0.1"""

import pandas as pd
import streamlit as st

from src.calculations import (
    calculate_cash_goal_progress,
    calculate_monthly_expenses,
    calculate_net_worth,
    calculate_networth_goal_progress,
    get_goal_status,
)
from src.categorizer import categorize_transaction
from src.report_generator import generate_ytd_statement

st.set_page_config(page_title="Personal CFO Agent", page_icon="💰", layout="wide")

# --- Session state defaults ---
if "transactions_df" not in st.session_state:
    st.session_state.transactions_df = None


def status_emoji(status: str) -> str:
    return {"Green": "🟢", "Yellow": "🟡", "Red": "🔴"}.get(status, "⚪")


def load_and_process_csv(uploaded_file) -> pd.DataFrame:
    df = pd.read_csv(uploaded_file)
    required = {"Date", "Description", "Amount"}
    missing = required - set(df.columns)
    if missing:
        st.error(f"CSV is missing columns: {', '.join(sorted(missing))}")
        return pd.DataFrame()

    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Amount"] = pd.to_numeric(df["Amount"], errors="coerce")
    df["Category"] = df["Description"].apply(categorize_transaction)
    return df


def spending_by_category(df: pd.DataFrame) -> pd.DataFrame:
    expenses = df[df["Amount"] < 0].copy()
    if expenses.empty:
        return pd.DataFrame(columns=["Category", "Amount"])
    summary = (
        expenses.groupby("Category", as_index=False)["Amount"]
        .sum()
        .rename(columns={"Amount": "Amount"})
    )
    summary["Amount"] = summary["Amount"].abs()
    return summary.sort_values("Amount", ascending=False)


# --- Sidebar: Financial Setup ---
st.sidebar.header("Financial Setup")

annual_cash_goal = st.sidebar.number_input(
    "Annual Cash Goal ($)", min_value=0.0, value=12000.0, step=500.0
)
annual_networth_goal = st.sidebar.number_input(
    "Annual Net Worth Goal ($)", min_value=0.0, value=100000.0, step=1000.0
)
tolerance_percent = st.sidebar.number_input(
    "Tolerance (%)", min_value=0.0, max_value=50.0, value=5.0, step=1.0
)
current_month = st.sidebar.slider("Current Month", 1, 12, 6)
monthly_income = st.sidebar.number_input(
    "Monthly Income ($)", min_value=0.0, value=5000.0, step=100.0
)
cash_balance = st.sidebar.number_input(
    "Cash Balance ($)", value=10000.0, step=500.0
)
investment_balance = st.sidebar.number_input(
    "Investment Balance ($)", value=25000.0, step=500.0
)
retirement_balance = st.sidebar.number_input(
    "Retirement Balance ($)", value=15000.0, step=500.0
)
debt_balance = st.sidebar.number_input(
    "Debt Balance ($)", min_value=0.0, value=5000.0, step=500.0
)

# --- Main: Dashboard ---
st.title("Personal CFO Agent")
st.caption("Local MVP v0.1 — no database, no external APIs")

df = st.session_state.transactions_df
monthly_expenses = calculate_monthly_expenses(df) if df is not None else 0.0
monthly_cash_flow = float(monthly_income) - monthly_expenses
current_networth = calculate_net_worth(
    cash_balance, investment_balance, retirement_balance, debt_balance
)
cash_goal_progress = calculate_cash_goal_progress(
    monthly_cash_flow, annual_cash_goal, current_month
)
networth_goal_progress = calculate_networth_goal_progress(
    current_networth, annual_networth_goal
)
cash_goal_status = get_goal_status(cash_goal_progress, tolerance_percent)
networth_goal_status = get_goal_status(networth_goal_progress, tolerance_percent)

st.header("Dashboard")

col1, col2, col3, col4 = st.columns(4)
col1.metric("Monthly Income", f"${monthly_income:,.2f}")
col2.metric("Monthly Expenses", f"${monthly_expenses:,.2f}")
col3.metric("Monthly Cash Flow", f"${monthly_cash_flow:,.2f}")
col4.metric("Current Net Worth", f"${current_networth:,.2f}")

col5, col6, col7, col8 = st.columns(4)
col5.metric("Cash Goal Progress", f"{cash_goal_progress:.1f}%")
col6.metric("Net Worth Goal Progress", f"{networth_goal_progress:.1f}%")
col7.metric(
    "Cash Goal Status",
    f"{status_emoji(cash_goal_status)} {cash_goal_status}",
)
col8.metric(
    "Net Worth Goal Status",
    f"{status_emoji(networth_goal_status)} {networth_goal_status}",
)

st.divider()

# --- Upload Transactions ---
st.header("Upload Transactions")
uploaded = st.file_uploader("Upload a CSV file", type=["csv"])

if uploaded is not None:
    processed = load_and_process_csv(uploaded)
    if not processed.empty:
        st.session_state.transactions_df = processed
        df = processed

if df is not None and not df.empty:
    display_df = df.copy()
    display_df["Expense"] = display_df["Amount"].apply(
        lambda x: abs(x) if x < 0 else None
    )
    st.dataframe(
        display_df[["Date", "Description", "Amount", "Expense", "Category"]],
        use_container_width=True,
        hide_index=True,
    )
    st.caption("Only rows with Amount < 0 count as expenses. Expense column shows positive amounts.")
else:
    st.info(
        "Upload a CSV with columns: Date, Description, Amount. "
        "Try `sample_data/sample_transactions.csv`."
    )

st.divider()

# --- Spending Breakdown ---
st.header("Spending Breakdown")

if df is not None and not df.empty:
    breakdown = spending_by_category(df)
    if breakdown.empty:
        st.write("No expenses found (Amount < 0).")
    else:
        st.dataframe(breakdown, use_container_width=True, hide_index=True)
        st.bar_chart(breakdown.set_index("Category")["Amount"])
else:
    st.write("Upload transactions to see spending breakdown.")

st.divider()

# --- YTD Financial Statement ---
st.header("YTD Financial Statement")

spending_list = []
if df is not None and not df.empty:
    breakdown = spending_by_category(df)
    spending_list = breakdown.to_dict("records")

report_data = {
    "setup": {
        "annual_cash_goal": annual_cash_goal,
        "annual_networth_goal": annual_networth_goal,
        "current_month": current_month,
        "tolerance_percent": tolerance_percent,
    },
    "metrics": {
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "monthly_cash_flow": monthly_cash_flow,
        "current_networth": current_networth,
        "cash_goal_progress": cash_goal_progress,
        "networth_goal_progress": networth_goal_progress,
    },
    "spending_breakdown": spending_list,
    "cash_goal_status": cash_goal_status,
    "networth_goal_status": networth_goal_status,
}

markdown_report = generate_ytd_statement(report_data)
st.markdown(markdown_report)

st.download_button(
    label="Download YTD Statement (.md)",
    data=markdown_report,
    file_name="ytd_financial_statement.md",
    mime="text/markdown",
)
