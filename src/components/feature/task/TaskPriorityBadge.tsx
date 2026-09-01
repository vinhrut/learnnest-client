import { cn } from '@/lib/cn';
import type { TaskPriority } from '@/types/task';
import { PRIORITY_CONFIG } from '@/types/task';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  showIcon?: boolean;
  className?: string;
}

export function TaskPriorityBadge({
  priority,
  showIcon = true,
  className,
}: TaskPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold',
        config.bgColor,
        config.color,
        className,
      )}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-xs">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
}
