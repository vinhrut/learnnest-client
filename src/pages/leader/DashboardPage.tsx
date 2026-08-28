import {
  FiFolder,
  FiLock,
  FiSlash,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useUsersQuery } from '@/hooks/users/users.queries';
import type { UserStatus } from '@/types/user';
import { RecentUsersCard } from '@/components/feature/dashboard/RecentUsersCard';
import { StatCard } from '@/components/feature/dashboard/StatCard';
import { StatusBreakdown } from '@/components/feature/dashboard/StatusBreakdown';

export function LeaderDashboardPage() {
  const { user } = useAuth();

  const recent = useUsersQuery({ page: 1, limit: 5 });
  const totalQ = useUsersQuery({ page: 1, limit: 1 });
  const activeQ = useUsersQuery({ page: 1, limit: 1, status: 'ACTIVE' });
  const inactiveQ = useUsersQuery({ page: 1, limit: 1, status: 'INACTIVE' });
  const lockedQ = useUsersQuery({ page: 1, limit: 1, status: 'LOCKED' });

  const counts: Record<UserStatus, number> = {
    ACTIVE: activeQ.data?.meta.total ?? 0,
    INACTIVE: inactiveQ.data?.meta.total ?? 0,
    LOCKED: lockedQ.data?.meta.total ?? 0,
  };
  const statsLoading =
    totalQ.isLoading ||
    activeQ.isLoading ||
    inactiveQ.isLoading ||
    lockedQ.isLoading;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">
          Xin chào, {user?.full_name || user?.username}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tổng quan hệ thống quản lý công việc.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Tổng người dùng"
          value={totalQ.data?.meta.total ?? 0}
          icon={FiUsers}
          tone="primary"
          loading={statsLoading}
        />
        <StatCard
          label="Đang hoạt động"
          value={counts.ACTIVE}
          icon={FiUserCheck}
          tone="success"
          loading={statsLoading}
        />
        <StatCard
          label="Ngưng hoạt động"
          value={counts.INACTIVE}
          icon={FiSlash}
          tone="neutral"
          loading={statsLoading}
        />
        <StatCard
          label="Đã khoá"
          value={counts.LOCKED}
          icon={FiLock}
          tone="danger"
          loading={statsLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentUsersCard
            users={recent.data?.data ?? []}
            loading={recent.isLoading}
          />
        </div>
        <div className="flex flex-col gap-6">
          <StatusBreakdown counts={counts} />
          <Card dashed>
            <div className="flex items-center gap-2 text-muted">
              <FiFolder className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Dự án &amp; Công việc</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Chưa có dữ liệu — module đang được phát triển.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
