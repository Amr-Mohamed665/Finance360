import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchBudgets } from '../store/slices/budgetsSlice';
import { fetchSavingsGoals } from '../store/slices/savingsGoalsSlice';
import { getCurrentMonth, filterByMonth, calcTotal } from '../utils/helpers';
import SummaryCards from '../components/dashboard/SummaryCards';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetOverview from '../components/dashboard/BudgetOverview';
import SavingsOverview from '../components/dashboard/SavingsOverview';
import SpendingInsights from '../components/dashboard/SpendingInsights';
import DashboardChart from '../components/dashboard/DashboardChart';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import './DashboardPage.css';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: transactions, loading: tLoading, error: tError } = useSelector((s) => s.transactions);
  const { items: categories, loading: cLoading } = useSelector((s) => s.categories);
  const { items: budgets, loading: bLoading } = useSelector((s) => s.budgets);
  const { items: savingsGoals, loading: sLoading } = useSelector((s) => s.savingsGoals);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
      dispatch(fetchBudgets(user.id));
      dispatch(fetchSavingsGoals(user.id));
    }
  }, [dispatch, user]);

  const currentMonth = getCurrentMonth();
  const monthTransactions = useMemo(() => filterByMonth(transactions, currentMonth), [transactions, currentMonth]);
  const totalIncome = useMemo(() => calcTotal(monthTransactions, 'income'), [monthTransactions]);
  const totalExpenses = useMemo(() => calcTotal(monthTransactions, 'expense'), [monthTransactions]);
  const balance = totalIncome - totalExpenses;
  const totalSavings = useMemo(
    () => savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0),
    [savingsGoals]
  );

  const isLoading = tLoading || cLoading || bLoading || sLoading;

  if (isLoading) return <Loading message="Loading dashboard..." />;
  if (tError) return <ErrorState message={tError} onRetry={() => dispatch(fetchTransactions(user.id))} />;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          <p className="dashboard__subtitle">Welcome back, {user?.name}! Here&apos;s your financial overview.</p>
        </div>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        totalSavings={totalSavings}
      />

      <div className="dashboard__grid">
        <div className="dashboard__grid-main">
          <DashboardChart transactions={transactions} />
          <RecentTransactions transactions={transactions} categories={categories} />
        </div>
        <div className="dashboard__grid-side">
          <SpendingInsights
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            savingsGoals={savingsGoals}
            currentMonth={currentMonth}
          />
          <BudgetOverview
            budgets={budgets}
            transactions={transactions}
            categories={categories}
            currentMonth={currentMonth}
          />
          <SavingsOverview savingsGoals={savingsGoals} />
        </div>
      </div>
    </div>
  );
}
