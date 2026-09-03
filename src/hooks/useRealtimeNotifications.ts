import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth.store';
import { taskKeys } from '@/hooks/queries/tasks.queries';
import {
  notificationKeys,
  useMarkNotificationRead,
} from '@/hooks/queries/notifications.queries';
import { notificationTargetPath } from '@/routes/roleHome';
import type { RealtimeNotification } from '@/types/task';

export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const markRead = useMarkNotificationRead();

  const openNotificationRef = useRef<(payload: RealtimeNotification) => void>(
    () => {},
  );
  useEffect(() => {
    openNotificationRef.current = (payload) => {
      markRead.mutate(payload.id);
      navigate(notificationTargetPath(user, payload.taskId));
    };
  });

  useEffect(() => {
    if (status !== 'authed' || !accessToken) return;

    const socket = getSocket();

    const onNotification = (payload: RealtimeNotification) => {
      toast.info(
        payload.message ? `${payload.title}: ${payload.message}` : payload.title,
        { onClick: () => openNotificationRef.current(payload) },
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
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
