import { useMemo } from 'react';
import { getAvailableMonths, getMonthLabel } from '../../utils/helpers';

const selectCls = 'bg-bg-tertiary/60 border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none transition-all duration-150 focus:border-accent-primary/50 backdrop-blur-sm cursor-pointer appearance-none pr-7';

export default function TransactionFilters({ filters, onFilterChange, categories, transactions, sort, onSortChange }) {
  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);
  const expenseCategories = useMemo(() => categories.filter((c) => c.type === 'expense'), [categories]);
  const incomeCategories  = useMemo(() => categories.filter((c) => c.type === 'income'),  [categories]);

  const handleChange = (field) => (e) => {
    onFilterChange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const SelectWrapper = ({ children }) => (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
        <i className="fa-solid fa-chevron-down" />
      </span>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <SelectWrapper>
        <select className={selectCls} value={filters.type} onChange={handleChange('type')}>
          <option value="" className="bg-bg-secondary">All Types</option>
          <option value="income" className="bg-bg-secondary">Income</option>
          <option value="expense" className="bg-bg-secondary">Expense</option>
        </select>
      </SelectWrapper>

      <SelectWrapper>
        <select className={selectCls} value={filters.categoryId} onChange={handleChange('categoryId')}>
          <option value="" className="bg-bg-secondary">All Categories</option>
          <optgroup label="Expense" className="bg-bg-secondary">
            {expenseCategories.map((c) => <option key={c.id} value={c.id} className="bg-bg-secondary">{c.name}</option>)}
          </optgroup>
          <optgroup label="Income" className="bg-bg-secondary">
            {incomeCategories.map((c) => <option key={c.id} value={c.id} className="bg-bg-secondary">{c.name}</option>)}
          </optgroup>
        </select>
      </SelectWrapper>

      <SelectWrapper>
        <select className={selectCls} value={filters.month} onChange={handleChange('month')}>
          <option value="" className="bg-bg-secondary">All Months</option>
          {months.map((m) => <option key={m} value={m} className="bg-bg-secondary">{getMonthLabel(m)}</option>)}
        </select>
      </SelectWrapper>

      {/* Sort */}
      <div className="flex items-center gap-1">
        <SelectWrapper>
          <select
            className={selectCls}
            value={sort.field}
            onChange={(e) => onSortChange((prev) => ({ ...prev, field: e.target.value }))}
          >
            <option value="date" className="bg-bg-secondary">Sort by Date</option>
            <option value="amount" className="bg-bg-secondary">Sort by Amount</option>
          </select>
        </SelectWrapper>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-bg-tertiary/60 text-text-muted hover:text-text-primary hover:border-border-hover transition-all duration-150"
          onClick={() => onSortChange((prev) => ({ ...prev, dir: prev.dir === 'asc' ? 'desc' : 'asc' }))}
          title={sort.dir === 'asc' ? 'Ascending' : 'Descending'}
        >
          <i className={`fa-solid ${sort.dir === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs`} />
        </button>
      </div>
    </div>
  );
}
