import { formatCurrency } from '../../utils/helpers';
import './SummaryCards.css';

const cards = [
  { key: 'income', label: 'Total Income', icon: 'fa-solid fa-circle-up', colorVar: '--income-color' },
  { key: 'expenses', label: 'Total Expenses', icon: 'fa-solid fa-circle-down', colorVar: '--expense-color' },
  { key: 'balance', label: 'Current Balance', icon: 'fa-solid fa-wallet', colorVar: '--accent-primary' },
  { key: 'savings', label: 'Total Savings', icon: 'fa-solid fa-piggy-bank', colorVar: '--accent-secondary' },
];

export default function SummaryCards({ totalIncome, totalExpenses, balance, totalSavings }) {
  const values = { income: totalIncome, expenses: totalExpenses, balance, savings: totalSavings };

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div key={card.key} className="summary-card" style={{ '--card-accent': `var(${card.colorVar})` }}>
          <div className="summary-card__icon" style={{
            color: `var(${card.colorVar})`,
            background: `color-mix(in srgb, var(${card.colorVar}) 10%, transparent)`
          }}>
            <i className={card.icon}></i>
          </div>
          <div className="summary-card__info">
            <span className="summary-card__label">{card.label}</span>
            <span className="summary-card__value">{formatCurrency(values[card.key])}</span>
          </div>
          <div className="summary-card__glow"></div>
        </div>
      ))}
    </div>
  );
}
