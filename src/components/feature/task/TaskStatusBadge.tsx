import type { TaskStatus } from '@/types/task';
import { TASK_STATUS_CONFIG } from '@/types/task';
import { Badge } from '@/components/ui/Badge';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const config = TASK_STATUS_CONFIG[status];

  const toneMap: Record<string, 'neutral' | 'primary' | 'success' | 'warning' | 'danger'> = {
    DRAFT: 'neutral',
    TODO: 'neutral',
    IN_PROGRESS: 'primary',
    DONE: 'success',
  };

  return (
    <Badge tone={toneMap[status]} className={className}>
      {config.label}
    </Badge>
  );
}
