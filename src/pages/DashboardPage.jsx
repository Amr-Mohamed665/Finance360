import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  const { user } = useSelector((s) => s.auth);
  const {
    items: transactions = [],
    loading: tLoading,
    error: tError,
  } = useSelector((s) => s.transactions);
  const { items: categories = [], loading: cLoading } = useSelector(
    (s) => s.categories,
  );
  const { items: budgets = [], loading: bLoading } = useSelector(
    (s) => s.budgets,
  );
  const { items: savingsGoals = [], loading: sLoading } = useSelector(
    (s) => s.savingsGoals,
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchBudgets(user.id));
      dispatch(fetchSavingsGoals(user.id));
    }
    dispatch(fetchCategories());
  }, [dispatch, user]);

  const currentMonth = getCurrentMonth();
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
  const totalSavings = useMemo(
    () =>
      Array.isArray(savingsGoals)
        ? savingsGoals.reduce(
            (sum, g) => sum + (Number(g.currentAmount) || 0),
            0,
          )
        : 0,
    [savingsGoals],
  );

  const isLoading = tLoading || cLoading || bLoading || sLoading;

  if (isLoading && (!transactions || transactions.length === 0))
    return <Loading message="Loading dashboard..." />;
  if (tError && (!transactions || transactions.length === 0)) {
    return (
      <ErrorState
        message={tError}
        onRetry={() => dispatch(fetchTransactions(user?.id))}
      />
    );
  }

  const displayName = user?.username || user?.name || "User";

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Summary Cards */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        totalSavings={totalSavings}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <DashboardChart transactions={transactions} />
          <RecentTransactions
            transactions={transactions}
            categories={categories}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
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
