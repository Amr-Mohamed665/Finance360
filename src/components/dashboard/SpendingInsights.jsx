import { useMemo } from 'react';
import Card from '../common/Card';
import { filterByMonth, calcTotal, getPreviousMonth, calcPercentage } from '../../utils/helpers';
import './SpendingInsights.css';

export default function SpendingInsights({ transactions, categories, budgets, savingsGoals, currentMonth }) {
  const insights = useMemo(() => {
    const monthTx = filterByMonth(transactions, currentMonth);
    const monthExpenses = monthTx.filter((t) => t.type === 'expense');
    const totalExpenseAmt = calcTotal(monthExpenses);

    /* 1. Highest spending category */
    const catSpending = {};
    monthExpenses.forEach((t) => {
      catSpending[t.categoryId] = (catSpending[t.categoryId] || 0) + t.amount;
    });
    let highestCat = null;
    let highestAmt = 0;
    Object.entries(catSpending).forEach(([catId, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = categories.find((c) => c.id === catId);
      }
    });

    /* 2. Monthly spending change */
    const prevMonth = getPreviousMonth(currentMonth);
    const prevExpenses = filterByMonth(transactions, prevMonth).filter((t) => t.type === 'expense');
    const prevTotal = calcTotal(prevExpenses);
    let spendingChange = null;
    if (prevTotal > 0) {
      spendingChange = Math.round(((totalExpenseAmt - prevTotal) / prevTotal) * 100);
    }

    /* 3. Budget usage */
    const monthBudgets = budgets.filter((b) => b.month === currentMonth);
    const totalBudget = monthBudgets.reduce((s, b) => s + b.amount, 0);
    const budgetPct = totalBudget > 0 ? calcPercentage(totalExpenseAmt, totalBudget) : null;

    /* 4. Savings progress */
    const totalSavingsTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSavingsCurrent = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
    const savingsPct = totalSavingsTarget > 0 ? calcPercentage(totalSavingsCurrent, totalSavingsTarget) : null;

    return { highestCat, highestAmt, spendingChange, budgetPct, savingsPct, prevMonth };
  }, [transactions, categories, budgets, savingsGoals, currentMonth]);

  return (
    <Card title="Spending Insights">
      <div className="insights__list">
        {insights.highestCat && (
          <div className="insight-item">
            <span className="insight-item__icon"><i className="fa-solid fa-fire text-danger"></i></span>
            <div className="insight-item__text">
              <strong><i className={insights.highestCat.icon}></i> {insights.highestCat.name}</strong> is your highest spending
              category this month (${insights.highestAmt.toLocaleString()}).
            </div>
          </div>
        )}

        {insights.spendingChange !== null && (
          <div className="insight-item">
            <span className="insight-item__icon">
              <i className={`fa-solid ${insights.spendingChange >= 0 ? 'fa-chart-line text-danger' : 'fa-chart-line-down text-success'}`}></i>
            </span>
            <div className="insight-item__text">
              Your spending {insights.spendingChange >= 0 ? 'increased' : 'decreased'} by{' '}
              <strong>{Math.abs(insights.spendingChange)}%</strong> compared with last month.
            </div>
          </div>
        )}

        {insights.budgetPct !== null && (
          <div className="insight-item">
            <span className="insight-item__icon"><i className="fa-solid fa-bullseye text-primary"></i></span>
            <div className="insight-item__text">
              You have used <strong>{insights.budgetPct}%</strong> of your monthly budget.
            </div>
          </div>
        )}

        {insights.savingsPct !== null && (
          <div className="insight-item">
            <span className="insight-item__icon"><i className="fa-solid fa-piggy-bank text-secondary"></i></span>
            <div className="insight-item__text">
              You are <strong>{insights.savingsPct}%</strong> toward your savings goals.
            </div>
          </div>
        )}

        {insights.highestCat === null && insights.spendingChange === null && (
          <p className="insights__empty">Add transactions to see your spending insights.</p>
        )}
      </div>
    </Card>
  );
}
