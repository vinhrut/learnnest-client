 
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useProjectMembersQuery } from '@/hooks/projects/project.queries';
import { canAssignTask } from '@/lib/permissions';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '@/types/task';
import { PRIORITY_LABEL } from '@/types/task';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  task?: Task;
  loading?: boolean;
  projectId?: string;
}

export function TaskForm({ open, onClose, onSubmit, task, loading, projectId }: TaskFormProps) {
  const isEdit = !!task;
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  // Get today's date in YYYY-MM-DD format for min validation
  const today = new Date().toISOString().split('T')[0];

  const canAssign = canAssignTask(user);
  const { data: members } = useProjectMembersQuery(
    canAssign && open ? projectId : undefined,
  );

  // Reset form fields whenever the modal opens or the edited task changes
  // (render-phase sync instead of an effect).
  const formKey = open ? (task?.id ?? 'new') : null;
  const [syncedFormKey, setSyncedFormKey] = useState(formKey);

  if (formKey !== syncedFormKey) {
    setSyncedFormKey(formKey);
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setPriority(task?.priority ?? 'MEDIUM');
    setDueDate(task?.due_date ? task.due_date.split('T')[0] : '');
    setAssigneeId(task?.assignee_id ?? '');
    setErrors({});
  }

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setAssigneeId('');
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    const newErrors: { title?: string; dueDate?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    // Validate due date is not in the past
    if (dueDate && dueDate < today) {
      newErrors.dueDate = 'Ngày hạn chót không được nhỏ hơn ngày hiện tại';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: CreateTaskRequest | UpdateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      ...(canAssign && assigneeId ? { assignee_id: assigneeId } : {}),
    };

    onSubmit(data);
  };

  const priorityOptions = Object.entries(PRIORITY_LABEL).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Sửa công việc' : 'Tạo công việc mới'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Lưu' : 'Tạo công việc'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Tiêu đề"
          placeholder="Nhập tiêu đề công việc"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({});
          }}
          error={errors.title}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface font-semibold">
            Mô tả
          </label>
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none"
            placeholder="Nhập mô tả công việc..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Select
          label="Mức độ ưu tiên"
          options={priorityOptions}
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        />

        <Input
          label="Hạn chót"
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => {
            setDueDate(e.target.value);
            if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
          }}
          error={errors.dueDate}
        />

        {canAssign && (
          <Select
            label="Người thực hiện"
            hint="Để trống nếu chưa giao cho ai."
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            onClear={() => setAssigneeId('')}
            options={[
              { value: '', label: 'Chưa giao' },
              ...(members ?? []).map((member) => ({
                value: member.user_id,
                label: member.user.full_name || member.user.username,
              })),
            ]}
          />
        )}
      </div>
    </Modal>
  );
}
