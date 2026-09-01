import { AlertItem } from './AlertItem';
import type { Task } from '@/types/task';

interface AlertListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function AlertList({ tasks, onTaskClick }: AlertListProps) {
  const getDueType = (dueDate: string | null | undefined): 'today' | 'tomorrow' | 'later' => {
    if (!dueDate) return 'later';
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const due = new Date(dueDate);
    if (due.toDateString() === today.toDateString()) return 'today';
    if (due.toDateString() === tomorrow.toDateString()) return 'tomorrow';
    return 'later';
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-t-xl border-b border-outline-variant">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface font-semibold">
          <span className="material-symbols-outlined text-danger">warning</span>
          Đến hạn trong 24h
        </h3>
        <span className="bg-error-container text-on-error-container font-label-md text-label-md px-2 py-1 rounded-full">
          {tasks.length} Tasks
        </span>
      </div>

      {/* Alert Items */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <AlertItem
              key={task.id}
              task={task}
              dueType={getDueType(task.due_date) === 'today' ? 'today' : 'tomorrow'}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        ) : (
          <p className="p-4 text-center text-body-md text-on-surface-variant">Không có công việc nào đến hạn</p>
        )}
      </div>

      {/* Footer Link */}
      <div className="p-3 border-t border-outline-variant text-center bg-surface-container-low rounded-b-xl">
        <a href="#" className="font-label-md text-label-md text-primary hover:underline">
          Xem tất cả công việc sắp đến hạn
        </a>
      </div>
    </div>
  );
}
