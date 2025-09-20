'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIInsight } from '@/types/finance';
import { Brain, AlertTriangle, Lightbulb, Trophy, Target, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  insights: AIInsight[];
}

export function AIInsightsCard({ insights }: AIInsightsProps) {
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-green-500" />;
      case 'recommendation':
        return <Target className="h-4 w-4 text-purple-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'border-l-orange-500 bg-orange-50';
      case 'tip':
        return 'border-l-blue-500 bg-blue-50';
      case 'achievement':
        return 'border-l-green-500 bg-green-50';
      case 'recommendation':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const totalPotentialSavings = insights
    .filter(insight => insight.potentialSavings)
    .reduce((sum, insight) => sum + (insight.potentialSavings || 0), 0);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Financial Insights
          </CardTitle>
          {totalPotentialSavings > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Potential Savings: ${totalPotentialSavings.toFixed(2)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No insights available yet.</p>
              <p className="text-sm">Add more transactions to get personalized recommendations.</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 border-l-4 rounded-r-lg ${getInsightColor(insight.type)} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      insight.impact === 'high' ? 'border-red-300 text-red-700' :
                      insight.impact === 'medium' ? 'border-yellow-300 text-yellow-700' :
                      'border-green-300 text-green-700'
                    }`}
                  >
                    {insight.impact} impact
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                {insight.potentialSavings && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">
                      Potential savings: ${insight.potentialSavings.toFixed(2)}
                    </span>
                    {insight.category && (
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {insights.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}