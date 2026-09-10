import { FiEdit2, FiTrash2 } from "react-icons/fi";

import { formatCurrency, calcPercentage } from "../../../utils/helpers";

const actionButton =
  "w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-150";

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { categoryName, categoryIcon, categoryColor, spent, amount } = budget;

  const pct = calcPercentage(spent, amount);

  const isOver = pct >= 100;
  const isWarning = pct >= 85 && pct < 100;

  const barColor = isOver
    ? "bg-expense"
    : isWarning
      ? "bg-yellow-500"
      : "bg-income";

  const statusBadge = isOver
    ? {
        text: "Over budget!",
        cls: "text-expense bg-expense/10 border-expense/20",
      }
    : isWarning
      ? {
          text: "Near limit",
          cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        }
      : {
          text: "On track",
          cls: "text-income bg-income/10 border-income/20",
        };

  const cardBorder = isOver
    ? "border-expense/30"
    : isWarning
      ? "border-yellow-500/20"
      : "border-border";

  return (
    <div
      className={[
        "glass-panel",
        "rounded-xl",
        "p-5",
        "flex flex-col gap-4",
        "border",
        cardBorder,
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        isOver
          ? "hover:shadow-expense/5"
          : isWarning
            ? "hover:shadow-yellow-500/5"
            : "hover:border-accent-primary/20 hover:shadow-accent-primary/5",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${categoryColor}18`,
            }}
          >
            <span
              className="text-sm"
              style={{
                color: categoryColor,
              }}
            >
              {categoryIcon?.startsWith("fa-") ? (
                <i className={categoryIcon} />
              ) : (
                "●"
              )}
            </span>
          </div>

          <span className="text-sm font-semibold text-text-primary truncate">
            {categoryName}
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
            title="Edit budget limit"
            aria-label="Edit budget limit"
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
            title="Delete budget limit"
            aria-label="Delete budget limit"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Values */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-2xl font-bold text-text-primary truncate">
          {formatCurrency(spent)}
        </span>

        <span className="text-sm text-text-muted whitespace-nowrap">
          of {formatCurrency(amount)}
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={[
            "h-full",
            "rounded-full",
            "transition-all duration-500",
            barColor,
          ].join(" ")}
          style={{
            width: `${Math.min(pct, 100)}%`,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-text-muted">{pct}% used</span>

        <span
          className={[
            "text-xs",
            "font-semibold",
            "px-2.5",
            "py-1",
            "rounded-full",
            "border",
            statusBadge.cls,
          ].join(" ")}
        >
          {statusBadge.text}
        </span>
      </div>
    </div>
  );
}
