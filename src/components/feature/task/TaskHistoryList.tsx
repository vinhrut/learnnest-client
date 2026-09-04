import { FiClock } from 'react-icons/fi';
import { Spinner } from '@/components/ui/Spinner';
import {
  HISTORY_ACTION_LABEL,
  type TaskHistoryItem,
} from '@/types/analytics';
import { TASK_STATUS_LABEL } from '@/types/task';

interface TaskHistoryListProps {
  items?: TaskHistoryItem[];
  loading?: boolean;
}

export function TaskHistoryList({ items = [], loading = false }: TaskHistoryListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-body-md text-on-surface-variant">
        Chua co nhat ky thao tac.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
            <FiClock className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-md font-semibold text-on-surface">
                {HISTORY_ACTION_LABEL[item.action]}
              </p>
              <time className="text-label-md text-on-surface-variant">
                {new Date(item.created_at).toLocaleString('vi-VN')}
              </time>
            </div>
            <p className="mt-1 text-label-md text-on-surface-variant">
              Actor: {item.actor_id}
            </p>
            {item.old_status && item.new_status && item.old_status !== item.new_status && (
              <p className="mt-2 text-body-md text-on-surface">
                {TASK_STATUS_LABEL[item.old_status]} -&gt; {TASK_STATUS_LABEL[item.new_status]}
              </p>
            )}
            {item.comment && (
              <p className="mt-2 text-body-md text-on-surface-variant">
                {item.comment}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
