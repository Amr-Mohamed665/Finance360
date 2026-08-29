import Card from '../common/Card';
import { calcPercentage, formatCurrency } from '../../utils/helpers';
import './SavingsOverview.css';

export default function SavingsOverview({ savingsGoals }) {
  return (
    <Card title="Savings Goals">
      {savingsGoals.length === 0 ? (
        <p className="savings-ov__empty">No savings goals yet.</p>
      ) : (
        <div className="savings-ov__list">
          {savingsGoals.map((goal) => {
            const pct = calcPercentage(goal.currentAmount, goal.targetAmount);
            return (
              <div key={goal.id} className="savings-ov__item">
                <div className="savings-ov__header">
                  <span className="savings-ov__name"><i className="fa-solid fa-bullseye text-secondary"></i> {goal.name}</span>
                  <span className="savings-ov__pct">{pct}%</span>
                </div>
                <div className="savings-ov__bar-bg">
                  <div
                    className="savings-ov__bar-fill"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="savings-ov__values">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
