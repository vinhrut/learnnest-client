import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui/PageLoading';

/** Trang chỉ dành cho khách; đã đăng nhập thì đẩy về dashboard. */
export function GuestRoute() {
  const { status, isAuthed } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return <PageLoading />;
  }

  if (isAuthed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
