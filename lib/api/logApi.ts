import { get } from '@/lib/http/httpMethods';
import { LogListResponse } from '@/lib/types/log.types';

export const getDownloadLogsApi = (page = 1, limit = 10) =>
  get<LogListResponse>('/case-study-download', { page, limit });