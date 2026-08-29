import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ─── Auth Service ─── */
export const authService = {
  async login(email, password) {
    const { data } = await api.get(`/users?email=${encodeURIComponent(email)}`);
    const user = data[0];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    return { id: user.id, name: user.name, email: user.email };
  },

  async register(userData) {
    const { data: existing } = await api.get(`/users?email=${encodeURIComponent(userData.email)}`);
    if (existing.length > 0) {
      throw new Error('An account with this email already exists');
    }
    const { data } = await api.post('/users', userData);
    return { id: data.id, name: data.name, email: data.email };
  },
};

/* ─── Transaction Service ─── */
export const transactionService = {
  async getAll(userId) {
    const { data } = await api.get(`/transactions?userId=${userId}`);
    return data;
  },
  async create(transaction) {
    const { data } = await api.post('/transactions', transaction);
    return data;
  },
  async update(id, transaction) {
    const { data } = await api.patch(`/transactions/${id}`, transaction);
    return data;
  },
  async remove(id) {
    await api.delete(`/transactions/${id}`);
    return id;
  },
};

/* ─── Category Service ─── */
export const categoryService = {
  async getAll() {
    const { data } = await api.get('/categories');
    return data;
  },
  async create(category) {
    const { data } = await api.post('/categories', category);
    return data;
  },
  async update(id, category) {
    const { data } = await api.patch(`/categories/${id}`, category);
    return data;
  },
  async remove(id) {
    await api.delete(`/categories/${id}`);
    return id;
  },
};

/* ─── Budget Service ─── */
export const budgetService = {
  async getAll(userId) {
    const { data } = await api.get(`/budgets?userId=${userId}`);
    return data;
  },
  async create(budget) {
    const { data } = await api.post('/budgets', budget);
    return data;
  },
  async update(id, budget) {
    const { data } = await api.patch(`/budgets/${id}`, budget);
    return data;
  },
  async remove(id) {
    await api.delete(`/budgets/${id}`);
    return id;
  },
};

/* ─── Savings Goal Service ─── */
export const savingsGoalService = {
  async getAll(userId) {
    const { data } = await api.get(`/savingsGoals?userId=${userId}`);
    return data;
  },
  async create(goal) {
    const { data } = await api.post('/savingsGoals', goal);
    return data;
  },
  async update(id, goal) {
    const { data } = await api.patch(`/savingsGoals/${id}`, goal);
    return data;
  },
  async remove(id) {
    await api.delete(`/savingsGoals/${id}`);
    return id;
  },
};

export default api;
