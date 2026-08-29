import Card from '../common/Card';
import { calcPercentage, formatCurrency } from '../../utils/helpers';

export default function SavingsOverview({ savingsGoals }) {
  return (
    <Card title="Savings Goals">
      {savingsGoals.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">No savings goals yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {savingsGoals.map((goal) => {
            const pct = calcPercentage(goal.currentAmount, goal.targetAmount);
            return (
              <div key={goal.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <i className="fa-solid fa-bullseye text-accent-secondary" />
                    {goal.name}
                  </span>
                  <span className="text-xs font-semibold text-accent-secondary">{pct}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-savings rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
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
