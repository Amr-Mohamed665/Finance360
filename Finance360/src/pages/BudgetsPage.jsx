import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiChevronDown, FiPlus, FiSearch, FiTarget } from "react-icons/fi";

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
import SearchInput from "../components/common/SearchInput";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );

  const selectedLabel = selectedOption?.label || placeholder;

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-[190px]">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={[
          "relative w-full h-10 px-3.5 pr-10",
          "flex items-center justify-between",
          "rounded-xl",
          "border",
          "bg-bg-tertiary/60",
          "text-sm font-medium text-text-primary",
          "outline-none",
          "backdrop-blur-sm",
          "transition-all duration-200",
          open
            ? "border-expense/60 bg-expense/5 ring-2 ring-expense/10"
            : "border-border hover:border-expense/30 hover:bg-expense/5",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedLabel}</span>

        <FiChevronDown
          className={[
            "absolute right-3",
            "w-4 h-4",
            "text-expense",
            "transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "absolute z-50 left-0 right-0 mt-2",
          "overflow-hidden",
          "rounded-xl",
          "border border-expense/20",
          "bg-bg-secondary/95",
          "backdrop-blur-xl",
          "shadow-[0_12px_35px_rgba(0,0,0,0.22)]",
          "origin-top",
          "transition-all duration-200 ease-out",
          open
            ? "visible opacity-100 translate-y-0 scale-100"
            : "invisible opacity-0 -translate-y-2 scale-[0.98] pointer-events-none",
        ].join(" ")}
      >
        <div className="max-h-64 overflow-y-auto p-1.5" role="listbox">
          {options.map((option) => {
            const selected = String(option.value) === String(value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={[
                  "w-full flex items-center justify-between",
                  "px-3 py-2.5",
                  "rounded-lg",
                  "text-left text-sm font-medium",
                  "transition-all duration-150",
                  selected
                    ? "bg-expense/10 text-expense"
                    : "text-text-secondary hover:bg-expense/5 hover:text-expense",
                ].join(" ")}
                role="option"
                aria-selected={selected}
              >
                <span className="truncate">{option.label}</span>

                {selected && <FiTarget className="w-3.5 h-3.5 ml-2 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BudgetsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    items: budgets = [],
    loading: bLoading,
    error: bError,
  } = useSelector((state) => state.budgets);

  const { items: transactions = [], loading: tLoading } = useSelector(
    (state) => state.transactions,
  );

  const { items: categories = [] } = useSelector((state) => state.categories);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    dispatch(fetchBudgets(user.id));
    dispatch(fetchTransactions(user.id));
    dispatch(fetchCategories());
  }, [dispatch, user?.id]);

  const months = useMemo(() => {
    const txMonths = (transactions || [])
      .filter((transaction) => transaction?.date)
      .map((transaction) => String(transaction.date).substring(0, 7));

    const budgetMonths = (budgets || [])
      .filter((budget) => budget?.month)
      .map((budget) => {
        if (typeof budget.month === "number" && budget.year) {
          return `${budget.year}-${String(budget.month).padStart(2, "0")}`;
        }

        return String(budget.month);
      });

    return Array.from(
      new Set([getCurrentMonth(), ...txMonths, ...budgetMonths]),
    )
      .filter(Boolean)
      .sort()
      .reverse();
  }, [transactions, budgets]);

  const monthOptions = useMemo(
    () =>
      months.map((month) => ({
        value: month,
        label: getMonthLabel(month),
      })),
    [months],
  );

  const monthBudgets = useMemo(() => {
    if (!Array.isArray(budgets)) return [];

    return budgets.filter((budget) => {
      if (!budget) return false;

      if (String(budget.month) === String(selectedMonth)) {
        return true;
      }

      if (typeof budget.month === "number" && budget.year && selectedMonth) {
        const [currentYear, currentMonth] = selectedMonth
          .split("-")
          .map(Number);

        return budget.month === currentMonth && budget.year === currentYear;
      }

      return false;
    });
  }, [budgets, selectedMonth]);

  const monthExpenses = useMemo(
    () =>
      filterByMonth(transactions, selectedMonth).filter(
        (transaction) => transaction && transaction.type === "expense",
      ),
    [transactions, selectedMonth],
  );

  const budgetWithUsage = useMemo(() => {
    return monthBudgets.map((budget) => {
      const budgetCategoryId = String(
        budget.categoryId ||
          budget.category?.documentId ||
          budget.category?.id ||
          budget.category ||
          "",
      );

      const category = Array.isArray(categories)
        ? categories.find(
            (item) => String(item.documentId || item.id) === budgetCategoryId,
          )
        : null;

      const spent = monthExpenses
        .filter((transaction) => {
          const transactionCategoryId = String(
            transaction.categoryId ||
              transaction.category?.documentId ||
              transaction.category?.id ||
              transaction.category ||
              "",
          );

          return transactionCategoryId === budgetCategoryId;
        })
        .reduce(
          (sum, transaction) => sum + (Number(transaction.amount) || 0),
          0,
        );

      return {
        ...budget,
        categoryName: category?.name || budget.category?.name || "Unknown",

        categoryIcon: category?.icon || budget.category?.icon || "box",

        categoryColor: category?.color || budget.category?.color || "#64748b",

        spent,
      };
    });
  }, [monthBudgets, monthExpenses, categories]);

  const filteredBudgets = useMemo(() => {
    if (!search.trim()) {
      return budgetWithUsage;
    }

    const query = search.trim().toLowerCase();

    return budgetWithUsage.filter((budget) =>
      String(budget.categoryName || "")
        .toLowerCase()
        .includes(query),
    );
  }, [budgetWithUsage, search]);

  const handleAddBudget = useCallback(() => {
    setEditingBudget(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  }, []);

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

      await dispatch(deleteBudget(budgetId)).unwrap();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingBudget(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (!user?.id) return;

    dispatch(fetchBudgets(user.id));
    dispatch(fetchTransactions(user.id));
    dispatch(fetchCategories());
  }, [dispatch, user?.id]);

  if (bLoading || tLoading) {
    return <Loading message="Loading budgets..." />;
  }

  if (bError) {
    return <ErrorState message={bError} onRetry={handleRetry} />;
  }

  const hasBudgets = budgetWithUsage.length > 0;
  const hasSearchResults = filteredBudgets.length > 0;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Controls */}
      <div className="glass-panel rounded-xl p-3 border border-border/30 relative z-30">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search budgets by category..."
              accent="danger"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <CustomDropdown
              value={selectedMonth}
              options={monthOptions}
              onChange={setSelectedMonth}
              placeholder="Select month"
            />

            {/* Add Button - unchanged */}
            <Button variant="primary" onClick={handleAddBudget}>
              <FiPlus className="w-4 h-4" />
              Set Budget
            </Button>
          </div>
        </div>
      </div>

      {/* Budget Content */}
      {!hasBudgets ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              icon={<FiTarget className="text-expense text-2xl" />}
              title="No budgets configured"
              message={`You haven't set any budgets for ${getMonthLabel(
                selectedMonth,
              )}.`}
              actionLabel="Create Budget"
              onAction={handleAddBudget}
            />
          </div>
        </div>
      ) : !hasSearchResults ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              icon={<FiSearch className="text-expense text-2xl" />}
              title="No budgets found"
              message={`No budgets match "${search}".`}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget.documentId || budget.id}
              budget={budget}
              onEdit={() => handleEdit(budget)}
              onDelete={() => handleDelete(budget)}
            />
          ))}
        </div>
      )}

      {/* Budget Modal */}
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

      {/* Delete Modal */}
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
