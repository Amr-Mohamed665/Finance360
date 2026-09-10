import { FiSearch, FiX } from "react-icons/fi";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  accent = "income",
}) {
  const accentStyles = {
    income: {
      icon: "text-income",
      focus: "focus:border-income/50 focus:ring-2 focus:ring-income/10",
      hover: "hover:border-income/30",
    },

    warning: {
      icon: "text-warning",
      focus: "focus:border-warning/50 focus:ring-2 focus:ring-warning/10",
      hover: "hover:border-warning/30",
    },

    primary: {
      icon: "text-accent-primary",
      focus:
        "focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/10",
      hover: "hover:border-accent-primary/30",
    },
  };

  const theme = accentStyles[accent] || accentStyles.income;

  return (
    <div className="relative flex items-center">
      <FiSearch
        className={[
          "absolute left-3.5",
          "z-10",
          "w-4 h-4",
          "pointer-events-none",
          theme.icon,
        ].join(" ")}
      />

      <input
        type="text"
        className={[
          "w-full",
          "bg-bg-tertiary/60",
          "border border-border",
          "rounded-xl",
          "pl-10 pr-10 py-2.5",
          "text-sm text-text-primary",
          "placeholder-text-muted",
          "outline-none",
          "backdrop-blur-sm",
          "transition-all duration-200",
          theme.focus,
          theme.hover,
        ].join(" ")}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {value && (
        <button
          type="button"
          className={[
            "absolute right-3",
            "z-10",
            "w-6 h-6",
            "flex items-center justify-center",
            "rounded-md",
            "text-text-muted",
            "hover:text-text-primary",
            "hover:bg-bg-hover",
            "transition-colors duration-150",
          ].join(" ")}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
