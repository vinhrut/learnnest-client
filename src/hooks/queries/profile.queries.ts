import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/stores/auth.store';
import { userKeys } from './users.queries';
import type { UpdateUserRequest } from '@/types/user';

export const profileKeys = {
  me: ['me', 'profile'] as const,
};

/** Hồ sơ đầy đủ của người đang đăng nhập (kèm phone / avatar_url mà /auth/me không trả). */
export function useMyProfileQuery() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: () => usersApi.getById(userId!),
    enabled: !!userId,
    staleTime: 60_000,
  });
}

type ProfilePayload = Pick<
  UpdateUserRequest,
  'full_name' | 'phone' | 'avatar_url'
>;

/**
 * Tự cập nhật hồ sơ (chỉ các trường backend cho phép non-admin sửa).
 * Sau khi lưu: làm mới hồ sơ + danh sách user, và đồng bộ lại `user` trong
 * auth store để tên/avatar trên topbar cập nhật ngay.
 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ProfilePayload) => usersApi.update(userId!, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      try {
        setUser(await authApi.me());
      } catch {
        /* không nghiêm trọng — dữ liệu sẽ đồng bộ ở lần bootstrap sau */
      }
    },
  });
}
