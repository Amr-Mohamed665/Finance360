import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { savingsGoalService } from '../../services/api';

export const fetchSavingsGoals = createAsyncThunk(
  'savingsGoals/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      return await savingsGoalService.getAll(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addSavingsGoal = createAsyncThunk(
  'savingsGoals/add',
  async (goal, { rejectWithValue }) => {
    try {
      return await savingsGoalService.create(goal);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateSavingsGoal = createAsyncThunk(
  'savingsGoals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await savingsGoalService.update(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteSavingsGoal = createAsyncThunk(
  'savingsGoals/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await savingsGoalService.remove(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const savingsGoalsSlice = createSlice({
  name: 'savingsGoals',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingsGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavingsGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSavingsGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSavingsGoal.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSavingsGoal.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSavingsGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export default savingsGoalsSlice.reducer;
