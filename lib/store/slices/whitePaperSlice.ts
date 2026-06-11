import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getWhitePapersApi,
  deleteWhitePaperApi,
  patchWhitePaperStatusApi,
  createWhitePaperApi,
  updateWhitePaperApi,
  getWhitePaperByIdApi,
} from '@/lib/api/whitePaperApi';
import { WhitePaper } from '@/lib/types/whitePaper.types';

interface WhitePaperState {
  items: WhitePaper[];
  pagination: any;
  loading: boolean;
  error: string | null;
}

const initialState: WhitePaperState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
};

export const fetchWhitePapersThunk = createAsyncThunk(
  'whitePaper/fetchAll',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await getWhitePapersApi(page || 1, limit || 10, search || '');
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch white papers');
    }
  },
);

export const fetchWhitePaperByIdThunk = createAsyncThunk(
  'whitePaper/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getWhitePaperByIdApi(id);
      return response.data; // This returns the single study object
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch white paper');
    }
  }
);

export const createWhitePaperThunk = createAsyncThunk(
  'whitePaper/create',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await createWhitePaperApi(formData);
      // Refresh the list to page 1 to show the new upload
      dispatch(fetchWhitePapersThunk({ page: 1, limit: 10, search: '' }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to upload white paper');
    }
  },
);

export const updateWhitePaperThunk = createAsyncThunk(
  'whitePaper/update',
  async ({ id, formData }: { id: number; formData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      await updateWhitePaperApi(id, formData);
      // Refresh the list to ensure all related data (like category name) is synced
      dispatch(fetchWhitePapersThunk({ page: 1, search: '' }));
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Update failed');
    }
  },
);

export const deleteWhitePaperThunk = createAsyncThunk('whitePaper/delete', async (id: number) => {
  await deleteWhitePaperApi(id);
  return id;
});

export const toggleWhitePaperStatusThunk = createAsyncThunk(
  'whitePaper/toggleStatus',
  async ({ id, isActive }: { id: number; isActive: boolean }) => {
    await patchWhitePaperStatusApi(id, isActive);
    return { id, isActive };
  },
);

const whitePaperSlice = createSlice({
  name: 'whitePaper',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch Cases
      .addCase(fetchWhitePapersThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhitePapersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWhitePapersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Cases
      .addCase(createWhitePaperThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWhitePaperThunk.fulfilled, state => {
        state.loading = false;
        // The list is refreshed via dispatch in the thunk
      })
      .addCase(createWhitePaperThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        //update
      .addCase(updateWhitePaperThunk.pending, state => {
        state.loading = true;
      })
      .addCase(updateWhitePaperThunk.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateWhitePaperThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        //delete
      .addCase(deleteWhitePaperThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(toggleWhitePaperStatusThunk.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.id);
        if (item) item.is_active = action.payload.isActive;
      });
  },
});

export default whitePaperSlice.reducer;
