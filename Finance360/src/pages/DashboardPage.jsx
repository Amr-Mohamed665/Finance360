import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiBarChart2, FiCalendar, FiRefreshCw } from "react-icons/fi";

import { fetchTransactions } from "../store/slices/transactionsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import { fetchBudgets } from "../store/slices/budgetsSlice";
import { fetchSavingsGoals } from "../store/slices/savingsGoalsSlice";

import { getCurrentMonth, filterByMonth, calcTotal } from "../utils/helpers";

import SummaryCards from "../components/features/dashboard/SummaryCards";
import RecentTransactions from "../components/features/dashboard/RecentTransactions";
import BudgetOverview from "../components/features/dashboard/BudgetOverview";
import SavingsOverview from "../components/features/dashboard/SavingsOverview";
import SpendingInsights from "../components/features/dashboard/SpendingInsights";
import DashboardChart from "../components/features/dashboard/DashboardChart";

import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    items: transactions = [],
    loading: tLoading,
    error: tError,
  } = useSelector((state) => state.transactions);

  const { items: categories = [], loading: cLoading } = useSelector(
    (state) => state.categories,
  );

  const { items: budgets = [], loading: bLoading } = useSelector(
    (state) => state.budgets,
  );

  const { items: savingsGoals = [], loading: sLoading } = useSelector(
    (state) => state.savingsGoals,
  );

  // Fetch dashboard data

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchBudgets(user.id));
      dispatch(fetchSavingsGoals(user.id));
    }

    dispatch(fetchCategories());
  }, [dispatch, user?.id]);

  // Calculations

  const currentMonth = getCurrentMonth();

  const currentMonthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const monthTransactions = useMemo(
    () => filterByMonth(transactions, currentMonth),
    [transactions, currentMonth],
  );

  const totalIncome = useMemo(
    () => calcTotal(monthTransactions, "income"),
    [monthTransactions],
  );

  const totalExpenses = useMemo(
    () => calcTotal(monthTransactions, "expense"),
    [monthTransactions],
  );

  const balance = totalIncome - totalExpenses;

  const totalSavings = useMemo(() => {
    if (!Array.isArray(savingsGoals)) return 0;

    return savingsGoals.reduce(
      (sum, goal) => sum + (Number(goal.currentAmount) || 0),
      0,
    );
  }, [savingsGoals]);

  const isLoading = tLoading || cLoading || bLoading || sLoading;

  // Loading state

  if (isLoading && (!transactions || transactions.length === 0)) {
    return <Loading message="Loading your financial dashboard..." />;
  }

  // Error state

  if (tError && (!transactions || transactions.length === 0)) {
    return (
      <ErrorState
        message={tError}
        onRetry={() => {
          if (user?.id) {
            dispatch(fetchTransactions(user.id));
          }
        }}
      />
    );
  }

  const displayName = user?.username || user?.name || "User";

  // Dashboard

  return (
    <div className="min-h-full space-y-6 pb-8 animate-fade-in">
      {/* Dashboard Header */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <FiBarChart2 className="h-4 w-4" />
            <span>Financial Overview</span>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {displayName}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening with your finances this month.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <FiCalendar className="h-4 w-4" />
            <span>{currentMonthLabel}</span>
          </div>
        </div>
      </header>

      {/* Summary Cards */}

      <section>
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
          totalSavings={totalSavings}
        />
      </section>

      {/* Main Dashboard Grid */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main Content */}

        <div className="min-w-0 space-y-6">
          {/* Chart */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <DashboardChart transactions={transactions} />
          </div>

          {/* Recent Transactions */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <RecentTransactions
              transactions={transactions}
              categories={categories}
            />
          </div>
        </div>

        {/* Sidebar */}

        <aside className="min-w-0 space-y-6">
          {/* Spending Insights */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <SpendingInsights
              transactions={transactions}
              categories={categories}
              budgets={budgets}
              savingsGoals={savingsGoals}
              currentMonth={currentMonth}
            />
          </div>

          {/* Budget */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <BudgetOverview
              budgets={budgets}
              transactions={transactions}
              categories={categories}
              currentMonth={currentMonth}
            />
          </div>

          {/* Savings */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <SavingsOverview savingsGoals={savingsGoals} />
          </div>
        </aside>
      </section>
    </div>
  );
}
