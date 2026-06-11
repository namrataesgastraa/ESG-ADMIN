import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDownloadLogsApi } from '@/lib/api/logApi';
import { DownloadLog } from '@/lib/types/log.types';

interface LogState {
  items: DownloadLog[];
  loading: boolean;
  pagination: any;
}

export const fetchLogsThunk = createAsyncThunk(
  'logs/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await getDownloadLogsApi(params.page, params.limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch logs');
    }
  }
);

const logSlice = createSlice({
  name: 'logs',
  initialState: { items: [], loading: false, pagination: null } as LogState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogsThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchLogsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLogsThunk.rejected, (state) => { state.loading = false; });
  },
});

export default logSlice.reducer;