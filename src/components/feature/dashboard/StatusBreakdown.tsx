import { Card } from '@/components/ui/Card';
import { USER_STATUS_LABEL, type UserStatus } from '@/types/user';

const BAR: Record<UserStatus, string> = {
  ACTIVE: 'bg-success',
  INACTIVE: 'bg-muted',
  LOCKED: 'bg-danger',
};

export function StatusBreakdown({
  counts,
}: {
  counts: Record<UserStatus, number>;
}) {
  const sum = counts.ACTIVE + counts.INACTIVE + counts.LOCKED;
  const total = sum || 1;

  return (
    <Card title="Phân bố trạng thái">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-canvas">
        {sum === 0 ? (
          <div className="w-full bg-line" />
        ) : (
          (Object.keys(BAR) as UserStatus[]).map((s) => (
            <div
              key={s}
              className={BAR[s]}
              style={{ width: `${(counts[s] / total) * 100}%` }}
            />
          ))
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {(Object.keys(BAR) as UserStatus[]).map((s) => (
          <li key={s} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className={`h-2.5 w-2.5 rounded-full ${BAR[s]}`} />
              {USER_STATUS_LABEL[s]}
            </span>
            <span className="font-semibold text-ink">{counts[s]}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
