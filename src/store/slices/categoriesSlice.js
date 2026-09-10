import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { categoryService } from "../../services/api";
import { getErrorMessage } from "../../utils/helpers";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAll();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch categories"));
    }
  },
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (category, { rejectWithValue }) => {
    try {
      return await categoryService.create(category);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to add category"));
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await categoryService.update(id, data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to update category"));
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.delete(id);

      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to delete category"));
    }
  },
);

const categoriesSlice = createSlice({
  name: "categories",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;

        state.items = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (!action.payload) return;

        const updatedId = action.payload.documentId || action.payload.id;

        const index = state.items.findIndex(
          (category) =>
            category.documentId === updatedId || category.id === updatedId,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const deletedId = action.payload;

        state.items = state.items.filter(
          (category) =>
            category.id !== deletedId && category.documentId !== deletedId,
        );
      });
  },
});

export default categoriesSlice.reducer;
