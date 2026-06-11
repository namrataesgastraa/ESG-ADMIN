import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBlogsApi, deleteBlogApi, patchBlogStatusApi, createBlogApi, fetchBlogByIdApi, updateBlogApi } from '@/lib/api/blogApi';
import { Blog } from '@/lib/types/blog.types';

interface BlogState {
  items: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
};

// --- THUNKS ---

// 1. Fetch All Blogs (with pagination and search)
export const fetchBlogsThunk = createAsyncThunk(
  'blog/fetchAll',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await getBlogsApi(page || 1, limit || 10, search || '');
      return response; // This matches your BlogListResponse
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

// 2. Create Blog
export const createBlogThunk = createAsyncThunk(
  'blog/create',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await createBlogApi(formData);
      dispatch(fetchBlogsThunk({ page: 1, limit: 10 })); // Refresh list after creation
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create blog');
    }
  }
);

// 3. Delete Blog
export const deleteBlogThunk = createAsyncThunk(
  'blog/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteBlogApi(id);
      return id; // Return ID to remove it from state locally
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete blog');
    }
  }
);

// 4. Toggle Status
export const toggleBlogStatusThunk = createAsyncThunk(
  'blog/toggleStatus',
  async ({ id, isActive }: { id: number; isActive: boolean }, { rejectWithValue }) => {
    try {
      await patchBlogStatusApi(id, isActive);
      return { id, isActive };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update status');
    }
  }
);

export const fetchBlogByIdThunk = createAsyncThunk(
  'blog/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetchBlogByIdApi(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

export const updateBlogThunk = createAsyncThunk(
  'blog/edit',
  async ({ id, formData }: { id: number; formData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      await updateBlogApi(id, formData);
      dispatch(fetchBlogsThunk({ page: 1, limit: 10 }));
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Update failed');
    }
  }
);

// --- SLICE ---

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Blogs Cases
      .addCase(fetchBlogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Blog Cases
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlogThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Blog Cases
      .addCase(deleteBlogThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })

      // Toggle Status Case
      .addCase(toggleBlogStatusThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].is_active = action.payload.isActive;
        }
      });
  },
});

export default blogSlice.reducer;