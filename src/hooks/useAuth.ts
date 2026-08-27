import { useEffect, useRef } from 'react';
import { authApi } from '@/api/auth.api';
import { hasRole as hasRoleFn, useAuthStore } from '@/stores/auth.store';
import type { RoleCode } from '@/types/user';

/**
 * Truy cập trạng thái phiên đăng nhập trong component.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  return {
    user,
    status,
    isAuthed: status === 'authed' && !!user,
    isAdmin: hasRoleFn(user, 'ADMIN'),
    hasRole: (...codes: RoleCode[]) => hasRoleFn(user, ...codes),
  };
}

/**
 * Xác thực lại phiên đã lưu khi app khởi động (gọi /auth/me).
 * Gắn một lần ở component gốc.
 */
export function useBootstrapAuth() {
  const status = useAuthStore((s) => s.status);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || status !== 'idle') return;
    started.current = true;

    const { refreshToken, setUser, setStatus, clearSession } =
      useAuthStore.getState();

    if (!refreshToken) {
      setStatus('guest');
      return;
    }

    setStatus('loading');
    authApi
      .me()
      .then((user) => {
        setUser(user);
        setStatus('authed');
      })
      .catch(() => {
        clearSession();
      });
  }, [status]);

  return status;
}
