import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui/PageLoading';
import type { RoleCode } from '@/types/user';

interface ProtectedRouteProps {
  requiredRoles?: RoleCode[];
  children?: ReactNode;
}

export function ProtectedRoute({
  requiredRoles,
  children,
}: ProtectedRouteProps) {
  const { status, isAuthed, hasRole } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return <PageLoading />;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(...requiredRoles)) {
    return <Navigate to="/403" replace />;
  }

  return children ?? <Outlet />;
}
