import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetService } from '../../services/api';

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      return await budgetService.getAll(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addBudget = createAsyncThunk(
  'budgets/add',
  async (budget, { rejectWithValue }) => {
    try {
      return await budgetService.create(budget);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await budgetService.update(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await budgetService.remove(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default budgetsSlice.reducer;
