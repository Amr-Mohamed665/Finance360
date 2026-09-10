import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgets, deleteBudget } from "../store/slices/budgetsSlice";
import { fetchTransactions } from "../store/slices/transactionsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import {
  getCurrentMonth,
  filterByMonth,
  getMonthLabel,
} from "../utils/helpers";
import BudgetCard from "../components/features/budgets/BudgetCard";
import BudgetForm from "../components/features/budgets/BudgetForm";
import Modal from "../components/common/Modal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function BudgetsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);

  const {
    items: budgets,
    loading: bLoading,
    error: bError,
  } = useSelector((s) => s.budgets);

  const { items: transactions, loading: tLoading } = useSelector(
    (s) => s.transactions,
  );

  const { items: categories } = useSelector((s) => s.categories);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchBudgets(user.id));
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  const months = useMemo(() => {
    const txMonths = (transactions || [])
      .filter((t) => t && t.date)
      .map((t) => String(t.date).substring(0, 7));

    const budgetMonths = (budgets || [])
      .filter((b) => b && b.month)
      .map((b) => {
        if (typeof b.month === "number" && b.year) {
          return `${b.year}-${String(b.month).padStart(2, "0")}`;
        }

        return String(b.month);
      });

    return Array.from(
      new Set([getCurrentMonth(), ...txMonths, ...budgetMonths]),
    )
      .filter(Boolean)
      .sort()
      .reverse();
  }, [transactions, budgets]);

  const monthBudgets = useMemo(() => {
    if (!Array.isArray(budgets)) return [];

    return budgets.filter((b) => {
      if (!b) return false;

      if (b.month === selectedMonth) {
        return true;
      }

      if (typeof b.month === "number" && b.year && selectedMonth) {
        const [currY, currM] = selectedMonth.split("-").map(Number);

        return b.month === currM && b.year === currY;
      }

      return false;
    });
  }, [budgets, selectedMonth]);

  const monthExpenses = useMemo(
    () =>
      filterByMonth(transactions, selectedMonth).filter(
        (t) => t && t.type === "expense",
      ),
    [transactions, selectedMonth],
  );

  const budgetWithUsage = useMemo(() => {
    return monthBudgets.map((b) => {
      const bCatId = String(
        b.categoryId ||
          b.category?.documentId ||
          b.category?.id ||
          b.category ||
          "",
      );

      const cat = Array.isArray(categories)
        ? categories.find((c) => String(c.documentId || c.id) === bCatId)
        : null;

      const spent = monthExpenses
        .filter((t) => {
          const tCatId = String(
            t.categoryId ||
              t.category?.documentId ||
              t.category?.id ||
              t.category ||
              "",
          );

          return tCatId === bCatId;
        })
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      return {
        ...b,
        categoryName: cat?.name || b.category?.name || "Unknown",

        categoryIcon: cat?.icon || b.category?.icon || "fa-solid fa-box-open",

        categoryColor: cat?.color || b.category?.color || "#64748b",

        spent,
      };
    });
  }, [monthBudgets, monthExpenses, categories]);

  const handleEdit = useCallback((budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  }, []);

  // بدل window.confirm - بنفتح مودال التأكيد
  const handleDelete = useCallback((budget) => {
    setDeleteTarget(budget);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleting) return;
    setDeleteTarget(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    const budgetId = deleteTarget?.documentId || deleteTarget?.id;

    if (!budgetId) {
      console.error("Cannot delete budget: missing ID");
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      await dispatch(deleteBudget(budgetId)).unwrap?.();
    } catch (err) {
      console.error("Failed to delete budget:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  if (bLoading || tLoading) {
    return <Loading message="Loading budgets..." />;
  }

  if (bError) {
    return (
      <ErrorState
        message={bError}
        onRetry={() => dispatch(fetchBudgets(user.id))}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Month selector */}
        <div className="relative">
          <select
            className="appearance-none bg-bg-tertiary/60 border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all cursor-pointer"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m} className="bg-bg-secondary">
                {getMonthLabel(m)}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
            <i className="fa-solid fa-chevron-down" />
          </span>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingBudget(null);
            setModalOpen(true);
          }}
        >
          <i className="fa-solid fa-plus" /> Set Budget
        </Button>
      </div>

      {budgetWithUsage.length === 0 ? (
        <EmptyState
          icon={
            <i className="fa-solid fa-bullseye text-accent-primary text-2xl" />
          }
          title="No budgets configured"
          message={`You haven't set any budgets for ${getMonthLabel(
            selectedMonth,
          )}.`}
          actionLabel="Create Budget"
          onAction={() => {
            setEditingBudget(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgetWithUsage.map((budget) => (
            <BudgetCard
              key={budget.documentId || budget.id}
              budget={budget}
              onEdit={() => handleEdit(budget)}
              onDelete={() => handleDelete(budget)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? "Edit Budget Limit" : "Set Category Budget"}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Budget"
        message="Are you sure you want to delete this budget limit?"
        itemName={
          deleteTarget
            ? deleteTarget.categoryName || deleteTarget.category?.name
            : null
        }
      />
    </div>
  );
}
