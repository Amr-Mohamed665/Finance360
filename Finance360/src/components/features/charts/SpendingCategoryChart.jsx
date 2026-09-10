import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../../common/Card';
import { formatCurrency } from '../../../utils/helpers';

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

const CATEGORY_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#14b8a6", // Teal
  "#f97316", // Orange
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#d946ef", // Fuchsia
];

const TIMEFRAME_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "9_months", label: "9 Months" },
  { value: "this_year", label: "This Year" },
  { value: "all_time", label: "All Time" },
];

const isDateInTimeframe = (dateStr, timeframe) => {
  if (!dateStr || timeframe === 'all_time') return true;
  const txDate = new Date(dateStr);
  if (isNaN(txDate.getTime())) return true;

  const now = new Date();
  
  if (timeframe === 'today') {
    return txDate.toDateString() === now.toDateString();
  }
  
  if (timeframe === 'this_week') {
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return txDate >= startOfWeek && txDate <= now;
  }
  
  if (timeframe === 'this_month') {
    return txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth();
  }
  
  if (timeframe === '3_months') {
    const past = new Date(now);
    past.setMonth(now.getMonth() - 3);
    return txDate >= past && txDate <= now;
  }
  
  if (timeframe === '6_months') {
    const past = new Date(now);
    past.setMonth(now.getMonth() - 6);
    return txDate >= past && txDate <= now;
  }
  
  if (timeframe === '9_months') {
    const past = new Date(now);
    past.setMonth(now.getMonth() - 9);
    return txDate >= past && txDate <= now;
  }
  
  if (timeframe === 'this_year') {
    return txDate.getFullYear() === now.getFullYear();
  }
  
  return true;
};

export default function SpendingCategoryChart({ transactions = [], categories = [] }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    const expenseTx = transactions.filter(
      (t) => t && t.type === 'expense'
    );
    const spendingMap = {};

    expenseTx.forEach((tx) => {
      const catKey = String(tx.categoryId || tx.category?.id || tx.category?.documentId || tx.category || 'other');
      spendingMap[catKey] = (spendingMap[catKey] || 0) + (Number(tx.amount) || 0);
    });

    const usedColors = new Set();

    return Object.entries(spendingMap)
      .map(([catId, amount], index) => {
        const cat = Array.isArray(categories)
          ? categories.find((c) => String(c.id || c.documentId) === catId)
          : null;
        
        let color = cat?.color;
        if (!color || color === '#888888' || usedColors.has(color)) {
          color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        }
        usedColors.add(color);

        return {
          name: cat?.name || 'Other',
          value: amount,
          color,
        };
      })
      .sort((a, b) => b.value - a.value);
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
