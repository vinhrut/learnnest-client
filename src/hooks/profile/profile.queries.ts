import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/stores/auth.store';
import { userKeys } from '../users/users.queries';
import type { AuthUser } from '@/types/auth';
import type { UpdateUserRequest } from '@/types/user';

export const profileKeys = {
  me: ['me', 'profile'] as const,
};

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
 * Làm mới hồ sơ sau khi thay đổi: nạp lại query hồ sơ (Topbar cũng đọc từ
 * query này nên avatar trên header tự cập nhật), danh sách user, và đồng bộ
 * lại user trong authStore.
 */
async function refreshProfileCaches(
  queryClient: QueryClient,
  setUser: (user: AuthUser) => void,
) {
  await queryClient.invalidateQueries({ queryKey: profileKeys.me });
  queryClient.invalidateQueries({ queryKey: userKeys.all });
  const refreshed = await authApi.me().catch(() => null);
  if (refreshed) setUser(refreshed);
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ProfilePayload) => usersApi.update(userId!, payload),
    // Không await: mutation kết thúc ngay khi server trả lời, việc làm mới cache
    // (kể cả gọi lại authApi.me) chạy ngầm để nút Lưu không kẹt spinner.
    onSuccess: () => {
      void refreshProfileCaches(queryClient, setUser);
    },
  });
}

/** Upload ảnh đại diện mới (dùng cho cả lần đầu thêm ảnh lẫn thay ảnh). */
export function useUploadMyAvatar() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(userId!, file),
    onSuccess: () => {
      void refreshProfileCaches(queryClient, setUser);
    },
  });
}

/** Xoá ảnh đại diện hiện tại. */
export function useDeleteMyAvatar() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: () => usersApi.deleteAvatar(userId!),
    onSuccess: () => {
      void refreshProfileCaches(queryClient, setUser);
    },
  });
}
