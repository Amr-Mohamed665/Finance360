import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTransactions,
  deleteTransaction,
} from "../store/slices/transactionsSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import TransactionTable from "../components/features/transactions/TransactionTable";
import TransactionFilters from "../components/features/transactions/TransactionFilters";
import TransactionSearch from "../components/features/transactions/TransactionSearch";
import TransactionForm from "../components/features/transactions/TransactionForm";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function TransactionsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);

  const {
    items: transactions = [],
    loading,
    error,
  } = useSelector((s) => s.transactions);

  const { items: categories = [] } = useSelector((s) => s.categories);

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
  }, [dispatch, user]);

  const filtered = useMemo(() => {
    let result = Array.isArray(transactions) ? [...transactions] : [];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((t) => {
        if (!t) return false;

        const catKey = String(
          t.categoryId ||
            t.category?.documentId ||
            t.category?.id ||
            t.category ||
            "",
        );

        const cat = Array.isArray(categories)
          ? categories.find((c) => String(c.documentId || c.id) === catKey)
          : null;

        const descMatch = (t.description || "").toLowerCase().includes(q);

        const catMatch = cat && (cat.name || "").toLowerCase().includes(q);

        return descMatch || catMatch;
      });
    }

    // Type filter
    if (filters.type) {
      result = result.filter((t) => t && t.type === filters.type);
    }

    // Category filter
    if (filters.categoryId) {
      result = result.filter((t) => {
        const catKey = String(
          t.categoryId ||
            t.category?.documentId ||
            t.category?.id ||
            t.category ||
            "",
        );

        return catKey === String(filters.categoryId);
      });
    }

    // Month filter
    if (filters.month) {
      result = result.filter(
        (t) => t && t.date && String(t.date).startsWith(filters.month),
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;

      if (sort.field === "date") {
        const dateA = a.date ? new Date(a.date).getTime() : 0;

        const dateB = b.date ? new Date(b.date).getTime() : 0;

        cmp = dateA - dateB;
      } else {
        cmp = (Number(a.amount) || 0) - (Number(b.amount) || 0);
      }

      return sort.dir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [transactions, search, filters, sort, categories]);

  const handleEdit = useCallback((tx) => {
    setEditingTx(tx);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (transaction) => {
      if (!window.confirm("Delete this transaction?")) {
        return;
      }

      // Strapi 5: use documentId first
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

  const handleAddTransaction = useCallback(() => {
    setEditingTx(null);
    setModalOpen(true);
  }, []);

  if (loading && transactions.length === 0) {
    return <Loading message="Loading transactions..." />;
  }

  if (error && transactions.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          if (user?.id) {
            dispatch(fetchTransactions(user.id));
          }
        }}
      />
    );
  }

  const hasTransactions = transactions.length > 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Search */}
      <div className="w-full">
        <TransactionSearch value={search} onChange={setSearch} />
      </div>

      {/* Filters + Add Transaction */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <TransactionFilters
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            transactions={transactions}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        {hasTransactions && (
          <div className="sm:ml-auto shrink-0">
            <Button variant="primary" onClick={handleAddTransaction}>
              <i className="fa-solid fa-plus mr-2" />
              Add Transaction
            </Button>
          </div>
        )}
      </div>

      {/* Transactions / Empty State */}
      {filtered.length === 0 ? (
        <div className="flex-1 min-h-[55vh] flex items-center justify-center">
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
              <div className="mt-5">
                <Button variant="primary" onClick={handleAddTransaction}>
                  <i className="fa-solid fa-plus mr-2" />
                  Add Transaction
                </Button>
              </div>
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
