import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import type { Task } from '@/types/task';
import { PRIORITY_CONFIG } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isActive?: boolean;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  onClick,
  isActive = false,
  isDragging = false,
}: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group relative cursor-grab rounded-md border bg-surface-container-lowest border-outline-variant p-3 transition-all',
        'hover:border-primary-container',
        (isActive || isSortableDragging) && 'cursor-grabbing border-2 border-primary-container shadow-md',
        isDragging && 'opacity-90 scale-[1.02] shadow-lg',
        isSortableDragging && 'opacity-50',
        task.status === 'DONE' && 'opacity-70',
      )}
    >
      {/* Edit button (hover) */}
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-base text-on-surface-variant cursor-pointer">
          edit
        </span>
      </div>

      {/* Priority Badge */}
      <div className="mb-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-label-md font-semibold',
            priority.bgColor,
            priority.color,
          )}
        >
          <span className="material-symbols-outlined text-base">{priority.icon}</span>
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <h4
        className={cn(
          'mb-3 pr-6 text-body-md font-medium',
          task.status === 'DONE' ? 'text-on-surface-variant line-through' : 'text-on-surface',
        )}
      >
        {task.title}
      </h4>

      {/* Approval Status */}
      {task.approval_status !== 'APPROVED' && (
        <div className="mb-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-label-md font-semibold',
              task.approval_status === 'PENDING'
                ? 'bg-warning-soft text-warning'
                : 'bg-error-container text-error',
            )}
          >
            <span className="material-symbols-outlined text-base">
              {task.approval_status === 'PENDING' ? 'schedule' : 'close'}
            </span>
            {task.approval_status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
          </span>
        </div>
      )}

      {/* Footer: Task Code + Assignee */}
      <div className="flex items-center justify-between border-t border-outline-variant pt-2">
        <span className="font-mono text-mono-sm text-on-surface-variant">{task.code}</span>
        {task.assignee && (
          <Avatar
            src={task.assignee.avatar_url}
            name={task.assignee.full_name}
            size="xs"
          />
        )}
      </div>
    </div>
  );
}
