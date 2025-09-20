'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Zap, Target } from 'lucide-react';
import { FinancialSummary } from '@/types/finance';
import { formatCurrency } from '@/lib/currency';

interface PremiumOverviewCardsProps {
  summary: FinancialSummary;
  preferredCurrency: string;
}

export function PremiumOverviewCards({ summary, preferredCurrency }: PremiumOverviewCardsProps) {
  const cards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 via-emerald-100 to-emerald-200',
      shadowColor: 'shadow-emerald-500/25',
      iconBg: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      subtitle: 'This period'
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      gradient: 'from-red-400 via-red-500 to-red-600',
      bgGradient: 'from-red-50 via-red-100 to-red-200',
      shadowColor: 'shadow-red-500/25',
      iconBg: 'bg-red-500',
      textColor: 'text-red-700',
      subtitle: 'This period'
    },
    {
      title: 'Net Income',
      value: summary.netIncome,
      icon: DollarSign,
      gradient: summary.netIncome >= 0 ? 'from-blue-400 via-blue-500 to-blue-600' : 'from-orange-400 via-orange-500 to-orange-600',
      bgGradient: summary.netIncome >= 0 ? 'from-blue-50 via-blue-100 to-blue-200' : 'from-orange-50 via-orange-100 to-orange-200',
      shadowColor: summary.netIncome >= 0 ? 'shadow-blue-500/25' : 'shadow-orange-500/25',
      iconBg: summary.netIncome >= 0 ? 'bg-blue-500' : 'bg-orange-500',
      textColor: summary.netIncome >= 0 ? 'text-blue-700' : 'text-orange-700',
      subtitle: 'Balance'
    },
    {
      title: 'Savings Rate',
      value: summary.savingsRate,
      icon: PiggyBank,
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 via-purple-100 to-purple-200',
      shadowColor: 'shadow-purple-500/25',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-700',
      subtitle: 'Target: 20%',
      isPercentage: true
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.title}
            className={`group relative overflow-hidden border-0 ${card.shadowColor} shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-90`} />
            
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating orbs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg group-hover:bg-white/10 transition-all duration-500" />
            
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-semibold ${card.textColor}`}>
                {card.title}
              </CardTitle>
              <div className={`p-2 ${card.iconBg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            
            <CardContent className="relative">
              <div className={`text-3xl font-bold ${card.textColor} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                {card.isPercentage 
                  ? `${card.value.toFixed(1)}%`
                  : formatCurrency(card.value, preferredCurrency)
                }
              </div>
              <p className={`text-xs ${card.textColor} opacity-70`}>
                {card.subtitle}
              </p>
              
              {/* Progress indicator for savings rate */}
              {card.isPercentage && (
                <div className="mt-3">
                  <div className="w-full bg-white/30 rounded-full h-1.5">
                    <div 
                      className={`bg-gradient-to-r ${card.gradient} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(card.value / 20 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
          </Card>
        );
      })}
    </div>
  );
}