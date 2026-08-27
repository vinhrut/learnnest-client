import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { toast } from '@/components/ui/toast';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/hooks/queries/auth.queries';
import { firstErrorMessage } from '@/lib/errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN = 60;

type Step = 'request' | 'reset';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const requestOtp = useForgotPasswordMutation();
  const reset = useResetPasswordMutation();

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && timerRef.current) clearInterval(timerRef.current);
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const submitRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }
    setErrors({});
    requestOtp.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setStep('reset');
          startCooldown();
        },
        onError: (err) => toast.error(firstErrorMessage(err)),
      },
    );
  };

  const resend = () => {
    if (cooldown > 0) return;
    requestOtp.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          startCooldown();
        },
        onError: (err) => toast.error(firstErrorMessage(err)),
      },
    );
  };

  const submitReset = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (code.trim().length !== 6) next.code = 'Mã gồm 6 chữ số';
    if (newPassword.length < 8) next.newPassword = 'Tối thiểu 8 ký tự';
    if (confirmNewPassword !== newPassword)
      next.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    reset.mutate(
      {
        email: email.trim(),
        code: code.trim(),
        newPassword,
        confirmNewPassword,
      },
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
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-ink">Quên mật khẩu</h2>
        <p className="mt-1 text-sm text-muted">
          {step === 'request'
            ? 'Nhập email tài khoản, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.'
            : `Nhập mã xác nhận đã gửi tới ${email} và mật khẩu mới của bạn.`}
        </p>
      </div>

      {step === 'request' ? (
        <form className="flex flex-col gap-4" onSubmit={submitRequest} noValidate>
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="ban@congty.com"
            autoComplete="email"
            leftIcon={<FiMail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />
          <Button
            type="submit"
            loading={requestOtp.isPending}
            className="mt-2 w-full"
          >
            Gửi mã xác nhận
          </Button>
        </form>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={submitReset} noValidate>
          <Input
            id="code"
            label="Mã xác nhận"
            placeholder="6 chữ số"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            error={errors.code}
            hint={
              cooldown > 0
                ? `Có thể gửi lại mã sau ${cooldown}s`
                : undefined
            }
            required
          />
          <PasswordInput
            id="newPassword"
            label="Mật khẩu mới"
            placeholder="••••••••"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            hint="Tối thiểu 8 ký tự"
            required
          />
          <PasswordInput
            id="confirmNewPassword"
            label="Xác nhận mật khẩu mới"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            error={errors.confirmNewPassword}
            required
          />

          <Button
            type="submit"
            loading={reset.isPending}
            className="mt-2 w-full"
          >
            Đặt lại mật khẩu
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="font-medium text-muted hover:text-ink"
              onClick={() => {
                setStep('request');
                setErrors({});
              }}
            >
              Đổi email
            </button>
            <button
              type="button"
              className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted/60 disabled:no-underline"
              onClick={resend}
              disabled={cooldown > 0 || requestOtp.isPending}
            >
              {cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : 'Gửi lại mã'}
            </button>
          </div>
        </form>
      )}

      <Link
        to="/login"
        className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <FiArrowLeft className="h-4 w-4" />
        Quay lại đăng nhập
      </Link>
    </div>
  );
}
