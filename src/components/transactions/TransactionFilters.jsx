import { useMemo } from 'react';
import { getAvailableMonths, getMonthLabel } from '../../utils/helpers';
import './TransactionFilters.css';

export default function TransactionFilters({ filters, onFilterChange, categories, transactions, sort, onSortChange }) {
  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);

  const handleChange = (field) => (e) => {
    onFilterChange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const expenseCategories = useMemo(() => categories.filter((c) => c.type === 'expense'), [categories]);
  const incomeCategories = useMemo(() => categories.filter((c) => c.type === 'income'), [categories]);

  return (
    <div className="tx-filters">
      <select
        className="tx-filters__select"
        value={filters.type}
        onChange={handleChange('type')}
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        className="tx-filters__select"
        value={filters.categoryId}
        onChange={handleChange('categoryId')}
      >
        <option value="">All Categories</option>
        <optgroup label="Expense">
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </optgroup>
        <optgroup label="Income">
          {incomeCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </optgroup>
      </select>

      <select
        className="tx-filters__select"
        value={filters.month}
        onChange={handleChange('month')}
      >
        <option value="">All Months</option>
        {months.map((m) => (
          <option key={m} value={m}>{getMonthLabel(m)}</option>
        ))}
      </select>

      <div className="tx-filters__sort">
        <select
          className="tx-filters__select"
          value={sort.field}
          onChange={(e) => onSortChange((prev) => ({ ...prev, field: e.target.value }))}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
        <button
          className="tx-filters__sort-dir"
          onClick={() =>
            onSortChange((prev) => ({ ...prev, dir: prev.dir === 'asc' ? 'desc' : 'asc' }))
          }
          title={sort.dir === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sort.dir === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
