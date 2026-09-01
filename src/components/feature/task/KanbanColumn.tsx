import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/cn';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types/task';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  count: number;
  status: TaskStatus;
  onTaskClick?: (task: Task) => void;
  isProtected?: boolean;
  loading?: boolean;
}

const STATUS_STYLES: Record<TaskStatus, { container: string; header: string; headerText: string }> = {
  DRAFT: {
    container: 'bg-surface-container-lowest',
    header: 'bg-surface-container',
    headerText: 'text-on-surface',
  },
  TODO: {
    container: 'bg-surface-container-lowest',
    header: 'bg-surface-container',
    headerText: 'text-on-surface',
  },
  IN_PROGRESS: {
    container: 'bg-surface-container-lowest',
    header: 'bg-primary-fixed',
    headerText: 'text-on-primary-fixed',
  },
  DONE: {
    container: 'bg-surface-container-lowest opacity-80',
    header: 'bg-surface-container-low',
    headerText: 'text-on-surface-variant',
  },
};

export function KanbanColumn({
  title,
  tasks,
  count,
  status,
  onTaskClick,
  isProtected = false,
  loading = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const styles = STATUS_STYLES[status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full w-[300px] flex-shrink-0 flex-col rounded-lg border border-outline-variant transition-colors',
        styles.container,
        isOver && 'bg-primary-fixed/20',
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'flex items-center justify-between border-b border-outline-variant p-3',
          styles.header,
        )}
      >
        <h3 className={cn(
          'flex items-center gap-2 text-label-md font-semibold uppercase',
          styles.headerText,
        )}>
          {title}
          <span className={cn(
            'rounded-full px-2 py-0.5 text-[10px]',
            status === 'IN_PROGRESS' ? 'bg-primary-container text-on-primary' : 'bg-surface-variant text-on-surface-variant'
          )}>
            {count}
          </span>
        </h3>
        <div className="flex items-center gap-1">
          {isProtected && (
            <span className="material-symbols-outlined text-xl text-on-surface-variant cursor-help" title="Manager only">shield</span>
          )}
          {status === 'IN_PROGRESS' && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          )}
          {status === 'DONE' && (
            <span className="material-symbols-outlined text-xl text-on-surface-variant">check_circle</span>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto p-2 kanban-scroll">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-md bg-surface-container" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick?.(task)}
                  isActive={status === 'IN_PROGRESS'}
                />
              ))}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
