import { useEffect, useMemo, useRef, useState } from "react";
import { getAvailableMonths, getMonthLabel } from "../../../utils/helpers";

function CustomDropdown({
  value,
  options,
  onChange,
  placeholder,
  grouped = false,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectedLabel = useMemo(() => {
    if (grouped) {
      for (const group of options) {
        const selected = group.options.find(
          (option) => String(option.value) === String(value),
        );

        if (selected) {
          return selected.label;
        }
      }
    }

    const selected = options.find(
      (option) => String(option.value) === String(value),
    );

    return selected?.label || placeholder;
  }, [options, value, placeholder, grouped]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto min-w-[170px] lg:min-w-[180px]">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={[
          "w-full h-10 px-3.5 pr-9",
          "flex items-center justify-between",
          "rounded-xl",
          "border",
          "bg-bg-tertiary/70",
          "text-sm font-medium text-text-primary",
          "outline-none",
          "backdrop-blur-sm",
          "transition-all duration-200",
          open
            ? "border-income/60 bg-income/5 ring-2 ring-income/10"
            : "border-border hover:border-income/30 hover:bg-income/5",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedLabel}</span>

        <span
          className={[
            "absolute right-3",
            "text-income",
            "text-xs",
            "transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      <div
        className={[
          "absolute z-50 left-0 min-w-full sm:min-w-[210px] mt-2",
          "overflow-hidden",
          "rounded-xl",
          "border border-income/20",
          "bg-bg-secondary/95",
          "backdrop-blur-xl",
          "shadow-[0_12px_35px_rgba(0,0,0,0.22)]",
          "origin-top-left",
          "transition-all duration-200 ease-out",
          open
            ? "visible opacity-100 translate-y-0 scale-100"
            : "invisible opacity-0 -translate-y-2 scale-[0.98] pointer-events-none",
        ].join(" ")}
      >
        <div className="max-h-64 overflow-y-auto p-1.5" role="listbox">
          {!grouped && (
            <>
              {options.map((option) => {
                const selected = String(option.value) === String(value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={[
                      "w-full flex items-center justify-between",
                      "px-3 py-2.5",
                      "rounded-lg",
                      "text-left text-sm font-medium",
                      "transition-all duration-150",
                      selected
                        ? "bg-income/10 text-income"
                        : "text-text-secondary hover:bg-income/5 hover:text-income",
                    ].join(" ")}
                    role="option"
                    aria-selected={selected}
                  >
                    <span className="truncate">{option.label}</span>

                    {selected && (
                      <i className="fa-solid fa-check text-xs ml-2 shrink-0" />
                    )}
                  </button>
                );
              })}
            </>
          )}

          {grouped &&
            options.map((group, groupIndex) => (
              <div key={group.label || groupIndex}>
                {group.label && (
                  <div className="px-3 py-1.5 my-1.5 border-y border-border/60 text-xs font-bold uppercase tracking-wider text-income/80 bg-bg-tertiary/30">
                    {group.label}
                  </div>
                )}

                {group.options.map((option) => {
                  const selected = String(option.value) === String(value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={[
                        "w-full flex items-center justify-between",
                        "px-3 py-2.5",
                        "rounded-lg",
                        "text-left text-sm font-medium",
                        "transition-all duration-150",
                        selected
                          ? "bg-income/10 text-income"
                          : "text-text-secondary hover:bg-income/5 hover:text-income",
                      ].join(" ")}
                      role="option"
                      aria-selected={selected}
                    >
                      <span className="truncate">{option.label}</span>

                      {selected && (
                        <i className="fa-solid fa-check text-xs ml-2 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function TransactionFilters({
  filters,
  onFilterChange,
  categories,
  transactions,
  sort,
  onSortChange,
}) {
  const months = useMemo(
    () => getAvailableMonths(transactions),
    [transactions],
  );

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "expense"),
    [categories],
  );

  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === "income"),
    [categories],
  );

  const typeOptions = [
    {
      value: "",
      label: "All Types",
    },
    {
      value: "income",
      label: "Income",
    },
    {
      value: "expense",
      label: "Expense",
    },
  ];

  const categoryGroups = [
    ...(expenseCategories.length > 0
      ? [
          {
            label: "Expense",
            options: expenseCategories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          },
        ]
      : []),

    ...(incomeCategories.length > 0
      ? [
          {
            label: "Income",
            options: incomeCategories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          },
        ]
      : []),
  ];

  const categoryOptions = [
    {
      options: [
        {
          value: "",
          label: "All Categories",
        },
      ],
    },
    ...categoryGroups,
  ];

  const monthOptions = [
    {
      value: "",
      label: "All Months",
    },
    ...months.map((month) => ({
      value: month,
      label: getMonthLabel(month),
    })),
  ];

  const sortOptions = [
    {
      value: "date",
      label: "Sort by Date",
    },
    {
      value: "amount",
      label: "Sort by Amount",
    },
  ];

  const handleTypeChange = (value) => {
    onFilterChange((previous) => ({
      ...previous,
      type: value,
      categoryId: "",
    }));
  };

  const handleCategoryChange = (value) => {
    onFilterChange((previous) => ({
      ...previous,
      categoryId: value,
    }));
  };

  const handleMonthChange = (value) => {
    onFilterChange((previous) => ({
      ...previous,
      month: value,
    }));
  };

  const handleSortChange = (value) => {
    onSortChange((previous) => ({
      ...previous,
      field: value,
    }));
  };

  const handleSortDirection = () => {
    onSortChange((previous) => ({
      ...previous,
      dir: previous.dir === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 w-full lg:w-auto">
        <CustomDropdown
          value={filters.type}
          options={typeOptions}
          onChange={handleTypeChange}
          placeholder="All Types"
        />

        <CustomDropdown
          value={filters.categoryId}
          options={categoryOptions}
          onChange={handleCategoryChange}
          placeholder="All Categories"
          grouped
        />

        <CustomDropdown
          value={filters.month}
          options={monthOptions}
          onChange={handleMonthChange}
          placeholder="All Months"
        />
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto">
        <CustomDropdown
          value={sort.field}
          options={sortOptions}
          onChange={handleSortChange}
          placeholder="Sort by Date"
        />

        <button
          type="button"
          onClick={handleSortDirection}
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-bg-tertiary/70 text-income hover:border-income/40 hover:bg-income/10 hover:shadow-[0_0_12px_rgba(34,197,94,0.12)] transition-all duration-200"
          title={sort.dir === "asc" ? "Ascending" : "Descending"}
          aria-label={sort.dir === "asc" ? "Sort ascending" : "Sort descending"}
        >
          <i
            className={`fa-solid ${
              sort.dir === "asc" ? "fa-arrow-up" : "fa-arrow-down"
            } text-xs`}
          />
        </button>
      </div>
    </div>
  );
}
