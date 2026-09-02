import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/stores/auth.store';
import { userKeys } from '../users/users.queries';
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

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ProfilePayload) => usersApi.update(userId!, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.me });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      const refreshed = await authApi.me().catch(() => null);
      if (refreshed) setUser(refreshed);
    },
  });
}
