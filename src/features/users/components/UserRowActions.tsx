import { useState } from 'react';
import { FiEdit2, FiEye, FiLock, FiTrash2, FiUnlock } from 'react-icons/fi';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { toast } from '@/components/ui/toast';
import {
  useDeleteUser,
  useLockUser,
  useUnlockUser,
} from '@/hooks/queries/users.queries';
import { firstErrorMessage } from '@/lib/errors';
import type { User } from '@/types/user';

type Dialog = 'lock' | 'unlock' | 'delete' | null;

export function UserRowActions({
  user,
  isSelf,
  onView,
  onEdit,
}: {
  user: User;
  isSelf: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
}) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const lock = useLockUser();
  const unlock = useUnlockUser();
  const remove = useDeleteUser();

  const busy = lock.isPending || unlock.isPending || remove.isPending;

  const run = (action: 'lock' | 'unlock' | 'delete', successMsg: string) => {
    const mutation =
      action === 'lock' ? lock : action === 'unlock' ? unlock : remove;
    mutation.mutate(user.id, {
      onSuccess: () => {
        toast.success(successMsg);
        setDialog(null);
      },
      onError: (err) => toast.error(firstErrorMessage(err)),
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <IconButton label="Xem chi tiết" onClick={() => onView(user)}>
        <FiEye />
      </IconButton>
      <IconButton label="Sửa" onClick={() => onEdit(user)}>
        <FiEdit2 />
      </IconButton>

      {user.status === 'LOCKED' ? (
        <IconButton
          label="Mở khoá"
          onClick={() => setDialog('unlock')}
          disabled={isSelf}
        >
          <FiUnlock />
        </IconButton>
      ) : (
        <IconButton
          label="Khoá"
          onClick={() => setDialog('lock')}
          disabled={isSelf}
        >
          <FiLock />
        </IconButton>
      )}

      <IconButton
        label="Xoá"
        danger
        onClick={() => setDialog('delete')}
        disabled={isSelf}
      >
        <FiTrash2 />
      </IconButton>

      <ConfirmDialog
        open={dialog === 'lock'}
        title="Khoá tài khoản"
        description={`Khoá "${user.username}"? Người dùng sẽ bị đăng xuất và không đăng nhập được.`}
        confirmLabel="Khoá"
        danger
        loading={busy}
        onConfirm={() => run('lock', 'Đã khoá tài khoản')}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'unlock'}
        title="Mở khoá tài khoản"
        description={`Mở khoá "${user.username}"?`}
        confirmLabel="Mở khoá"
        loading={busy}
        onConfirm={() => run('unlock', 'Đã mở khoá tài khoản')}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'delete'}
        title="Xoá tài khoản"
        description={`Xoá "${user.username}"? Tài khoản sẽ bị ẩn khỏi hệ thống.`}
        confirmLabel="Xoá"
        danger
        loading={busy}
        onConfirm={() => run('delete', 'Đã xoá tài khoản')}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
