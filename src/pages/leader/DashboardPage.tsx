import { useNavigate } from 'react-router-dom';
import { AlertList } from '@/components/feature/dashboard/AlertList';
import { DashboardOverview } from '@/components/feature/dashboard/DashboardOverview';
import {
  useDashboardOverviewQuery,
  useExportDashboardExcel,
} from '@/hooks/analytics/analytics.queries';
import { useTasksQuery } from '@/hooks/tasks/task.queries';

const DUE_WINDOW_STARTED_AT = Date.now();
const DUE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function LeaderDashboardPage() {
  const navigate = useNavigate();
  const overview = useDashboardOverviewQuery();
  const exportExcel = useExportDashboardExcel();
  const tasks = useTasksQuery();

  const dueTasks = (tasks.data ?? []).filter((task) => {
    if (!task.due_date) return false;
    const due = new Date(task.due_date).getTime();
    return due >= DUE_WINDOW_STARTED_AT && due <= DUE_WINDOW_STARTED_AT + DUE_WINDOW_MS;
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-headline-md font-bold text-on-surface">
          Tong quan quan ly
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Theo doi tinh trang cong viec, deadline va bao cao cua phan he Tracking.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DashboardOverview
            data={overview.data}
            loading={overview.isLoading}
            onRefresh={() => {
              overview.refetch();
              tasks.refetch();
            }}
            onExport={() => exportExcel.mutate()}
            exporting={exportExcel.isPending}
          />
        </div>

        <div className="lg:col-span-4">
          <AlertList
            tasks={dueTasks}
            onTaskClick={(task) => navigate(`/leader/tasks?taskId=${task.id}`)}
            onViewAllClick={() => navigate('/leader/tasks')}
          />
        </div>
      </div>
    </div>
  );
}
