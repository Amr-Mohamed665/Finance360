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

/**
 * Extract a user-friendly error message from an API error response or Error object.
 * Prevents displaying raw status codes like "Request failed with status code 401/409/500".
 */
export function getErrorMessage(err, fallbackMessage = "An error occurred. Please try again.") {
  if (!err) return fallbackMessage;

  if (typeof err === "string") {
    if (err.includes("status code")) {
      const codeMatch = err.match(/\b(4\d\d|5\d\d)\b/);
      if (codeMatch) return getFriendlyStatusMessage(Number(codeMatch[1]));
    }
    return err;
  }

  // 1. Express backend format: { success: false, message: "Reason..." }
  if (err.response?.data?.message && typeof err.response.data.message === "string") {
    return err.response.data.message;
  }

  // 2. Strapi / nested format: { error: { message: "Reason..." } }
  if (err.response?.data?.error?.message && typeof err.response.data.error.message === "string") {
    return err.response.data.error.message;
  }

  // 3. Direct string response body
  if (typeof err.response?.data === "string" && err.response.data.trim()) {
    return err.response.data;
  }

  // 4. Validation errors array: { errors: [...] }
  if (err.response?.data?.errors) {
    const errors = err.response.data.errors;
    if (typeof errors === "string") return errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0];
      if (typeof first === "string") return first;
      if (first?.message) return first.message;
    }
  }

  // 5. HTTP status fallback with friendly explanations instead of raw status codes
  const status = err.response?.status;
  if (status) {
    return getFriendlyStatusMessage(status);
  }

  // 6. Network/Client error message if not generic status code string
  if (err.message && typeof err.message === "string" && !err.message.includes("status code")) {
    return err.message;
  }

  return fallbackMessage;
}

export function getFriendlyStatusMessage(status) {
  switch (status) {
    case 400:
      return "Bad request. Please check the entered information.";
    case 401:
      return "Invalid credentials or session expired. Please log in again.";
    case 403:
      return "Access denied. You do not have permission for this action.";
    case 404:
      return "The requested item or endpoint was not found.";
    case 409:
      return "Conflict detected. An item with these details already exists.";
    case 422:
      return "Validation failed. Please verify your input data.";
    case 500:
      return "Server error occurred. Please try again later or contact support.";
    case 502:
    case 503:
    case 504:
      return "Server is temporarily unavailable. Please try again in a few moments.";
    default:
      return "An error occurred while processing your request. Please try again.";
  }
}

