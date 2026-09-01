import { cn } from '@/lib/cn';
import { Spinner } from '@/components/ui/Spinner';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const TONE: Record<Tone, { border: string; text: string }> = {
  primary: {
    border: 'border-l-primary-container',
    text: 'text-on-primary-container',
  },
  success: {
    border: 'border-l-success',
    text: 'text-success',
  },
  warning: {
    border: 'border-l-warning',
    text: 'text-warning',
  },
  danger: {
    border: 'border-l-error',
    text: 'text-error',
  },
  neutral: {
    border: 'border-l-outline',
    text: 'text-on-surface-variant',
  },
};

export interface StatCardProps {
  label: string;
  value: number | string;
  tone?: Tone;
  loading?: boolean;
}

/**
 * StatCard - KPI card with optional colored left border indicator
 * Uses Material Symbols icons based on tone
 *
 * @example
 * <StatCard
 *   label="Tổng số Task"
 *   value={1248}
 *   tone="primary"
 * />
 */
export function StatCard({
  label,
  value,
  tone = 'neutral',
  loading = false,
}: StatCardProps) {
  const toneConfig = TONE[tone];

  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded border border-outline-variant bg-surface-container-lowest p-4',
        'border-l-4',
        toneConfig.border,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wide">
          {label}
        </p>
        <span className={cn('material-symbols-outlined text-xl', toneConfig.text)}>
          {tone === 'primary' && 'format_list_bulleted'}
          {tone === 'success' && 'check_circle'}
          {tone === 'warning' && 'hourglass_empty'}
          {tone === 'danger' && 'error'}
          {tone === 'neutral' && 'dashboard'}
        </span>
      </div>
      <div>
        {loading ? (
          <Spinner className="h-7 w-7 text-muted" />
        ) : (
          <p className="text-headline-md text-on-surface font-bold">
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
        )}
      </div>
    </div>
  );
}
