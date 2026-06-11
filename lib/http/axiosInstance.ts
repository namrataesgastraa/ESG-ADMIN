import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearAuthCookies,
} from '@/lib/cookies/cookieUtils'

/**
 * Main axios instance used for all API calls.
 * Base URL is read from NEXT_PUBLIC_API_URL env variable.
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 600000,
})

/**
 * Sets the default Authorization header on the axios instance.
 * Call this after login and after rehydrating auth from cookies.
 */
export function setAxiosAuthToken(token: string): void {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

/**
 * Removes the default Authorization header from the axios instance.
 * Call this on logout.
 */
export function clearAxiosAuthToken(): void {
  delete axiosInstance.defaults.headers.common['Authorization']
}

// --- REQUEST INTERCEPTOR ------------------------------------
// Attaches Bearer token to every outgoing request.
// Acts as a per-request safety net even if default header is set.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config
  },
  (error) => Promise.reject(error)
)

// --- RESPONSE INTERCEPTOR -----------------------------------
// Handles 401 errors by attempting token refresh.
// If refresh succeeds: retries original request transparently.
// If refresh fails: clears auth and redirects to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh on 401 and only once (_retry flag)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = getRefreshToken()

      if (refreshToken) {
        try {
          // CRITICAL: Use a fresh axios instance here.
          // Using axiosInstance would re-trigger this interceptor
          // causing an infinite 401 refresh loop.
          const freshAxios = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: { 'Content-Type': 'application/json' },
          })

          const response = await freshAxios.post('auth/refresh-token', {
            refresh_token: refreshToken,
          })

          // CRITICAL: Your API wraps data in nested .data
          // Response shape: { status, responseCode, message, data: { accessToken } }
          // So correct extraction is response.data.data.accessToken
          const newToken: string = response.data.data.accessToken

          // Update cookie + axios default header with new token
          setAccessToken(newToken)
          setAxiosAuthToken(newToken)

          // Update the failed request's header and retry it
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          return axiosInstance(originalRequest)

        } catch (refreshError) {
          // Refresh token itself is expired or invalid
          // Force full logout
          clearAuthCookies()
          clearAxiosAuthToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token in cookie at all
        clearAuthCookies()
        clearAxiosAuthToken()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
