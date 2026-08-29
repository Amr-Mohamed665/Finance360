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
import './AnalyticsPage.css';

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

  // Synchronize dropdown default values once months load
  useEffect(() => {
    if (months.length > 0) {
      setSummaryMonth(months[0]);
      setMonthA(months[0]);
      if (months.length > 1) {
        setMonthB(months[1]);
      } else {
        setMonthB(getPreviousMonth(months[0]));
      }
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

    // Spending by category breakdown
    const categoryBreakdown = [];
    const expensesTx = monthTx.filter((t) => t.type === 'expense');
    const totalExpenses = calcTotal(expensesTx);

    const catSpending = {};
    expensesTx.forEach((t) => {
      catSpending[t.categoryId] = (catSpending[t.categoryId] || 0) + t.amount;
    });

    Object.entries(catSpending).forEach(([catId, spent]) => {
      const cat = categories.find((c) => c.id === catId);
      const budget = budgets.find((b) => b.categoryId === catId && b.month === summaryMonth);
      categoryBreakdown.push({
        categoryId: catId,
        categoryName: cat?.name || 'Unknown',
        categoryIcon: cat?.icon || 'fa-solid fa-box-open',
        categoryColor: cat?.color || 'var(--text-muted)',
        spent,
        pctOfTotal: totalExpenses > 0 ? Math.round((spent / totalExpenses) * 100) : 0,
        budgetLimit: budget?.amount || 0,
        budgetUsage: budget ? calcPercentage(spent, budget.amount) : null,
      });
    });

    categoryBreakdown.sort((a, b) => b.spent - a.spent);

    return { income, expenses, balance, categoryBreakdown, totalExpenses };
  }, [summaryMonth, transactions, categories, budgets]);

  /* Period Comparison derived stats */
  const comparisonData = useMemo(() => {
    if (!monthA || !monthB) return null;
    const txA = filterByMonth(transactions, monthA);
    const txB = filterByMonth(transactions, monthB);

    const incomeA = calcTotal(txA, 'income');
    const expensesA = calcTotal(txA, 'expense');
    const savingsA = incomeA - expensesA;

    const incomeB = calcTotal(txB, 'income');
    const expensesB = calcTotal(txB, 'expense');
    const savingsB = incomeB - expensesB;

    let expenseDiffPct = 0;
    if (expensesB > 0) {
      expenseDiffPct = Math.round(((expensesA - expensesB) / expensesB) * 100);
    }

    return {
      monthALabel: getMonthLabel(monthA),
      monthBLabel: getMonthLabel(monthB),
      incomeA,
      expensesA,
      savingsA,
      incomeB,
      expensesB,
      savingsB,
      expenseDiffPct,
    };
  }, [monthA, monthB, transactions]);

  const isLoading = tLoading || cLoading || bLoading || sLoading;

  if (isLoading) return <Loading message="Loading analytics..." />;
  if (tError) return <ErrorState message={tError} onRetry={() => dispatch(fetchTransactions(user.id))} />;
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<i className="fa-solid fa-chart-line text-primary"></i>}
        title="No transaction history"
        message="Analytics charts and summaries require financial records. Add transactions to begin."
      />
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-page__header">
        <h1 className="analytics-page__title">Financial Analytics</h1>
        <p className="analytics-page__subtitle">Visual insights, trend lines, and comparative metrics</p>
      </div>

      {/* Main charts */}
      <div className="analytics-charts-grid">
        <IncomeExpenseChart transactions={transactions} />
        <SpendingCategoryChart transactions={transactions} categories={categories} />
      </div>

      <div className="analytics-trend-section">
        <MonthlySpendingChart transactions={transactions} />
      </div>

      {/* Monthly Summary Section */}
      <div className="analytics-section-title">
        <h2>Monthly Details</h2>
        <select
          className="analytics-month-select"
          value={summaryMonth}
          onChange={(e) => setSummaryMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {getMonthLabel(m)}
            </option>
          ))}
        </select>
      </div>

      {summaryData && (
        <div className="summary-details">
          <div className="summary-details__cards">
            <div className="summary-detail-card">
              <span className="summary-detail-card__label">Income</span>
              <span className="summary-detail-card__value text-success">
                {formatCurrency(summaryData.income)}
              </span>
            </div>
            <div className="summary-detail-card">
              <span className="summary-detail-card__label">Expenses</span>
              <span className="summary-detail-card__value text-danger">
                {formatCurrency(summaryData.expenses)}
              </span>
            </div>
            <div className="summary-detail-card">
              <span className="summary-detail-card__label">Net Savings</span>
              <span className={`summary-detail-card__value ${summaryData.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(summaryData.balance)}
              </span>
            </div>
          </div>

          <div className="summary-details__categories">
            <Card title="Category Spending Breakdown">
              {summaryData.categoryBreakdown.length === 0 ? (
                <p className="no-expenses-label">No expense records found for this period.</p>
              ) : (
                <div className="breakdown-list">
                  {summaryData.categoryBreakdown.map((item) => (
                    <div key={item.categoryId} className="breakdown-item">
                      <div className="breakdown-item__meta">
                        <span className="breakdown-item__name">
                          <i className={item.categoryIcon} style={{ color: item.categoryColor }}></i> {item.categoryName}
                        </span>
                        <span className="breakdown-item__value">
                          {formatCurrency(item.spent)} ({item.pctOfTotal}%)
                        </span>
                      </div>
                      {item.budgetUsage !== null && (
                        <div className="breakdown-item__budget">
                          <div className="breakdown-item__budget-bar-bg">
                            <div
                              className={`breakdown-item__budget-bar-fill ${item.budgetUsage >= 100 ? 'bg-danger' : item.budgetUsage >= 85 ? 'bg-warning' : 'bg-success'}`}
                              style={{ width: `${item.budgetUsage}%` }}
                            ></div>
                          </div>
                          <span className="breakdown-item__budget-pct">
                            Budget limit: {formatCurrency(item.budgetLimit)} ({item.budgetUsage}% used)
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Period Comparison Section */}
      <div className="analytics-section-title">
        <h2>Compare Periods</h2>
        <div className="compare-selectors">
          <select
            className="analytics-month-select"
            value={monthA}
            onChange={(e) => setMonthA(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                Month A: {getMonthLabel(m)}
              </option>
            ))}
          </select>
          <span className="compare-vs">vs</span>
          <select
            className="analytics-month-select"
            value={monthB}
            onChange={(e) => setMonthB(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                Month B: {getMonthLabel(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparisonData && (
        <div className="comparison-cards">
          <div className="comparison-card compare-header-card">
            <span className="comparison-card__label">Metric</span>
            <span className="comparison-card__value compare-month-header">{comparisonData.monthALabel} (A)</span>
            <span className="comparison-card__value compare-month-header">{comparisonData.monthBLabel} (B)</span>
          </div>

          <div className="comparison-card">
            <span className="comparison-card__label">Income</span>
            <span className="comparison-card__value text-success">{formatCurrency(comparisonData.incomeA)}</span>
            <span className="comparison-card__value text-success">{formatCurrency(comparisonData.incomeB)}</span>
          </div>

          <div className="comparison-card">
            <span className="comparison-card__label">Expenses</span>
            <span className="comparison-card__value text-danger">{formatCurrency(comparisonData.expensesA)}</span>
            <span className="comparison-card__value text-danger">{formatCurrency(comparisonData.expensesB)}</span>
          </div>

          <div className="comparison-card">
            <span className="comparison-card__label">Net Savings</span>
            <span className={`comparison-card__value ${comparisonData.savingsA >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(comparisonData.savingsA)}
            </span>
            <span className={`comparison-card__value ${comparisonData.savingsB >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(comparisonData.savingsB)}
            </span>
          </div>

          <div className="comparison-insights-bar">
            {comparisonData.expensesB > 0 ? (
              <p>
                💡 {comparisonData.monthALabel} expenses are{' '}
                <strong>
                  {Math.abs(comparisonData.expenseDiffPct)}%{' '}
                  {comparisonData.expenseDiffPct >= 0 ? 'higher' : 'lower'}
                </strong>{' '}
                than {comparisonData.monthBLabel}.
              </p>
            ) : (
              <p>💡 Add expense records in {comparisonData.monthBLabel} to compare spending.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
