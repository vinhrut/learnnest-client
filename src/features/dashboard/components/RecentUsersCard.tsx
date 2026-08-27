import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { RoleTags } from '@/features/users/components/RoleTags';
import { UserStatusBadge } from '@/features/users/components/UserStatusBadge';
import type { User } from '@/types/user';

export function RecentUsersCard({
  users,
  loading,
}: {
  users: User[];
  loading: boolean;
}) {
  return (
    <Card
      title="Người dùng mới nhất"
      action={
        <Link
          to="/users"
          className="text-sm font-medium text-primary hover:underline"
        >
          Xem tất cả
        </Link>
      }
      bodyClassName="p-0"
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      ) : users.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Chưa có người dùng</p>
      ) : (
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3"
            >
              <Avatar src={u.avatar_url} name={u.full_name || u.username} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {u.full_name || u.username}
                </p>
                <p className="truncate text-xs text-muted">{u.email}</p>
              </div>
              <RoleTags roles={u.roles} />
              <UserStatusBadge status={u.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
