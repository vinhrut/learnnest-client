import { useState, type FormEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/toast';
import { useUpdateMyProfile } from '@/hooks/queries/profile.queries';
import { errorMessages } from '@/lib/errors';
import type { User } from '@/types/user';

interface FormState {
  full_name: string;
  phone: string;
  avatar_url: string;
}

function initial(user: User): FormState {
  return {
    full_name: user.full_name ?? '',
    phone: user.phone ?? '',
    avatar_url: user.avatar_url ?? '',
  };
}

/** Form sửa thông tin cá nhân (chỉ các trường non-admin được backend cho phép). */
export function ProfileForm({ user }: { user: User }) {
  const update = useUpdateMyProfile();
  const [form, setForm] = useState<FormState>(() => initial(user));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const dirty =
    form.full_name !== (user.full_name ?? '') ||
    form.phone !== (user.phone ?? '') ||
    form.avatar_url !== (user.avatar_url ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    update.mutate(
      {
        full_name: form.full_name.trim() || undefined,
        phone: form.phone.trim() || undefined,
        avatar_url: form.avatar_url.trim() || undefined,
      },
      {
        onSuccess: () => toast.success('Đã cập nhật hồ sơ'),
        onError: (err) => errorMessages(err).forEach((m) => toast.error(m)),
      },
    );
  };

  return (
    <Card title="Thông tin cá nhân">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tên đăng nhập"
            value={user.username}
            disabled
            hint="Liên hệ quản trị viên để thay đổi"
          />
          <Input label="Email" value={user.email} disabled />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Họ và tên"
            value={form.full_name}
            onChange={(e) => set('full_name', e.target.value)}
          />
          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Ảnh đại diện (URL)"
              placeholder="https://..."
              value={form.avatar_url}
              onChange={(e) => set('avatar_url', e.target.value)}
            />
          </div>
          <Avatar
            src={form.avatar_url || null}
            name={form.full_name || user.username}
            size="lg"
            className="mb-1"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button
            variant="secondary"
            onClick={() => setForm(initial(user))}
            disabled={!dirty || update.isPending}
          >
            Hoàn tác
          </Button>
          <Button type="submit" loading={update.isPending} disabled={!dirty}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Card>
  );
}
