/**
 * Format a number as Egyptian Pounds (EGP) currency.
 */
export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const dStr = String(dateStr);
    const date = dStr.includes('T') ? new Date(dStr) : new Date(dStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
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
  if (!monthStr || !monthStr.includes('-')) return getCurrentMonth();
  const [year, month] = monthStr.split('-').map(Number);
  const prev = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, '0')}`;
  return prev;
}

/**
 * Get month label from YYYY-MM string.
 */
export function getMonthLabel(monthStr) {
  if (!monthStr || !monthStr.includes('-')) return monthStr || '';
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Filter transactions by month string (YYYY-MM).
 */
export function filterByMonth(transactions = [], month) {
  if (!Array.isArray(transactions) || !month) return [];
  return transactions.filter((t) => t && t.date && String(t.date).startsWith(month));
}

/**
 * Calculate total amount from transactions.
 */
export function calcTotal(transactions = [], type) {
  if (!Array.isArray(transactions)) return 0;
  return transactions
    .filter((t) => t && (type ? t.type === type : true))
    .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);
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
export function getAvailableMonths(transactions = []) {
  if (!Array.isArray(transactions)) return [getCurrentMonth()];
  const months = new Set(
    transactions
      .filter((t) => t && t.date)
      .map((t) => String(t.date).substring(0, 7))
  );
  if (months.size === 0) months.add(getCurrentMonth());
  return Array.from(months).sort().reverse();
}

/**
 * Percentage calculation, capped at 100.
 */
export function calcPercentage(current, target) {
  const c = Number(current) || 0;
  const t = Number(target) || 0;
  if (!t || t <= 0) return 0;
  return Math.min(Math.round((c / t) * 100), 100);
}
