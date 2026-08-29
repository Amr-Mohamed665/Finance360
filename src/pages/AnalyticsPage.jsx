import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchBudgets } from '../store/slices/budgetsSlice';
import { fetchSavingsGoals } from '../store/slices/savingsGoalsSlice';
import {
  getCurrentMonth,
  getPreviousMonth,
  filterByMonth,
  calcTotal,
  getAvailableMonths,
  getMonthLabel,
  calcPercentage,
  formatCurrency,
} from '../utils/helpers';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import SpendingCategoryChart from '../components/charts/SpendingCategoryChart';
import MonthlySpendingChart from '../components/charts/MonthlySpendingChart';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

const selectCls =
  'appearance-none bg-bg-tertiary/60 border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all cursor-pointer';

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: transactions, loading: tLoading, error: tError } = useSelector((s) => s.transactions);
  const { items: categories, loading: cLoading } = useSelector((s) => s.categories);
  const { items: budgets, loading: bLoading } = useSelector((s) => s.budgets);
  const { items: savingsGoals, loading: sLoading } = useSelector((s) => s.savingsGoals);

  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);

  const [monthA, setMonthA] = useState('');
  const [monthB, setMonthB] = useState('');
  const [summaryMonth, setSummaryMonth] = useState('');

  useEffect(() => {
    if (months.length > 0) {
      setSummaryMonth(months[0]);
      setMonthA(months[0]);
      setMonthB(months.length > 1 ? months[1] : getPreviousMonth(months[0]));
    } else {
      const current = getCurrentMonth();
      setSummaryMonth(current);
      setMonthA(current);
      setMonthB(getPreviousMonth(current));
    }
  }, [months]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
      dispatch(fetchBudgets(user.id));
      dispatch(fetchSavingsGoals(user.id));
    }
  }, [dispatch, user]);

  /* Derived stats for Summary Month */
  const summaryData = useMemo(() => {
    if (!summaryMonth) return null;
    const monthTx = filterByMonth(transactions, summaryMonth);
    const income = calcTotal(monthTx, 'income');
    const expenses = calcTotal(monthTx, 'expense');
    const balance = income - expenses;

    const expensesTx = monthTx.filter((t) => t.type === 'expense');
    const totalExpenses = calcTotal(expensesTx);

    const catSpending = {};
    expensesTx.forEach((t) => {
      catSpending[t.categoryId] = (catSpending[t.categoryId] || 0) + t.amount;
    });

    const categoryBreakdown = Object.entries(catSpending).map(([catId, spent]) => {
      const cat = categories.find((c) => c.id === catId);
      const budget = budgets.find((b) => b.categoryId === catId && b.month === summaryMonth);
      return {
        categoryId: catId,
        categoryName: cat?.name || 'Unknown',
        categoryIcon: cat?.icon || 'fa-solid fa-box-open',
        categoryColor: cat?.color || '#64748b',
        spent,
        pctOfTotal: totalExpenses > 0 ? Math.round((spent / totalExpenses) * 100) : 0,
        budgetLimit: budget?.amount || 0,
        budgetUsage: budget ? calcPercentage(spent, budget.amount) : null,
      };
    });
    categoryBreakdown.sort((a, b) => b.spent - a.spent);

    return { income, expenses, balance, categoryBreakdown, totalExpenses };
  }, [summaryMonth, transactions, categories, budgets]);

  /* Period Comparison */
  const comparisonData = useMemo(() => {
    if (!monthA || !monthB) return null;
    const txA = filterByMonth(transactions, monthA);
    const txB = filterByMonth(transactions, monthB);
    const incomeA = calcTotal(txA, 'income');
    const expensesA = calcTotal(txA, 'expense');
    const incomeB = calcTotal(txB, 'income');
    const expensesB = calcTotal(txB, 'expense');
    const expenseDiffPct = expensesB > 0 ? Math.round(((expensesA - expensesB) / expensesB) * 100) : 0;
    return {
      monthALabel: getMonthLabel(monthA),
      monthBLabel: getMonthLabel(monthB),
      incomeA, expensesA, savingsA: incomeA - expensesA,
      incomeB, expensesB, savingsB: incomeB - expensesB,
      expenseDiffPct,
    };
  }, [monthA, monthB, transactions]);

  const isLoading = tLoading || cLoading || bLoading || sLoading;
  if (isLoading) return <Loading message="Loading analytics..." />;
  if (tError)    return <ErrorState message={tError} onRetry={() => dispatch(fetchTransactions(user.id))} />;
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<i className="fa-solid fa-chart-line text-accent-primary text-2xl" />}
        title="No transaction history"
        message="Analytics charts and summaries require financial records. Add transactions to begin."
      />
    );
  }

  const SelectWrap = ({ children }) => (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
        <i className="fa-solid fa-chevron-down" />
      </span>
    </div>
  );

  const SectionTitle = ({ title, children }) => (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      {children}
    </div>
  );

  const barColor = (pct) => pct >= 100 ? 'bg-expense' : pct >= 85 ? 'bg-yellow-500' : 'bg-income';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Financial Analytics</h1>
        <p className="page-subtitle">Visual insights, trend lines, and comparative metrics</p>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart transactions={transactions} />
        <SpendingCategoryChart transactions={transactions} categories={categories} />
      </div>

      <div>
        <MonthlySpendingChart transactions={transactions} />
      </div>

      {/* Monthly Details */}
      <div>
        <SectionTitle title="Monthly Details">
          <SelectWrap>
            <select className={selectCls} value={summaryMonth} onChange={(e) => setSummaryMonth(e.target.value)}>
              {months.map((m) => <option key={m} value={m} className="bg-bg-secondary">{getMonthLabel(m)}</option>)}
            </select>
          </SelectWrap>
        </SectionTitle>

        {summaryData && (
          <div className="flex flex-col gap-6">
            {/* Summary stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Income',      value: summaryData.income,   color: 'text-income', bg: 'bg-income/10 border-income/20' },
                { label: 'Expenses',    value: summaryData.expenses,  color: 'text-expense', bg: 'bg-expense/10 border-expense/20' },
                { label: 'Net Savings', value: summaryData.balance,   color: summaryData.balance >= 0 ? 'text-income' : 'text-expense', bg: 'bg-bg-tertiary/60 border-border' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`glass-panel rounded-xl p-4 border text-center ${bg}`}>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{formatCurrency(value)}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <Card title="Category Spending Breakdown">
              {summaryData.categoryBreakdown.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No expense records for this period.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {summaryData.categoryBreakdown.map((item) => (
                    <div key={item.categoryId} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-text-primary font-medium">
                          <i className={item.categoryIcon} style={{ color: item.categoryColor }} />
                          {item.categoryName}
                        </span>
                        <span className="text-sm font-semibold text-text-primary">
                          {formatCurrency(item.spent)}{' '}
                          <span className="text-xs text-text-muted">({item.pctOfTotal}%)</span>
                        </span>
                      </div>
                      {/* Of-total bar */}
                      <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary rounded-full"
                          style={{ width: `${item.pctOfTotal}%` }}
                        />
                      </div>
                      {/* Budget bar */}
                      {item.budgetUsage !== null && (
                        <div className="flex flex-col gap-1">
                          <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor(item.budgetUsage)}`}
                              style={{ width: `${Math.min(item.budgetUsage, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-text-muted">
                            Budget: {formatCurrency(item.budgetLimit)} — {item.budgetUsage}% used
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Period Comparison */}
      <div>
        <SectionTitle title="Compare Periods">
          <div className="flex items-center gap-2">
            <SelectWrap>
              <select className={selectCls} value={monthA} onChange={(e) => setMonthA(e.target.value)}>
                {months.map((m) => <option key={m} value={m} className="bg-bg-secondary">A: {getMonthLabel(m)}</option>)}
              </select>
            </SelectWrap>
            <span className="text-text-muted text-sm font-semibold">vs</span>
            <SelectWrap>
              <select className={selectCls} value={monthB} onChange={(e) => setMonthB(e.target.value)}>
                {months.map((m) => <option key={m} value={m} className="bg-bg-secondary">B: {getMonthLabel(m)}</option>)}
              </select>
            </SelectWrap>
          </div>
        </SectionTitle>

        {comparisonData && (
          <div className="glass-panel rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 px-5 py-3 bg-bg-tertiary/50 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
              <span>Metric</span>
              <span className="text-center">{comparisonData.monthALabel}</span>
              <span className="text-center">{comparisonData.monthBLabel}</span>
            </div>

            {[
              { label: 'Income',      a: comparisonData.incomeA,    b: comparisonData.incomeB,    color: 'text-income' },
              { label: 'Expenses',    a: comparisonData.expensesA,  b: comparisonData.expensesB,  color: 'text-expense' },
              { label: 'Net Savings', a: comparisonData.savingsA,   b: comparisonData.savingsB,   color: null },
            ].map(({ label, a, b, color }) => (
              <div key={label} className="grid grid-cols-3 px-5 py-3.5 border-b border-border hover:bg-bg-hover transition-colors">
                <span className="text-sm text-text-muted">{label}</span>
                <span className={`text-sm font-semibold text-center ${color ?? (a >= 0 ? 'text-income' : 'text-expense')}`}>
                  {formatCurrency(a)}
                </span>
                <span className={`text-sm font-semibold text-center ${color ?? (b >= 0 ? 'text-income' : 'text-expense')}`}>
                  {formatCurrency(b)}
                </span>
              </div>
            ))}

            {/* Insight bar */}
            <div className="px-5 py-3 bg-accent-primary/5 border-t border-border">
              <p className="text-sm text-text-secondary">
                💡{' '}
                {comparisonData.expensesB > 0 ? (
                  <>
                    <strong className="text-text-primary">{comparisonData.monthALabel}</strong> expenses are{' '}
                    <strong className={comparisonData.expenseDiffPct >= 0 ? 'text-expense' : 'text-income'}>
                      {Math.abs(comparisonData.expenseDiffPct)}% {comparisonData.expenseDiffPct >= 0 ? 'higher' : 'lower'}
                    </strong>{' '}
                    than <strong className="text-text-primary">{comparisonData.monthBLabel}</strong>.
                  </>
                ) : (
                  <>Add expense records in <strong className="text-text-primary">{comparisonData.monthBLabel}</strong> to compare spending.</>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
