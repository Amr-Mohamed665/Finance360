import { useMemo } from 'react';
import Card from '../../common/Card';
import { filterByMonth, calcTotal, getPreviousMonth, calcPercentage } from '../../../utils/helpers';

export default function SpendingInsights({
  transactions = [],
  categories = [],
  budgets = [],
  savingsGoals = [],
  currentMonth
}) {
  const insights = useMemo(() => {
    const monthTx = filterByMonth(transactions, currentMonth);
    const monthExpenses = monthTx.filter((t) => t && t.type === 'expense');
    const totalExpenseAmt = calcTotal(monthExpenses);

    /* 1. Highest spending category */
    const catSpending = {};
    monthExpenses.forEach((t) => {
      const catKey = String(t.categoryId || t.category?.id || t.category?.documentId || t.category || '');
      if (catKey) {
        catSpending[catKey] = (catSpending[catKey] || 0) + (Number(t.amount) || 0);
      }
    });
    let highestCat = null;
    let highestAmt = 0;
    Object.entries(catSpending).forEach(([catId, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = Array.isArray(categories)
          ? categories.find((c) => String(c.id || c.documentId) === catId)
          : null;
      }
    });

    /* 2. Monthly spending change */
    const prevMonth = getPreviousMonth(currentMonth);
    const prevExpenses = filterByMonth(transactions, prevMonth).filter((t) => t && t.type === 'expense');
    const prevTotal = calcTotal(prevExpenses);
    let spendingChange = null;
    if (prevTotal > 0) {
      spendingChange = Math.round(((totalExpenseAmt - prevTotal) / prevTotal) * 100);
    }

    /* 3. Budget usage */
    const monthBudgets = (budgets || []).filter((b) => {
      if (!b) return false;
      if (b.month === currentMonth) return true;
      if (typeof b.month === 'number' && b.year && currentMonth) {
        const [currY, currM] = currentMonth.split('-').map(Number);
        return b.month === currM && b.year === currY;
      }
      return false;
    });
    const totalBudget = monthBudgets.reduce((s, b) => s + (Number(b.amount) || 0), 0);
    const budgetPct = totalBudget > 0 ? calcPercentage(totalExpenseAmt, totalBudget) : null;

    /* 4. Savings progress */
    const totalSavingsTarget = (savingsGoals || []).reduce((s, g) => s + (Number(g.targetAmount) || 0), 0);
    const totalSavingsCurrent = (savingsGoals || []).reduce((s, g) => s + (Number(g.currentAmount) || 0), 0);
    const savingsPct = totalSavingsTarget > 0 ? calcPercentage(totalSavingsCurrent, totalSavingsTarget) : null;

    return { highestCat, highestAmt, spendingChange, budgetPct, savingsPct };
  }, [transactions, categories, budgets, savingsGoals, currentMonth]);

  const insightRows = [
    insights.highestCat && {
      icon: 'fa-solid fa-fire',
      iconColor: 'text-expense',
      text: (
        <>
          <strong className="text-text-primary">
            <i className={insights.highestCat.icon} /> {insights.highestCat.name}
          </strong>{' '}
          is your top spending category (${insights.highestAmt.toLocaleString()}).
        </>
      ),
    },
    insights.spendingChange !== null && {
      icon: insights.spendingChange >= 0 ? 'fa-solid fa-chart-line' : 'fa-solid fa-chart-line-down',
      iconColor: insights.spendingChange >= 0 ? 'text-expense' : 'text-income',
      text: (
        <>
          Spending {insights.spendingChange >= 0 ? 'increased' : 'decreased'} by{' '}
          <strong className="text-text-primary">{Math.abs(insights.spendingChange)}%</strong> vs last month.
        </>
      ),
    },
    insights.budgetPct !== null && {
      icon: 'fa-solid fa-bullseye',
      iconColor: 'text-accent-primary',
      text: (
        <>
          <strong className="text-text-primary">{insights.budgetPct}%</strong> of your monthly budget used.
        </>
      ),
    },
    insights.savingsPct !== null && {
      icon: 'fa-solid fa-piggy-bank',
      iconColor: 'text-accent-secondary',
      text: (
        <>
          <strong className="text-text-primary">{insights.savingsPct}%</strong> toward your savings goals.
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <Card title="Spending Insights">
      {insightRows.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">
          Add transactions to see your spending insights.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {insightRows.map((row, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-hover border border-border">
              <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-bg-tertiary text-sm ${row.iconColor}`}>
                <i className={row.icon} />
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">{row.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
