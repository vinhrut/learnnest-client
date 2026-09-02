import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { RoleCode } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui/PageLoading';
import { homePathForUser } from './roleHome';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: RoleCode[];
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { status, user, isAuthed, hasRole } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return <PageLoading />;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(...allowedRoles)) {
    return <Navigate to={homePathForUser(user)} replace />;
  }

  return <>{children}</>;
}
