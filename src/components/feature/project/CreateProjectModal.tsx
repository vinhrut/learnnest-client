import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/toast';
import { useCreateProject } from '@/hooks/projects/project.queries';
import { projectKeys } from '@/hooks/projects/project.queries';
import { useQueryClient } from '@tanstack/react-query';
import type { ProjectStatus } from '@/types/project';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const createProject = useCreateProject();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'PLANNING' as ProjectStatus,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      await createProject.mutateAsync(formData);
      // Refetch project list to refresh the data
      await queryClient.refetchQueries({ queryKey: projectKeys.list() });
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
    onClose();
  };

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

        <div className="rounded-lg border border-dashed border-line bg-canvas p-3">
          <p className="text-sm text-muted">
            Thêm thành viên sau khi tạo, ở trang chi tiết dự án.
          </p>
        </div>
      </form>
    </Modal>
  );
}
