import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import { PRIORITY_LABEL, TASK_STATUS_LABEL } from '@/types/task';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  task?: Task;
  loading?: boolean;
}

export function TaskForm({ open, onClose, onSubmit, task, loading }: TaskFormProps) {
  const isEdit = !!task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('DRAFT');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('DRAFT');
      setDueDate('');
    }
    setErrors({});
  }, [task, open]);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setStatus('DRAFT');
    setDueDate('');
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    // Validate
    if (!title.trim()) {
      setErrors({ title: 'Tiêu đề là bắt buộc' });
      return;
    }

    const data: CreateTaskRequest | UpdateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority: priority as any,
      status: status as any,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    onSubmit(data);
  };

  const priorityOptions = Object.entries(PRIORITY_LABEL).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(TASK_STATUS_LABEL).map(([value, label]) => ({
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
        {/* Title */}
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

        {/* Description */}
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

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Mức độ ưu tiên"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
          <Select
            label="Trạng thái"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        {/* Due Date */}
        <Input
          label="Hạn chót"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </Modal>
  );
}
