import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions, deleteTransaction } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionSearch from '../components/transactions/TransactionSearch';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './TransactionsPage.css';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: transactions, loading, error } = useSelector((s) => s.transactions);
  const { items: categories } = useSelector((s) => s.categories);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', categoryId: '', month: '' });
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  const filtered = useMemo(() => {
    let result = [...transactions];

    /* Search */
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => {
        const cat = categories.find((c) => c.id === t.categoryId);
        return (
          t.description.toLowerCase().includes(q) ||
          (cat && cat.name.toLowerCase().includes(q))
        );
      });
    }

    /* Filter by type */
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    /* Filter by category */
    if (filters.categoryId) {
      result = result.filter((t) => t.categoryId === filters.categoryId);
    }

    /* Filter by month */
    if (filters.month) {
      result = result.filter((t) => t.date.startsWith(filters.month));
    }

    /* Sort */
    result.sort((a, b) => {
      let cmp = 0;
      if (sort.field === 'date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sort.field === 'amount') {
        cmp = a.amount - b.amount;
      }
      return sort.dir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [transactions, search, filters, sort, categories]);

  const handleEdit = useCallback((tx) => {
    setEditingTx(tx);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        dispatch(deleteTransaction(id));
      }
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingTx(null);
  }, []);

  if (loading) return <Loading message="Loading transactions..." />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchTransactions(user.id))} />;

  return (
    <div className="transactions-page">
      <div className="transactions-page__header">
        <div>
          <h1 className="transactions-page__title">Transactions</h1>
          <p className="transactions-page__subtitle">
            Manage your income and expenses
          </p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Add Transaction
        </Button>
      </div>

      <div className="transactions-page__toolbar">
        <TransactionSearch value={search} onChange={setSearch} />
        <TransactionFilters
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          transactions={transactions}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<i className="fa-solid fa-money-bill-transfer text-success"></i>}
          title="No transactions found"
          message={
            transactions.length === 0
              ? 'Add your first transaction to start tracking your finances.'
              : 'No transactions match your current filters.'
          }
          actionLabel={transactions.length === 0 ? 'Add Transaction' : undefined}
          onAction={transactions.length === 0 ? () => setModalOpen(true) : undefined}
        />
      ) : (
        <TransactionTable
          transactions={filtered}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingTx ? 'Edit Transaction' : 'Add Transaction'}
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
