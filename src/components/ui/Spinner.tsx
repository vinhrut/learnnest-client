import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        'h-4 w-4',
        className,
      )}
      role="status"
      aria-label="Đang tải"
    />
  );
}
