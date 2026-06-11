export interface BlogTabBullet {
  id?: number;
  blog_tab_id?: number;
  bullet_order: number;
  lead: string;
  body: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogTabContent {
  paragraphs?: string[];
  intro?: string;
  bullets?: Array<{ lead: string; body: string }>;
  cards?: Array<{ title: string; items: string[] }>;
}

export interface BlogTab {
  id?: number;
  blog_id?: number;
  tab_order: number;
  heading: string;
  content: BlogTabContent;
  section_image: string | null;
  section_image_caption: string | null;
  bullets?: BlogTabBullet[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogReference {
  id?: number;
  blog_id?: number;
  reference_order: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  id: number;
  blog_name: string;
  website_url: string;
  linkedin_url: string;
  instagram_url: string;
  medium_url: string;
  main_title: string;
  sub_title: string;
  normalized_title: string;
  eyebrow: string;
  intro_paragraph_1: string;
  intro_paragraph_2: string;
  cta_text: string;
  cover_image: string | null;
  cover_caption: string;
  pdf_file: string | null; // Keep null or string track as received from backend schema
  is_active: boolean;
  is_delete: boolean;
  created_by: number;
  updated_by: number | null;
  createdAt: string;
  updatedAt: string;
  tabs: BlogTab[];
  references: BlogReference[];
}

export interface BlogListResponse {
  status: boolean;
  responseCode: number;
  message: string;
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}