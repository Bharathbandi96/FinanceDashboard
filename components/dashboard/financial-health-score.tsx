'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Transaction, Budget } from '@/types/finance';
import { convertCurrency } from '@/lib/currency';
import { Heart, TrendingUp, Shield, Target, BarChart3 } from 'lucide-react';

interface FinancialHealthScoreProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: number;
  selectedYear: number;
  preferredCurrency: string;
}

export function FinancialHealthScore({ transactions, budgets, selectedMonth, selectedYear, preferredCurrency }: FinancialHealthScoreProps) {
  // Filter transactions for selected month/year
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (transactionDate.getFullYear() === selectedYear) && (transactionDate.getMonth() === selectedMonth);
  });

  const income = filteredTransactions
    ?.filter(t => t.type === 'income')
    ?.reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

  const expenses = filteredTransactions
    ?.filter(t => t.type === 'expense')
    ?.reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

  // Calculate health metrics
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const budgetAdherence = budgets.length > 0 
    ? budgets.reduce((acc, budget) => acc + Math.min((budget.limit - budget.spent) / budget.limit * 100, 100), 0) / budgets.length
    : 100;
  
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 100;
  const diversificationScore = new Set(filteredTransactions.map(t => t.category)).size * 10; // Max 100 for 10+ categories

  // Overall health score (weighted average)
  const healthScore = Math.round(
    (savingsRate * 0.3) + 
    (budgetAdherence * 0.25) + 
    (Math.max(0, 100 - expenseRatio) * 0.25) + 
    (Math.min(diversificationScore, 100) * 0.2)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 60) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 40) return { label: 'Fair', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const badge = getScoreBadge(healthScore);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Heart className="h-5 w-5 text-emerald-600" />
            Financial Health Score
          </CardTitle>
          <Badge className={badge.color}>
            {badge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(healthScore)} mb-2`}>
            {healthScore}
          </div>
          <Progress value={20} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">Overall Financial Health</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Savings Rate</span>
            </div>
            <Progress value={Math.max(0, savingsRate)} className="h-2" />
            <p className="text-xs text-muted-foreground">{savingsRate.toFixed(1)}%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Budget Adherence</span>
            </div>
            <Progress value={budgetAdherence} className="h-2" />
            <p className="text-xs text-muted-foreground">{budgetAdherence.toFixed(1)}%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Expense Control</span>
            </div>
            <Progress value={Math.max(0, 100 - expenseRatio)} className="h-2" />
            <p className="text-xs text-muted-foreground">{(100 - expenseRatio).toFixed(1)}%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">Diversification</span>
            </div>
            <Progress value={Math.min(diversificationScore, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">{Math.min(diversificationScore, 100).toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}