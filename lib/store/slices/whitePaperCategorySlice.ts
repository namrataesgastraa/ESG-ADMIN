import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getWPCategoriesApi,
  deleteWPCategoryApi,
  patchWPCategoryStatusApi,
  getWPCategoryByIdApi,
  createWPCategoryApi,
  updateWPCategoryApi,
} from '@/lib/api/whitePaperCategoryApi';
import { WhitePaperCategory } from '@/lib/types/whitePaperCategory.types';

interface WPState {
  items: WhitePaperCategory[];
  currentCategory: WhitePaperCategory | null;
  pagination: any;
  loading: boolean;
  error: string | null;
}

export const fetchWPCategoriesThunk = createAsyncThunk(
  'whitePaperCategory/fetchAll',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await getWPCategoriesApi(page || 1, limit || 10, search || '');
      return response; // This matches your BlogListResponse
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch blogs');
    }
  },
);

export const toggleWPCategoryStatusThunk = createAsyncThunk(
  'whitePaperCategory/toggleStatus',
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    await patchWPCategoryStatusApi(id, isActive);
    return { id, isActive };
  },
);

export const fetchWPCategoryByIdThunk = createAsyncThunk(
  'whitePaperCategory/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getWPCategoryByIdApi(id);
      return response.data; // This returns the single category object
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch category');
    }
  },
);

export const deleteWPCategoryThunk = createAsyncThunk(
  'whitePaperCategory/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteWPCategoryApi(id);
      return id; // Return the ID so the reducer knows which one to remove
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete category');
    }
  },
);

export const createWPCategoryThunk = createAsyncThunk(
  'whitePaperCategory/create',
  async (name: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await createWPCategoryApi(name);
      // After creating, we refresh the list to show the new item at the top
      dispatch(fetchWPCategoriesThunk({ page: 1 }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create category');
    }
  },
);

export const updateWPCategoryThunk = createAsyncThunk(
  'whitePaperCategory/update',
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      await updateWPCategoryApi(id, name);
      return { id, name };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Update failed');
    }
  },
);

const wpCategorySlice = createSlice({
  name: 'whitePaperCategory',
  initialState: { items: [], currentCategory: null, pagination: null, loading: false, error: null } as WPState,
  reducers: {},
  extraReducers: builder => {
    builder
      // FETCH ALL
      .addCase(fetchWPCategoriesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWPCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWPCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // TOGGLE STATUS (Instant Local Update)
      .addCase(toggleWPCategoryStatusThunk.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.id);
        if (item) item.is_active = action.payload.isActive;
      })
      // DELETE (Instant Local Removal)
      .addCase(deleteWPCategoryThunk.fulfilled, (state, action) => {
        // Filter out the deleted category from the local state
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      //create
      .addCase(createWPCategoryThunk.pending, state => {
        state.loading = true;
      })
      .addCase(createWPCategoryThunk.fulfilled, state => {
        state.loading = false;
        // We don't necessarily need to push to items here
        // because dispatch(fetchWPCategoriesThunk) handles the refresh.
      })
      .addCase(createWPCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //update
      .addCase(updateWPCategoryThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWPCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Find the item in our current list and update its name
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].name = action.payload.name;
        }
        state.currentCategory = null; // Clear the edit buffer
      })
      .addCase(updateWPCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wpCategorySlice.reducer;
