'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnimatedChartContainerProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export function AnimatedChartContainer({ 
  title, 
  icon: Icon, 
  children, 
  className = '',
  gradient = 'from-slate-900 via-slate-800 to-slate-900'
}: AnimatedChartContainerProps) {
  return (
    <Card className={`group relative overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 bg-white ${className}`}>
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gray-900 transition-colors duration-300">
          <div className="p-2 bg-blue-500 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">{title}</span>
          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-50 rounded-xl p-4 border group-hover:bg-gray-100 transition-all duration-300">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}