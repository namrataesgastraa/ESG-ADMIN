export interface WhitePaperCategory {
  id: number;
  name: string;
  normalized_name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhitePaperCategoryListResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: WhitePaperCategory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}