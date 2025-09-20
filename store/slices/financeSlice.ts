import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, Budget, UserPreferences } from '@/types/finance';
import { sampleTransactions, sampleBudgets } from '@/lib/sample-data';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  preferences: UserPreferences;
  selectedMonth: number;
  selectedYear: number;
  showAddTransaction: boolean;
}

const initialState: FinanceState = {
  transactions: sampleTransactions,
  budgets: sampleBudgets,
  preferences: {
    preferredCurrency: 'USD',
    budgetAlerts: true,
    savingsGoal: 1000
  },
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  showAddTransaction: false,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      
      // Update budget if it's an expense
      if (action.payload.type === 'expense') {
        const budget = state.budgets.find(b => b.category === action.payload.category);
        if (budget) {
          budget.spent += action.payload.amount;
        }
      }
    },
    updatePreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
    },
    setSelectedMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    setShowAddTransaction: (state, action: PayloadAction<boolean>) => {
      state.showAddTransaction = action.payload;
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
  },
});

export const {
  addTransaction,
  updatePreferences,
  setSelectedMonth,
  setSelectedYear,
  setShowAddTransaction,
  updateBudget,
} = financeSlice.actions;

export default financeSlice.reducer;