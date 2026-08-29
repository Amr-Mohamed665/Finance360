import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addBudget, updateBudget } from '../../store/slices/budgetsSlice';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

export default function BudgetForm({ budget, categories, userId, month, existingBudgets, onClose }) {
  const isEdit = !!budget;
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    categoryId: budget?.categoryId || '',
    amount: budget?.amount?.toString() || '',
    month: budget?.month || month,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const expenseCategories = useMemo(() => {
    return categories
      .filter((c) => c.type === 'expense')
      .map((c) => ({ value: c.id, label: c.name }));
  }, [categories]);

  const validate = () => {
    const errs = {};
    if (!form.categoryId) {
      errs.categoryId = 'Category is required';
    } else if (!isEdit) {
      const isDuplicate = existingBudgets.some(
        (b) => b.categoryId === form.categoryId && b.month === form.month
      );
      if (isDuplicate) errs.categoryId = 'A budget for this category already exists this month';
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid budget limit (greater than 0)';
    if (!form.month) errs.month = 'Month is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = { ...form, amount: Number(form.amount), userId };
    try {
      if (isEdit) {
        await dispatch(updateBudget({ id: budget.id, data: payload })).unwrap();
      } else {
        await dispatch(addBudget(payload)).unwrap();
      }
      onClose();
    } catch {
      /* handled by slice */
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <Select
        id="budget-category"
        label="Expense Category"
        value={form.categoryId}
        onChange={handleChange('categoryId')}
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
        onChange={handleChange('amount')}
        placeholder="e.g., 500"
        error={errors.amount}
        required
        icon={<i className="fa-solid fa-bullseye" />}
        min="1"
      />

      <Input
        id="budget-month"
        label="Budget Month"
        type="month"
        value={form.month}
        onChange={handleChange('month')}
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
          {submitting ? 'Saving...' : isEdit ? 'Update Limit' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
}
