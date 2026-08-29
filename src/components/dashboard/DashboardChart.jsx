import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../common/Card';
import { getAvailableMonths, filterByMonth, calcTotal, getMonthLabel, formatCurrency } from '../../utils/helpers';

// Custom high-fidelity tooltip element
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
          <div key={pld.name} className="tooltip-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: pld.color }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: pld.fill }}></span>
            <span style={{ color: '#cbd5e1' }}>{pld.name}:</span>
            <span style={{ fontWeight: 700 }}>{formatCurrency(pld.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardChart({ transactions }) {
  const chartData = useMemo(() => {
    const months = getAvailableMonths(transactions).slice(0, 6).reverse();
    return months.map((m) => {
      const monthTx = filterByMonth(transactions, m);
      return {
        month: getMonthLabel(m).split(' ')[0],
        Income: calcTotal(monthTx, 'income'),
        Expenses: calcTotal(monthTx, 'expense'),
      };
    });
  }, [transactions]);

  return (
    <Card title="Monthly Net Capital Flow">
      {chartData.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          No data available for chart.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.95}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.65}/>
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.95}/>
                <stop offset="100%" stopColor="#e11d48" stopOpacity={0.65}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} iconType="circle" />
            <Bar name="Income" dataKey="Income" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} />
            <Bar name="Expenses" dataKey="Expenses" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
