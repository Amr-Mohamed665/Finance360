import { useEffect, useState, useMemo } from 'react';
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
import { useCallback } from 'react';

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
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => {
        const cat = categories.find((c) => c.id === t.categoryId);
        return t.description.toLowerCase().includes(q) || (cat && cat.name.toLowerCase().includes(q));
      });
    }
    if (filters.type)       result = result.filter((t) => t.type === filters.type);
    if (filters.categoryId) result = result.filter((t) => t.categoryId === filters.categoryId);
    if (filters.month)      result = result.filter((t) => t.date.startsWith(filters.month));
    result.sort((a, b) => {
      let cmp = sort.field === 'date' ? new Date(a.date) - new Date(b.date) : a.amount - b.amount;
      return sort.dir === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [transactions, search, filters, sort, categories]);

  const handleEdit        = useCallback((tx) => { setEditingTx(tx); setModalOpen(true); }, []);
  const handleDelete      = useCallback((id) => { if (window.confirm('Delete this transaction?')) dispatch(deleteTransaction(id)); }, [dispatch]);
  const handleCloseModal  = useCallback(() => { setModalOpen(false); setEditingTx(null); }, []);

  if (loading) return <Loading message="Loading transactions..." />;
  if (error)   return <ErrorState message={error} onRetry={() => dispatch(fetchTransactions(user.id))} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Manage your income and expenses</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-plus" /> Add Transaction
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <TransactionSearch value={search} onChange={setSearch} />
        </div>
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
          icon={<i className="fa-solid fa-money-bill-transfer text-income text-2xl" />}
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

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingTx ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm transaction={editingTx} categories={categories} userId={user?.id} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
