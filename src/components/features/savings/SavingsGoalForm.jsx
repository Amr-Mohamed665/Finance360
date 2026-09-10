import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addSavingsGoal,
  updateSavingsGoal,
} from "../../../store/slices/savingsGoalsSlice";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../common/Input";
import Button from "../../common/Button";

export default function SavingsGoalForm({ goal, userId, onClose }) {
  const isEdit = !!goal;
  const dispatch = useDispatch();

  const initialDate = goal?.deadline || goal?.targetDate || "";
  const formattedDate = initialDate ? String(initialDate).split("T")[0] : "";

  const [form, setForm] = useState({
    name: goal?.name || "",
    targetAmount:
      goal?.targetAmount !== undefined ? goal.targetAmount.toString() : "",
    currentAmount:
      goal?.currentAmount !== undefined ? goal.currentAmount.toString() : "0",
    targetDate: formattedDate,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Goal name is required";
    }

    if (
      !form.targetAmount ||
      isNaN(form.targetAmount) ||
      Number(form.targetAmount) <= 0
    ) {
      errs.targetAmount = "Enter a valid target amount (greater than 0)";
    }

    if (
      form.currentAmount === "" ||
      isNaN(form.currentAmount) ||
      Number(form.currentAmount) < 0
    ) {
      errs.currentAmount = "Enter a valid current amount (0 or greater)";
    } else if (Number(form.currentAmount) > Number(form.targetAmount)) {
      errs.currentAmount = "Current savings cannot exceed the target amount";
    }

    if (form.targetDate) {
      const today = new Date().toISOString().split("T")[0];

      if (form.targetDate < today) {
        errs.targetDate = "Target date must be today or in the future";
      }
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
      name: form.name.trim(),
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      targetDate: form.targetDate || null,
      deadline: form.targetDate ? `${form.targetDate}T23:59:59.000Z` : null,
      userId,
    };

    try {
      if (isEdit) {
        // Strapi 5: prefer documentId for update requests
        const goalId = goal.documentId || goal.id;

        await dispatch(
          updateSavingsGoal({
            id: goalId,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addSavingsGoal(payload)).unwrap();
      }

      saved = true;
    } catch (error) {
      console.error("Savings goal save failed:", error);
      setServerError(getErrorMessage(error, "Failed to save savings goal"));
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
      <Input
        id="savings-name"
        label="Goal Name"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="e.g., Summer Trip, New Laptop"
        error={errors.name}
        required
        icon={<i className="fa-solid fa-bullseye" />}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="savings-target"
          label="Target Amount"
          type="number"
          value={form.targetAmount}
          onChange={handleChange("targetAmount")}
          placeholder="e.g., 2000"
          error={errors.targetAmount}
          required
          icon={<span className="text-xs font-bold text-text-muted">EGP</span>}
          min="1"
        />

        <Input
          id="savings-current"
          label="Current Savings"
          type="number"
          value={form.currentAmount}
          onChange={handleChange("currentAmount")}
          placeholder="0"
          error={errors.currentAmount}
          required
          icon={<span className="text-xs font-bold text-text-muted">EGP</span>}
          min="0"
        />
      </div>

      <Input
        id="savings-date"
        label="Target Date (optional)"
        type="date"
        value={form.targetDate}
        onChange={handleChange("targetDate")}
        error={errors.targetDate}
        icon={<i className="fa-solid fa-calendar" />}
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>

        <Button type="submit" variant="primary" disabled={submitting} fullWidth>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Goal"}
        </Button>
      </div>
    </form>
  );
}
