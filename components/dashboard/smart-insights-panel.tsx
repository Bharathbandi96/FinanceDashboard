'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Transaction } from '@/types/finance';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface SmartInsightsPanelProps {
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  preferredCurrency: string;
}

export function SmartInsightsPanel({ transactions, selectedMonth, selectedYear, preferredCurrency }: SmartInsightsPanelProps) {
  // Filter transactions for selected period
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  const previousMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
  });

  // Calculate insights
  const currentExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

  const previousExpenses = previousMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

  const expenseChange = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;

  const currentIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

  const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;

  // Top spending category
  const categorySpending = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const amount = convertCurrency(t.amount, t.currency, preferredCurrency);
      acc[t.category] = (acc[t.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  const insights = [
    {
      id: 1,
      type: expenseChange > 10 ? 'warning' : expenseChange < -10 ? 'success' : 'info',
      title: 'Spending Trend',
      description: `${Math.abs(expenseChange).toFixed(1)}% ${expenseChange > 0 ? 'increase' : 'decrease'} from last month`,
      value: formatCurrency(currentExpenses, preferredCurrency),
      icon: expenseChange > 0 ? ArrowUpRight : ArrowDownRight,
      color: expenseChange > 10 ? 'text-red-400' : expenseChange < -10 ? 'text-emerald-400' : 'text-blue-400'
    },
    {
      id: 2,
      type: savingsRate > 20 ? 'success' : savingsRate > 10 ? 'info' : 'warning',
      title: 'Savings Rate',
      description: `${savingsRate > 20 ? 'Excellent' : savingsRate > 10 ? 'Good' : 'Needs improvement'} financial health`,
      value: `${savingsRate.toFixed(1)}%`,
      icon: Target,
      color: savingsRate > 20 ? 'text-emerald-400' : savingsRate > 10 ? 'text-blue-400' : 'text-orange-400'
    },
    {
      id: 3,
      type: 'info',
      title: 'Top Category',
      description: topCategory ? `Highest spending in ${topCategory[0]}` : 'No expenses recorded',
      value: topCategory ? formatCurrency(topCategory[1], preferredCurrency) : '$0',
      icon: TrendingUp,
      color: 'text-purple-400'
    }
  ];

  return (
    <Card className="bg-white border shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gray-900">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          Smart Insights
          <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="group relative">
              <div className="relative p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${insight.color}`} />
                    <span className="text-gray-900 font-medium">{insight.title}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`
                      ${insight.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                      ${insight.type === 'warning' ? 'bg-orange-100 text-orange-800 border-orange-200' : ''}
                      ${insight.type === 'info' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                    `}
                  >
                    {insight.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                  <span className={`text-lg font-bold ${insight.color}`}>{insight.value}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t border-gray-200">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            Get AI Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}