export interface Category {
  id: number;
  name: string;
  normalized_name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Rename this from CategoryResponse to CategoryListResponse
export interface CategoryListResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: Category[];
  pagination: CategoryPagination;
}