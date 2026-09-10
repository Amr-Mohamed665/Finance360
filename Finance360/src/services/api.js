import axios from "axios";

const API_BASE_URL = "https://finance-360-backend-express-production.up.railway.app/api";

// Axios instance — connected to Railway Express backend
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// JWT interceptor — automatically attaches token to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Auth requests do not need JWT
    const isAuthRequest =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for automatic error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally if token expires
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/register")
    ) {
      // Token is invalid/expired
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("finance360_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Authentication & User Profile
export const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });

    const { accessToken, refreshToken, user } = response.data.data || response.data;
    if (accessToken) localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("finance360_user", JSON.stringify(user));

    return user;
  },

  async register(userData) {
    const response = await api.post("/auth/register", {
      username: userData.username || userData.name,
      email: userData.email,
      password: userData.password,
    });

    const { accessToken, refreshToken, user } = response.data.data || response.data;
    if (accessToken) localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("finance360_user", JSON.stringify(user));

    return user;
  },

  async getMe() {
    try {
      const response = await api.get("/users/me");
      const user = response.data.data || response.data;
      localStorage.setItem("finance360_user", JSON.stringify(user));
      return user;
    } catch (err) {
      // Fallback to locally stored user
      const local = localStorage.getItem("finance360_user");
      return local ? JSON.parse(local) : null;
    }
  },

  async updateProfile(userId, profileData) {
    const response = await api.put(`/users/${userId}`, profileData);
    const updatedUser = response.data.data || response.data;
    localStorage.setItem("finance360_user", JSON.stringify(updatedUser));
    return updatedUser;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("finance360_user");
  },
};

// Categories — CRUD operations
export const categoryService = {
  async getAll(userId) {
    const response = await api.get("/categories");
    return response.data.data || response.data;
  },

  async create(categoryData) {
    const payload = {
      name: categoryData.name,
      type: categoryData.type || "expense",
      icon: categoryData.icon || "fa-solid fa-tags",
      color: categoryData.color || "#6366f1",
    };

    const response = await api.post("/categories", payload);
    return response.data.data || response.data;
  },

  async update(id, categoryData) {
    const payload = {
      name: categoryData.name,
      type: categoryData.type,
      icon: categoryData.icon,
      color: categoryData.color,
    };

    const response = await api.put(`/categories/${id}`, payload);
    return response.data.data || response.data;
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data || response.data;
  },

  async remove(id) {
    return this.delete(id);
  },
};

// Transactions — CRUD operations
export const transactionService = {
  async getAll(userId) {
    const response = await api.get("/transactions");
    return response.data.data || response.data;
  },

  async create(transactionData) {
    const payload = {
      amount: Number(transactionData.amount),
      type: transactionData.type,
      description: transactionData.description,
      date: transactionData.date,
      categoryId: transactionData.categoryId || transactionData.category || undefined,
    };

    const response = await api.post("/transactions", payload);
    return response.data.data || response.data;
  },

  async update(id, transactionData) {
    const payload = {
      amount: Number(transactionData.amount),
      type: transactionData.type,
      description: transactionData.description,
      date: transactionData.date,
      categoryId: transactionData.categoryId || transactionData.category || undefined,
    };

    const response = await api.put(`/transactions/${id}`, payload);
    return response.data.data || response.data;
  },

  async delete(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data.data || response.data;
  },

  async remove(id) {
    return this.delete(id);
  },
};

// Budgets — CRUD operations
export const budgetService = {
  async getAll(userId) {
    const response = await api.get("/budgets");
    return response.data.data || response.data;
  },

  async create(budgetData) {
    let month = budgetData.month;
    let year = budgetData.year || new Date().getFullYear();

    if (typeof month === "string" && month.includes("-")) {
      const [y, m] = month.split("-").map(Number);
      year = y;
      month = m;
    }

    const payload = {
      amount: Number(budgetData.amount),
      month: Number(month),
      year: Number(year),
      categoryId: budgetData.categoryId || budgetData.category || undefined,
    };

    const response = await api.post("/budgets", payload);
    return response.data.data || response.data;
  },

  async update(id, budgetData) {
    let month = budgetData.month;
    let year = budgetData.year || new Date().getFullYear();

    if (typeof month === "string" && month.includes("-")) {
      const [y, m] = month.split("-").map(Number);
      year = y;
      month = m;
    }

    const payload = {
      amount: Number(budgetData.amount),
      month: Number(month),
      year: Number(year),
      categoryId: budgetData.categoryId || budgetData.category || undefined,
    };

    const response = await api.put(`/budgets/${id}`, payload);
    return response.data.data || response.data;
  },

  async delete(id) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data.data || response.data;
  },

  async remove(id) {
    return this.delete(id);
  },
};

// Savings Goals — CRUD operations
export const savingsGoalService = {
  async getAll(userId) {
    const response = await api.get("/savings-goals");
    return response.data.data || response.data;
  },

  async create(goalData) {
    const payload = {
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount) || 0,
      deadline: goalData.deadline || goalData.targetDate || null,
    };

    const response = await api.post("/savings-goals", payload);
    return response.data.data || response.data;
  },

  async update(id, goalData) {
    const payload = {
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount) || 0,
      deadline: goalData.deadline || goalData.targetDate || null,
    };

    const response = await api.put(`/savings-goals/${id}`, payload);
    return response.data.data || response.data;
  },

  async delete(id) {
    const response = await api.delete(`/savings-goals/${id}`);
    return response.data.data || response.data;
  },

  async remove(id) {
    return this.delete(id);
  },
};

export default api;
