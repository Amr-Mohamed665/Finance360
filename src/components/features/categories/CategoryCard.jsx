import { useMemo } from "react";

const actionBtn =
  "w-8 h-8 flex items-center justify-center rounded-md text-xs transition-all duration-150";

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
          cls: "bg-income/15 text-income border-income/20",
        };

      case "expense":
        return {
          text: "Expense",
          cls: "bg-expense/15 text-expense border-expense/20",
        };

      default:
        return {
          text: "General",
          cls: "bg-accent-primary/15 text-accent-primary border-accent-primary/20",
        };
    }
  }, [type]);

  const catColor =
    color ||
    (type === "income"
      ? "#10b981"
      : type === "expense"
        ? "#f43f5e"
        : "#6366f1");

  const catIcon = icon || "fa-solid fa-tag";

  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col justify-between gap-4 border border-border hover:border-border-hover transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
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

          <div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              {name}
            </h3>

            <span
              className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[11px] font-semibold border ${typeBadge.cls}`}
            >
              {typeBadge.text}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`${actionBtn} text-text-muted hover:text-accent-primary hover:bg-accent-primary/10`}
            onClick={() => onEdit(category)}
            title="Edit Category"
          >
            <i className="fa-solid fa-pen" />
          </button>

          <button
            type="button"
            className={`${actionBtn} text-text-muted hover:text-expense hover:bg-expense/10`}
            onClick={() => onDelete(category)}
            title="Delete Category"
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/50">
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
