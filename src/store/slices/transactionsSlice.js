import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { transactionService } from "../../services/api";
import { getErrorMessage } from "../../utils/helpers";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (userId, { rejectWithValue }) => {
    try {
      return await transactionService.getAll(userId);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch transactions"));
    }
  },
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transaction, { rejectWithValue }) => {
    try {
      return await transactionService.create(transaction);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to add transaction"));
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await transactionService.update(id, data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to update transaction"));
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await transactionService.delete(id);

      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to delete transaction"));
    }
  },
);

const transactionsSlice = createSlice({
  name: "transactions",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearTransactionsError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;

        state.items = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addTransaction.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      // Update
      .addCase(updateTransaction.fulfilled, (state, action) => {
        if (!action.payload) return;

        const updatedId = action.payload.documentId || action.payload.id;

        const index = state.items.findIndex(
          (transaction) =>
            transaction.documentId === updatedId ||
            transaction.id === updatedId,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.items = state.items.filter(
          (transaction) =>
            transaction.id !== deletedId &&
            transaction.documentId !== deletedId,
        );
      });
  },
});

export const { clearTransactionsError } = transactionsSlice.actions;

export default transactionsSlice.reducer;
