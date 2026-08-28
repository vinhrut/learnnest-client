import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { RoleCode } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: RoleCode[];
  redirectTo?: string;
}

/**
 * Route bảo vệ theo role.
 * Nếu user không có role phù hợp → redirect.
 */
export function RoleRoute({
  children,
  allowedRoles,
  redirectTo = '/',
}: RoleRouteProps) {
  const { hasRole, isAuthed } = useAuth();

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(...allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
