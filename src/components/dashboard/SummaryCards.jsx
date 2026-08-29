import { formatCurrency } from '../../utils/helpers';

const cards = [
  {
    key: 'income',
    label: 'Total Income',
    icon: 'fa-solid fa-circle-up',
    gradient: 'bg-gradient-income',
    glow: 'shadow-glow-income',
    border: 'border-income/20',
    textColor: 'text-income',
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: 'fa-solid fa-circle-down',
    gradient: 'bg-gradient-expense',
    glow: 'shadow-glow-expense',
    border: 'border-expense/20',
    textColor: 'text-expense',
  },
  {
    key: 'balance',
    label: 'Current Balance',
    icon: 'fa-solid fa-wallet',
    gradient: 'bg-gradient-primary',
    glow: 'shadow-glow',
    border: 'border-accent-primary/20',
    textColor: 'text-accent-primary',
  },
  {
    key: 'savings',
    label: 'Total Savings',
    icon: 'fa-solid fa-piggy-bank',
    gradient: 'bg-gradient-savings',
    glow: 'shadow-glow-cyan',
    border: 'border-accent-secondary/20',
    textColor: 'text-accent-secondary',
  },
];

export default function SummaryCards({ totalIncome, totalExpenses, balance, totalSavings }) {
  const values = { income: totalIncome, expenses: totalExpenses, balance, savings: totalSavings };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`glass-panel rounded-xl p-5 flex items-center gap-4 border ${card.border} hover:${card.glow} transition-all duration-200 animate-fade-in`}
        >
          <div className={`w-12 h-12 rounded-xl ${card.gradient} flex items-center justify-center flex-shrink-0 ${card.glow}`}>
            <i className={`${card.icon} text-white text-lg`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider truncate">{card.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${card.textColor} truncate`}>
              {formatCurrency(values[card.key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
