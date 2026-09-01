import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { StatCard } from '@/components/feature/dashboard/StatCard';
import { AlertList } from '@/components/feature/dashboard/AlertList';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/profile/profile.queries';
import { ProfileInfoCard } from '@/components/feature/profile/ProfileInfoCard';
import type { Task } from '@/types/task';

// Mock tasks for AlertList demo
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    code: 'TSK-1001',
    title: 'Hoàn thiện tài liệu dự án Q3',
    description: '',
    status: 'NEW',
    priority: 'HIGH',
    assignment_status: 'APPROVED',
    project_id: 'p1',
    assignee_id: 'u1',
    creator_id: 'u1',
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: {
      id: 'u1',
      username: 'user1',
      email: 'user1@email.com',
      full_name: 'Nguyễn Văn A',
      avatar_url: null,
    },
  },
  {
    id: '2',
    code: 'TSK-1002',
    title: 'Review thiết kế UI mới',
    description: '',
    status: 'DOING',
    priority: 'MEDIUM',
    assignment_status: 'APPROVED',
    project_id: 'p1',
    assignee_id: 'u2',
    creator_id: 'u1',
    due_date: new Date(Date.now() + 3600000 * 3).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: {
      id: 'u2',
      username: 'user2',
      email: 'user2@email.com',
      full_name: 'Trần Thị B',
      avatar_url: null,
    },
  },
];

export function BADashboardPage() {
  const { user } = useAuth();
  const profile = useMyProfileQuery();
  const [dueTasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header>
        <h1 className="text-headline-md text-on-surface font-bold">
          Xin chào, {user?.full_name || user?.username}
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Chào mừng bạn quay lại TaskMaster Pro.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Công việc của tôi"
          value={12}
          tone="primary"
        />
        <StatCard
          label="Đang làm"
          value={5}
          tone="warning"
        />
        <StatCard
          label="Hoàn thành"
          value={7}
          tone="success"
        />
        <StatCard
          label="Quá hạn"
          value={0}
          tone="danger"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {profile.isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-7 w-7 text-primary" />
            </div>
          ) : profile.data ? (
            <ProfileInfoCard user={profile.data} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-body-md text-on-surface-variant">Không tải được hồ sơ</p>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <AlertList tasks={dueTasks} />

          <Card title="Lối tắt">
            <div className="flex flex-col gap-2">
              <Link
                to="/ba/profile"
                className="flex items-center justify-between rounded-lg border border-outline-variant px-3 py-2.5 text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-on-surface-variant">account_circle</span>
                  Cập nhật hồ sơ
                </span>
                <span className="material-symbols-outlined text-xl text-on-surface-variant">chevron_right</span>
              </Link>
              <Link
                to="/ba/tasks"
                className="flex items-center justify-between rounded-lg border border-outline-variant px-3 py-2.5 text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-on-surface-variant">assignment</span>
                  Công việc của tôi
                </span>
                <span className="material-symbols-outlined text-xl text-on-surface-variant">chevron_right</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
