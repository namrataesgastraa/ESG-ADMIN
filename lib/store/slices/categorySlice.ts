import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCategoriesApi,
  deleteCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  patchCategoryStatusApi,
} from '@/lib/api/categoryApi';
import type { Category, CategoryPagination } from '@/lib/types/category.types';

// 1. Describe what the "Category Box" in the store looks like
interface CategoryState {
  items: Category[];
  pagination: CategoryPagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
};

// 2. The Thunk: The "Action" that goes to the API and brings data back
export const fetchCategoriesThunk = createAsyncThunk(
  'category/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await getCategoriesApi(params.page ?? 1, params.limit ?? 10);
      // We return exactly what the UI needs
      return {
        items: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      // If backend sends an error message, we catch it here
      const msg = error?.response?.data?.message ?? 'Failed to fetch categories';
      return rejectWithValue(msg);
    }
  },
);

// 3. The Slice: How the "Box" updates based on the Thunk's status
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      /* --- FETCH ALL --- */
      .addCase(fetchCategoriesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* --- UPDATE CATEGORY (PUT) --- */
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        // We look at the 'arg' which contains the data we sent
        const { id, data } = action.meta.arg;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          // Merge the changes into the item
          state.items[index] = { ...state.items[index], ...data };
        }
      })

      /* --- TOGGLE STATUS (PATCH) --- */
      .addCase(toggleCategoryStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { id, isActive } = action.meta.arg;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          state.items[index].is_active = isActive;
        }
      })

      /* --- DELETE CATEGORY --- */
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.meta.arg;
        state.items = state.items.filter(item => item.id !== id);
      });
  },
});

// CREATE THUNK
export const createCategoryThunk = createAsyncThunk(
  'category/create',
  async (name: string, { dispatch, rejectWithValue }) => {
    try {
      await createCategoryApi({ name });
      dispatch(fetchCategoriesThunk({})); // Refresh the list after adding!
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create');
    }
  },
);

// DELETE THUNK
export const deleteCategoryThunk = createAsyncThunk(
  'category/delete',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await deleteCategoryApi(id);
      dispatch(fetchCategoriesThunk({})); // Refresh the list after deleting!
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete');
    }
  },
);

export const updateCategoryThunk = createAsyncThunk(
  'category/update',
  async ({ id, data }: { id: number; data: { name: string; is_active: boolean } }, { dispatch, rejectWithValue }) => {
    try {
      await updateCategoryApi(id, data);
      dispatch(fetchCategoriesThunk({})); // Refresh the table list
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update category');
    }
  },
);

export const toggleCategoryStatusThunk = createAsyncThunk(
  'category/toggleStatus',
  async ({ id, isActive }: { id: number; isActive: boolean }, { dispatch, rejectWithValue }) => {
    try {
      await patchCategoryStatusApi(id, isActive);
      // Refresh the list so the "Active" badge color changes immediately
      dispatch(fetchCategoriesThunk({}));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update status';
      return rejectWithValue(msg);
    }
  },
);
export default categorySlice.reducer;
