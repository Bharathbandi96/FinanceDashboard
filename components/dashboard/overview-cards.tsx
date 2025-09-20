'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { FinancialSummary } from '@/types/finance';
import { formatCurrency } from '@/lib/currency';

interface OverviewCardsProps {
  summary: FinancialSummary;
  preferredCurrency: string;
}

export function OverviewCards({ summary, preferredCurrency }: OverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-800">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-700">
            {formatCurrency(summary.totalIncome, preferredCurrency)}
          </div>
          <p className="text-xs text-emerald-600">This month</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {formatCurrency(summary.totalExpenses, preferredCurrency)}
          </div>
          <p className="text-xs text-red-600">This month</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Net Income</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {formatCurrency(summary.netIncome, preferredCurrency)}
          </div>
          <p className="text-xs text-blue-600">This month</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Savings Rate</CardTitle>
          <PiggyBank className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {summary.savingsRate.toFixed(1)}%
          </div>
          <p className="text-xs text-purple-600">
            Goal: {formatCurrency(summary.monthlyAverage * 0.2, preferredCurrency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}