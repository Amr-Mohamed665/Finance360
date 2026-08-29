import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets, deleteBudget } from '../store/slices/budgetsSlice';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { getCurrentMonth, filterByMonth, getMonthLabel } from '../utils/helpers';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function BudgetsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: budgets, loading: bLoading, error: bError } = useSelector((s) => s.budgets);
  const { items: transactions, loading: tLoading } = useSelector((s) => s.transactions);
  const { items: categories } = useSelector((s) => s.categories);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchBudgets(user.id));
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  const months = useMemo(() => {
    const txMonths = transactions.map((t) => t.date.substring(0, 7));
    const budgetMonths = budgets.map((b) => b.month);
    return Array.from(new Set([getCurrentMonth(), ...txMonths, ...budgetMonths])).sort().reverse();
  }, [transactions, budgets]);

  const monthBudgets  = useMemo(() => budgets.filter((b) => b.month === selectedMonth), [budgets, selectedMonth]);
  const monthExpenses = useMemo(() => filterByMonth(transactions, selectedMonth).filter((t) => t.type === 'expense'), [transactions, selectedMonth]);

  const budgetWithUsage = useMemo(() => {
    return monthBudgets.map((b) => {
      const cat = categories.find((c) => c.id === b.categoryId);
      const spent = monthExpenses.filter((t) => t.categoryId === b.categoryId).reduce((sum, t) => sum + t.amount, 0);
      return {
        ...b,
        categoryName:  cat?.name  || 'Unknown',
        categoryIcon:  cat?.icon  || 'fa-solid fa-box-open',
        categoryColor: cat?.color || '#64748b',
        spent,
      };
    });
  }, [monthBudgets, monthExpenses, categories]);

  const handleEdit       = (budget) => { setEditingBudget(budget); setModalOpen(true); };
  const handleDelete     = (id)     => { if (window.confirm('Delete this budget limit?')) dispatch(deleteBudget(id)); };
  const handleCloseModal = ()       => { setModalOpen(false); setEditingBudget(null); };

  if (bLoading || tLoading) return <Loading message="Loading budgets..." />;
  if (bError) return <ErrorState message={bError} onRetry={() => dispatch(fetchBudgets(user.id))} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Set and track monthly category budget limits</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Month selector */}
          <div className="relative">
            <select
              className="appearance-none bg-bg-tertiary/60 border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m} className="bg-bg-secondary">{getMonthLabel(m)}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
              <i className="fa-solid fa-chevron-down" />
            </span>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <i className="fa-solid fa-plus" /> Set Budget
          </Button>
        </div>
      </div>

      {budgetWithUsage.length === 0 ? (
        <EmptyState
          icon={<i className="fa-solid fa-bullseye text-accent-primary text-2xl" />}
          title="No budgets configured"
          message={`You haven't set any budgets for ${getMonthLabel(selectedMonth)}.`}
          actionLabel="Create Budget"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgetWithUsage.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={() => handleEdit(budget)}
              onDelete={() => handleDelete(budget.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingBudget ? 'Edit Budget Limit' : 'Set Category Budget'}>
        <BudgetForm
          budget={editingBudget}
          categories={categories}
          userId={user?.id}
          month={selectedMonth}
          existingBudgets={budgets}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
