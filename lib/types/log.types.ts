export interface DownloadLog {
  id: number;
  type: 'blog' | 'white_paper' | 'case_study'; 
  resource_id: number;
  email: string;
  mobile: string;
  title: string;
  category_name: string | null;
  context: string;
  ip_address: string;
  createdAt: string;
}

export interface LogListResponse {
  status: boolean;
  message: string;
  responseCode: number; 
  data: DownloadLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}