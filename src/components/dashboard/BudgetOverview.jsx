import { useMemo } from 'react';
import Card from '../common/Card';
import { filterByMonth, calcPercentage, formatCurrency } from '../../utils/helpers';

export default function BudgetOverview({ budgets, transactions, categories, currentMonth }) {
  const monthBudgets = useMemo(
    () => budgets.filter((b) => b.month === currentMonth),
    [budgets, currentMonth]
  );

  const monthExpenses = useMemo(
    () => filterByMonth(transactions, currentMonth).filter((t) => t.type === 'expense'),
    [transactions, currentMonth]
  );

  const budgetData = useMemo(() => {
    return monthBudgets.map((b) => {
      const cat = categories.find((c) => c.id === b.categoryId);
      const spent = monthExpenses
        .filter((t) => t.categoryId === b.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      const pct = calcPercentage(spent, b.amount);
      return {
        id: b.id,
        category: cat?.name || 'Unknown',
        icon: cat?.icon || 'fa-solid fa-box-open',
        color: cat?.color || '#64748b',
        spent,
        limit: b.amount,
        pct,
      };
    });
  }, [monthBudgets, monthExpenses, categories]);

  const barColor = (pct) => {
    if (pct >= 90) return 'bg-expense';
    if (pct >= 70) return 'bg-yellow-500';
    return 'bg-income';
  };

  return (
    <Card title="Budget Overview">
      {budgetData.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">No budgets set for this month.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {budgetData.map((b) => (
            <div key={b.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-text-primary font-medium">
                  <i className={b.icon} style={{ color: b.color }} />
                  {b.category}
                </span>
                <span className="text-xs text-text-muted">
                  {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor(b.pct)}`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="text-xs text-text-muted">{b.pct}% used</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
