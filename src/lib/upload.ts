/**
 * Helper dùng chung cho việc chọn / kiểm tra / gửi file lên server.
 * Các ngưỡng ở đây phải khớp với `src/common/helpers/upload.constants.ts`
 * bên backend để lỗi được chặn sớm ngay trên trình duyệt.
 */

/** Dung lượng tối đa cho ảnh đại diện (5MB) — khớp MAX_IMAGE_SIZE của backend. */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

/** Các định dạng ảnh backend chấp nhận. */
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/** Giá trị cho thuộc tính `accept` của <input type="file">. */
export const IMAGE_ACCEPT = IMAGE_MIME_TYPES.join(',');

/** Hiển thị dung lượng file dạng dễ đọc: 1.4 MB, 240 KB... */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Kiểm tra file ảnh trước khi upload.
 * Trả về thông báo lỗi tiếng Việt, hoặc `null` nếu hợp lệ.
 */
export function validateImageFile(
  file: File,
  maxSize: number = MAX_AVATAR_SIZE,
): string | null {
  if (!(IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return 'Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP hoặc GIF.';
  }
  if (file.size > maxSize) {
    return `Ảnh vượt quá dung lượng cho phép (tối đa ${formatFileSize(maxSize)}).`;
  }
  return null;
}

/**
 * Bọc file vào FormData để gửi multipart.
 */
export function toFileFormData(file: File, field = 'file'): FormData {
  const formData = new FormData();
  formData.append(field, file);
  return formData;
}
