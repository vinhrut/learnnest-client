import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { RoleTags } from '@/components/feature/users/RoleTags';
import { UserStatusBadge } from '@/components/feature/users/UserStatusBadge';
import type { User } from '@/types/user';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function ProfileInfoCard({ user }: { user: User }) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Avatar
          src={user.avatar_url}
          name={user.full_name || user.username}
          size="xl"
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-ink">
            {user.full_name || user.username}
          </p>
          <p className="truncate text-sm text-muted">@{user.username}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <RoleTags roles={user.roles} />
            <UserStatusBadge status={user.status} />
          </div>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Email</dt>
          <dd className="mt-0.5 break-all font-medium text-ink">{user.email}</dd>
        </div>
        <div>
          <dt className="text-muted">Số điện thoại</dt>
          <dd className="mt-0.5 font-medium text-ink">{user.phone || '—'}</dd>
        </div>
        <div>
          <dt className="text-muted">Ngày tạo</dt>
          <dd className="mt-0.5 font-medium text-ink">
            {formatDate(user.created_at)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Cập nhật gần nhất</dt>
          <dd className="mt-0.5 font-medium text-ink">
            {formatDate(user.updated_at)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
