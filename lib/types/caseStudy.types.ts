export interface CaseStudy {
  id: number
  title: string
  normalized_title: string
  description: string
  category_id: number
  pdf_file: string
  image: string
  is_active: boolean
  createdAt: string
  updatedAt: string
  category: {
    id: number;
    name: string;
  };
}

export interface CaseStudyPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CaseStudyListResponse {
  status: boolean
  responseCode: number
  message: string
  data: CaseStudy[]
  pagination: CaseStudyPagination
}

export interface SingleCaseStudyResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: CaseStudy; // Single object, not an array
}
