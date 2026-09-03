import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/Avatar';
import { useAvailableUsersQuery, useAddProjectMember } from '@/hooks/projects/project.queries';
import { toast } from '@/components/ui/toast';
import { ROLE_LABEL } from '@/types/user';

interface AddMemberModalProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

export function AddMemberModal({ projectId, open, onClose }: AddMemberModalProps) {
  const { data: availableUsers, isLoading } = useAvailableUsersQuery(open ? projectId : undefined);
  const addMember = useAddProjectMember();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!selectedUserId) {
      toast.error('Vui lòng chọn thành viên');
      return;
    }

    try {
      await addMember.mutateAsync({
        projectId,
        payload: { user_id: selectedUserId, project_role: 'MEMBER' },
      });
      toast.success('Thêm thành viên thành công!');
      handleClose();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Thêm thành viên thất bại';
      toast.error(message);
    }
  };

  const handleClose = () => {
    setSelectedUserId(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Thêm thành viên"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedUserId || addMember.isPending}
          >
            {addMember.isPending && <Spinner />}
            Thêm
          </Button>
        </>
      }
    >
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : availableUsers && availableUsers.length > 0 ? (
          <div className="space-y-1">
            {availableUsers.map((user) => (
              <label
                key={user.id}
                className={`
                  flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors
                  ${
                    selectedUserId === user.id
                      ? 'bg-primary-soft border border-primary'
                      : 'hover:bg-canvas border border-transparent'
                  }
                `}
              >
                <input
                  type="radio"
                  name="member"
                  checked={selectedUserId === user.id}
                  onChange={() => setSelectedUserId(user.id)}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <Avatar
                  src={user.avatar_url}
                  name={user.full_name || user.username}
                  size="sm"
                />
                <div className="flex flex-grow flex-col">
                  <span className="text-sm font-medium text-ink">
                    {user.full_name || user.username}
                  </span>
                  <span className="text-xs text-muted">{user.email}</span>
                </div>
                <span className="rounded bg-canvas px-2 py-0.5 text-[10px] font-medium text-muted">
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted">
            <p>Không có user nào có thể thêm</p>
            <p className="mt-1 text-xs">Tất cả user đã tham gia dự án này</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
