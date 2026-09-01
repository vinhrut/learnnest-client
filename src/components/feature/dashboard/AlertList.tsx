import type { Task } from '@/types/task';
import { AlertItem } from './AlertItem';

export interface AlertListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onViewAllClick?: () => void;
}

/**
 * AlertList - Displays tasks due within 24 hours
 *
 * @example
 * <AlertList tasks={dueTasks} onTaskClick={(task) => navigate(`/tasks/${task.id}`)} />
 */
export function AlertList({ tasks, onTaskClick, onViewAllClick }: AlertListProps) {
  const getDueType = (dueDate: string | null | undefined): 'today' | 'tomorrow' => {
    if (!dueDate) return 'tomorrow';
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const due = new Date(dueDate);
    if (due.toDateString() === today.toDateString()) return 'today';
    return 'tomorrow';
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest p-4 rounded-t-xl">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface font-semibold">
          <span className="material-symbols-outlined text-error">warning</span>
          Đến hạn trong 24h
        </h3>
        <span className="bg-error-container text-on-error-container font-label-md px-2 py-1 rounded-full">
          {tasks.length} Tasks
        </span>
      </div>

      {/* Alert Items */}
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <AlertItem
              key={task.id}
              task={task}
              dueType={getDueType(task.due_date)}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        ) : (
          <div className="p-4 text-center">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">check_circle</span>
            <p className="text-body-md text-on-surface-variant">Không có công việc nào đến hạn</p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      {tasks.length > 0 && (
        <div className="border-t border-outline-variant bg-surface-container-low p-3 text-center rounded-b-xl">
          <button
            onClick={onViewAllClick}
            className="font-label-md text-primary hover:underline"
          >
            Xem tất cả công việc sắp đến hạn
          </button>
        </div>
      )}
    </div>
  );
}
