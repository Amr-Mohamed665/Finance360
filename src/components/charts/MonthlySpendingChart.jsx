import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import { getAvailableMonths, filterByMonth, calcTotal, getMonthLabel, formatCurrency } from '../../utils/helpers';

// Custom tooltip renderer
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip" style={{
        background: 'rgba(15, 19, 26, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.37)'
      }}>
        <p className="tooltip-label" style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc', marginBottom: '0.5rem' }}>{label}</p>
        {payload.map((pld) => (
          <div key={pld.name} className="tooltip-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--expense-color)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--expense-color)' }}></span>
            <span style={{ color: '#cbd5e1' }}>Total Spent:</span>
            <span style={{ fontWeight: 700 }}>{formatCurrency(pld.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlySpendingChart({ transactions }) {
  const chartData = useMemo(() => {
    const months = getAvailableMonths(transactions).slice(0, 12).reverse();
    return months.map((m) => {
      return {
        month: getMonthLabel(m),
        Spending: calcTotal(filterByMonth(transactions, m), 'expense'),
      };
    });
  }, [transactions]);

  return (
    <Card title="Monthly Spending Over Time">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorSpendingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--expense-color)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--expense-color)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Spending"
            stroke="var(--expense-color)"
            fillOpacity={1}
            fill="url(#colorSpendingGrad)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
