import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { savingsGoalService } from '../../services/api';
import { getErrorMessage } from '../../utils/helpers';

export const fetchSavingsGoals = createAsyncThunk(
  'savingsGoals/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      return await savingsGoalService.getAll(userId);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch savings goals'));
    }
  }
);

export const addSavingsGoal = createAsyncThunk(
  'savingsGoals/add',
  async (goal, { rejectWithValue }) => {
    try {
      return await savingsGoalService.create(goal);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to add savings goal'));
    }
  }
);

export const updateSavingsGoal = createAsyncThunk(
  'savingsGoals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await savingsGoalService.update(id, data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update savings goal'));
    }
  }
);

export const deleteSavingsGoal = createAsyncThunk(
  'savingsGoals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await savingsGoalService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete savings goal'));
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
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSavingsGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSavingsGoal.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(updateSavingsGoal.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.items.findIndex(
          (g) => g.id === action.payload.id || (g.documentId && g.documentId === action.payload.documentId)
        );
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSavingsGoal.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (g) => g.id !== action.payload && g.documentId !== action.payload
        );
      });
  },
});

export default savingsGoalsSlice.reducer;
