import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { FiCamera, FiLock, FiTrash2 } from 'react-icons/fi';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/toast';
import { RoleTags } from '@/components/feature/users/RoleTags';
import { UserStatusBadge } from '@/components/feature/users/UserStatusBadge';
import { useDeleteMyAvatar, useUploadMyAvatar } from '@/hooks/profile/profile.queries';
import { errorMessages } from '@/lib/errors';
import { IMAGE_ACCEPT, MAX_AVATAR_SIZE, formatFileSize, validateImageFile } from '@/lib/upload';
import type { User } from '@/types/user';

export function ProfileHero({
  user,
  onChangePassword,
}: {
  user: User;
  onChangePassword: () => void;
}) {
  const uploadAvatar = useUploadMyAvatar();
  const deleteAvatar = useDeleteMyAvatar();

  const [preview, setPreview] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thu hồi object URL của ảnh xem trước để không rò rỉ bộ nhớ.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

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
      onSuccess: () => {
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
  const hasAvatar = !!user.avatar_url;
  const name = user.full_name || user.username;

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
      <div className="h-28 bg-gradient-to-r from-primary to-primary-container sm:h-32" />

      <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="relative -mt-12 shrink-0">
            <Avatar
              src={preview ?? (user.avatar_url || null)}
              name={name}
              size="xl"
              className="ring-4 ring-surface-container-lowest"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              title={`Tải ảnh đại diện lên · JPG, PNG, WEBP hoặc GIF · tối đa ${formatFileSize(MAX_AVATAR_SIZE)}`}
              aria-label="Tải ảnh đại diện lên"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant shadow-sm transition-all duration-150 hover:bg-surface-container active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadAvatar.isPending ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <FiCamera className="text-base" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="min-w-0 sm:pb-1">
            <h1 className="truncate text-headline-md text-on-surface">{name}</h1>
            <p className="truncate text-body-md text-on-surface-variant">@{user.username}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <RoleTags roles={user.roles} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1.5 sm:items-end">
          <div className="flex flex-wrap items-center justify-center gap-2">
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
      </div>

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
    </div>
  );
}
