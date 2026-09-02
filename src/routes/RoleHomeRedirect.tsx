import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui/PageLoading';
import { homePathForUser } from './roleHome';

export function RoleHome() {
  const { status, user, isAuthed } = useAuth();

  if (status === 'idle' || status === 'loading') {
    return <PageLoading />;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={homePathForUser(user)} replace />;
}
