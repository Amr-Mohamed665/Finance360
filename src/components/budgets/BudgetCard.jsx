import Card from '../common/Card';
import { formatCurrency, calcPercentage } from '../../utils/helpers';
import './BudgetCard.css';

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const { categoryName, categoryIcon, categoryColor, spent, amount } = budget;
  const pct = calcPercentage(spent, amount);

  let statusClass = '';
  if (pct >= 100) statusClass = 'budget-card--over';
  else if (pct >= 85) statusClass = 'budget-card--warning';

  return (
    <Card
      className={`budget-card ${statusClass}`}
      title={
        <span className="budget-card__title-text">
          <i className={categoryIcon} style={{ color: categoryColor }}></i> {categoryName}
        </span>
      }
      action={
        <div className="budget-card__actions">
          <button className="budget-card__action-btn" onClick={onEdit} title="Edit budget limit">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button className="budget-card__action-btn budget-card__action-btn--delete" onClick={onDelete} title="Delete budget limit">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      }
    >
      <div className="budget-card__body-content">
        <div className="budget-card__values">
          <span className="budget-card__spent">{formatCurrency(spent)} spent</span>
          <span className="budget-card__limit">of {formatCurrency(amount)}</span>
        </div>

        <div className="budget-card__bar-container">
          <div
            className={`budget-card__bar-fill ${pct >= 100 ? 'budget-card__bar-fill--danger' : pct >= 85 ? 'budget-card__bar-fill--warning' : ''}`}
            style={{ width: `${pct}%` }}
          ></div>
        </div>

        <div className="budget-card__footer">
          <span className="budget-card__percentage">{pct}% used</span>
          {pct >= 100 ? (
            <span className="budget-card__status budget-card__status--danger">Over budget!</span>
          ) : pct >= 85 ? (
            <span className="budget-card__status budget-card__status--warning">Near limit</span>
          ) : (
            <span className="budget-card__status budget-card__status--safe">On track</span>
          )}
        </div>
      </div>
    </Card>
  );
}
