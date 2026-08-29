import { formatCurrency, calcPercentage } from '../../utils/helpers';

const actionBtn = 'w-8 h-8 flex items-center justify-center rounded-md text-xs transition-all duration-150';

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { categoryName, categoryIcon, categoryColor, spent, amount } = budget;
  const pct = calcPercentage(spent, amount);

  const isOver    = pct >= 100;
  const isWarning = pct >= 85 && pct < 100;

  const barColor = isOver ? 'bg-expense' : isWarning ? 'bg-yellow-500' : 'bg-income';
  const statusBadge = isOver
    ? { text: 'Over budget!', cls: 'text-expense bg-expense/10 border-expense/20' }
    : isWarning
    ? { text: 'Near limit',  cls: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' }
    : { text: 'On track',   cls: 'text-income bg-income/10 border-income/20' };

  return (
    <div className={`glass-panel rounded-xl p-5 flex flex-col gap-4 border ${isOver ? 'border-expense/30' : isWarning ? 'border-yellow-500/20' : 'border-border'}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <i className={categoryIcon} style={{ color: categoryColor }} />
          {categoryName}
        </span>
        <div className="flex gap-1">
          <button
            className={`${actionBtn} text-text-muted hover:text-accent-primary hover:bg-accent-primary/10`}
            onClick={onEdit} title="Edit budget limit"
          >
            <i className="fa-solid fa-pen" />
          </button>
          <button
            className={`${actionBtn} text-text-muted hover:text-expense hover:bg-expense/10`}
            onClick={onDelete} title="Delete budget limit"
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </div>

      {/* Values */}
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-text-primary">{formatCurrency(spent)}</span>
        <span className="text-sm text-text-muted">of {formatCurrency(amount)}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{pct}% used</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBadge.cls}`}>
          {statusBadge.text}
        </span>
      </div>
    </div>
  );
}
