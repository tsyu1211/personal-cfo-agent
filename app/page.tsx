"use client";

import { useMemo, useState } from "react";
import {
  calculateCashGoalProgress,
  calculateMonthlyExpenses,
  calculateNetWorth,
  calculateNetworthGoalProgress,
  getGoalStatus,
} from "@/lib/calculations";
import { parseTransactionsCsv, spendingByCategory } from "@/lib/csv";
import { generateYtdStatement } from "@/lib/reportGenerator";
import { defaultSetup, type FinancialSetup, type Transaction } from "@/lib/types";

function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function statusEmoji(status: string): string {
  if (status === "Green") return "🟢";
  if (status === "Yellow") return "🟡";
  if (status === "Red") return "🔴";
  return "⚪";
}

function statusClass(status: string): string {
  if (status === "Green") return "status-green";
  if (status === "Yellow") return "status-yellow";
  return "status-red";
}

function NumberField({
  label,
  value,
  onChange,
  min = undefined,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function Home() {
  const [setup, setSetup] = useState<FinancialSetup>(defaultSetup);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const monthlyExpenses = calculateMonthlyExpenses(transactions);
  const monthlyCashFlow = setup.monthlyIncome - monthlyExpenses;
  const currentNetworth = calculateNetWorth(
    setup.cashBalance,
    setup.investmentBalance,
    setup.retirementBalance,
    setup.debtBalance
  );
  const cashGoalProgress = calculateCashGoalProgress(
    monthlyCashFlow,
    setup.annualCashGoal,
    setup.currentMonth
  );
  const networthGoalProgress = calculateNetworthGoalProgress(
    currentNetworth,
    setup.annualNetworthGoal
  );
  const cashGoalStatus = getGoalStatus(cashGoalProgress, setup.tolerancePercent);
  const networthGoalStatus = getGoalStatus(
    networthGoalProgress,
    setup.tolerancePercent
  );

  const breakdown = useMemo(
    () => spendingByCategory(transactions),
    [transactions]
  );

  const markdownReport = generateYtdStatement({
    setup: {
      annualCashGoal: setup.annualCashGoal,
      annualNetworthGoal: setup.annualNetworthGoal,
      currentMonth: setup.currentMonth,
      tolerancePercent: setup.tolerancePercent,
    },
    metrics: {
      monthlyIncome: setup.monthlyIncome,
      monthlyExpenses,
      monthlyCashFlow,
      currentNetworth,
      cashGoalProgress,
      networthGoalProgress,
    },
    spendingBreakdown: breakdown,
    cashGoalStatus,
    networthGoalStatus,
  });

  function updateSetup<K extends keyof FinancialSetup>(key: K, value: FinancialSetup[K]) {
    setSetup((s) => ({ ...s, [key]: value }));
  }

  function handleFileUpload(file: File | null) {
    if (!file) return;
    setCsvError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseTransactionsCsv(String(reader.result));
      if (result.error) {
        setCsvError(result.error);
        return;
      }
      setTransactions(result.transactions);
    };
    reader.readAsText(file);
  }

  function downloadReport() {
    const blob = new Blob([markdownReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ytd_financial_statement.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  const maxBar = breakdown[0]?.amount ?? 1;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Financial Setup</h2>
        <NumberField
          label="Annual Cash Goal ($)"
          value={setup.annualCashGoal}
          onChange={(v) => updateSetup("annualCashGoal", v)}
          min={0}
          step={500}
        />
        <NumberField
          label="Annual Net Worth Goal ($)"
          value={setup.annualNetworthGoal}
          onChange={(v) => updateSetup("annualNetworthGoal", v)}
          min={0}
          step={1000}
        />
        <NumberField
          label="Tolerance (%)"
          value={setup.tolerancePercent}
          onChange={(v) => updateSetup("tolerancePercent", v)}
          min={0}
          step={1}
        />
        <label>Current Month: {setup.currentMonth}</label>
        <input
          type="range"
          min={1}
          max={12}
          value={setup.currentMonth}
          onChange={(e) => updateSetup("currentMonth", Number(e.target.value))}
        />
        <NumberField
          label="Monthly Income ($)"
          value={setup.monthlyIncome}
          onChange={(v) => updateSetup("monthlyIncome", v)}
          min={0}
          step={100}
        />
        <NumberField
          label="Cash Balance ($)"
          value={setup.cashBalance}
          onChange={(v) => updateSetup("cashBalance", v)}
          step={500}
        />
        <NumberField
          label="Investment Balance ($)"
          value={setup.investmentBalance}
          onChange={(v) => updateSetup("investmentBalance", v)}
          step={500}
        />
        <NumberField
          label="Retirement Balance ($)"
          value={setup.retirementBalance}
          onChange={(v) => updateSetup("retirementBalance", v)}
          step={500}
        />
        <NumberField
          label="Debt Balance ($)"
          value={setup.debtBalance}
          onChange={(v) => updateSetup("debtBalance", v)}
          min={0}
          step={500}
        />
      </aside>

      <main className="main">
        <h1>Personal CFO Agent</h1>
        <p className="caption">MVP v0.1 — browser-only state, no database, no external APIs</p>

        <section className="section">
          <h2>Dashboard</h2>
          <div className="metrics">
            <div className="metric">
              <label>Monthly Income</label>
              <strong>{money(setup.monthlyIncome)}</strong>
            </div>
            <div className="metric">
              <label>Monthly Expenses</label>
              <strong>{money(monthlyExpenses)}</strong>
            </div>
            <div className="metric">
              <label>Monthly Cash Flow</label>
              <strong>{money(monthlyCashFlow)}</strong>
            </div>
            <div className="metric">
              <label>Current Net Worth</label>
              <strong>{money(currentNetworth)}</strong>
            </div>
            <div className="metric">
              <label>Cash Goal Progress</label>
              <strong>{cashGoalProgress.toFixed(1)}%</strong>
            </div>
            <div className="metric">
              <label>Net Worth Goal Progress</label>
              <strong>{networthGoalProgress.toFixed(1)}%</strong>
            </div>
            <div className="metric">
              <label>Cash Goal Status</label>
              <strong className={statusClass(cashGoalStatus)}>
                {statusEmoji(cashGoalStatus)} {cashGoalStatus}
              </strong>
            </div>
            <div className="metric">
              <label>Net Worth Goal Status</label>
              <strong className={statusClass(networthGoalStatus)}>
                {statusEmoji(networthGoalStatus)} {networthGoalStatus}
              </strong>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Upload Transactions</h2>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
          />
          {csvError && <div className="error">{csvError}</div>}
          {transactions.length > 0 ? (
            <>
              <table style={{ marginTop: "1rem" }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Expense</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>{t.amount.toFixed(2)}</td>
                      <td>{t.amount < 0 ? Math.abs(t.amount).toFixed(2) : "—"}</td>
                      <td>{t.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="caption" style={{ marginTop: "0.5rem" }}>
                Only Amount &lt; 0 counts as expense. Sample file:{" "}
                <a href="/sample_data/sample_transactions.csv" download>
                  sample_transactions.csv
                </a>
              </p>
            </>
          ) : (
            <div className="info" style={{ marginTop: "1rem" }}>
              Upload a CSV with columns: Date, Description, Amount. Or download the sample
              file above.
            </div>
          )}
        </section>

        <section className="section">
          <h2>Spending Breakdown</h2>
          {breakdown.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((row) => (
                    <tr key={row.category}>
                      <td>{row.category}</td>
                      <td>{money(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bar-chart">
                {breakdown.map((row) => (
                  <div className="bar-row" key={row.category}>
                    <span>{row.category}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(row.amount / maxBar) * 100}%` }}
                      />
                    </div>
                    <span>{money(row.amount)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Upload transactions to see spending breakdown.</p>
          )}
        </section>

        <section className="section">
          <h2>YTD Financial Statement</h2>
          <div className="report-preview">{markdownReport}</div>
          <button type="button" className="btn" onClick={downloadReport}>
            Download YTD Statement (.md)
          </button>
        </section>
      </main>
    </div>
  );
}
