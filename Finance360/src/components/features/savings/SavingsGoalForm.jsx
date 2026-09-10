import { useState } from "react";
import { useDispatch } from "react-redux";
import { FiCalendar, FiDollarSign, FiTarget } from "react-icons/fi";

import {
  addSavingsGoal,
  updateSavingsGoal,
} from "../../../store/slices/savingsGoalsSlice";

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
      goal?.targetAmount !== undefined ? String(goal.targetAmount) : "",

    currentAmount:
      goal?.currentAmount !== undefined ? String(goal.currentAmount) : "0",

    targetDate: formattedDate,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Goal name is required";
    }

    if (
      !form.targetAmount ||
      isNaN(form.targetAmount) ||
      Number(form.targetAmount) <= 0
    ) {
      nextErrors.targetAmount = "Enter a valid target amount (greater than 0)";
    }

    if (
      form.currentAmount === "" ||
      isNaN(form.currentAmount) ||
      Number(form.currentAmount) < 0
    ) {
      nextErrors.currentAmount = "Enter a valid current amount (0 or greater)";
    } else if (Number(form.currentAmount) > Number(form.targetAmount)) {
      nextErrors.currentAmount =
        "Current savings cannot exceed the target amount";
    }

    if (form.targetDate) {
      const today = new Date().toISOString().split("T")[0];

      if (form.targetDate < today) {
        nextErrors.targetDate = "Target date must be today or in the future";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

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
        const goalId = goal.documentId || goal.id;

        if (!goalId) {
          console.error("Cannot update savings goal: missing ID");
          return;
        }

        await dispatch(
          updateSavingsGoal({
            id: goalId,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addSavingsGoal(payload)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Savings goal save failed:", error);
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
      {/* Goal Name */}
      <Input
        id="savings-name"
        label="Goal Name"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="e.g., Summer Trip, New Laptop"
        error={errors.name}
        required
        icon={<FiTarget />}
      />

      {/* Amounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="savings-target"
          label="Target Amount"
          type="number"
          value={form.targetAmount}
          onChange={handleChange("targetAmount")}
          placeholder="e.g., 2000"
          error={errors.targetAmount}
          required
          icon={<FiDollarSign />}
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
          icon={<FiTarget />}
          min="0"
        />
      </div>

      {/* Target Date */}
      <Input
        id="savings-date"
        label="Target Date (optional)"
        type="date"
        value={form.targetDate}
        onChange={handleChange("targetDate")}
        error={errors.targetDate}
        icon={<FiCalendar />}
      />

      {/* Actions */}
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
