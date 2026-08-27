import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md';

const SIZE: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Bắt buộc để có `aria-label` + tooltip cho nút chỉ có icon. */
  label: string;
  icon?: ReactNode;
  size?: Size;
  danger?: boolean;
  bordered?: boolean;
}

/**
 * Nút vuông chỉ chứa icon, dùng chung cho topbar / hàng thao tác / phân trang.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, icon, size = 'sm', danger, bordered, className, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        title={label}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-muted transition-colors',
          'hover:bg-canvas hover:text-ink',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent',
          bordered && 'border border-line bg-white text-ink',
          danger && 'hover:text-danger',
          SIZE[size],
          className,
        )}
        {...props}
      >
        {icon ?? children}
      </button>
    );
  },
);
