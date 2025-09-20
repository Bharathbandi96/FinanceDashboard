'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GlobalDateSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function GlobalDateSelector({ selectedMonth, selectedYear, onMonthChange, onYearChange }: GlobalDateSelectorProps) {
  const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'year'>('month');
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const quarters = [
    { name: 'Q1', months: [0, 1, 2] },
    { name: 'Q2', months: [3, 4, 5] },
    { name: 'Q3', months: [6, 7, 8] },
    { name: 'Q4', months: [9, 10, 11] }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const handleQuickSelect = (period: string) => {
    const now = new Date();
    switch (period) {
      case 'current':
        onMonthChange(now.getMonth());
        onYearChange(now.getFullYear());
        break;
      case 'last':
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        onMonthChange(lastMonth);
        onYearChange(lastYear);
        break;
      case 'ytd':
        onMonthChange(0);
        onYearChange(now.getFullYear());
        break;
    }
  };

  return (
    <Card className="bg-white border shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Section - Period Info */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-lg">Analysis Period</h3>
              <p className="text-gray-600 text-sm">Select timeframe for insights</p>
            </div>
          </div>

          {/* Center Section - Main Controls */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="h-10 w-10 p-0 text-gray-600 hover:bg-gray-200 rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
                <SelectTrigger className="w-36 bg-white border-gray-300 text-gray-900 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()} className="text-gray-900 hover:bg-gray-100">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
                <SelectTrigger className="w-24 bg-white border-gray-300 text-gray-900 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-gray-900 hover:bg-gray-100">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-10 w-10 p-0 text-gray-600 hover:bg-gray-200 rounded-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Section - Quick Actions */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 border-green-200 cursor-pointer hover:bg-green-200 transition-all"
              onClick={() => handleQuickSelect('current')}
            >
              <Clock className="h-3 w-3 mr-1" />
              Current
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 border-blue-200 cursor-pointer hover:bg-blue-200 transition-all"
              onClick={() => handleQuickSelect('last')}
            >
              Last Month
            </Badge>
            <Badge 
              variant="secondary" 
              className="bg-purple-100 text-purple-800 border-purple-200 cursor-pointer hover:bg-purple-200 transition-all"
              onClick={() => handleQuickSelect('ytd')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              YTD
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}