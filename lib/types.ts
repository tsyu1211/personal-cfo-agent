export type GoalStatus = "Green" | "Yellow" | "Red";

export interface FinancialSetup {
  annualCashGoal: number;
  annualNetworthGoal: number;
  tolerancePercent: number;
  currentMonth: number;
  monthlyIncome: number;
  cashBalance: number;
  investmentBalance: number;
  retirementBalance: number;
  debtBalance: number;
}

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface SpendingRow {
  category: string;
  amount: number;
}

export const defaultSetup: FinancialSetup = {
  annualCashGoal: 12000,
  annualNetworthGoal: 100000,
  tolerancePercent: 5,
  currentMonth: 6,
  monthlyIncome: 5000,
  cashBalance: 10000,
  investmentBalance: 25000,
  retirementBalance: 15000,
  debtBalance: 5000,
};
