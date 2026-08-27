/**
 * Kiểu dữ liệu dùng chung cho lớp giao tiếp API.
 */

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

/**
 * Hình dạng lỗi backend trả về (NestJS):
 *  - 401 / 403 / 404 / 409 : `message` là string
 *  - 400 (ValidationPipe)  : `message` là string[]
 */
export interface ApiErrorBody {
  statusCode?: number;
  error?: string;
  message: string | string[];
}

/**
 * Lỗi đã được chuẩn hoá để UI dùng: luôn có `messages` dạng mảng.
 */
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
