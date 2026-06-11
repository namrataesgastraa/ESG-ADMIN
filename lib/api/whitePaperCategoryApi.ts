import { get, post, put, del, patch } from '@/lib/http/httpMethods';
import { WhitePaperCategoryListResponse } from '@/lib/types/whitePaperCategory.types'

export const getWPCategoriesApi = (page = 1, limit = 10, search = ''): Promise<WhitePaperCategoryListResponse> =>
  get<WhitePaperCategoryListResponse>('/white-paper-category', { page, limit, search });

export const createWPCategoryApi = (name: string): Promise<WhitePaperCategoryListResponse> =>
  post('/white-paper-category', { name });

export const updateWPCategoryApi = (id: number, name: string): Promise<WhitePaperCategoryListResponse> =>
  put(`/white-paper-category/${id}`, { name });

export const deleteWPCategoryApi = (id: number): Promise<WhitePaperCategoryListResponse> =>
  del(`/white-paper-category/${id}`);

export const getWPCategoryByIdApi = (id: number): Promise<WhitePaperCategoryListResponse> => 
  get<WhitePaperCategoryListResponse>(`/white-paper-category/${id}`)

export const patchWPCategoryStatusApi = (id: number, is_active: boolean): Promise<WhitePaperCategoryListResponse> =>
  patch(`/white-paper-category/status/${id}`, { is_active });