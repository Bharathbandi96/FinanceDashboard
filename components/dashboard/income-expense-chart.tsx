'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/lib/currency';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  currency: string;
}

export function IncomeExpenseChart({ transactions, currency }: IncomeExpenseChartProps) {
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
  
  // Get last 6 months of data
  const monthlyData = getMonthlyData(filteredTransactions, selectedDate);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Income vs Expenses</h3>
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [formatCurrency(Number(value), currency), '']} />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function getMonthlyData(transactions: Transaction[], selectedDate: Date) {
  const monthlyTotals: { [key: string]: { income: number; expenses: number } } = {};
  
  // Generate data for the selected month and 5 months before it
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() - i);
    months.push(date);
  }
  
  // Initialize all months with zero values
  months.forEach(date => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyTotals[key] = { income: 0, expenses: 0 };
  });
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyTotals[monthKey]) {
      if (transaction.type === 'income') {
        monthlyTotals[monthKey].income += transaction.amount;
      } else {
        monthlyTotals[monthKey].expenses += transaction.amount;
      }
    }
  });

  return months.map(date => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const data = monthlyTotals[key];
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    };
  });
}