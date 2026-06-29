import { get, del, post, patch, put } from '@/lib/http/httpMethods';
import { CaseStudyListResponse } from '@/lib/types/caseStudy.types';

// FETCH ALL: With pagination
export const getCaseStudiesApi = (page: number = 1, limit: number = 10): Promise<CaseStudyListResponse> =>
  get<CaseStudyListResponse>('/case-study', { page, limit });

// FETCH SINGLE: For the Edit page
export const getCaseStudyByIdApi = (id: number): Promise<any> =>
  get(`/case-study/${id}`);

// DELETE: Remove by ID
export const deleteCaseStudyApi = (id: number) => 
  del(`/case-study/${id}`);

// CREATE: data will be a FormData object containing title, description, files, etc.
export const createCaseStudyApi = (data: FormData): Promise<any> => {
  return post('/case-study', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// PREVIEW: parse the Excel without saving (returns the parsed payload)
export const previewCaseStudyExcelApi = (data: FormData): Promise<any> =>
  post('/case-study/preview-excel', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// PUBLISH: parse the Excel and save the case study
export const uploadCaseStudyExcelApi = (data: FormData): Promise<any> =>
  post('/case-study/upload-excel', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateCaseStudyApi = (id: number, data: FormData): Promise<any> =>
  put(`/case-study/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Toggle Status: Using PATCH for a quick boolean flip
export const patchCaseStudyStatusApi = (id: number, is_active: boolean): Promise<any> =>
  patch(`/case-study/${id}/status`, { is_active });