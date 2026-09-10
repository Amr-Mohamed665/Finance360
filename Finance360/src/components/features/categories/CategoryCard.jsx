import { useMemo } from "react";

const actionBtn =
  "w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-all duration-150";

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  transactionCount = 0,
}) {
  const { name, type, icon, color } = category;

  const typeBadge = useMemo(() => {
    switch (type) {
      case "income":
        return {
          text: "Income",
          cls: "bg-income/10 text-income border-income/20",
        };

      case "expense":
        return {
          text: "Expense",
          cls: "bg-expense/10 text-expense border-expense/20",
        };

      default:
        return {
          text: "General",
          cls: "bg-warning/10 text-warning border-warning/20",
        };
    }
  }, [type]);

  const catColor =
    color ||
    (type === "income"
      ? "#10b981"
      : type === "expense"
        ? "#f43f5e"
        : "#f59e0b");

  const catIcon = icon || "fa-solid fa-tags";

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between gap-4 border border-border/70 hover:border-warning/30 hover:shadow-[0_8px_25px_rgba(245,158,11,0.06)] transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0"
            style={{
              backgroundColor: `${catColor}20`,
              color: catColor,
              border: `1px solid ${catColor}40`,
            }}
          >
            <i className={catIcon} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-text-primary tracking-tight truncate">
              {name}
            </h3>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${typeBadge.cls}`}
            >
              {typeBadge.text}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className={`${actionBtn} text-text-muted hover:text-warning hover:bg-warning/10`}
            onClick={() => onEdit(category)}
            title="Edit Category"
            aria-label="Edit Category"
          >
            <i className="fa-solid fa-pen" />
          </button>

          <button
            type="button"
            className={`${actionBtn} text-text-muted hover:text-expense hover:bg-expense/10`}
            onClick={() => onDelete(category)}
            title="Delete Category"
            aria-label="Delete Category"
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border/50">
        <span>
          {transactionCount > 0
            ? `${transactionCount} transactions`
            : "No transactions"}
        </span>

        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: catColor,
            }}
          />

          <span>{catColor}</span>
        </span>
      </div>
    </div>
  );
}
