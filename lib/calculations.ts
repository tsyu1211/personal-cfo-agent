import type { GoalStatus, Transaction } from "./types";

export function calculateMonthlyExpenses(transactions: Transaction[]): number {
  if (!transactions.length) return 0;
  return transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function calculateNetWorth(
  cash: number,
  investment: number,
  retirement: number,
  debt: number
): number {
  return cash + investment + retirement - debt;
}

export function calculateCashGoalProgress(
  monthlyCashFlow: number,
  annualCashGoal: number,
  currentMonth: number
): number {
  if (annualCashGoal <= 0) return 0;
  const month = Math.max(1, Math.min(12, Math.round(currentMonth)));
  const ytdCashFlow = monthlyCashFlow * month;
  return (ytdCashFlow / annualCashGoal) * 100;
}

export function calculateNetworthGoalProgress(
  currentNetworth: number,
  annualNetworthGoal: number
): number {
  if (annualNetworthGoal <= 0) return 0;
  return (currentNetworth / annualNetworthGoal) * 100;
}

export function getGoalStatus(
  progressPercent: number,
  tolerancePercent: number
): GoalStatus {
  const greenThreshold = 100 - tolerancePercent;
  const yellowThreshold = 90 - tolerancePercent;

  if (progressPercent >= greenThreshold) return "Green";
  if (progressPercent >= yellowThreshold) return "Yellow";
  return "Red";
}
