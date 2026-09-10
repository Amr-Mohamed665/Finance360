import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { budgetService } from "../../services/api";

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchAll",
  async (userId, { rejectWithValue }) => {
    try {
      return await budgetService.getAll(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const addBudget = createAsyncThunk(
  "budgets/add",
  async (budget, { rejectWithValue }) => {
    try {
      return await budgetService.create(budget);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const updateBudget = createAsyncThunk(
  "budgets/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await budgetService.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const deleteBudget = createAsyncThunk(
  "budgets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await budgetService.delete(id);

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

const budgetsSlice = createSlice({
  name: "budgets",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;

        state.items = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addBudget.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })

      // UPDATE
      .addCase(updateBudget.fulfilled, (state, action) => {
        if (!action.payload) return;
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // DELETE
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default budgetsSlice.reducer;
