import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBlogsApi,
  deleteBlogApi,
  patchBlogStatusApi,
  createBlogApi,
  fetchBlogByIdApi,
  updateBlogApi,
  uploadBlogExcelApi,
  previewBlogExcelApi,
} from '@/lib/api/blogApi';
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
  excelPreview: any | null;
}

const initialState: BlogState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
  excelPreview: null,
};

export const fetchBlogsThunk = createAsyncThunk(
  'blog/fetchAll',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await getBlogsApi(page || 1, limit || 10, search || '');
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const createBlogThunk = createAsyncThunk(
  'blog/create',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await createBlogApi(formData);
      dispatch(fetchBlogsThunk({ page: 1, limit: 10 }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const previewBlogExcelThunk = createAsyncThunk(
  'blog/previewExcel',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await previewBlogExcelApi(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Excel preview failed');
    }
  }
);

export const uploadBlogExcelThunk = createAsyncThunk(
  'blog/uploadExcel',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await uploadBlogExcelApi(formData);
      dispatch(fetchBlogsThunk({ page: 1, limit: 10 }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Excel upload failed');
    }
  }
);

export const deleteBlogThunk = createAsyncThunk(
  'blog/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteBlogApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete blog');
    }
  }
);

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

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearExcelPreview: (state) => {
      state.excelPreview = null;
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(previewBlogExcelThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(previewBlogExcelThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.excelPreview = action.payload;
      })
      .addCase(previewBlogExcelThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadBlogExcelThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadBlogExcelThunk.fulfilled, (state) => {
        state.loading = false;
        state.excelPreview = null;
      })
      .addCase(uploadBlogExcelThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteBlogThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })

      .addCase(toggleBlogStatusThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].is_active = action.payload.isActive;
        }
      });
  },
});

export const { clearExcelPreview } = blogSlice.actions;

export default blogSlice.reducer;