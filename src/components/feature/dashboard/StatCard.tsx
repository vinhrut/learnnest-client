import type { IconType } from 'react-icons';
import { cn } from '@/lib/cn';
import { Spinner } from '@/components/ui/Spinner';

type Tone = 'primary' | 'success' | 'danger' | 'neutral';

const TONE: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-canvas text-muted',
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
    <div className="flex items-center gap-4 rounded-xl border border-line bg-white p-4">
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-lg',
          TONE[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="text-2xl font-bold text-ink">
          {loading ? <Spinner className="h-5 w-5 text-muted" /> : value}
        </p>
      </div>
    </div>
  );
}
