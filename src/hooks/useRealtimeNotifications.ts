import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth.store';
import { taskKeys } from '@/hooks/queries/tasks.queries';
import { notificationKeys } from '@/hooks/queries/notifications.queries';
import type { RealtimeNotification } from '@/types/task';

/**
 * Kết nối socket realtime khi đã đăng nhập và lắng nghe thông báo task.
 * Gắn MỘT LẦN ở `AppLayout` (chỉ render khi đã đăng nhập).
 *
 * Khi có thông báo: hiện toast + làm mới danh sách "Việc của tôi" và các query
 * thông báo (để badge chuông cập nhật ngay), không cần reload trang.
 */
export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  const status = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (status !== 'authed' || !accessToken) return;

    const socket = getSocket();

    const onNotification = (payload: RealtimeNotification) => {
      toast.info(
        payload.message ? `${payload.title}: ${payload.message}` : payload.title,
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.assignedToMe });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    };

    socket.on('notification', onNotification);
    connectSocket();

    return () => {
      socket.off('notification', onNotification);
      disconnectSocket();
    };
  }, [status, accessToken, queryClient]);
}
