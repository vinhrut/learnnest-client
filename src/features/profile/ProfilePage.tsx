import { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { useMyProfileQuery } from '@/hooks/queries/profile.queries';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { ProfileForm } from './components/ProfileForm';
import { ProfileInfoCard } from './components/ProfileInfoCard';

export function ProfilePage() {
  const { data: user, isLoading, isError, refetch } = useMyProfileQuery();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Xem và cập nhật thông tin tài khoản của bạn."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7 text-primary" />
        </div>
      ) : isError || !user ? (
        <EmptyState
          title="Không tải được hồ sơ"
          description="Đã có lỗi khi lấy thông tin tài khoản."
          action={
            <Button variant="secondary" onClick={() => refetch()}>
              Thử lại
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileInfoCard user={user} />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <ProfileForm user={user} />

            <Card title="Bảo mật">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Mật khẩu</p>
                  <p className="text-sm text-muted">
                    Xác thực bằng mật khẩu hiện tại. Sau khi đổi, bạn sẽ cần đăng
                    nhập lại trên mọi thiết bị.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  leftIcon={<FiLock />}
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {changePasswordOpen && (
        <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} />
      )}
    </div>
  );
}
