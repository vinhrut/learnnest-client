import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { toast } from '@/components/ui/toast';
import { useLoginMutation } from '@/hooks/auth/auth.queries';
import { firstErrorMessage } from '@/lib/errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Email không hợp lệ';
    if (!password) nextErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    login.mutate(
      { email: email.trim(), password, remember },
      {
        onSuccess: () => navigate('/dashboard', { replace: true }),
        onError: (err) => toast.error(firstErrorMessage(err)),
      },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-ink">Đăng nhập</h2>
        <p className="mt-1 text-sm text-muted">
          Dùng email và mật khẩu được cấp để vào hệ thống.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
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

        <PasswordInput
          id="password"
          label="Mật khẩu"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-line accent-primary"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Ghi nhớ đăng nhập
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" loading={login.isPending} className="mt-2 w-full">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
