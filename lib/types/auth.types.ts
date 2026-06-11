export interface UserProfile {
  id: number
  name: string
  email: string
  mobile_number: string
  is_superadmin: boolean
  is_active: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponseData {
  user: UserProfile
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenResponseData {
  accessToken: string
}

export interface AuthState {
  user: UserProfile | null
  accessToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
