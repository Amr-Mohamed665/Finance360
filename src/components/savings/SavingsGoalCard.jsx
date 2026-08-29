import Card from '../common/Card';
import { formatCurrency, formatDate, calcPercentage } from '../../utils/helpers';
import './SavingsGoalCard.css';

export default function SavingsGoalCard({ goal, onEdit, onDelete }) {
  const { name, currentAmount, targetAmount, targetDate } = goal;
  const pct = calcPercentage(currentAmount, targetAmount);

  return (
    <Card
      className="savings-goal-card"
      title={<span className="savings-goal-card__title-text"><i className="fa-solid fa-bullseye text-secondary"></i> {name}</span>}
      action={
        <div className="savings-goal-card__actions">
          <button className="savings-goal-card__action-btn" onClick={onEdit} title="Edit Goal">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button className="savings-goal-card__action-btn savings-goal-card__action-btn--delete" onClick={onDelete} title="Delete Goal">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      }
    >
      <div className="savings-goal-card__body-content">
        <div className="savings-goal-card__values">
          <span className="savings-goal-card__current">{formatCurrency(currentAmount)}</span>
          <span className="savings-goal-card__target">of {formatCurrency(targetAmount)}</span>
        </div>

        <div className="savings-goal-card__bar-container">
          <div className="savings-goal-card__bar-fill" style={{ width: `${pct}%` }}></div>
        </div>

        <div className="savings-goal-card__footer">
          <span className="savings-goal-card__pct">{pct}% saved</span>
          {targetDate && (
            <span className="savings-goal-card__date">Target: {formatDate(targetDate)}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
