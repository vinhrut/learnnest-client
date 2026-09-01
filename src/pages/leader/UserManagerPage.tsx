import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useUsersQuery } from '@/hooks/users/users.queries';
import type { User, UserStatus } from '@/types/user';
import { UserDetailModal } from '@/components/feature/users/UserDetailModal';
import { UserFilters } from '@/components/feature/users/UserFilters';
import { UserFormModal } from '@/components/feature/users/UserFormModal';
import { UserTable } from '@/components/feature/users/UserTable';

const LIMIT = 10;

export function UserManagerPage() {
  const { user: currentUser } = useAuth();
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page')) || 1;
  const status = (params.get('status') as UserStatus | null) ?? '';
  const urlSearch = params.get('q') ?? '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const patchParams = (mut: (p: URLSearchParams) => void, replace = true) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mut(next);
        return next;
      },
      { replace },
    );
  };

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    patchParams((p) => {
      if (debouncedSearch) p.set('q', debouncedSearch);
      else p.delete('q');
      p.delete('page');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleStatusChange = (value: UserStatus | '') => {
    patchParams((p) => {
      if (value) p.set('status', value);
      else p.delete('status');
      p.delete('page');
    });
  };

  const handlePageChange = (next: number) => {
    patchParams((p) => {
      if (next > 1) p.set('page', String(next));
      else p.delete('page');
    }, false);
  };

  const query = useUsersQuery({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    status: status || undefined,
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (user: User) => {
    setDetailId(null);
    setEditing(user);
    setFormOpen(true);
  };

  const users = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Tạo tài khoản, phân vai trò và khoá/mở khoá truy cập."
        actions={
          <Button leftIcon={<FiPlus />} onClick={openCreate}>
            Thêm người dùng
          </Button>
        }
      />

      <UserFilters
        search={searchInput}
        status={status}
        onSearchChange={setSearchInput}
        onStatusChange={handleStatusChange}
      />

      <div className="overflow-hidden rounded-xl">
        <UserTable
          users={users}
          loading={query.isFetching}
          currentUserId={currentUser?.id}
          onView={(u) => setDetailId(u.id)}
          onEdit={openEdit}
        />
        {meta && meta.total > 0 && (
          <div className="border border-t-0 border-line bg-white">
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {formOpen && (
        <UserFormModal
          key={editing?.id ?? 'new'}
          user={editing}
          onClose={() => setFormOpen(false)}
        />
      )}

      {detailId && (
        <UserDetailModal
          userId={detailId}
          onEdit={openEdit}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
