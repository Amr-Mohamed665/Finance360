import { useMemo } from 'react';
import Card from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './RecentTransactions.css';

export default function RecentTransactions({ transactions, categories }) {
  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.icon : 'fa-solid fa-box-open';
  };

  const getCategoryColor = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.color : 'var(--text-muted)';
  };

  return (
    <Card title="Recent Transactions">
      {recent.length === 0 ? (
        <p className="recent-tx__empty">No transactions yet.</p>
      ) : (
        <div className="recent-tx__list">
          {recent.map((tx) => (
            <div key={tx.id} className="recent-tx__item">
              <div className="recent-tx__icon" style={{
                color: getCategoryColor(tx.categoryId),
                background: `color-mix(in srgb, ${getCategoryColor(tx.categoryId)} 10%, transparent)`
              }}>
                <i className={getCategoryIcon(tx.categoryId)}></i>
              </div>
              <div className="recent-tx__details">
                <span className="recent-tx__desc">{tx.description}</span>
                <span className="recent-tx__meta">
                  {getCategoryName(tx.categoryId)} · {formatDate(tx.date)}
                </span>
              </div>
              <span className={`recent-tx__amount recent-tx__amount--${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
