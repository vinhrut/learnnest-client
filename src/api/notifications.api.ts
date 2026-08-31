import { api } from '@/lib/axios';
import type { Paginated } from '@/types/api';
import type { NotificationItem, NotificationListQuery } from '@/types/notification';

export const notificationsApi = {
  list: (query: NotificationListQuery = {}) =>
    api
      .get<Paginated<NotificationItem>>('/notifications', {
        params: cleanQuery(query),
      })
      .then((r) => r.data),

  unreadCount: () =>
    api
      .get<{ count: number }>('/notifications/unread-count')
      .then((r) => r.data),

  markRead: (id: string) =>
    api
      .patch<{ success: boolean }>(`/notifications/${id}/read`)
      .then((r) => r.data),

  markAllRead: () =>
    api
      .patch<{ updated: number }>('/notifications/read-all')
      .then((r) => r.data),
};

function cleanQuery(query: NotificationListQuery): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(query).filter(
      ([, v]) => v !== undefined && v !== '' && v !== null,
    ),
  );
}
