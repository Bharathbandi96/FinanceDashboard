import { Transaction, Budget } from '@/types/finance';

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2025-01-15',
    currency: 'USD'
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200,
    category: 'Rent',
    description: 'Monthly rent payment',
    date: '2025-01-01',
    currency: 'USD'
  },
  {
    id: '3',
    type: 'expense',
    amount: 450,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    date: '2025-01-08',
    currency: 'USD'
  },
  {
    id: '4',
    type: 'expense',
    amount: 80,
    category: 'Utilities',
    description: 'Electricity bill',
    date: '2025-01-05',
    currency: 'USD'
  },
  {
    id: '5',
    type: 'income',
    amount: 500,
    category: 'Freelance',
    description: 'Web development project',
    date: '2025-08-10',
    currency: 'USD'
  },
  {
    id: '6',
    type: 'expense',
    amount: 150,
    category: 'Entertainment',
    description: 'Movies and dining',
    date: '2025-09-12',
    currency: 'USD'
  }
];

export const sampleBudgets: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    limit: 600,
    spent: 450,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'Entertainment',
    limit: 300,
    spent: 150,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'Utilities',
    limit: 200,
    spent: 80,
    period: 'monthly'
  },
  {
    id: '4',
    category: 'Transportation',
    limit: 400,
    spent: 0,
    period: 'monthly'
  }
];

export const categories = [
  'Salary',
  'Freelance',
  'Investment',
  'Rent',
  'Groceries',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other'
];