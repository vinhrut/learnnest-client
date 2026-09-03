import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/toast';
import {
  useDeleteMyAvatar,
  useUpdateMyProfile,
  useUploadMyAvatar,
} from '@/hooks/profile/profile.queries';
import { errorMessages } from '@/lib/errors';
import { IMAGE_ACCEPT, MAX_AVATAR_SIZE, formatFileSize, validateImageFile } from '@/lib/upload';
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

export function ProfileForm({ user }: { user: User }) {
  const update = useUpdateMyProfile();
  const uploadAvatar = useUploadMyAvatar();
  const deleteAvatar = useDeleteMyAvatar();

  const [form, setForm] = useState<FormState>(() => initial(user));
  const [preview, setPreview] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thu hồi object URL của ảnh xem trước để không rò rỉ bộ nhớ.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset ngay để chọn lại đúng file vừa rồi vẫn kích hoạt onChange.
    e.target.value = '';
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setPreview(URL.createObjectURL(file));
    uploadAvatar.mutate(file, {
      onSuccess: (updated) => {
        set('avatar_url', updated.avatar_url ?? '');
        setPreview(null);
        toast.success('Đã cập nhật ảnh đại diện');
      },
      onError: (err) => {
        setPreview(null);
        errorMessages(err).forEach((m) => toast.error(m));
      },
    });
  };

  const handleDeleteAvatar = () => {
    deleteAvatar.mutate(undefined, {
      onSuccess: () => {
        set('avatar_url', '');
        setPreview(null);
        setConfirmDelete(false);
        toast.success('Đã xoá ảnh đại diện');
      },
      onError: (err) => {
        setConfirmDelete(false);
        errorMessages(err).forEach((m) => toast.error(m));
      },
    });
  };

  const busy = uploadAvatar.isPending || deleteAvatar.isPending;
  const hasAvatar = !!form.avatar_url;

  return (
    <Card title="Thông tin cá nhân">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
          <Avatar
            src={preview ?? (form.avatar_url || null)}
            name={form.full_name || user.username}
            size="xl"
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                leftIcon={<FiUpload />}
                onClick={() => fileInputRef.current?.click()}
                loading={uploadAvatar.isPending}
                disabled={busy}
              >
                Tải ảnh lên
              </Button>
              {hasAvatar && (
                <Button
                  variant="ghost"
                  leftIcon={<FiTrash2 />}
                  onClick={() => setConfirmDelete(true)}
                  disabled={busy}
                >
                  Xoá ảnh
                </Button>
              )}
            </div>
            <p className="text-label-md text-on-surface-variant">
              JPG, PNG, WEBP hoặc GIF · tối đa {formatFileSize(MAX_AVATAR_SIZE)}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

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

        <Input
          label="Ảnh đại diện (URL)"
          placeholder="https://..."
          hint="Hoặc dán trực tiếp đường dẫn ảnh có sẵn"
          value={form.avatar_url}
          onChange={(e) => set('avatar_url', e.target.value)}
        />

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

      <ConfirmDialog
        open={confirmDelete}
        title="Xoá ảnh đại diện"
        description="Ảnh đại diện hiện tại sẽ bị xoá khỏi tài khoản của bạn. Bạn có chắc chắn không?"
        confirmLabel="Xoá ảnh"
        danger
        loading={deleteAvatar.isPending}
        onConfirm={handleDeleteAvatar}
        onClose={() => setConfirmDelete(false)}
      />
    </Card>
  );
}
