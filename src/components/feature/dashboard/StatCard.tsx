import type { IconType } from 'react-icons';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/ui/Spinner';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const TONE: Record<Tone, string> = {
  primary: 'bg-primary-fixed-dim text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-error-container text-danger',
  neutral: 'bg-surface-container-high text-on-surface-variant',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
  loading = false,
}: {
  label: string;
  value: number | string;
  icon: IconType;
  tone?: Tone;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-lg',
          TONE[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-col">
        <p className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-headline-md text-on-surface font-bold">
          {loading ? <Spinner className="h-6 w-6 text-muted" /> : value}
        </p>
      </div>
    </div>
  );
}
