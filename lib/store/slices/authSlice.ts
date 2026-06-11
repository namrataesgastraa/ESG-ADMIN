import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getProfileApi, loginApi } from '@/lib/api/authApi'
import {
  clearAuthCookies,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/cookies/cookieUtils'
import { clearAxiosAuthToken, setAxiosAuthToken } from '@/lib/http/axiosInstance'
import type { AuthState, LoginRequest, UserProfile } from '@/lib/types/auth.types'

interface ApiErrorResponse {
  message?: string
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallbackMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

export const loginThunk = createAsyncThunk<
  { user: UserProfile; accessToken: string },
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi(credentials)
    const { user, accessToken, refreshToken } = response.data

    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    return { user, accessToken }
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Login failed'))
  }
})

export const fetchProfileThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getProfileApi()
    return response.data
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch profile'))
  }
})

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  clearAuthCookies()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    rehydrateAuth: (state) => {
      const token = getAccessToken()

      if (token) {
        state.accessToken = token
        state.isAuthenticated = true
        setAxiosAuthToken(token)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        setAxiosAuthToken(action.payload.accessToken)
        state.error = null
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload ?? 'Login failed'
      })
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to fetch profile'
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
        clearAxiosAuthToken()
      })
  },
})

export const { rehydrateAuth } = authSlice.actions

export default authSlice.reducer
