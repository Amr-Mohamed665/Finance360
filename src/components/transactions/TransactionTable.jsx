import { formatCurrency, formatDate } from '../../utils/helpers';
import './TransactionTable.css';

export default function TransactionTable({ transactions, categories, onEdit, onDelete }) {
  const getCat = (id) => categories.find((c) => c.id === id);

  return (
    <div className="tx-table-wrapper">
      {/* Desktop table */}
      <table className="tx-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th className="tx-table__right">Amount</th>
            <th className="tx-table__right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const cat = getCat(tx.categoryId);
            return (
              <tr key={tx.id}>
                <td>{formatDate(tx.date)}</td>
                <td>
                  <span className={`tx-badge tx-badge--${tx.type}`}>
                    {tx.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td>{cat ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><i className={cat.icon} style={{ color: cat.color }}></i> {cat.name}</span> : 'Unknown'}</td>
                <td>{tx.description}</td>
                <td className={`tx-table__right tx-amount--${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="tx-table__right">
                  <div className="tx-table__actions">
                    <button className="tx-table__btn tx-table__btn--edit" onClick={() => onEdit(tx)} title="Edit transaction"><i className="fa-solid fa-pen"></i></button>
                    <button className="tx-table__btn tx-table__btn--delete" onClick={() => onDelete(tx.id)} title="Delete transaction"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="tx-cards">
        {transactions.map((tx) => {
          const cat = getCat(tx.categoryId);
          return (
            <div key={tx.id} className="tx-card-item">
              <div className="tx-card-item__top">
                <div className="tx-card-item__icon" style={{
                  color: cat?.color || 'var(--text-muted)',
                  background: `color-mix(in srgb, ${cat?.color || 'var(--text-muted)'} 10%, transparent)`
                }}>
                  <i className={cat?.icon || 'fa-solid fa-box-open'}></i>
                </div>
                <div className="tx-card-item__info">
                  <span className="tx-card-item__desc">{tx.description}</span>
                  <span className="tx-card-item__meta">
                    {cat?.name || 'Unknown'} · {formatDate(tx.date)}
                  </span>
                </div>
                <span className={`tx-card-item__amount tx-amount--${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
              <div className="tx-card-item__bottom">
                <span className={`tx-badge tx-badge--${tx.type}`}>
                  {tx.type === 'income' ? 'Income' : 'Expense'}
                </span>
                <div className="tx-table__actions">
                  <button className="tx-table__btn tx-table__btn--edit" onClick={() => onEdit(tx)} title="Edit transaction"><i className="fa-solid fa-pen"></i></button>
                  <button className="tx-table__btn tx-table__btn--delete" onClick={() => onDelete(tx.id)} title="Delete transaction"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
