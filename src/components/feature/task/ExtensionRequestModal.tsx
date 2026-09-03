import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, Input, inputBaseClass } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import type { Task } from '@/types/task';

interface ExtensionRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { requested_due_date: string; reason: string }) => void;
  task: Task;
  loading?: boolean;
}

function toDateInputValue(iso: string | null): string {
  return iso ? iso.split('T')[0] : '';
}

export function ExtensionRequestModal({
  open,
  onClose,
  onSubmit,
  task,
  loading,
}: ExtensionRequestModalProps) {
  const [dueDate, setDueDate] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ dueDate?: string; reason?: string }>({});

  const currentDueDate = toDateInputValue(task.due_date);

  const handleSubmit = () => {
    const nextErrors: { dueDate?: string; reason?: string } = {};

    if (!dueDate) {
      nextErrors.dueDate = 'Vui lòng chọn hạn chót mới';
    } else if (task.due_date && new Date(dueDate) <= new Date(currentDueDate)) {
      nextErrors.dueDate = 'Ngày gia hạn phải sau hạn chót hiện tại';
    }

    if (reason.trim().length < 5) {
      nextErrors.reason = 'Lý do phải có ít nhất 5 ký tự';
    }

    if (nextErrors.dueDate || nextErrors.reason) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      requested_due_date: new Date(dueDate).toISOString(),
      reason: reason.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Xin gia hạn hạn chót"
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Gửi yêu cầu
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-surface-container px-3 py-2">
          <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
            Hạn chót hiện tại
          </span>
          <p className="text-body-md text-on-surface font-medium">
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Chưa có'}
          </p>
        </div>

        <Input
          label="Hạn chót mới"
          type="date"
          required
          min={currentDueDate || undefined}
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
          }}
          error={errors.dueDate}
        />

        <Field label="Lý do xin gia hạn" required error={errors.reason}>
          <textarea
            className={cn(
              inputBaseClass,
              'resize-none py-2',
              errors.reason ? 'border-error' : 'border-outline-variant',
            )}
            placeholder="Mô tả lý do cần dời hạn chót..."
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
            }}
          />
        </Field>
      </div>
    </Modal>
  );
}
