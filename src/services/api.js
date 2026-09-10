import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://finance-360-backend-express-production.up.railway.app/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to normalize Express API or legacy Strapi responses
export const normalizeData = (resData) => {
  if (!resData) return resData;
  // If Express response wrapper { success: true, data: [...] }
  const data = resData.data !== undefined ? resData.data : resData;
  if (Array.isArray(data)) {
    return data.map((item) => normalizeItem(item));
  }
  return normalizeItem(data);
};

const normalizeItem = (item) => {
  if (!item || typeof item !== "object") return item;
  if (item.attributes) {
    const { attributes, id, documentId } = item;
    return {
      id,
      documentId: documentId || id,
      ...attributes,
    };
  }
  return item;
};

// JWT interceptor — attaches Bearer token to all protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isAuthRequest =
      config.url?.startsWith("/auth/login") ||
      config.url?.startsWith("/auth/register") ||
      config.url?.startsWith("/auth/local");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for automatic 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/register")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("finance360_user");
    }
    return Promise.reject(error);
  },
);

// Authentication & User Profile
export const authService = {
  async login(email, password) {
    // Try Express backend endpoint first (/auth/login)
    let response;
    try {
      response = await api.post("/auth/login", {
        email: email,
        password,
      });
    } catch (err) {
      // Fallback for legacy Strapi (/auth/local)
      if (err.response?.status === 404) {
        response = await api.post("/auth/local", {
          identifier: email,
          password,
        });
      } else {
        throw err;
      }
    }

    const resData = response.data.data || response.data;
    const jwt = resData.accessToken || resData.jwt || resData.token;
    const user = resData.user || resData;

    if (jwt) localStorage.setItem("token", jwt);
    if (user) localStorage.setItem("finance360_user", JSON.stringify(user));

    return user;
  },

  async register(userData) {
    let response;
    try {
      response = await api.post("/auth/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        response = await api.post("/auth/local/register", {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        });
      } else {
        throw err;
      }
    }

    const resData = response.data.data || response.data;
    const jwt = resData.accessToken || resData.jwt || resData.token;
    const user = resData.user || resData;

    if (jwt) localStorage.setItem("token", jwt);
    if (user) localStorage.setItem("finance360_user", JSON.stringify(user));

    return user;
  },

  async getMe() {
    try {
      let response;
      try {
        response = await api.get("/auth/me");
      } catch (err) {
        if (err.response?.status === 404) {
          response = await api.get("/users/me?populate=*");
        } else {
          throw err;
        }
      }
      const user = response.data.data || response.data;
      localStorage.setItem("finance360_user", JSON.stringify(user));
      return user;
    } catch (err) {
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
    localStorage.removeItem("finance360_user");
  },
};

// Categories — CRUD operations
export const categoryService = {
  async getAll(userId) {
    const response = await api.get("/categories");
    return normalizeData(response.data);
  },

  async create(categoryData) {
    const payload = {
      name: categoryData.name,
      type: categoryData.type || "expense",
      icon: categoryData.icon || "fa-solid fa-tags",
    };

    const response = await api.post("/categories", payload);
    return normalizeData(response.data);
  },

  async update(id, categoryData) {
    const payload = {
      name: categoryData.name,
      type: categoryData.type,
      icon: categoryData.icon,
    };

    const response = await api.put(`/categories/${id}`, payload);
    return normalizeData(response.data);
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`);
    return normalizeData(response.data);
  },

  async remove(id) {
    return this.delete(id);
  },
};

// Transactions — CRUD operations
export const transactionService = {
  async getAll(userId) {
    const response = await api.get("/transactions");
    return normalizeData(response.data);
  },

  async create(transactionData) {
    const catId = transactionData.categoryId || transactionData.category;
    const payload = {
      amount: Number(transactionData.amount),
      type: transactionData.type,
      description: transactionData.description,
      date: transactionData.date,
      categoryId: catId,
    };

    const response = await api.post("/transactions", payload);
    return normalizeData(response.data);
  },

  async update(id, transactionData) {
    const catId = transactionData.categoryId || transactionData.category;
    const payload = {
      amount: Number(transactionData.amount),
      type: transactionData.type,
      description: transactionData.description,
      date: transactionData.date,
      categoryId: catId,
    };

    const response = await api.put(`/transactions/${id}`, payload);
    return normalizeData(response.data);
  },

  async delete(id) {
    const response = await api.delete(`/transactions/${id}`);
    return normalizeData(response.data);
  },

  async remove(id) {
    return this.delete(id);
  },
};

// Budgets — CRUD operations
export const budgetService = {
  async getAll(userId) {
    const response = await api.get("/budgets");
    return normalizeData(response.data);
  },

  async create(budgetData) {
    let month = budgetData.month;
    let year = budgetData.year || new Date().getFullYear();

    if (typeof month === "string" && month.includes("-")) {
      const [y, m] = month.split("-").map(Number);
      year = y;
      month = m;
    }

    const catId = budgetData.categoryId || budgetData.category;
    const payload = {
      amount: Number(budgetData.amount),
      month: Number(month),
      year: Number(year),
      categoryId: catId,
    };

    const response = await api.post("/budgets", payload);
    return normalizeData(response.data);
  },

  async update(id, budgetData) {
    let month = budgetData.month;
    let year = budgetData.year || new Date().getFullYear();

    if (typeof month === "string" && month.includes("-")) {
      const [y, m] = month.split("-").map(Number);
      year = y;
      month = m;
    }

    const catId = budgetData.categoryId || budgetData.category;
    const payload = {
      amount: Number(budgetData.amount),
      month: Number(month),
      year: Number(year),
      categoryId: catId,
    };

    const response = await api.put(`/budgets/${id}`, payload);
    return normalizeData(response.data);
  },

  async delete(id) {
    const response = await api.delete(`/budgets/${id}`);
    return normalizeData(response.data);
  },

  async remove(id) {
    return this.delete(id);
  },
};

// Savings Goals — CRUD operations
export const savingsGoalService = {
  async getAll(userId) {
    const response = await api.get("/savings-goals");
    return normalizeData(response.data);
  },

  async create(goalData) {
    const payload = {
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount) || 0,
      deadline: goalData.deadline || goalData.targetDate || null,
    };

    const response = await api.post("/savings-goals", payload);
    return normalizeData(response.data);
  },

  async update(id, goalData) {
    const payload = {
      name: goalData.name,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: Number(goalData.currentAmount) || 0,
      deadline: goalData.deadline || goalData.targetDate || null,
    };

    const response = await api.put(`/savings-goals/${id}`, payload);
    return normalizeData(response.data);
  },

  async delete(id) {
    const response = await api.delete(`/savings-goals/${id}`);
    return normalizeData(response.data);
  },

  async remove(id) {
    return this.delete(id);
  },
};

export default api;
