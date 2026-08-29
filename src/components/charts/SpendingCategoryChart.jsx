import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../../components/common/Card';
import { formatCurrency } from '../../utils/helpers';

// Custom high-fidelity tooltip for the pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip" style={{
        background: 'rgba(15, 19, 26, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.37)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem'
      }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: data.payload.color }}></span>
        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{data.name}:</span>
        <span style={{ fontWeight: 700, color: data.payload.color }}>{formatCurrency(data.value)}</span>
      </div>
    );
  }
  return null;
};

export default function SpendingCategoryChart({ transactions, categories }) {
  const chartData = useMemo(() => {
    const expenseTx = transactions.filter((t) => t.type === 'expense');
    const spendingMap = {};

    expenseTx.forEach((tx) => {
      spendingMap[tx.categoryId] = (spendingMap[tx.categoryId] || 0) + tx.amount;
    });

    return Object.entries(spendingMap).map(([catId, amount]) => {
      const cat = categories.find((c) => c.id === catId);
      return {
        name: cat?.name || 'Other',
        value: amount,
        color: cat?.color || '#888888',
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  return (
    <Card title="Spending by Category Breakdown">
      {chartData.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4.5rem' }}>
          No expense records found.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
