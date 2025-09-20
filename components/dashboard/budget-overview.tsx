'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget, Transaction } from '@/types/finance';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { AlertTriangle, CheckCircle, PlusCircle, TrendingDown } from 'lucide-react';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  preferredCurrency: string;
}

export function BudgetOverview({ budgets, transactions, selectedMonth, selectedYear, preferredCurrency }: BudgetOverviewProps) {
  // Get all categories from transactions
  const allCategories = Array.from(new Set(transactions.map(t => t.category)));
  
  // Calculate actual spending for each category in the selected month
  const categorySpending = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' &&
             transactionDate.getFullYear() === selectedYear &&
             transactionDate.getMonth() === selectedMonth;
    })
    .reduce((acc, transaction) => {
      const amount = convertCurrency(transaction.amount, transaction.currency, preferredCurrency);
      acc[transaction.category] = (acc[transaction.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  // Create comprehensive budget data including categories without budgets
  const comprehensiveBudgets = allCategories.map(category => {
    const existingBudget = budgets.find(b => b.category === category);
    const actualSpent = categorySpending[category] || 0;
    
    if (existingBudget) {
      return {
        ...existingBudget,
        spent: actualSpent
      };
    } else {
      // Create a virtual budget for categories without set budgets
      return {
        id: `virtual-${category}`,
        category,
        limit: 0,
        spent: actualSpent,
        period: 'monthly' as const,
        isVirtual: true
      };
    }
  }).sort((a, b) => b.spent - a.spent);
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <TrendingDown className="h-5 w-5 text-purple-600" />
          Budget & Category Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comprehensiveBudgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;
            const isVirtual = 'isVirtual' in budget && budget.isVirtual;

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{budget.category}</span>
                    {isVirtual ? (
                      <PlusCircle className="h-4 w-4 text-gray-400" />
                    ) : (
                      <>
                        {isOverBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {!isOverBudget && !isNearLimit && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isVirtual ? (
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        No Budget Set
                      </Badge>
                    ) : (
                      <Badge 
                        variant={isOverBudget ? 'destructive' : isNearLimit ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {percentage.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  {!isVirtual ? (
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                    />
                  ) : (
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: '100%' }} />
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(budget.spent, preferredCurrency)} spent</span>
                    {!isVirtual ? (
                      <span>{formatCurrency(budget.limit, preferredCurrency)} limit</span>
                    ) : (
                      <span className="text-gray-400">Set budget limit</span>
                    )}
                  </div>
                  {!isVirtual && (
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(Math.max(0, budget.limit - budget.spent), preferredCurrency)} remaining
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {comprehensiveBudgets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No expense categories found.</p>
              <p className="text-sm">Start adding transactions to see budget overview.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}