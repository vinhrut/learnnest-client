import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/ui/Spinner';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsQuery,
  useUnreadCountQuery,
} from '@/hooks/queries/notifications.queries';
import { useAuth } from '@/hooks/useAuth';
import { notificationTargetPath } from '@/routes/roleHome';
import type { NotificationItem } from '@/types/notification';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'vừa xong';
  if (min < 60) return `${min} phút trước`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} giờ trước`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const unread = useUnreadCountQuery();
  const list = useNotificationsQuery({ page: 1, limit: 10 });
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const count = unread.data?.count ?? 0;
  const items = list.data?.data ?? [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.is_read) markRead.mutate(item.id);
    setOpen(false);
    navigate(
      notificationTargetPath(user, {
        type: item.type,
        taskId: item.task_id,
        projectId: item.project_id,
      }),
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Thông báo"
      >
        <FiBell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-line bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">Thông báo</p>
            {count > 0 && (
              <button
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
              >
                <FiCheck className="h-3.5 w-3.5" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {list.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-5 w-5 text-primary" />
              </div>
            ) : items.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted">
                Chưa có thông báo
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        'flex w-full flex-col gap-0.5 px-3 py-2.5 text-left hover:bg-canvas',
                        !item.is_read && 'bg-primary-soft/40',
                      )}
                    >
                      <span
                        className={cn(
                          'text-sm text-ink',
                          !item.is_read && 'font-semibold',
                        )}
                      >
                        {item.title}
                      </span>
                      {item.message && (
                        <span className="truncate text-xs text-muted">
                          {item.message}
                        </span>
                      )}
                      <span className="text-[11px] text-muted">
                        {timeAgo(item.created_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
