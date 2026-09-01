import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/ui/Table';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMyTasksQuery } from '@/hooks/queries/tasks.queries';
import {
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  type TaskCard,
  type TaskPriority,
} from '@/types/task';

const PRIORITY_TONE: Record<
  TaskPriority,
  'neutral' | 'primary' | 'warning' | 'danger'
> = {
  LOW: 'neutral',
  MEDIUM: 'primary',
  HIGH: 'warning',
  URGENT: 'danger',
};

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('vi-VN');
}

const columns: Column<TaskCard>[] = [
  {
    key: 'title',
    header: 'Công việc',
    render: (t) => (
      <div className="min-w-0">
        <p className="font-medium text-ink">{t.title}</p>
        {t.description && (
          <p className="truncate text-xs text-muted">{t.description}</p>
        )}
      </div>
    ),
    cellClassName: 'max-w-[320px]',
  },
  {
    key: 'project',
    header: 'Dự án',
    render: (t) => t.project?.code ?? '—',
    className: 'hidden md:table-cell',
  },
  {
    key: 'priority',
    header: 'Ưu tiên',
    render: (t) => (
      <Badge tone={PRIORITY_TONE[t.priority]}>
        {TASK_PRIORITY_LABEL[t.priority]}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Trạng thái',
    render: (t) => TASK_STATUS_LABEL[t.status] ?? t.status,
  },
  {
    key: 'assigner',
    header: 'Người giao',
    render: (t) => t.assigner?.full_name ?? t.assigner?.email ?? '—',
    className: 'hidden lg:table-cell',
  },
  {
    key: 'due',
    header: 'Hạn',
    render: (t) => formatDate(t.dueDate),
    className: 'hidden sm:table-cell',
  },
];

export function MyTasksPage() {
  const query = useMyTasksQuery();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Việc của tôi"
        subtitle="Danh sách công việc được giao. Tự cập nhật khi có việc mới, không cần tải lại trang."
      />

      <Table
        columns={columns}
        rows={query.data ?? []}
        rowKey={(t) => t.id}
        loading={query.isFetching}
        emptyState={
          <p className="text-center text-sm text-muted">
            Bạn chưa được giao công việc nào.
          </p>
        }
      />
    </div>
  );
}
