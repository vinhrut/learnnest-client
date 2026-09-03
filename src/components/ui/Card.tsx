import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  title,
  action,
  children,
  className,
  bodyClassName,
  dashed = false,
  headerClassName,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  dashed?: boolean;
  headerClassName?: string;
}) {
  const hasHeader = title != null || action != null;
  return (
    <div
      className={cn(
        'rounded-xl border bg-surface-container-lowest',
        dashed ? 'border-dashed border-outline-variant' : 'border-outline-variant',
        className,
      )}
    >
      {hasHeader && (
        <div className={cn(
          'flex items-center justify-between gap-3 border-b border-outline-variant px-5 py-4',
          'bg-surface-container-low rounded-t-xl',
          headerClassName,
        )}>
          {typeof title === 'string' ? (
            <h3 className="text-headline-sm text-on-surface font-semibold">{title}</h3>
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
