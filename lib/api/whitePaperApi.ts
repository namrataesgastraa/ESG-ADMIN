import { get, post, put, del, patch } from '@/lib/http/httpMethods';
import { WhitePaperListResponse } from '@/lib/types/whitePaper.types';

export const getWhitePapersApi = (page: number, limit: number, search: string) =>
  get<WhitePaperListResponse>('/white-paper', { page, limit, search });

export const getWhitePaperByIdApi = (id: number) => 
  get<any>(`/white-paper/${id}`);

export const createWhitePaperApi = (data: FormData): Promise<WhitePaperListResponse> =>
  post('/white-paper', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const previewWhitePaperExcelApi = (data: FormData): Promise<any> =>
  post('/white-paper/preview-excel', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const uploadWhitePaperExcelApi = (data: FormData): Promise<any> =>
  post('/white-paper/upload-excel', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateWhitePaperApi = (id: number, data: FormData) =>
  put(`/white-paper/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteWhitePaperApi = (id: number) => 
  del(`/white-paper/${id}`);

export const patchWhitePaperStatusApi = (id: number, is_active: boolean) =>
  patch(`/white-paper/${id}/status`, { is_active });