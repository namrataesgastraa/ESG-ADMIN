export interface ApiResponse<T> {
  status: boolean
  responseCode: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  status: boolean
  responseCode: number
  message: string
}
