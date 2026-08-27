import type { ReactNode } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useUserQuery } from '@/hooks/queries/users.queries';
import type { User } from '@/types/user';
import { RoleTags } from './RoleTags';
import { UserStatusBadge } from './UserStatusBadge';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-40 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-medium text-ink">
        {children}
      </dd>
    </div>
  );
}

export function UserDetailModal({
  userId,
  onEdit,
  onClose,
}: {
  userId: string;
  onEdit: (user: User) => void;
  onClose: () => void;
}) {
  const { data: user, isLoading, isError } = useUserQuery(userId);

  return (
    <Modal
      open
      onClose={onClose}
      title="Chi tiết người dùng"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button
            leftIcon={<FiEdit2 />}
            disabled={!user}
            onClick={() => user && onEdit(user)}
          >
            Sửa
          </Button>
        </>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      ) : isError || !user ? (
        <p className="py-6 text-center text-sm text-muted">
          Không tải được thông tin người dùng.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatar_url}
              name={user.full_name || user.username}
              size="lg"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-ink">
                {user.full_name || user.username}
              </p>
              <p className="truncate text-sm text-muted">@{user.username}</p>
            </div>
          </div>

          <dl className="flex flex-col gap-3">
            <Row label="Email">{user.email}</Row>
            <Row label="Số điện thoại">{user.phone || '—'}</Row>
            <Row label="Vai trò">
              <RoleTags roles={user.roles} />
            </Row>
            <Row label="Trạng thái">
              <UserStatusBadge status={user.status} />
            </Row>
            <Row label="Ngày tạo">{formatDateTime(user.created_at)}</Row>
            <Row label="Cập nhật gần nhất">
              {formatDateTime(user.updated_at)}
            </Row>
          </dl>
        </div>
      )}
    </Modal>
  );
}
