'use client';

import { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  addTransaction,
  updatePreferences,
  setSelectedMonth,
  setSelectedYear,
  setShowAddTransaction
} from '@/store/slices/financeSlice';
import { PremiumOverviewCards } from '@/components/dashboard/premium-overview-cards';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { BudgetOverview } from '@/components/dashboard/budget-overview';
import { CurrencyConverter } from '@/components/dashboard/currency-converter';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import { UserPreferencesCard } from '@/components/dashboard/user-preferences';
import { AIInsightsCard } from '@/components/dashboard/ai-insights';
import { AnnualOverview } from '@/components/dashboard/annual-overview';
import { GlobalDateSelector } from '@/components/dashboard/global-date-selector';
import { SpendingTrendsChart } from '@/components/dashboard/spending-trends-chart';
import { CategoryComparisonChart } from '@/components/dashboard/category-comparison-chart';
import { FinancialHealthScore } from '@/components/dashboard/financial-health-score';
import { SmartInsightsPanel } from '@/components/dashboard/smart-insights-panel';
import { AnimatedChartContainer } from '@/components/dashboard/animated-chart-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction, Budget, FinancialSummary, UserPreferences, AIInsight } from '@/types/finance';
import { generateAIInsights } from '@/lib/ai-insights';
import { convertCurrency } from '@/lib/currency';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Calendar,
  Brain,
  Activity,
  PieChart,
  LineChart,
  DollarSign,
  Target
} from 'lucide-react';

export default function Home() {
  const dispatch = useAppDispatch();
  const {
    transactions,
    budgets,
    preferences,
    selectedMonth,
    selectedYear,
    showAddTransaction
  } = useAppSelector((state) => state.finance);

  const { summary, insights, filteredSummary } = useMemo(() => {
    // Filter transactions for selected month/year
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === selectedYear &&
        transactionDate.getMonth() === selectedMonth;
    });

    // Convert all amounts to preferred currency
    const convertedTransactions = transactions.map(t => ({
      ...t,
      amount: convertCurrency(t.amount, t.currency, preferences.preferredCurrency)
    }));

    const convertedFilteredTransactions = filteredTransactions.map(t => ({
      ...t,
      amount: convertCurrency(t.amount, t.currency, preferences.preferredCurrency)
    }));

    // Overall summary (all time)
    const totalIncome = convertedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = convertedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Filtered summary (selected month/year)
    const filteredIncome = convertedFilteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const filteredExpenses = convertedFilteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = totalIncome - totalExpenses;
    const filteredNetIncome = filteredIncome - filteredExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const filteredSavingsRate = filteredIncome > 0 ? (filteredNetIncome / filteredIncome) * 100 : 0;

    // Calculate monthly average
    const monthlyData = convertedTransactions.reduce((acc, t) => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
      if (t.type === 'income') acc[month].income += t.amount;
      else acc[month].expenses += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    const months = Object.keys(monthlyData);
    const monthlyAverage = months.length > 0
      ? Object.values(monthlyData).reduce((sum, month) => sum + month.expenses, 0) / months.length
      : 0;

    const yearlyProjection = monthlyAverage * 12;

    const summaryData: FinancialSummary = {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      monthlyAverage,
      yearlyProjection,
    };

    const filteredSummaryData: FinancialSummary = {
      totalIncome: filteredIncome,
      totalExpenses: filteredExpenses,
      netIncome: filteredNetIncome,
      savingsRate: filteredSavingsRate,
      monthlyAverage: filteredExpenses,
      yearlyProjection: filteredExpenses * 12,
    };

    const aiInsights = generateAIInsights(transactions, budgets, preferences.preferredCurrency);

    return {
      summary: summaryData,
      insights: aiInsights,
      filteredSummary: filteredSummaryData
    };
  }, [transactions, budgets, preferences.preferredCurrency, selectedMonth, selectedYear]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    dispatch(addTransaction(transaction));
  };

  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    dispatch(updatePreferences(newPreferences));
  };

  const handleMonthChange = useCallback((month: number) => {
    dispatch(setSelectedMonth(month));
  }, [dispatch]);

  const handleYearChange = useCallback((year: number) => {
    dispatch(setSelectedYear(year));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personal Finance Dashboard
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Comprehensive financial management with intelligent insights
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <GlobalDateSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
          />
        </div>

        {/* Overview Cards */}
        <div className="mb-8">
          <PremiumOverviewCards summary={filteredSummary} preferredCurrency={preferences.preferredCurrency} />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-7 w-full max-w-4xl">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Budget</span>
              </TabsTrigger>
              <TabsTrigger value="converter" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Converter</span>
              </TabsTrigger>
              <TabsTrigger value="annual" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Annual</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AnimatedChartContainer title="Income vs Expenses" icon={LineChart}>
                <IncomeExpenseChart transactions={transactions} currency={preferences.preferredCurrency} />
              </AnimatedChartContainer>
              <AnimatedChartContainer title="Expense Breakdown" icon={PieChart}>
                <ExpenseChart transactions={transactions} />
              </AnimatedChartContainer>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <SmartInsightsPanel
                transactions={transactions}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                preferredCurrency={preferences.preferredCurrency}
              />
              <FinancialHealthScore
                transactions={transactions}
                budgets={budgets}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                preferredCurrency={preferences.preferredCurrency}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <AnimatedChartContainer title="Daily Spending Trends" icon={TrendingUp}>
                <SpendingTrendsChart
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  preferredCurrency={preferences.preferredCurrency}
                />
              </AnimatedChartContainer>
              <AnimatedChartContainer title="Category Comparison" icon={BarChart3}>
                <CategoryComparisonChart
                  transactions={transactions}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  preferredCurrency={preferences.preferredCurrency}
                />
              </AnimatedChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionList
              transactions={transactions}
              onAddTransaction={() => dispatch(setShowAddTransaction(true))}
            />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetOverview
              budgets={budgets}
              transactions={transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              preferredCurrency={preferences.preferredCurrency}
            />
          </TabsContent>

          <TabsContent value="converter" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <CurrencyConverter />
            </div>
          </TabsContent>

          <TabsContent value="annual" className="space-y-6">
            <AnnualOverview
              transactions={transactions}
              preferredCurrency={preferences.preferredCurrency}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AIInsightsCard insights={insights} />
              <UserPreferencesCard
                preferences={preferences}
                onUpdatePreferences={handleUpdatePreferences}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Transaction Dialog */}
        <AddTransactionDialog
          open={showAddTransaction}
          onOpenChange={(open) => dispatch(setShowAddTransaction(open))}
          onAddTransaction={handleAddTransaction}
        />
      </div>
    </div>
  );
}