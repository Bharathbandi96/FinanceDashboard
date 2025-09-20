'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Transaction } from '@/types/finance';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { TrendingUp } from 'lucide-react';

interface SpendingTrendsChartProps {
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  preferredCurrency: string;
}

export function SpendingTrendsChart({ transactions, selectedMonth, selectedYear, preferredCurrency }: SpendingTrendsChartProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  // Filter transactions for selected month/year
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === selectedDate.getMonth() &&
           transactionDate.getFullYear() === selectedDate.getFullYear();
  });
  
  // Get daily spending data for the current month
  const dailyData = getDailySpendingData(filteredTransactions, selectedDate);

  // Generate daily spending data for the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const dailyDataOriginal = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(selectedYear, selectedMonth, day);
    
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === selectedYear &&
             transactionDate.getMonth() === selectedMonth &&
             transactionDate.getDate() === day;
    });

    const expenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency, preferredCurrency), 0);

    return {
      day: day.toString(),
      expenses,
      income,
      net: income - expenses,
    };
  });

  // Calculate cumulative spending
  let cumulativeExpenses = 0;
  const cumulativeData = dailyDataOriginal.map(day => {
    cumulativeExpenses += day.expenses;
    return {
      ...day,
      cumulative: cumulativeExpenses,
    };
  });

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Daily Spending Trends
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-600 min-w-[120px] text-center">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cumulativeData}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value, name) => [
                formatCurrency(Number(value), preferredCurrency), 
                name === 'expenses' ? 'Daily Expenses' : 
                name === 'cumulative' ? 'Cumulative Expenses' : 'Daily Income'
              ]}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#cumulativeGradient)"
              name="cumulative"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              name="expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function getDailySpendingData(transactions: Transaction[], selectedDate: Date) {
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
  const dailyTotals: { [key: string]: number } = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const date = new Date(transaction.date);
      if (date >= firstDay && date <= lastDay) {
        const dayKey = date.getDate().toString();
        dailyTotals[dayKey] = (dailyTotals[dayKey] || 0) + transaction.amount;
      }
    });
  
  let cumulativeSpending = 0;
  const data = [];
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayKey = day.toString();
    const dailyAmount = dailyTotals[dayKey] || 0;
    cumulativeSpending += dailyAmount;
    
    data.push({
      day: dayKey,
      amount: dailyAmount,
      cumulative: cumulativeSpending,
    });
  }
  
  return data;
}