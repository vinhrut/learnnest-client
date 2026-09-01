import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import type { Task } from '@/types/task';

export interface AlertItemProps {
  task: Task;
  dueType: 'today' | 'tomorrow';
  onClick?: () => void;
}

/**
 * AlertItem - Single alert item for tasks due soon
 *
 * @example
 * <AlertItem
 *   task={task}
 *   dueType="today"
 *   onClick={() => openTask(task.id)}
 * />
 */
export function AlertItem({ task, dueType, onClick }: AlertItemProps) {
  const dueTime = task.due_date
    ? new Date(task.due_date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group cursor-pointer border-b border-outline-variant p-4 transition-colors hover:bg-surface-container-low',
        'border-l-2',
        dueType === 'today' ? 'border-l-error' : 'border-l-warning',
      )}
    >
      <div className="mb-1 flex items-start justify-between">
        <span className="font-mono-sm text-mono-sm text-on-surface-variant">{task.code}</span>
        <span
          className={cn(
            'font-label-md text-[10px] font-bold uppercase tracking-wider',
            dueType === 'today' ? 'text-error' : 'text-warning',
          )}
        >
          {dueType === 'today' ? 'Hôm nay' : 'Ngày mai'} {dueTime}
        </span>
      </div>
      <h4 className="mb-2 text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">
        {task.title}
      </h4>
      {task.assignee && (
        <div className="flex items-center gap-2">
          <Avatar
            src={task.assignee.avatar_url}
            name={task.assignee.full_name}
            size="xs"
          />
          <span className="font-label-md text-[11px] text-on-surface-variant">
            {task.assignee.full_name || task.assignee.username}
          </span>
        </div>
      )}
    </div>
  );
}
