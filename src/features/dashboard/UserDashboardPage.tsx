import { Link } from 'react-router-dom';
import { FiArrowRight, FiFolder, FiUser } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useMyProfileQuery } from '@/hooks/queries/profile.queries';
import { ProfileInfoCard } from '@/features/profile/components/ProfileInfoCard';

export function UserDashboardPage() {
  const { user } = useAuth();
  const profile = useMyProfileQuery();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">
          Xin chào, {user?.full_name || user?.username}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Chào mừng bạn quay lại LearnNest.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {profile.isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-7 w-7 text-primary" />
            </div>
          ) : profile.data ? (
            <ProfileInfoCard user={profile.data} />
          ) : (
            <EmptyState title="Không tải được hồ sơ" />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Lối tắt">
            <div className="flex flex-col gap-2">
              <Link
                to="/profile"
                className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas"
              >
                <span className="flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-muted" />
                  Cập nhật hồ sơ
                </span>
                <FiArrowRight className="h-4 w-4 text-muted" />
              </Link>
            </div>
          </Card>

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
