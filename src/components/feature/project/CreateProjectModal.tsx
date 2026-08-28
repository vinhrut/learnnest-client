import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/toast';
import { useCreateProject } from '@/hooks/projects/project.queries';
import { useUsersQuery } from '@/hooks/users/users.queries';
import type { ProjectStatus } from '@/types/project';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const { data: users } = useUsersQuery({});

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'PLANNING' as ProjectStatus,
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await createProject.mutateAsync({
        ...formData,
        member_ids: selectedMembers,
      });
      toast.success('Tạo dự án thành công!');
      handleClose();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tạo dự án thất bại';
      toast.error(message);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', description: '', status: 'PLANNING' });
    setSelectedMembers([]);
    onClose();
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const availableUsers = users?.data || [];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Tạo dự án mới"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createProject.isPending}
          >
            {createProject.isPending && <Spinner />}
            Tạo dự án
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên dự án */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Tên dự án <span className="text-danger">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên dự án..."
          />
        </div>

        {/* Mã dự án */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Mã dự án <span className="text-danger">*</span>
          </label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="PROJ-001"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả mục tiêu và phạm vi dự án..."
            rows={3}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Trạng thái</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="PLANNING">Lên kế hoạch</option>
            <option value="ACTIVE">Đang chạy</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </div>

        {/* Thành viên */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Thành viên tham gia
          </label>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-line bg-white">
            {availableUsers.length === 0 ? (
              <p className="p-3 text-sm text-muted">Không có user nào</p>
            ) : (
              availableUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-line p-3 last:border-0 hover:bg-canvas"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
                  />
                  <div className="flex flex-grow items-center gap-2">
                    <span className="text-sm text-ink">
                      {user.full_name || user.username}
                    </span>
                    <span className="rounded bg-canvas px-2 py-0.5 text-[10px] font-medium text-muted">
                      {user.roles[0]}
                    </span>
                  </div>
                  <span className="text-xs text-muted">{user.email}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
