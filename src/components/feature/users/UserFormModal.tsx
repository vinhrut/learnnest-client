import { useState, type FormEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/toast';
import { useCreateUser, useUpdateUser } from '@/hooks/users/users.queries';
import { errorMessages, guessFieldErrors } from '@/lib/errors';
import {
  ROLE_CODES,
  ROLE_LABEL,
  USER_STATUS_LABEL,
  type CreateUserRequest,
  type RoleCode,
  type UpdateUserRequest,
  type User,
  type UserStatus,
} from '@/types/user';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  status: UserStatus;
  roleCodes: RoleCode[];
}

const EMPTY: FormState = {
  username: '',
  email: '',
  password: '',
  full_name: '',
  phone: '',
  avatar_url: '',
  status: 'ACTIVE',
  roleCodes: ['USER'],
};

const ROLE_OPTIONS = ROLE_CODES.map((r) => ({ value: r, label: ROLE_LABEL[r] }));
const STATUS_OPTIONS = (Object.keys(USER_STATUS_LABEL) as UserStatus[]).map(
  (s) => ({ value: s, label: USER_STATUS_LABEL[s] }),
);

function initialForm(user: User | null): FormState {
  if (!user) return EMPTY;
  return {
    username: user.username,
    email: user.email,
    password: '',
    full_name: user.full_name ?? '',
    phone: user.phone ?? '',
    avatar_url: user.avatar_url ?? '',
    status: user.status,
    roleCodes: user.roles,
  };
}

export function UserFormModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const isEdit = !!user;
  const create = useCreateUser();
  const update = useUpdateUser();

  const [form, setForm] = useState<FormState>(() => initialForm(user));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.username.trim().length < 3)
      e.username = 'Tối thiểu 3 ký tự';
    if (!EMAIL_RE.test(form.email)) e.email = 'Email không hợp lệ';
    if (!isEdit && form.password.length < 8)
      e.password = 'Tối thiểu 8 ký tự';
    if (isEdit && form.password && form.password.length < 8)
      e.password = 'Tối thiểu 8 ký tự';
    if (form.roleCodes.length === 0) e.roleCodes = 'Chọn ít nhất 1 vai trò';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleError = (err: unknown) => {
    const fieldErrors = guessFieldErrors(err);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    } else {
      errorMessages(err).forEach((m) => toast.error(m));
    }
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    if (isEdit && user) {
      const payload: UpdateUserRequest = {
        username: form.username.trim(),
        email: form.email.trim(),
        full_name: form.full_name.trim() || undefined,
        phone: form.phone.trim() || undefined,
        avatar_url: form.avatar_url.trim() || undefined,
        status: form.status,
        roleCodes: form.roleCodes,
      };
      if (form.password) payload.password = form.password;

      update.mutate(
        { id: user.id, payload },
        {
          onSuccess: () => {
            toast.success('Đã cập nhật người dùng');
            onClose();
          },
          onError: handleError,
        },
      );
      return;
    }

    const payload: CreateUserRequest = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      full_name: form.full_name.trim() || undefined,
      phone: form.phone.trim() || undefined,
      avatar_url: form.avatar_url.trim() || undefined,
      roleCodes: form.roleCodes,
    };
    create.mutate(payload, {
      onSuccess: () => {
        toast.success('Đã tạo user — email thông tin đăng nhập đã được gửi');
        onClose();
      },
      onError: handleError,
    });
  };

  const pending = create.isPending || update.isPending;

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? 'Sửa người dùng' : 'Thêm người dùng'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Huỷ
          </Button>
          <Button type="submit" form="user-form" loading={pending}>
            {isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
          </Button>
        </>
      }
    >
      <form
        id="user-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tên đăng nhập"
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            error={errors.username}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
            required
          />
        </div>

        <PasswordInput
          label={isEdit ? 'Mật khẩu mới' : 'Mật khẩu'}
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          error={errors.password}
          hint={isEdit ? 'Để trống nếu không đổi mật khẩu' : 'Tối thiểu 8 ký tự'}
          required={!isEdit}
        />

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
            name={form.full_name || form.username}
            size="lg"
            className="mb-1"
          />
        </div>

        {isEdit && (
          <Select
            label="Trạng thái"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(e) => set('status', e.target.value as UserStatus)}
          />
        )}

        <MultiSelect
          label="Vai trò"
          options={ROLE_OPTIONS}
          value={form.roleCodes}
          onChange={(v) => set('roleCodes', v)}
          error={errors.roleCodes}
          required
        />
      </form>
    </Modal>
  );
}
