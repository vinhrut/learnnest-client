import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Thẻ nội dung dùng chung: viền + nền trắng + bo góc. Có thể kèm header
 * (title + action) tách bằng đường kẻ.
 */
export function Card({
  title,
  action,
  children,
  className,
  bodyClassName,
  dashed = false,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  dashed?: boolean;
}) {
  const hasHeader = title != null || action != null;
  return (
    <div
      className={cn(
        'rounded-xl border bg-white',
        dashed ? 'border-dashed border-line' : 'border-line',
        className,
      )}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          {typeof title === 'string' ? (
            <h3 className="text-sm font-semibold text-ink">{title}</h3>
          ) : (
            title
          )}
          {action}
        </div>
      )}
      <div className={cn(hasHeader ? 'p-5' : 'p-5', bodyClassName)}>{children}</div>
    </div>
  );
}
