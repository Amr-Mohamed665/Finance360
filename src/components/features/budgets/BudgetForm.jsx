import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addBudget, updateBudget } from "../../../store/slices/budgetsSlice";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";

export default function BudgetForm({
  budget,
  categories,
  userId,
  month,
  existingBudgets,
  onClose,
}) {
  const isEdit = !!budget;
  const dispatch = useDispatch();

  const initialCatId =
    budget?.category?.documentId ||
    budget?.category?.id ||
    budget?.categoryId ||
    (typeof budget?.category === "string" ||
    typeof budget?.category === "number"
      ? budget.category
      : "");

  const [form, setForm] = useState({
    categoryId: initialCatId ? String(initialCatId) : "",

    amount: budget?.amount !== undefined ? budget.amount.toString() : "",

    month: budget?.month || month,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const expenseCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories
      .filter((c) => !c.type || c.type === "expense" || c.type === "both")
      .map((c) => ({
        value: String(c.documentId || c.id),
        label: c.name,
      }));
  }, [categories]);

  const validate = () => {
    const errs = {};

    if (!form.categoryId) {
      errs.categoryId = "Category is required";
    } else if (!isEdit && Array.isArray(existingBudgets)) {
      const isDuplicate = existingBudgets.some((b) => {
        const bCatId = String(
          b.category?.documentId ||
            b.category?.id ||
            b.categoryId ||
            b.category ||
            "",
        );

        return (
          bCatId === String(form.categoryId) &&
          String(b.month) === String(form.month)
        );
      });

      if (isDuplicate) {
        errs.categoryId =
          "A budget for this category already exists this month";
      }
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errs.amount = "Enter a valid budget limit (greater than 0)";
    }

    if (!form.month) {
      errs.month = "Month is required";
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

    const catVal = form.categoryId;

    const payload = {
      ...form,
      category: catVal,
      categoryId: catVal,
      amount: Number(form.amount),
      userId,
    };

    try {
      if (isEdit) {
        const budgetId = budget.documentId || budget.id;

        if (!budgetId) {
          setServerError("Cannot update budget: missing ID");
          return;
        }

        await dispatch(
          updateBudget({
            id: budgetId,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addBudget(payload)).unwrap();
      }

      saved = true;
    } catch (error) {
      console.error("Budget save failed:", error);
      setServerError(getErrorMessage(error, "Failed to save budget"));
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
      <Select
        id="budget-category"
        label="Expense Category"
        value={form.categoryId}
        onChange={handleChange("categoryId")}
        options={expenseCategories}
        placeholder="Select a category"
        error={errors.categoryId}
        required
        disabled={isEdit}
      />

      <Input
        id="budget-amount"
        label="Monthly Limit"
        type="number"
        value={form.amount}
        onChange={handleChange("amount")}
        placeholder="e.g., 500"
        error={errors.amount}
        required
        icon={<span className="text-xs font-bold text-text-muted">EGP</span>}
        min="1"
      />

      <Input
        id="budget-month"
        label="Budget Month"
        type="month"
        value={form.month}
        onChange={handleChange("month")}
        error={errors.month}
        required
        icon={<i className="fa-solid fa-calendar" />}
        disabled={isEdit}
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>

        <Button type="submit" variant="primary" disabled={submitting} fullWidth>
          {submitting ? "Saving..." : isEdit ? "Update Limit" : "Set Budget"}
        </Button>
      </div>
    </form>
  );
}
