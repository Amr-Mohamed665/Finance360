import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addCategory,
  updateCategory,
} from "../../../store/slices/categoriesSlice";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";

const iconOptions = [
  {
    value: "fa-solid fa-utensils",
    label: "Food & Dining (🍽️)",
  },
  {
    value: "fa-solid fa-cart-shopping",
    label: "Shopping (🛒)",
  },
  {
    value: "fa-solid fa-house",
    label: "Housing / Rent (🏠)",
  },
  {
    value: "fa-solid fa-car",
    label: "Transportation (🚗)",
  },
  {
    value: "fa-solid fa-briefcase",
    label: "Salary / Work (💼)",
  },
  {
    value: "fa-solid fa-graduation-cap",
    label: "Education (🎓)",
  },
  {
    value: "fa-solid fa-heart-pulse",
    label: "Health & Medical (💊)",
  },
  {
    value: "fa-solid fa-plane",
    label: "Travel & Vacations (✈️)",
  },
  {
    value: "fa-solid fa-film",
    label: "Entertainment (🎬)",
  },
  {
    value: "fa-solid fa-bolt",
    label: "Bills & Utilities (⚡)",
  },
  {
    value: "fa-solid fa-money-bill-wave",
    label: "Income / Cash (💵)",
  },
  {
    value: "fa-solid fa-gift",
    label: "Gifts & Donations (🎁)",
  },
  {
    value: "fa-solid fa-piggy-bank",
    label: "Savings & Investment (🏦)",
  },
  {
    value: "fa-solid fa-tags",
    label: "General / Other (🏷️)",
  },
];

const colorOptions = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#3b82f6",
  "#84cc16",
];

export default function CategoryForm({ category, userId, onClose }) {
  const isEdit = !!category;
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: category?.name || "",
    type: category?.type || "expense",
    icon: category?.icon || "fa-solid fa-tags",
    color: category?.color || "#6366f1",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Category name is required";
    }

    if (!form.type) {
      errs.type = "Category type is required";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSubmitting(true);
    let saved = false;

    const payload = {
      ...form,
      name: form.name.trim(),
      userId,
    };

    try {
      if (isEdit) {
        const categoryId = category.documentId || category.id;

        if (!categoryId) {
          setServerError("Cannot update category: missing ID");
          return;
        }

        await dispatch(
          updateCategory({
            id: categoryId,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addCategory(payload)).unwrap();
      }

      saved = true;
    } catch (error) {
      console.error("Category save failed:", error);
      setServerError(getErrorMessage(error, "Failed to save category"));
    } finally {
      setSubmitting(false);
      if (saved) onClose();
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-expense/10 border border-expense/20 text-expense text-sm">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
          {serverError}
        </div>
      )}
      {/* Type toggle */}
      <div className="flex rounded-lg overflow-hidden border border-border bg-bg-tertiary/40 p-1 gap-1">
        {[
          {
            key: "expense",
            label: "Expense",
            cls: "bg-expense",
          },
          {
            key: "income",
            label: "Income",
            cls: "bg-income",
          },
          {
            key: "both",
            label: "Both",
            cls: "bg-accent-primary",
          },
        ].map(({ key, label, cls }) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              handleChange("type")({
                target: {
                  value: key,
                },
              })
            }
            className={[
              "flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-150",
              form.type === key
                ? `${cls} text-white shadow-sm`
                : "text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <Input
        id="cat-name"
        label="Category Name"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="e.g., Groceries, Rent, Freelancing"
        error={errors.name}
        required
        icon={
          <i
            className={form.icon || "fa-solid fa-tag"}
            style={{
              color: form.color,
            }}
          />
        }
      />

      <Select
        id="cat-icon"
        label="Icon"
        value={form.icon}
        onChange={handleChange("icon")}
        options={iconOptions}
        placeholder="Select icon"
      />

      {/* Color Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Category Color
        </label>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  color,
                }))
              }
              className={`w-7 h-7 rounded-full transition-transform duration-150 ${
                form.color === color
                  ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-bg-primary"
                  : "hover:scale-110"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>

        <Button type="submit" variant="primary" disabled={submitting} fullWidth>
          {submitting
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
