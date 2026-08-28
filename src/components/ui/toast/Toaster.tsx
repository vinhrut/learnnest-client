import { createPortal } from 'react-dom';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiX,
} from 'react-icons/fi';
import { cn } from '@/lib/cn';
import { useToastStore, type ToastType } from './toast.store';

const ICON: Record<ToastType, typeof FiInfo> = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const TONE: Record<ToastType, string> = {
  success: 'border-l-success',
  error: 'border-l-danger',
  warning: 'border-l-warning',
  info: 'border-l-primary',
};

const ICON_COLOR: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary',
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return createPortal(
    <div className="fixed right-4 top-4 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICON[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border border-line border-l-4 bg-white p-3 shadow-lg',
              TONE[t.type],
            )}
          >
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', ICON_COLOR[t.type])} />
            <p className="flex-1 text-sm text-ink">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted hover:text-ink"
              aria-label="Đóng thông báo"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
