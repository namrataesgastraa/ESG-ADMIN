import { get, post, put, del, patch } from '@/lib/http/httpMethods';
import { BlogListResponse } from '@/lib/types/blog.types';

export const getBlogsApi = (
  page: number,
  limit: number,
  search = ' '
): Promise<BlogListResponse> =>
  get<BlogListResponse>(`/blog?page=${page}&limit=${limit}&search=${search}`);

export const getBlogByIdApi = (id: number): Promise<any> =>
  get<any>(`/blog/${id}`);

export const createBlogApi = (data: FormData): Promise<BlogListResponse> =>
  post('/blog', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const previewBlogExcelApi = (data: FormData): Promise<any> =>
  post('/blog/preview-excel', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const uploadBlogExcelApi = (data: FormData): Promise<any> =>
  post('/blog/upload-excel', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const fetchBlogByIdApi = (id: number): Promise<any> =>
  get<any>(`/blog/${id}`);

export const updateBlogApi = (id: number, data: FormData): Promise<any> =>
  put(`/blog/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteBlogApi = (id: number): Promise<any> =>
  del(`/blog/${id}`);

export const patchBlogStatusApi = (
  id: number,
  is_active: boolean
): Promise<any> =>
  patch(`/blog/status/${id}`, { is_active });