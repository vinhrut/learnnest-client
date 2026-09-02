import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'tertiary';

const TONE: Record<Tone, string> = {
  neutral: 'bg-surface-container-high text-on-surface-variant',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-error-container text-on-error-container',
  primary: 'bg-primary-fixed text-on-primary-fixed',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  icon,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2.5 py-0.5 text-label-md font-semibold',
        TONE[tone],
        className,
      )}
    >
      {icon ? <span className="mr-1">{icon}</span> : null}
      {children}
    </span>
  );
}
