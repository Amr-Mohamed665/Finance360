import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { FiCalendar, FiTarget } from "react-icons/fi";

import { addBudget, updateBudget } from "../../../store/slices/budgetsSlice";

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

  const initialCategoryId =
    budget?.category?.documentId ||
    budget?.category?.id ||
    budget?.categoryId ||
    (typeof budget?.category === "string" ||
    typeof budget?.category === "number"
      ? budget.category
      : "");

  const [form, setForm] = useState({
    categoryId: initialCategoryId ? String(initialCategoryId) : "",

    amount: budget?.amount !== undefined ? String(budget.amount) : "",

    month: budget?.month || month,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const expenseCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories
      .filter(
        (category) =>
          !category.type ||
          category.type === "expense" ||
          category.type === "both",
      )
      .map((category) => ({
        value: String(category.documentId || category.id),
        label: category.name,
      }));
  }, [categories]);

  const validate = () => {
    const nextErrors = {};

    if (!form.categoryId) {
      nextErrors.categoryId = "Category is required";
    } else if (!isEdit && Array.isArray(existingBudgets)) {
      const duplicate = existingBudgets.some((existingBudget) => {
        const budgetCategoryId = String(
          existingBudget.category?.documentId ||
            existingBudget.category?.id ||
            existingBudget.categoryId ||
            existingBudget.category ||
            "",
        );

        return (
          budgetCategoryId === String(form.categoryId) &&
          String(existingBudget.month) === String(form.month)
        );
      });

      if (duplicate) {
        nextErrors.categoryId =
          "A budget for this category already exists this month";
      }
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      nextErrors.amount = "Enter a valid budget limit (greater than 0)";
    }

    if (!form.month) {
      nextErrors.month = "Month is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const categoryValue = form.categoryId;

    const payload = {
      ...form,
      category: categoryValue,
      categoryId: categoryValue,
      amount: Number(form.amount),
      userId,
    };

    try {
      if (isEdit) {
        const budgetId = budget.documentId || budget.id;

        if (!budgetId) {
          console.error("Cannot update budget: missing ID");
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

      onClose();
    } catch (error) {
      console.error("Budget save failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
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
        icon={<FiTarget />}
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
        icon={<FiCalendar />}
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
