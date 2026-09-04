import type { ReactNode } from 'react';
import { FiChevronRight, FiClipboard, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { AlertList } from '@/components/feature/dashboard/AlertList';
import { DashboardOverview } from '@/components/feature/dashboard/DashboardOverview';
import { ProfileInfoCard } from '@/components/feature/profile/ProfileInfoCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  useDashboardOverviewQuery,
  useExportDashboardExcel,
} from '@/hooks/analytics/analytics.queries';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/profile/profile.queries';
import { useTasksQuery } from '@/hooks/tasks/task.queries';

const DUE_WINDOW_STARTED_AT = Date.now();
const DUE_WINDOW_MS = 24 * 60 * 60 * 1000;

export function DevDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = useMyProfileQuery();
  const overview = useDashboardOverviewQuery();
  const exportExcel = useExportDashboardExcel();
  const tasks = useTasksQuery(user ? { assignee_id: user.id } : undefined);

  const dueTasks = (tasks.data ?? []).filter((task) => {
    if (!task.due_date) return false;
    const due = new Date(task.due_date).getTime();
    return due >= DUE_WINDOW_STARTED_AT && due <= DUE_WINDOW_STARTED_AT + DUE_WINDOW_MS;
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-headline-md font-bold text-on-surface">
          Xin chao, {user?.full_name || user?.username}
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Tong quan cong viec, deadline va bao cao ca nhan.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
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

          {profile.isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-7 w-7 text-primary" />
            </div>
          ) : profile.data ? (
            <ProfileInfoCard user={profile.data} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-body-md text-on-surface-variant">
                Khong tai duoc ho so
              </p>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <AlertList
            tasks={dueTasks}
            onTaskClick={(task) => navigate(`/dev/tasks?taskId=${task.id}`)}
            onViewAllClick={() => navigate('/dev/tasks')}
          />

          <Card title="Loi tat">
            <div className="flex flex-col gap-2">
              <ShortcutLink to="/dev/profile" icon={<FiUser />} label="Cap nhat ho so" />
              <ShortcutLink to="/dev/tasks" icon={<FiClipboard />} label="Cong viec cua toi" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ShortcutLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-outline-variant px-3 py-2.5 text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container"
    >
      <span className="flex items-center gap-2">
        <span className="text-xl text-on-surface-variant">{icon}</span>
        {label}
      </span>
      <FiChevronRight className="text-xl text-on-surface-variant" />
    </Link>
  );
}
