import type { QueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';
import { toast } from '@/components/ui/toast';
import { errorMessages } from '@/lib/errors';
import type { User } from '@/types/user';
import { userKeys } from './users.queries';
import { profileKeys } from '../profile/profile.queries';

/**
 * Upload ảnh đại diện ngầm — không chặn UI. Nơi gọi tự lo hiển thị preview cục bộ
 * (object URL); khi Cloudinary trả về thì hàm này làm mới cache để mọi `<Avatar>`
 * (bảng user, Topbar, hồ sơ) hiện URL thật. Lỗi chỉ toast, không throw. Dùng
 * `QueryClient` ổn định + `toast` global nên vẫn hoàn tất kể cả khi component
 * gọi nó (ví dụ modal) đã unmount.
 */
export function uploadAvatarInBackground(
  queryClient: QueryClient,
  id: string,
  file: File,
  onDone?: (user: User) => void,
): Promise<void> {
  return usersApi
    .uploadAvatar(id, file)
    .then((user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      onDone?.(user);
    })
    .catch((err) => {
      toast.error('Tải ảnh đại diện lên thất bại');
      errorMessages(err).forEach((m) => toast.error(m));
    });
}
