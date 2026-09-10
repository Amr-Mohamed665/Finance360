import { FiCalendar, FiEdit2, FiTarget, FiTrash2 } from "react-icons/fi";

import {
  formatCurrency,
  formatDate,
  calcPercentage,
} from "../../../utils/helpers";

const actionButton =
  "w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-150";

export default function SavingsGoalCard({ goal, onEdit, onDelete }) {
  const { name, currentAmount, targetAmount, targetDate, deadline } = goal;

  const pct = calcPercentage(currentAmount, targetAmount);

  const safePct = Math.min(Math.max(Number(pct) || 0, 0), 100);

  const goalDate = deadline || targetDate;

  return (
    <div
      className={[
        "glass-panel",
        "rounded-xl",
        "p-5",
        "flex flex-col gap-4",
        "border border-accent-secondary/15",
        "hover:border-accent-secondary/30",
        "hover:shadow-glow-cyan",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-accent-secondary/15 flex items-center justify-center shrink-0">
            <FiTarget className="text-accent-secondary w-4 h-4" />
          </span>

          <span className="text-sm font-semibold text-text-primary truncate">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className={[
              actionButton,
              "text-text-muted",
              "hover:text-accent-primary",
              "hover:bg-accent-primary/10",
            ].join(" ")}
            onClick={onEdit}
            title="Edit Goal"
            aria-label="Edit Goal"
          >
            <FiEdit2 />
          </button>

          <button
            type="button"
            className={[
              actionButton,
              "text-text-muted",
              "hover:text-expense",
              "hover:bg-expense/10",
            ].join(" ")}
            onClick={onDelete}
            title="Delete Goal"
            aria-label="Delete Goal"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Values */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-2xl font-bold text-accent-secondary truncate">
          {formatCurrency(currentAmount)}
        </span>

        <span className="text-sm text-text-muted whitespace-nowrap">
          of {formatCurrency(targetAmount)}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-savings rounded-full transition-all duration-500"
          style={{
            width: `${safePct}%`,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-accent-secondary">
          {pct}% saved
        </span>

        {goalDate && (
          <span className="text-xs text-text-muted flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {formatDate(goalDate)}
          </span>
        )}
      </div>
    </div>
  );
}
