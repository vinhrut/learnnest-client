
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  statusCode?: number;
  error?: string;
  message: string | string[];
}

export class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? 'Đã có lỗi xảy ra');
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}
