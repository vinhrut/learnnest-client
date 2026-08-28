import { ApiError } from '@/types/api';

/** Lấy danh sách message lỗi để hiển thị. */
export function errorMessages(error: unknown): string[] {
  if (error instanceof ApiError) return error.messages;
  if (error instanceof Error) return [error.message];
  return ['Đã có lỗi xảy ra'];
}

export function firstErrorMessage(error: unknown): string {
  return errorMessages(error)[0];
}

/** Đoán field bị lỗi từ nội dung message (dùng cho form user). */
export function guessFieldErrors(
  error: unknown,
): Partial<Record<'username' | 'email', string>> {
  const msgs = errorMessages(error).join(' ').toLowerCase();
  const out: Partial<Record<'username' | 'email', string>> = {};
  if (error instanceof ApiError && error.status === 409) {
    if (msgs.includes('email')) out.email = 'Email đã tồn tại';
    if (msgs.includes('username')) out.username = 'Username đã tồn tại';
    if (!out.email && !out.username) {
      out.email = 'Username hoặc email đã tồn tại';
      out.username = 'Username hoặc email đã tồn tại';
    }
  }
  return out;
}
