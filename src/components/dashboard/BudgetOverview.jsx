import { useMemo } from 'react';
import Card from '../common/Card';
import { filterByMonth, calcPercentage, formatCurrency } from '../../utils/helpers';
import './BudgetOverview.css';

export default function BudgetOverview({ budgets, transactions, categories, currentMonth }) {
  const monthBudgets = useMemo(() => {
    return budgets.filter((b) => b.month === currentMonth);
  }, [budgets, currentMonth]);

  const monthExpenses = useMemo(() => {
    return filterByMonth(transactions, currentMonth).filter((t) => t.type === 'expense');
  }, [transactions, currentMonth]);

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
        color: cat?.color || 'var(--text-muted)',
        spent,
        limit: b.amount,
        pct,
      };
    });
  }, [monthBudgets, monthExpenses, categories]);

  return (
    <Card title="Budget Overview">
      {budgetData.length === 0 ? (
        <p className="budget-ov__empty">No budgets set for this month.</p>
      ) : (
        <div className="budget-ov__list">
          {budgetData.map((b) => (
            <div key={b.id} className="budget-ov__item">
              <div className="budget-ov__header">
                <span className="budget-ov__cat">
                  <i className={b.icon} style={{ color: b.color }}></i> {b.category}
                </span>
                <span className="budget-ov__values">
                  {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                </span>
              </div>
              <div className="budget-ov__bar-bg">
                <div
                  className={`budget-ov__bar-fill ${b.pct >= 90 ? 'budget-ov__bar-fill--danger' : b.pct >= 70 ? 'budget-ov__bar-fill--warning' : ''}`}
                  style={{ width: `${b.pct}%` }}
                ></div>
              </div>
              <span className="budget-ov__pct">{b.pct}% used</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
