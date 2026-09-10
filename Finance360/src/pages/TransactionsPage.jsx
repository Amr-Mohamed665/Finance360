import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchTransactions,
  deleteTransaction,
} from "../store/slices/transactionsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";

import TransactionTable from "../components/features/transactions/TransactionTable";
import TransactionFilters from "../components/features/transactions/TransactionFilters";
import TransactionForm from "../components/features/transactions/TransactionForm";

import Modal from "../components/common/Modal";
import SearchInput from "../components/common/SearchInput";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function TransactionsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    items: transactions = [],
    loading,
    error,
  } = useSelector((state) => state.transactions);

  const { items: categories = [] } = useSelector((state) => state.categories);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    type: "",
    categoryId: "",
    month: "",
  });

  const [sort, setSort] = useState({
    field: "date",
    dir: "desc",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
    }

    dispatch(fetchCategories());
  }, [dispatch, user?.id]);

  const getCategory = useCallback(
    (transaction) => {
      if (!transaction) return null;

      const category = transaction.category;

      if (category && typeof category === "object") {
        return category;
      }

      const categoryId =
        transaction.categoryId ||
        category ||
        transaction.category?.documentId ||
        transaction.category?.id;

      if (!categoryId) return null;

      return categories.find(
        (item) =>
          String(item.id) === String(categoryId) ||
          String(item.documentId) === String(categoryId),
      );
    },
    [categories],
  );

  const filtered = useMemo(() => {
    let result = Array.isArray(transactions) ? [...transactions] : [];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((transaction) => {
        if (!transaction) return false;

        const category = getCategory(transaction);

        const description = String(transaction.description || "").toLowerCase();

        const categoryName = String(category?.name || "").toLowerCase();

        return description.includes(query) || categoryName.includes(query);
      });
    }

    if (filters.type) {
      result = result.filter(
        (transaction) => transaction?.type === filters.type,
      );
    }

    if (filters.categoryId) {
      result = result.filter((transaction) => {
        const category = getCategory(transaction);

        const categoryId =
          category?.documentId || category?.id || transaction?.categoryId;

        return String(categoryId) === String(filters.categoryId);
      });
    }

    if (filters.month) {
      result = result.filter(
        (transaction) =>
          transaction?.date &&
          String(transaction.date).startsWith(filters.month),
      );
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sort.field === "date") {
        const dateA = a?.date ? new Date(a.date).getTime() : 0;

        const dateB = b?.date ? new Date(b.date).getTime() : 0;

        comparison = dateA - dateB;
      }

      if (sort.field === "amount") {
        comparison = (Number(a?.amount) || 0) - (Number(b?.amount) || 0);
      }

      return sort.dir === "desc" ? -comparison : comparison;
    });

    return result;
  }, [transactions, search, filters, sort, getCategory]);

  const handleAddTransaction = useCallback(() => {
    setEditingTx(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((transaction) => {
    setEditingTx(transaction);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (transaction) => {
      if (!window.confirm("Delete this transaction?")) {
        return;
      }

      const transactionId = transaction?.documentId || transaction?.id;

      if (!transactionId) {
        console.error("Cannot delete transaction: missing ID");
        return;
      }

      dispatch(deleteTransaction(transactionId));
    },
    [dispatch],
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingTx(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (user?.id) {
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user?.id]);

  if (loading && transactions.length === 0) {
    return <Loading message="Loading transactions..." />;
  }

  if (error && transactions.length === 0) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  const hasTransactions = transactions.length > 0;

  const incomeCount = transactions.filter(
    (transaction) => transaction?.type === "income",
  ).length;

  const expenseCount = transactions.filter(
    (transaction) => transaction?.type === "expense",
  ).length;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Summary */}
      {hasTransactions && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="glass-panel rounded-xl px-4 py-3 border border-border/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">
                  Total
                </p>

                <p className="text-xl font-bold text-text-primary mt-1">
                  {transactions.length}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-income/10 flex items-center justify-center">
                <i className="fa-solid fa-list text-income text-sm" />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl px-4 py-3 border border-income/15">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">
                  Income
                </p>

                <p className="text-xl font-bold text-income mt-1">
                  {incomeCount}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-income/10 flex items-center justify-center">
                <i className="fa-solid fa-arrow-trend-up text-income text-sm" />
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl px-4 py-3 border border-expense/15">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-text-muted">
                  Expenses
                </p>

                <p className="text-xl font-bold text-expense mt-1">
                  {expenseCount}
                </p>
              </div>

              <div className="w-9 h-9 rounded-lg bg-expense/10 flex items-center justify-center">
                <i className="fa-solid fa-arrow-trend-down text-expense text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="glass-panel rounded-xl p-2 border border-border/30">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by description or category..."
          accent="income"
        />
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-2 border border-border/30 relative z-30">
        <TransactionFilters
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          transactions={transactions}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Transactions */}
      {filtered.length === 0 ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              icon={
                <i className="fa-solid fa-money-bill-transfer text-income text-2xl" />
              }
              title="No transactions found"
              message={
                transactions.length === 0
                  ? "Add your first transaction to start tracking your finances."
                  : "No transactions match your current filters."
              }
            />

            {transactions.length === 0 && (
              <Button variant="primary" onClick={handleAddTransaction}>
                <i className="fa-solid fa-plus mr-2" />
                Add Transaction
              </Button>
            )}
          </div>
        </div>
      ) : (
        <TransactionTable
          transactions={filtered}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingTx ? "Edit Transaction" : "Add Transaction"}
      >
        <TransactionForm
          transaction={editingTx}
          categories={categories}
          userId={user?.id}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
