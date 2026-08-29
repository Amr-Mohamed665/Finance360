/**
 * Format a number as USD currency.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get current month string (YYYY-MM).
 */
export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get previous month string (YYYY-MM).
 */
export function getPreviousMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const prev = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, '0')}`;
  return prev;
}

/**
 * Get month label from YYYY-MM string.
 */
export function getMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Filter transactions by month string (YYYY-MM).
 */
export function filterByMonth(transactions, month) {
  return transactions.filter((t) => t.date.startsWith(month));
}

/**
 * Calculate total amount from transactions.
 */
export function calcTotal(transactions, type) {
  return transactions
    .filter((t) => (type ? t.type === type : true))
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Validate email format.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generate available months from transactions for selectors.
 */
export function getAvailableMonths(transactions) {
  const months = new Set(transactions.map((t) => t.date.substring(0, 7)));
  return Array.from(months).sort().reverse();
}

/**
 * Percentage calculation, capped at 100.
 */
export function calcPercentage(current, target) {
  if (!target || target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}
