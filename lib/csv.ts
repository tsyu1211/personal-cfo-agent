import { categorizeTransaction } from "./categorizer";
import type { Transaction } from "./types";

export function parseTransactionsCsv(text: string): {
  transactions: Transaction[];
  error?: string;
} {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { transactions: [], error: "CSV file is empty." };
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const dateIdx = headers.indexOf("Date");
  const descIdx = headers.indexOf("Description");
  const amountIdx = headers.indexOf("Amount");

  if (dateIdx === -1 || descIdx === -1 || amountIdx === -1) {
    return {
      transactions: [],
      error: "CSV must include columns: Date, Description, Amount",
    };
  }

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(",");
    const description = cols[descIdx]?.trim() ?? "";
    const amount = Number(cols[amountIdx]?.trim());

    if (Number.isNaN(amount)) continue;

    transactions.push({
      date: cols[dateIdx]?.trim() ?? "",
      description,
      amount,
      category: categorizeTransaction(description),
    });
  }

  return { transactions };
}

export function spendingByCategory(transactions: Transaction[]) {
  const totals = new Map<string, number>();

  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const prev = totals.get(t.category) ?? 0;
    totals.set(t.category, prev + Math.abs(t.amount));
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}
