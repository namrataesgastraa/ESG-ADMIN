import { get, post } from '@/lib/http/httpMethods'
import type { ApiResponse } from '@/lib/types/api.types'
import type {
  LoginRequest,
  LoginResponseData,
  RefreshTokenResponseData,
  UserProfile,
} from '@/lib/types/auth.types'

/**
 * Authenticates a user with email and password credentials.
 */
export const loginApi = (payload: LoginRequest) =>
  post<ApiResponse<LoginResponseData>>('auth/login', payload)

/**
 * Requests a new access token using the stored refresh token.
 */
export const refreshTokenApi = (refresh_token: string) =>
  post<ApiResponse<RefreshTokenResponseData>>('auth/refresh-token', { refresh_token })

/**
 * Fetches the authenticated user's profile.
 */
export const getProfileApi = () => get<ApiResponse<UserProfile>>('auth/profile')
