import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications.api';
import type { NotificationListQuery } from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params: NotificationListQuery) =>
    ['notifications', 'list', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export function useNotificationsQuery(params: NotificationListQuery = {}) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsApi.list(params),
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: notificationsApi.unreadCount,
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: invalidate,
  });
}
