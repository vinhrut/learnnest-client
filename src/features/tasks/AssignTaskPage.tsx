import { useMemo, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Field } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/toast';
import { firstErrorMessage } from '@/lib/errors';
import { useUsersQuery } from '@/hooks/queries/users.queries';
import {
  useCreateTask,
  useProjectOptionsQuery,
} from '@/hooks/queries/tasks.queries';
import {
  TASK_PRIORITY_LABEL,
  type CreateTaskRequest,
  type TaskPriority,
} from '@/types/task';

const PRIORITY_OPTIONS = (
  Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]
).map((value) => ({ value, label: TASK_PRIORITY_LABEL[value] }));

interface FormState {
  projectId: string;
  assigneeId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

const EMPTY: FormState = {
  projectId: '',
  assigneeId: '',
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
};

export function AssignTaskPage() {
  const projectsQuery = useProjectOptionsQuery();
  const usersQuery = useUsersQuery({ page: 1, limit: 100, status: 'ACTIVE' });
  const createTask = useCreateTask();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const projectOptions = useMemo(
    () =>
      (projectsQuery.data ?? []).map((p) => ({
        value: p.id,
        label: `${p.code} — ${p.name}`,
      })),
    [projectsQuery.data],
  );

  const userOptions = useMemo(
    () =>
      (usersQuery.data?.data ?? []).map((u) => ({
        value: u.id,
        label: u.full_name ? `${u.full_name} (${u.email})` : u.email,
      })),
    [usersQuery.data],
  );

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.projectId) e.projectId = 'Chọn dự án';
    if (!form.assigneeId) e.assigneeId = 'Chọn người được giao';
    if (form.title.trim().length < 3) e.title = 'Tối thiểu 3 ký tự';
    if (form.title.trim().length > 255) e.title = 'Tối đa 255 ký tự';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload: CreateTaskRequest = {
      projectId: form.projectId,
      assigneeId: form.assigneeId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      dueDate: form.dueDate
        ? new Date(form.dueDate).toISOString()
        : undefined,
    };

    createTask.mutate(payload, {
      onSuccess: (task) => {
        toast.success(`Đã giao việc "${task.title}"`);
        setForm((f) => ({ ...f, title: '', description: '', dueDate: '' }));
        setErrors({});
      },
      onError: (err) => toast.error(firstErrorMessage(err)),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Giao việc"
        subtitle="Tạo một công việc và giao thẳng cho người dùng. Người được giao sẽ nhận email và thông báo realtime."
      />

      <Card className="max-w-2xl">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Select
            label="Dự án"
            required
            placeholder={
              projectsQuery.isLoading ? 'Đang tải...' : '-- Chọn dự án --'
            }
            options={projectOptions}
            value={form.projectId}
            onChange={(e) => set('projectId', e.target.value)}
            error={errors.projectId}
          />

          <Select
            label="Người được giao"
            required
            placeholder={
              usersQuery.isLoading ? 'Đang tải...' : '-- Chọn người dùng --'
            }
            options={userOptions}
            value={form.assigneeId}
            onChange={(e) => set('assigneeId', e.target.value)}
            error={errors.assigneeId}
          />

          <Input
            label="Tiêu đề công việc"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            error={errors.title}
            placeholder="Ví dụ: Viết tài liệu API"
          />

          <Field label="Mô tả" htmlFor="task-desc">
            <textarea
              id="task-desc"
              className="min-h-[96px] w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Độ ưu tiên"
              options={PRIORITY_OPTIONS}
              value={form.priority}
              onChange={(e) => set('priority', e.target.value as TaskPriority)}
            />
            <Input
              label="Hạn hoàn thành"
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" loading={createTask.isPending}>
              Giao việc
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
