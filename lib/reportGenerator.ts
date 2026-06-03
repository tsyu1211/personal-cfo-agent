import type { SpendingRow } from "./types";

function money(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateYtdStatement(data: {
  setup: Record<string, number>;
  metrics: Record<string, number>;
  spendingBreakdown: SpendingRow[];
  cashGoalStatus: string;
  networthGoalStatus: string;
}): string {
  const { setup, metrics, spendingBreakdown, cashGoalStatus, networthGoalStatus } = data;

  const lines = [
    "# YTD Financial Statement",
    "",
    "## Executive Summary",
    "",
    `- **Current month:** ${setup.currentMonth ?? "—"}`,
    `- **Monthly income:** $${money(metrics.monthlyIncome ?? 0)}`,
    `- **Monthly expenses:** $${money(metrics.monthlyExpenses ?? 0)}`,
    `- **Monthly cash flow:** $${money(metrics.monthlyCashFlow ?? 0)}`,
    `- **Current net worth:** $${money(metrics.currentNetworth ?? 0)}`,
    "",
    "## Income Statement",
    "",
    "| Item | Amount |",
    "|------|--------|",
    `| Monthly Income | $${money(metrics.monthlyIncome ?? 0)} |`,
    `| Monthly Expenses | $${money(metrics.monthlyExpenses ?? 0)} |`,
    `| Monthly Cash Flow | $${money(metrics.monthlyCashFlow ?? 0)} |`,
    "",
    "## Spending Breakdown",
    "",
  ];

  if (spendingBreakdown.length) {
    lines.push("| Category | Amount |", "|----------|--------|");
    for (const row of spendingBreakdown) {
      lines.push(`| ${row.category} | $${money(row.amount)} |`);
    }
  } else {
    lines.push("_No spending data uploaded yet._");
  }

  lines.push(
    "",
    "## Cash Savings Goal",
    "",
    `- **Annual cash goal:** $${money(setup.annualCashGoal ?? 0)}`,
    `- **Progress:** ${(metrics.cashGoalProgress ?? 0).toFixed(1)}%`,
    `- **Status:** ${cashGoalStatus}`,
    "",
    "## Net Worth Goal",
    "",
    `- **Annual net worth goal:** $${money(setup.annualNetworthGoal ?? 0)}`,
    `- **Progress:** ${(metrics.networthGoalProgress ?? 0).toFixed(1)}%`,
    `- **Status:** ${networthGoalStatus}`,
    "",
    "## CFO Notes",
    "",
    "- This report is generated in your browser (no server database).",
    "- Upload transaction CSV files for accurate spending breakdown.",
    "- Adjust sidebar goals and balances to reflect your financial plan.",
    ""
  );

  return lines.join("\n");
}
