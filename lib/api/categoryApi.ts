import { del, get, patch, post, put } from '@/lib/http/httpMethods'
import type { CategoryListResponse } from '@/lib/types/category.types' // Check this name!

export const getCategoriesApi = (
  page: number = 1,
  limit: number = 10
): Promise<CategoryListResponse> =>
    get<CategoryListResponse>('category', { page, limit })
  
// CREATE: Send new category name to server
export const createCategoryApi = (data: { name: string }) => 
  post('/category', data)

// UPDATE: Change an existing category (needs the ID and new data)
export const updateCategoryApi = (id: number, data: { name: string; is_active: boolean }) => 
  put(`/category/${id}`, data)

// DELETE: Remove a category by ID
export const deleteCategoryApi = (id: number) => 
    del(`/category/${id}`)

export const getCategoryByIdApi = (id: number): Promise<any> => 
  get(`/category/${id}`)

// PATCH: Specifically for flipping the active/inactive switch
export const patchCategoryStatusApi = (id: number, isActive: boolean) => 
    patch(`/category/${id}/status`, { is_active: isActive })