import { Transaction, Budget, AIInsight } from '@/types/finance';

export function generateAIInsights(
  transactions: Transaction[],
  budgets: Budget[],
  preferredCurrency: string
): AIInsight[] {
  const insights: AIInsight[] = [];
  
  // Analyze spending patterns
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return t.type === 'expense' && 
           transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const lastMonthExpenses = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return t.type === 'expense' && 
           transactionDate.getMonth() === lastMonth && 
           transactionDate.getFullYear() === lastMonthYear;
  });

  // Category spending analysis
  const categorySpending = thisMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // High spending category warning
  const highestCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (highestCategory && highestCategory[1] > 500) {
    insights.push({
      id: 'high-spending-' + Date.now(),
      type: 'warning',
      title: `High ${highestCategory[0]} Spending`,
      description: `You've spent $${highestCategory[1].toFixed(2)} on ${highestCategory[0]} this month. Consider reviewing these expenses.`,
      impact: 'high',
      category: highestCategory[0],
      potentialSavings: highestCategory[1] * 0.2
    });
  }

  // Budget alerts
  budgets.forEach(budget => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage > 90) {
      insights.push({
        id: 'budget-alert-' + budget.id,
        type: 'warning',
        title: `${budget.category} Budget Alert`,
        description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget. Only $${(budget.limit - budget.spent).toFixed(2)} remaining.`,
        impact: 'high',
        category: budget.category
      });
    }
  });

  // Spending trend analysis
  const thisMonthTotal = thisMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  if (thisMonthTotal > lastMonthTotal * 1.2) {
    insights.push({
      id: 'spending-increase-' + Date.now(),
      type: 'warning',
      title: 'Spending Increase Detected',
      description: `Your spending increased by ${(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)}% compared to last month.`,
      impact: 'medium',
      potentialSavings: thisMonthTotal - lastMonthTotal
    });
  } else if (thisMonthTotal < lastMonthTotal * 0.8) {
    insights.push({
      id: 'spending-decrease-' + Date.now(),
      type: 'achievement',
      title: 'Great Job Saving!',
      description: `You've reduced spending by ${(((lastMonthTotal - thisMonthTotal) / lastMonthTotal) * 100).toFixed(1)}% this month. Keep it up!`,
      impact: 'high'
    });
  }

  // Subscription detection
  const subscriptions = transactions.filter(t => 
    t.type === 'expense' && 
    (t.description.toLowerCase().includes('subscription') || 
     t.description.toLowerCase().includes('monthly') ||
     t.category === 'Entertainment')
  );

  if (subscriptions.length > 3) {
    const subscriptionTotal = subscriptions.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: 'subscription-review-' + Date.now(),
      type: 'tip',
      title: 'Review Your Subscriptions',
      description: `You have ${subscriptions.length} subscription-like expenses totaling $${subscriptionTotal.toFixed(2)}. Consider canceling unused services.`,
      impact: 'medium',
      potentialSavings: subscriptionTotal * 0.3
    });
  }

  // Savings recommendations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - thisMonthTotal) / totalIncome) * 100 : 0;
  
  if (savingsRate < 20) {
    insights.push({
      id: 'savings-goal-' + Date.now(),
      type: 'recommendation',
      title: 'Increase Your Savings Rate',
      description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for 20% by reducing discretionary spending.`,
      impact: 'high',
      potentialSavings: totalIncome * 0.2 - (totalIncome - thisMonthTotal)
    });
  }

  // Frequent small purchases
  const smallPurchases = thisMonthExpenses.filter(t => t.amount < 20);
  if (smallPurchases.length > 15) {
    const smallPurchaseTotal = smallPurchases.reduce((sum, t) => sum + t.amount, 0);
    insights.push({
      id: 'small-purchases-' + Date.now(),
      type: 'tip',
      title: 'Watch Small Purchases',
      description: `You made ${smallPurchases.length} small purchases totaling $${smallPurchaseTotal.toFixed(2)}. These add up quickly!`,
      impact: 'medium',
      potentialSavings: smallPurchaseTotal * 0.4
    });
  }

  return insights.slice(0, 6); // Return top 6 insights
}