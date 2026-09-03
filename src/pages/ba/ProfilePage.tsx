import { useState } from 'react';
import { FiLock, FiShield, FiUser } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/cn';
import { useMyProfileQuery } from '@/hooks/profile/profile.queries';
import { ChangePasswordModal } from '@/components/feature/profile/ChangePasswordModal';
import { ProfileAboutCard } from '@/components/feature/profile/ProfileAboutCard';
import { ProfileForm } from '@/components/feature/profile/ProfileForm';
import { ProfileHero } from '@/components/feature/profile/ProfileHero';

type TabId = 'info' | 'security';

const TABS: { id: TabId; label: string; icon: typeof FiUser }[] = [
  { id: 'info', label: 'Thông tin cá nhân', icon: FiUser },
  { id: 'security', label: 'Bảo mật', icon: FiShield },
];

export function ProfilePage() {
  const { data: user, isLoading, isError, refetch } = useMyProfileQuery();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [tab, setTab] = useState<TabId>('info');

  return (
    <div className="flex flex-col gap-6">
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
        <>
          <ProfileHero user={user} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ProfileAboutCard user={user} />
            </div>

            <div className="flex flex-col gap-4 lg:col-span-2">
              <div
                role="tablist"
                aria-label="Mục hồ sơ"
                className="flex gap-1 border-b border-outline-variant"
              >
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`profile-tab-${id}`}
                    aria-selected={tab === id}
                    aria-controls={`profile-panel-${id}`}
                    onClick={() => setTab(id)}
                    className={cn(
                      'flex items-center gap-2 border-b-2 px-4 py-3 text-label-md transition-colors',
                      tab === id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface',
                    )}
                  >
                    <Icon className="text-base" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Cả hai panel luôn được mount để form không mất nội dung đang gõ dở khi đổi tab. */}
              <div
                role="tabpanel"
                id="profile-panel-info"
                aria-labelledby="profile-tab-info"
                hidden={tab !== 'info'}
              >
                <ProfileForm user={user} />
              </div>

              <div
                role="tabpanel"
                id="profile-panel-security"
                aria-labelledby="profile-tab-security"
                hidden={tab !== 'security'}
              >
                <Card>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-body-md font-semibold text-on-surface">Mật khẩu</p>
                      <p className="text-body-md text-on-surface-variant">
                        Xác thực bằng mật khẩu hiện tại. Sau khi đổi, bạn sẽ cần đăng
                        nhập lại trên mọi thiết bị.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      leftIcon={<FiLock />}
                      onClick={() => setChangePasswordOpen(true)}
                      className="shrink-0"
                    >
                      Đổi mật khẩu
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}

      {changePasswordOpen && (
        <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} />
      )}
    </div>
  );
}
