import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FiCamera, FiTrash2 } from 'react-icons/fi';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/toast';
import {
  useCreateUser,
  useDeleteUserAvatar,
  useUpdateUser,
} from '@/hooks/users/users.queries';
import { uploadAvatarInBackground } from '@/hooks/users/avatarUpload';
import { errorMessages, guessFieldErrors } from '@/lib/errors';
import {
  IMAGE_ACCEPT,
  MAX_AVATAR_SIZE,
  formatFileSize,
  validateImageFile,
} from '@/lib/upload';
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
  const queryClient = useQueryClient();
  const create = useCreateUser();
  const update = useUpdateUser();
  const deleteAvatar = useDeleteUserAvatar();

  const [form, setForm] = useState<FormState>(() => initialForm(user));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  // Ảnh chọn từ máy: ở chế độ tạo mới phải giữ file tới lúc submit (chưa có id);
  // ở chế độ sửa thì upload ngay nên chỉ cần preview tạm.
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thu hồi object URL của ảnh xem trước để không rò rỉ bộ nhớ.
  useEffect(() => {
    if (!avatarPreview) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset ngay để chọn lại đúng file vừa rồi vẫn kích hoạt onChange.
    e.target.value = '';
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));

    if (isEdit && user) {
      // Sửa: upload ngầm, không chặn nút Lưu. Modal có thể đóng trước khi xong.
      set('avatar_url', '');
      setAvatarUploading(true);
      void uploadAvatarInBackground(queryClient, user.id, file, (updated) => {
        set('avatar_url', updated.avatar_url ?? '');
        setAvatarPreview(null);
      }).finally(() => setAvatarUploading(false));
    } else {
      // Tạo mới: chưa có id, giữ file tới khi tạo xong user.
      setAvatarFile(file);
    }
  };

  const handleDeleteAvatar = () => {
    if (!user) return;
    deleteAvatar.mutate(user.id, {
      onSuccess: () => {
        setAvatarPreview(null);
        setAvatarFile(null);
        set('avatar_url', '');
        toast.success('Đã xoá ảnh đại diện');
      },
      onError: (err) => errorMessages(err).forEach((m) => toast.error(m)),
    });
  };

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
      // Có file chọn từ máy thì upload sau khi tạo, không gửi URL text.
      avatar_url: avatarFile ? undefined : form.avatar_url.trim() || undefined,
      roleCodes: form.roleCodes,
    };
    create.mutate(payload, {
      onSuccess: (createdUser) => {
        // Upload ảnh ngầm sau khi có id — không giữ modal lại chờ.
        if (avatarFile) {
          void uploadAvatarInBackground(queryClient, createdUser.id, avatarFile);
        }
        toast.success('Đã tạo user — email thông tin đăng nhập đã được gửi');
        onClose();
      },
      onError: handleError,
    });
  };

  const pending =
    create.isPending || update.isPending || deleteAvatar.isPending;

  const previewSrc = avatarPreview ?? (form.avatar_url || null);
  const showRemoveAvatar = isEdit && !!user?.avatar_url;

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

        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar
              src={previewSrc}
              name={form.full_name || form.username}
              size="lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title={`Tải ảnh lên · JPG, PNG, WEBP hoặc GIF · tối đa ${formatFileSize(MAX_AVATAR_SIZE)}`}
              aria-label="Tải ảnh đại diện lên"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant shadow-sm transition-all duration-150 hover:bg-surface-container active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {avatarUploading ? (
                <Spinner className="h-3.5 w-3.5" />
              ) : (
                <FiCamera className="text-sm" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={handleAvatarFile}
            />
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <Input
              label="Ảnh đại diện (URL)"
              placeholder="https://... hoặc bấm biểu tượng máy ảnh để tải từ máy"
              value={form.avatar_url}
              onChange={(e) => set('avatar_url', e.target.value)}
            />
            {showRemoveAvatar && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={pending}
                className="inline-flex w-fit items-center gap-1 text-label-md text-error transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiTrash2 className="text-sm" /> Xoá ảnh đại diện
              </button>
            )}
          </div>
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
