import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  addTransaction,
  updateTransaction,
} from "../../../store/slices/transactionsSlice";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";

export default function TransactionForm({
  transaction,
  categories,
  userId,
  onClose,
}) {
  const isEdit = !!transaction;
  const dispatch = useDispatch();

  const initialCatId =
    transaction?.category?.documentId ||
    transaction?.category?.id ||
    transaction?.categoryId ||
    (typeof transaction?.category === "string" ||
    typeof transaction?.category === "number"
      ? transaction.category
      : "");

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
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }

    return categories
      .filter((c) => !c.type || c.type === "both" || c.type === form.type)
      .map((c) => ({
        value: String(c.documentId || c.id),
        label: c.name,
      }));
  }, [categories, form.type]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSubmitting(true);
    let saved = false;

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
        // Strapi 5: documentId first
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

      saved = true;
    } catch (error) {
      console.error("Transaction save failed:", error);
      setServerError(getErrorMessage(error, "Failed to save transaction"));
    } finally {
      setSubmitting(false);
      if (saved) onClose();
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

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
      {serverError && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-expense/10 border border-expense/20 text-expense text-sm">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0" />
          {serverError}
        </div>
      )}
      {/* Type toggle */}
      <div className="flex rounded-lg overflow-hidden border border-border bg-bg-tertiary/40 p-1 gap-1">
        {["expense", "income"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() =>
              handleChange("type")({
                target: { value: type },
              })
            }
            className={[
              "flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-150",

              form.type === type
                ? type === "expense"
                  ? "bg-expense text-white shadow-glow-expense"
                  : "bg-income text-white shadow-glow-income"
                : "text-text-muted hover:text-text-secondary",
            ].join(" ")}
          >
            {type === "expense" ? "↓ Expense" : "↑ Income"}
          </button>
        ))}
      </div>

      <Input
        id="tx-amount"
        label="Amount"
        type="number"
        value={form.amount}
        onChange={handleChange("amount")}
        placeholder="0.00"
        error={errors.amount}
        required
        icon={<span className="text-xs font-bold text-text-muted">EGP</span>}
        min="0"
        step="0.01"
      />

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

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>

        <Button type="submit" variant="primary" disabled={submitting} fullWidth>
          {submitting ? "Saving..." : isEdit ? "Update" : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
