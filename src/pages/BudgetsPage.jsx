import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets, deleteBudget } from '../store/slices/budgetsSlice';
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { getCurrentMonth, filterByMonth, getAvailableMonths, getMonthLabel } from '../utils/helpers';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './BudgetsPage.css';

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
    // Merge transaction months and budget months to get all available selections
    const txMonths = transactions.map((t) => t.date.substring(0, 7));
    const budgetMonths = budgets.map((b) => b.month);
    const uniqueMonths = Array.from(new Set([getCurrentMonth(), ...txMonths, ...budgetMonths]));
    return uniqueMonths.sort().reverse();
  }, [transactions, budgets]);

  const monthBudgets = useMemo(() => {
    return budgets.filter((b) => b.month === selectedMonth);
  }, [budgets, selectedMonth]);

  const monthExpenses = useMemo(() => {
    return filterByMonth(transactions, selectedMonth).filter((t) => t.type === 'expense');
  }, [transactions, selectedMonth]);

  const budgetWithUsage = useMemo(() => {
    return monthBudgets.map((b) => {
      const cat = categories.find((c) => c.id === b.categoryId);
      const spent = monthExpenses
        .filter((t) => t.categoryId === b.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...b,
        categoryName: cat?.name || 'Unknown',
        categoryIcon: cat?.icon || 'fa-solid fa-box-open',
        categoryColor: cat?.color || 'var(--text-muted)',
        spent,
      };
    });
  }, [monthBudgets, monthExpenses, categories]);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget limit?')) {
      dispatch(deleteBudget(id));
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  const isLoading = bLoading || tLoading;

  if (isLoading) return <Loading message="Loading budgets..." />;
  if (bError) return <ErrorState message={bError} onRetry={() => dispatch(fetchBudgets(user.id))} />;

  return (
    <div className="budgets-page">
      <div className="budgets-page__header">
        <div>
          <h1 className="budgets-page__title">Budgets</h1>
          <p className="budgets-page__subtitle">Set and track monthly category budget limits</p>
        </div>
        <div className="budgets-page__actions">
          <select
            className="budgets-page__month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {getMonthLabel(m)}
              </option>
            ))}
          </select>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Set Budget
          </Button>
        </div>
      </div>

      {budgetWithUsage.length === 0 ? (
        <EmptyState
          icon={<i className="fa-solid fa-bullseye text-primary"></i>}
          title="No budgets configured"
          message={`You haven't set any budgets for ${getMonthLabel(selectedMonth)}.`}
          actionLabel="Create Budget"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="budgets-grid">
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

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget Limit' : 'Set Category Budget'}
      >
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
