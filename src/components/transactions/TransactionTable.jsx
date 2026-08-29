import { formatCurrency, formatDate } from '../../utils/helpers';

const actionBtn = 'w-8 h-8 flex items-center justify-center rounded-md text-xs transition-all duration-150';

export default function TransactionTable({ transactions, categories, onEdit, onDelete }) {
  const getCat = (id) => categories.find((c) => c.id === id);

  const Badge = ({ type }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        type === 'income'
          ? 'bg-income/15 text-income border border-income/20'
          : 'bg-expense/15 text-expense border border-expense/20'
      }`}
    >
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  );

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-tertiary/50">
              {['Date', 'Type', 'Category', 'Description', 'Amount', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider ${i >= 4 ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => {
              const cat = getCat(tx.categoryId);
              return (
                <tr key={tx.id} className="hover:bg-bg-hover transition-colors duration-100">
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3"><Badge type={tx.type} /></td>
                  <td className="px-4 py-3">
                    {cat ? (
                      <span className="flex items-center gap-2">
                        <i className={cat.icon} style={{ color: cat.color }} />
                        <span className="text-text-secondary">{cat.name}</span>
                      </span>
                    ) : (
                      <span className="text-text-muted">Unknown</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-primary max-w-[180px] truncate">{tx.description}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className={`${actionBtn} text-text-muted hover:text-accent-primary hover:bg-accent-primary/10`}
                        onClick={() => onEdit(tx)} title="Edit"
                      >
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button
                        className={`${actionBtn} text-text-muted hover:text-expense hover:bg-expense/10`}
                        onClick={() => onDelete(tx.id)} title="Delete"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {transactions.map((tx) => {
          const cat = getCat(tx.categoryId);
          const color = cat?.color ?? '#64748b';
          return (
            <div key={tx.id} className="glass-panel rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ color, background: `${color}18` }}
                >
                  <i className={cat?.icon ?? 'fa-solid fa-box-open'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
                  <p className="text-xs text-text-muted">{cat?.name ?? 'Unknown'} · {formatDate(tx.date)}</p>
                </div>
                <span className={`text-sm font-bold flex-shrink-0 ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge type={tx.type} />
                <div className="flex gap-1">
                  <button
                    className={`${actionBtn} text-text-muted hover:text-accent-primary hover:bg-accent-primary/10`}
                    onClick={() => onEdit(tx)}
                  ><i className="fa-solid fa-pen" /></button>
                  <button
                    className={`${actionBtn} text-text-muted hover:text-expense hover:bg-expense/10`}
                    onClick={() => onDelete(tx.id)}
                  ><i className="fa-solid fa-trash" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
