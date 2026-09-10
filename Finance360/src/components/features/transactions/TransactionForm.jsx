import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";

import {
  addTransaction,
  updateTransaction,
} from "../../../store/slices/transactionsSlice";

import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";

export default function TransactionForm({
  transaction,
  categories,
  userId,
  onClose,
}) {
  const dispatch = useDispatch();

  const isEdit = !!transaction;

  // Get the category ID from the transaction
  const initialCatId =
    transaction?.category?.documentId ||
    transaction?.category?.id ||
    transaction?.categoryId ||
    (typeof transaction?.category === "string" ||
    typeof transaction?.category === "number"
      ? transaction.category
      : "");

  // Form state
  const [form, setForm] = useState({
    type: transaction?.type || "expense",

    amount:
      transaction?.amount !== undefined ? transaction.amount.toString() : "",

    categoryId: initialCatId ? String(initialCatId) : "",

    description: transaction?.description || "",

    date: transaction?.date
      ? String(transaction.date).split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Show only categories matching the selected transaction type
  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories
      .filter(
        (category) =>
          !category.type ||
          category.type === "both" ||
          category.type === form.type,
      )
      .map((category) => ({
        value: String(category.documentId || category.id),
        label: category.name,
      }));
  }, [categories, form.type]);

  // Validate form fields
  const validate = () => {
    const errs = {};

    if (!form.type) {
      errs.type = "Type is required";
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errs.amount = "Enter a valid amount";
    }

    if (!form.categoryId) {
      errs.categoryId = "Category is required";
    }

    if (!form.description.trim()) {
      errs.description = "Description is required";
    }

    if (!form.date) {
      errs.date = "Date is required";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // Submit transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const catVal = form.categoryId;

    const payload = {
      type: form.type,
      amount: Number(form.amount),
      category: catVal,
      categoryId: catVal,
      description: form.description.trim(),
      date: form.date,
      userId,
    };

    try {
      if (isEdit) {
        // Strapi 5 uses documentId when available
        const transactionId = transaction.documentId || transaction.id;

        await dispatch(
          updateTransaction({
            id: transactionId,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addTransaction(payload)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Transaction save failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Update form fields and clear their errors
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      // Reset category when transaction type changes
      if (field === "type") {
        next.categoryId = "";
      }

      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {/* Transaction Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-secondary">
          Transaction Type
        </label>

        <div className="flex rounded-xl overflow-hidden border border-border bg-bg-tertiary/40 p-1 gap-1">
          {["expense", "income"].map((type) => {
            const isActive = form.type === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  handleChange("type")({
                    target: {
                      value: type,
                    },
                  })
                }
                className={[
                  "flex-1 py-2.5 rounded-lg text-sm font-semibold",
                  "transition-all duration-150",
                  "focus:outline-none",
                  isActive
                    ? type === "expense"
                      ? "bg-expense text-white shadow-glow-expense"
                      : "bg-income text-white shadow-glow-income"
                    : [
                        "text-text-muted",
                        "hover:text-text-primary",
                        "hover:bg-bg-tertiary",
                      ].join(" "),
                ].join(" ")}
              >
                <span className="flex items-center justify-center gap-2">
                  <i
                    className={
                      type === "expense"
                        ? "fa-solid fa-arrow-down"
                        : "fa-solid fa-arrow-up"
                    }
                  />

                  {type === "expense" ? "Expense" : "Income"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount */}
      <Input
        id="tx-amount"
        label="Amount"
        type="number"
        value={form.amount}
        onChange={handleChange("amount")}
        placeholder="0.00"
        error={errors.amount}
        required
        icon={<i className="fa-solid fa-dollar-sign" />}
        min="0"
        step="0.01"
      />

      {/* Category */}
      <Select
        id="tx-category"
        label="Category"
        value={form.categoryId}
        onChange={handleChange("categoryId")}
        options={filteredCategories}
        placeholder="Select a category"
        error={errors.categoryId}
        required
      />

      {/* Description */}
      <Input
        id="tx-description"
        label="Description"
        value={form.description}
        onChange={handleChange("description")}
        placeholder="What was this transaction for?"
        error={errors.description}
        required
        icon={<i className="fa-solid fa-pen-to-square" />}
      />

      {/* Date */}
      <Input
        id="tx-date"
        label="Date"
        type="date"
        value={form.date}
        onChange={handleChange("date")}
        error={errors.date}
        required
        icon={<i className="fa-solid fa-calendar" />}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          fullWidth
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button type="submit" variant="primary" disabled={submitting} fullWidth>
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Transaction"
              : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
