import { get, post, put, del, patch } from '@/lib/http/httpMethods';
import { BlogListResponse } from '@/lib/types/blog.types';

// Fetch with Pagination
export const getBlogsApi = (page: number, limit: number, search = ' '): Promise<BlogListResponse> =>
  get<BlogListResponse>(`/blog?page=${page}&limit=${limit}&search=${search}`);

export const getBlogByIdApi = (id: number): Promise<any> => 
  get<any>(`/blog/${id}`);

export const createBlogApi = (data: FormData): Promise<BlogListResponse> =>
  post('/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const fetchBlogByIdApi = (id: number): Promise<any> => 
  get<any>(`/blog/${id}`);

export const updateBlogApi = (id: number, data: FormData): Promise<any> =>
  put(`/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteBlogApi = (id: number): Promise<any> => 
  del(`/blog/${id}`);

export const patchBlogStatusApi = (id: number, is_active: boolean): Promise<any> =>
  patch(`/blog/status/${id}`, { is_active });


