import { useMemo } from 'react';
import Card from '../../common/Card';
import { filterByMonth, calcPercentage, formatCurrency } from '../../../utils/helpers';

export default function BudgetOverview({ budgets = [], transactions = [], categories = [], currentMonth }) {
  const monthBudgets = useMemo(() => {
    if (!Array.isArray(budgets)) return [];
    return budgets.filter((b) => {
      if (!b) return false;
      if (b.month === currentMonth) return true;
      if (typeof b.month === 'number' && b.year && currentMonth) {
        const [currY, currM] = currentMonth.split('-').map(Number);
        return b.month === currM && b.year === currY;
      }
      return false;
    });
  }, [budgets, currentMonth]);

  const monthExpenses = useMemo(
    () => filterByMonth(transactions, currentMonth).filter((t) => t && t.type === 'expense'),
    [transactions, currentMonth]
  );

  const budgetData = useMemo(() => {
    return monthBudgets.map((b) => {
      const bCatId = String(b.categoryId || b.category?.id || b.category?.documentId || b.category || '');
      const cat = Array.isArray(categories)
        ? categories.find((c) => String(c.id || c.documentId) === bCatId)
        : null;

      const spent = monthExpenses
        .filter((t) => {
          const tCatId = String(t.categoryId || t.category?.id || t.category?.documentId || t.category || '');
          return tCatId === bCatId;
        })
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const pct = calcPercentage(spent, b.amount);
      return {
        id: b.id || b.documentId,
        category: cat?.name || b.category?.name || 'Unknown',
        icon: cat?.icon || b.category?.icon || 'fa-solid fa-box-open',
        color: cat?.color || b.category?.color || '#64748b',
        spent,
        limit: Number(b.amount) || 0,
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
