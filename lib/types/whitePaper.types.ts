export interface WhitePaper {
  id: number;
  title: string;
  normalized_title: string;
  description: string;
  category_id: number | null;
  industry_tag?: string | null;
  slug?: string | null;
  pdf_file: string | null;
  image: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  } | null;
}

export interface WhitePaperListResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: WhitePaper[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}