import { useSortable } from '@dnd-kit/sortable';
import { FiClock, FiEdit2, FiX } from 'react-icons/fi';
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
        task.status === 'CLOSED' && 'opacity-60',
        task.status === 'REJECTED' && 'opacity-75',
      )}
    >
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <FiEdit2 className="text-base text-on-surface-variant cursor-pointer" />
      </div>

      <div className="mb-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-label-md font-semibold',
            priority.bgColor,
            priority.color,
          )}
        >
          <priority.icon className="text-base" />
          {priority.label}
        </span>
      </div>

      <h4
        className={cn(
          'mb-3 pr-6 text-body-md font-medium',
          task.status === 'DONE' || task.status === 'CLOSED' ? 'text-on-surface-variant line-through' : 'text-on-surface',
        )}
      >
        {task.title}
      </h4>

      {task.assignment_status && task.assignment_status !== 'APPROVED' && task.assignment_status !== 'ASSIGNED' && (
        <div className="mb-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-label-md font-semibold',
              task.assignment_status === 'WAITING_APPROVAL'
                ? 'bg-warning-soft text-warning'
                : task.assignment_status === 'REJECTED'
                  ? 'bg-error-container text-error'
                  : 'bg-surface-variant text-on-surface-variant',
            )}
          >
            {task.assignment_status === 'WAITING_APPROVAL' ? (
              <FiClock className="text-base" />
            ) : (
              <FiX className="text-base" />
            )}
            {task.assignment_status === 'WAITING_APPROVAL' ? 'Chờ duyệt' :
             task.assignment_status === 'REJECTED' ? 'Từ chối' :
             task.assignment_status === 'NOT_ASSIGNED' ? 'Chưa giao' : 'Đã hủy'}
          </span>
        </div>
      )}

      {task.pending_extension_request && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 rounded bg-warning-soft px-1.5 py-0.5 text-label-md font-semibold text-warning">
            <FiClock className="text-base" />
            Chờ gia hạn
          </span>
        </div>
      )}

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
