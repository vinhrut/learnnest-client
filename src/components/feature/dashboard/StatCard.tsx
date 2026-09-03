import type { IconType } from 'react-icons';
import { FiAlertCircle, FiCheckCircle, FiGrid, FiList, FiLoader } from 'react-icons/fi';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/ui/Spinner';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const TONE: Record<Tone, { border: string; text: string; icon: IconType }> = {
  primary: {
    border: 'border-l-primary-container',
    text: 'text-on-primary-container',
    icon: FiList,
  },
  success: {
    border: 'border-l-success',
    text: 'text-success',
    icon: FiCheckCircle,
  },
  warning: {
    border: 'border-l-warning',
    text: 'text-warning',
    icon: FiLoader,
  },
  danger: {
    border: 'border-l-error',
    text: 'text-error',
    icon: FiAlertCircle,
  },
  neutral: {
    border: 'border-l-outline',
    text: 'text-on-surface-variant',
    icon: FiGrid,
  },
};

export interface StatCardProps {
  label: string;
  value: number | string;
  tone?: Tone;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  tone = 'neutral',
  loading = false,
}: StatCardProps) {
  const toneConfig = TONE[tone];
  const ToneIcon = toneConfig.icon;

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
        <ToneIcon className={cn('text-xl', toneConfig.text)} />
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
