import { useMemo } from 'react';
import Card from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function RecentTransactions({ transactions, categories }) {
  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const getCat = (categoryId) => categories.find((c) => c.id === categoryId);

  return (
    <Card title="Recent Transactions">
      {recent.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">No transactions yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {recent.map((tx) => {
            const cat = getCat(tx.categoryId);
            const color = cat?.color ?? '#64748b';
            return (
              <div key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
                  style={{ color, background: `${color}18` }}
                >
                  <i className={cat?.icon ?? 'fa-solid fa-box-open'} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
                  <p className="text-xs text-text-muted">
                    {cat?.name ?? 'Unknown'} · {formatDate(tx.date)}
                  </p>
                </div>

                {/* Amount */}
                <span
                  className={`text-sm font-semibold flex-shrink-0 ${
                    tx.type === 'income' ? 'text-income' : 'text-expense'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
