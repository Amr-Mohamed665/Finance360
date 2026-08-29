import { formatCurrency, formatDate, calcPercentage } from '../../utils/helpers';

const actionBtn = 'w-8 h-8 flex items-center justify-center rounded-md text-xs transition-all duration-150';

export default function SavingsGoalCard({ goal, onEdit, onDelete }) {
  const { name, currentAmount, targetAmount, targetDate } = goal;
  const pct = calcPercentage(currentAmount, targetAmount);

  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 border border-accent-secondary/15 hover:border-accent-secondary/30 hover:shadow-glow-cyan transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <span className="w-7 h-7 rounded-md bg-accent-secondary/15 flex items-center justify-center">
            <i className="fa-solid fa-bullseye text-accent-secondary text-xs" />
          </span>
          {name}
        </span>
        <div className="flex gap-1">
          <button
            className={`${actionBtn} text-text-muted hover:text-accent-primary hover:bg-accent-primary/10`}
            onClick={onEdit} title="Edit Goal"
          >
            <i className="fa-solid fa-pen" />
          </button>
          <button
            className={`${actionBtn} text-text-muted hover:text-expense hover:bg-expense/10`}
            onClick={onDelete} title="Delete Goal"
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </div>

      {/* Values */}
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-accent-secondary">{formatCurrency(currentAmount)}</span>
        <span className="text-sm text-text-muted">of {formatCurrency(targetAmount)}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-savings rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-accent-secondary">{pct}% saved</span>
        {targetDate && (
          <span className="text-xs text-text-muted flex items-center gap-1">
            <i className="fa-solid fa-calendar text-[10px]" />
            {formatDate(targetDate)}
          </span>
        )}
      </div>
    </div>
  );
}
