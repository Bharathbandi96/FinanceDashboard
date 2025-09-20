export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
  billImage?: string; // Base64 encoded image or file URL
  billFileName?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface CurrencyRate {
  [key: string]: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  monthlyAverage: number;
  yearlyProjection: number;
}

export interface UserPreferences {
  preferredCurrency: string;
  budgetAlerts: boolean;
  savingsGoal: number;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  potentialSavings?: number;
}