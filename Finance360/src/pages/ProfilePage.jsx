import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCurrentUser, logout } from "../store/slices/authSlice";
import { fetchTransactions } from "../store/slices/transactionsSlice";
import { fetchBudgets } from "../store/slices/budgetsSlice";
import { fetchSavingsGoals } from "../store/slices/savingsGoalsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import { formatDate } from "../utils/helpers";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: transactions = [] } = useSelector(
    (state) => state.transactions,
  );
  const { items: budgets = [] } = useSelector((state) => state.budgets);
  const { items: savingsGoals = [] } = useSelector(
    (state) => state.savingsGoals,
  );
  const { items: categories = [] } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchBudgets(user.id));
      dispatch(fetchSavingsGoals(user.id));
    }
    dispatch(fetchCategories());
  }, [dispatch, user?.id]);

  const displayName = user?.username || user?.name || "User";
  const email = user?.email || "No email provided";
  const memberSince = user?.createdAt
    ? formatDate(user.createdAt)
    : "Active Member";
  const firstLetter = displayName.charAt(0).toUpperCase();

  const stats = useMemo(
    () => [
      {
        label: "Transactions",
        value: Array.isArray(transactions) ? transactions.length : 0,
        icon: "fa-solid fa-receipt",
        color: "text-accent-primary",
        bg: "bg-accent-primary/10 border-accent-primary/20",
      },
      {
        label: "Categories",
        value: Array.isArray(categories) ? categories.length : 0,
        icon: "fa-solid fa-layer-group",
        color: "text-warning",
        bg: "bg-warning/10 border-warning/20",
      },
      {
        label: "Active Budgets",
        value: Array.isArray(budgets) ? budgets.length : 0,
        icon: "fa-solid fa-bullseye",
        color: "text-expense",
        bg: "bg-expense/10 border-expense/20",
      },
      {
        label: "Savings Goals",
        value: Array.isArray(savingsGoals) ? savingsGoals.length : 0,
        icon: "fa-solid fa-piggy-bank",
        color: "text-savings",
        bg: "bg-savings/10 border-savings/20",
      },
    ],
    [transactions, categories, budgets, savingsGoals],
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-5xl mx-auto w-full">
      {/* Profile Overview Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-border relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-4xl sm:text-5xl font-extrabold shadow-glow-indigo border-2 border-white/20 flex-shrink-0">
              {firstLetter}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-primary/15 text-accent-primary border border-accent-primary/25">
                  Verified User
                </span>
              </div>

              <p className="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-2">
                <i className="fa-solid fa-envelope text-text-muted text-xs" />
                {email}
              </p>

              <p className="text-xs text-text-muted flex items-center justify-center sm:justify-start gap-2 mt-1">
                <i className="fa-solid fa-calendar text-text-muted text-xs" />
                Member since {memberSince}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Link to="/profile/edit" className="flex-shrink-0">
            <Button variant="primary">
              <i className="fa-solid fa-user-pen" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Activity Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => (
          <div
            key={st.label}
            className={`glass-panel rounded-xl p-4 flex flex-col gap-2 border ${st.bg} transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">
                {st.label}
              </span>
              <span className={`text-sm ${st.color}`}>
                <i className={st.icon} />
              </span>
            </div>
            <span className="text-2xl font-bold text-text-primary">
              {st.value}
            </span>
          </div>
        ))}
      </div>

      {/* Details Card */}
      <Card title="Account Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-bg-tertiary/40 border border-border/50 flex items-center justify-between">
            <span className="text-text-muted flex items-center gap-2">
              <i className="fa-solid fa-user text-xs w-4 text-accent-primary" />{" "}
              Username
            </span>
            <span className="font-semibold text-text-primary">
              {displayName}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-tertiary/40 border border-border/50 flex items-center justify-between">
            <span className="text-text-muted flex items-center gap-2">
              <i className="fa-solid fa-envelope text-xs w-4 text-accent-primary" />{" "}
              Email
            </span>
            <span className="font-semibold text-text-primary">{email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-tertiary/40 border border-border/50 flex items-center justify-between">
            <span className="text-text-muted flex items-center gap-2">
              <i className="fa-solid fa-id-badge text-xs w-4 text-accent-primary" />{" "}
              User ID
            </span>
            <span className="font-mono text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded border border-border">
              {user?.id || user?.documentId || "Local ID"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-tertiary/40 border border-border/50 flex items-center justify-between">
            <span className="text-text-muted flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-xs w-4 text-accent-primary" />{" "}
              Status
            </span>
            <span className="text-xs font-semibold text-income flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-income animate-pulse" />{" "}
              Active
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
