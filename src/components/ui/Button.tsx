import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-primary-container text-on-primary hover:bg-primary transition-colors',
  secondary:
    'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container transition-colors',
  danger:
    'bg-error-container text-on-error-container hover:bg-error/90',
  ghost:
    'bg-transparent text-on-surface-variant hover:bg-surface-container transition-colors',
};

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-label-md gap-1.5',
  md: 'h-10 px-4 text-label-md gap-2',
  lg: 'h-12 px-6 text-body-lg gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold',
        'transition-all duration-150 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {loading ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <>
          {leftIcon && <span className="material-symbols-outlined text-base">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="material-symbols-outlined text-base">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
