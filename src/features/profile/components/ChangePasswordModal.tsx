import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { toast } from '@/components/ui/toast';
import { useChangePasswordMutation } from '@/hooks/queries/auth.queries';
import { firstErrorMessage } from '@/lib/errors';

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const change = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!currentPassword) next.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (newPassword.length < 8) next.newPassword = 'Tối thiểu 8 ký tự';
    if (newPassword && newPassword === currentPassword)
      next.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    if (confirmNewPassword !== newPassword)
      next.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    change.mutate(
      { currentPassword, newPassword, confirmNewPassword },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          navigate('/login', { replace: true });
        },
        onError: (err) => toast.error(firstErrorMessage(err)),
      },
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Đổi mật khẩu"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={change.isPending}
          >
            Huỷ
          </Button>
          <Button type="submit" form="change-password-form" loading={change.isPending}>
            Đổi mật khẩu
          </Button>
        </>
      }
    >
      <form
        id="change-password-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        <p className="text-sm text-muted">
          Sau khi đổi mật khẩu, bạn sẽ bị đăng xuất khỏi mọi thiết bị và cần đăng
          nhập lại.
        </p>
        <PasswordInput
          label="Mật khẩu hiện tại"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
          required
        />
        <PasswordInput
          label="Mật khẩu mới"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
          hint="Tối thiểu 8 ký tự"
          required
        />
        <PasswordInput
          label="Xác nhận mật khẩu mới"
          autoComplete="new-password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={errors.confirmNewPassword}
          required
        />
      </form>
    </Modal>
  );
}
