import { Avatar } from '@/components/ui/Avatar';
import { Table, type Column } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import type { User } from '@/types/user';
import { RoleTags } from './RoleTags';
import { UserRowActions } from './UserRowActions';
import { UserStatusBadge } from './UserStatusBadge';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function UserTable({
  users,
  loading,
  currentUserId,
  onView,
  onEdit,
}: {
  users: User[];
  loading: boolean;
  currentUserId: string | undefined;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
}) {
  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'Người dùng',
      cellClassName: 'max-w-[16rem]',
      render: (u) => (
        <button
          type="button"
          onClick={() => onView(u)}
          className="flex items-center gap-3 text-left"
        >
          <Avatar src={u.avatar_url} name={u.full_name || u.username} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink hover:text-primary">
              {u.full_name || u.username}
            </p>
            <p className="truncate text-xs text-muted">@{u.username}</p>
          </div>
        </button>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      cellClassName: 'max-w-[15rem] truncate',
      render: (u) => <span title={u.email}>{u.email}</span>,
    },
    {
      key: 'roles',
      header: 'Vai trò',
      render: (u) => <RoleTags roles={u.roles} />,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (u) => <UserStatusBadge status={u.status} />,
    },
    {
      key: 'created_at',
      header: 'Ngày tạo',
      className: 'hidden lg:table-cell',
      render: (u) => (
        <span className="text-muted">{formatDate(u.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) => (
        <UserRowActions
          user={u}
          isSelf={u.id === currentUserId}
          onView={onView}
          onEdit={onEdit}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={users}
      rowKey={(u) => u.id}
      loading={loading}
      emptyState={
        <EmptyState
          title="Không có người dùng"
          description="Thử đổi từ khoá tìm kiếm hoặc bộ lọc trạng thái."
        />
      }
    />
  );
}
