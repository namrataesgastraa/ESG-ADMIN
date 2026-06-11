import axiosInstance from '@/lib/http/axiosInstance'
import { AxiosRequestConfig } from 'axios';

/**
 * Sends a GET request and returns the unwrapped API payload.
 */
export const get = <T>(url: string, params?: object): Promise<T> =>
  axiosInstance.get<T>(url, { params }).then((response) => response.data)

/**
 * Sends a POST request and returns the unwrapped API payload.
 */
export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
  axiosInstance.post<T>(url, data, config).then((response) => response.data)

/**
 * Updated PUT to accept optional config
 */
export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
  axiosInstance.put<T>(url, data, config).then((response) => response.data);

/**
 * Sends a PATCH request and returns the unwrapped API payload.
 */
export const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
  axiosInstance.patch<T>(url, data, config).then((response) => response.data)

/**
 * Sends a DELETE request and returns the unwrapped API payload.
 */
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  axiosInstance.delete<T>(url, config).then((response) => response.data)
