import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSavingsGoal, updateSavingsGoal } from '../../store/slices/savingsGoalsSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import './SavingsGoalForm.css';

export default function SavingsGoalForm({ goal, userId, onClose }) {
  const isEdit = !!goal;
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: goal?.name || '',
    targetAmount: goal?.targetAmount?.toString() || '',
    currentAmount: goal?.currentAmount?.toString() || '0',
    targetDate: goal?.targetDate || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Goal name is required';
    if (!form.targetAmount || isNaN(form.targetAmount) || Number(form.targetAmount) <= 0) {
      errs.targetAmount = 'Enter a valid target amount (greater than 0)';
    }
    if (form.currentAmount === '' || isNaN(form.currentAmount) || Number(form.currentAmount) < 0) {
      errs.currentAmount = 'Enter a valid current amount (0 or greater)';
    } else if (Number(form.currentAmount) > Number(form.targetAmount)) {
      errs.currentAmount = 'Current savings cannot exceed the target amount';
    }

    if (form.targetDate) {
      const today = new Date().toISOString().split('T')[0];
      if (form.targetDate < today) {
        errs.targetDate = 'Target date must be today or in the future';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      ...form,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      userId,
    };

    try {
      if (isEdit) {
        await dispatch(updateSavingsGoal({ id: goal.id, data: payload })).unwrap();
      } else {
        await dispatch(addSavingsGoal(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      // slice catches
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form className="savings-form" onSubmit={handleSubmit} noValidate>
      <Input
        id="savings-name"
        label="Goal Name"
        value={form.name}
        onChange={handleChange('name')}
        placeholder="e.g., Summer Trip, New Laptop"
        error={errors.name}
        required
        icon={<i className="fa-solid fa-bullseye"></i>}
      />

      <div className="savings-form__row">
        <Input
          id="savings-target"
          label="Target Amount (EGP)"
          type="number"
          value={form.targetAmount}
          onChange={handleChange('targetAmount')}
          placeholder="e.g., 2000"
          error={errors.targetAmount}
          required
          icon={<i className="fa-solid fa-money-bill-wave"></i>}
          min="1"
        />

        <Input
          id="savings-current"
          label="Current Savings (EGP)"
          type="number"
          value={form.currentAmount}
          onChange={handleChange('currentAmount')}
          placeholder="0"
          error={errors.currentAmount}
          required
          icon={<i className="fa-solid fa-piggy-bank"></i>}
          min="0"
        />
      </div>

      <Input
        id="savings-date"
        label="Target Date"
        type="date"
        value={form.targetDate}
        onChange={handleChange('targetDate')}
        error={errors.targetDate}
        icon={<i className="fa-solid fa-calendar"></i>}
      />

      <div className="savings-form__actions">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
}
