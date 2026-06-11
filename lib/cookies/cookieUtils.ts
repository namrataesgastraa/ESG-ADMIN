import Cookies from 'js-cookie'

const isProduction = process.env.NODE_ENV === 'production'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const cookieOptions = {
  sameSite: 'strict' as const,
  secure: isProduction,
  path: '/',
}

/**
 * Stores the short-lived access token in cookies.
 */
export const setAccessToken = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_KEY, token, { ...cookieOptions, expires: 1 })
}

/**
 * Stores the long-lived refresh token in cookies.
 */
export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { ...cookieOptions, expires: 7 })
}

/**
 * Reads the access token from cookies.
 */
export const getAccessToken = (): string | undefined => Cookies.get(ACCESS_TOKEN_KEY)

/**
 * Reads the refresh token from cookies.
 */
export const getRefreshToken = (): string | undefined => Cookies.get(REFRESH_TOKEN_KEY)

/**
 * Removes the access token cookie.
 */
export const removeAccessToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY, cookieOptions)
}

/**
 * Removes the refresh token cookie.
 */
export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY, cookieOptions)
}

/**
 * Clears all authentication cookies.
 */
export const clearAuthCookies = (): void => {
  removeAccessToken()
  removeRefreshToken()
}
