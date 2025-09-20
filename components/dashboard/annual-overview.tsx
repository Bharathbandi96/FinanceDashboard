'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Transaction } from '@/types/finance';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface AnnualOverviewProps {
  transactions: Transaction[];
  preferredCurrency: string;
}

export function AnnualOverview({ transactions, preferredCurrency }: AnnualOverviewProps) {
  const currentYear = new Date().getFullYear();
  
  // Generate monthly data for the current year
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = index;
    const monthName = new Date(currentYear, month).toLocaleDateString('en-US', { month: 'short' });
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentYear && transactionDate.getMonth() === month;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

    return {
      month: monthName,
      income,
      expenses,
      net: income - expenses,
    };
  });

  // Calculate year-to-date totals
  const currentMonth = new Date().getMonth();
  const ytdData = monthlyData.slice(0, currentMonth + 1);
  
  const ytdIncome = ytdData.reduce((sum, month) => sum + month.income, 0);
  const ytdExpenses = ytdData.reduce((sum, month) => sum + month.expenses, 0);
  const ytdNet = ytdIncome - ytdExpenses;

  // Calculate projections
  const avgMonthlyIncome = ytdIncome / (currentMonth + 1);
  const avgMonthlyExpenses = ytdExpenses / (currentMonth + 1);
  const projectedYearlyIncome = avgMonthlyIncome * 12;
  const projectedYearlyExpenses = avgMonthlyExpenses * 12;

  // Category breakdown for the year
  const categoryData = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === currentYear)
    .reduce((acc, transaction) => {
      const amount = convertCurrency(transaction.amount, transaction.currency, preferredCurrency);
      acc[transaction.category] = (acc[transaction.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([category, amount]) => ({ category, amount }));

  return (
    <div className="space-y-6">
      {/* Year-to-Date Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(ytdIncome, preferredCurrency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected: {formatCurrency(projectedYearlyIncome, preferredCurrency)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(ytdExpenses, preferredCurrency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected: {formatCurrency(projectedYearlyExpenses, preferredCurrency)}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Net</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${ytdNet >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(ytdNet, preferredCurrency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected: {formatCurrency(projectedYearlyIncome - projectedYearlyExpenses, preferredCurrency)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Monthly Trends ({currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value), preferredCurrency), '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Income"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Expenses"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Net"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Expense Categories */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Top Expense Categories ({currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value), preferredCurrency), 'Amount']}
              />
              <Bar dataKey="amount" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}