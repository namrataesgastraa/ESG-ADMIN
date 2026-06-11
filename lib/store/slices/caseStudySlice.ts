import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCaseStudiesApi,
  deleteCaseStudyApi,
  createCaseStudyApi,
  patchCaseStudyStatusApi,
  updateCaseStudyApi,
  getCaseStudyByIdApi,
} from '@/lib/api/caseStudyApi';
import { CaseStudy, CaseStudyPagination } from '@/lib/types/caseStudy.types';

interface CaseStudyState {
  items: CaseStudy[];
  pagination: CaseStudyPagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: CaseStudyState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
};

// THUNK: Fetch All Case Studies
export const fetchCaseStudiesThunk = createAsyncThunk(
  'caseStudy/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await getCaseStudiesApi(params.page ?? 1, params.limit ?? 10);
      return {
        items: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch');
    }
  },
);

export const fetchCaseStudyByIdThunk = createAsyncThunk(
  'caseStudy/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getCaseStudyByIdApi(id);
      return response.data; // This returns the single study object
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch case study');
    }
  }
);

// THUNK: Delete Case Study
export const deleteCaseStudyThunk = createAsyncThunk(
  'caseStudy/delete',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await deleteCaseStudyApi(id);
      dispatch(fetchCaseStudiesThunk({})); // Refresh list
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete');
    }
  },
);

export const createCaseStudyThunk = createAsyncThunk(
  'caseStudy/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      // Add the type <any> or your specific interface here
      const response = await createCaseStudyApi(formData);

      // Now TypeScript knows 'response' has a 'data' property
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Upload failed');
    }
  },
);

export const updateCaseStudyThunk = createAsyncThunk(
  'caseStudy/update',
  async ({ id, formData }: { id: number; formData: FormData }, { dispatch, rejectWithValue }) => {
    try {
      await updateCaseStudyApi(id, formData);
      dispatch(fetchCaseStudiesThunk({})); // Refresh the list
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Update failed');
    }
  },
);

export const toggleCaseStudyStatusThunk = createAsyncThunk(
  'caseStudy/toggleStatus',
  async ({ id, isActive }: { id: number; isActive: boolean }, { rejectWithValue }) => {
    try {
      await patchCaseStudyStatusApi(id, isActive);
      return { id, isActive }; // Return to update state immediately
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Status update failed');
    }
  },
);

const caseStudySlice = createSlice({
  name: 'caseStudy',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCaseStudiesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseStudiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCaseStudiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCaseStudyThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCaseStudyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleCaseStudyStatusThunk.fulfilled, (state, action) => {
        const { id, isActive } = action.payload;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          state.items[index].is_active = isActive;
        }
      })
      .addCase(deleteCaseStudyThunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter(item => item.id !== id);
      });
  },
});

export default caseStudySlice.reducer;
