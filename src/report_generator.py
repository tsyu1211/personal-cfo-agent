"""Generate YTD financial statement as Markdown."""


def generate_ytd_statement(data: dict) -> str:
    """Build a Markdown report from dashboard data."""
    setup = data.get("setup", {})
    metrics = data.get("metrics", {})
    spending = data.get("spending_breakdown", [])
    cash_status = data.get("cash_goal_status", "—")
    nw_status = data.get("networth_goal_status", "—")

    lines = [
        "# YTD Financial Statement",
        "",
        "## Executive Summary",
        "",
        f"- **Current month:** {setup.get('current_month', '—')}",
        f"- **Monthly income:** ${metrics.get('monthly_income', 0):,.2f}",
        f"- **Monthly expenses:** ${metrics.get('monthly_expenses', 0):,.2f}",
        f"- **Monthly cash flow:** ${metrics.get('monthly_cash_flow', 0):,.2f}",
        f"- **Current net worth:** ${metrics.get('current_networth', 0):,.2f}",
        "",
        "## Income Statement",
        "",
        "| Item | Amount |",
        "|------|--------|",
        f"| Monthly Income | ${metrics.get('monthly_income', 0):,.2f} |",
        f"| Monthly Expenses | ${metrics.get('monthly_expenses', 0):,.2f} |",
        f"| Monthly Cash Flow | ${metrics.get('monthly_cash_flow', 0):,.2f} |",
        "",
        "## Spending Breakdown",
        "",
    ]

    if spending:
        lines.append("| Category | Amount |")
        lines.append("|----------|--------|")
        for row in spending:
            lines.append(f"| {row['Category']} | ${row['Amount']:,.2f} |")
    else:
        lines.append("_No spending data uploaded yet._")

    lines.extend(
        [
            "",
            "## Cash Savings Goal",
            "",
            f"- **Annual cash goal:** ${setup.get('annual_cash_goal', 0):,.2f}",
            f"- **Progress:** {metrics.get('cash_goal_progress', 0):.1f}%",
            f"- **Status:** {cash_status}",
            "",
            "## Net Worth Goal",
            "",
            f"- **Annual net worth goal:** ${setup.get('annual_networth_goal', 0):,.2f}",
            f"- **Progress:** {metrics.get('networth_goal_progress', 0):.1f}%",
            f"- **Status:** {nw_status}",
            "",
            "## CFO Notes",
            "",
            "- This report is generated locally from your session data.",
            "- Upload transaction CSV files for accurate spending breakdown.",
            "- Adjust sidebar goals and balances to reflect your financial plan.",
            "",
        ]
    )

    return "\n".join(lines)
