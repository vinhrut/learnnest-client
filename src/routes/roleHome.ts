import { hasRole } from '@/stores/auth.store';
import type { AuthUser } from '@/types/auth';

export function homePathForUser(user: AuthUser | null | undefined): string {
  if (!user) return '/login';
  if (hasRole(user, 'ADMIN')) return '/admin/users';
  if (hasRole(user, 'LEAD')) return '/leader/dashboard';
  if (hasRole(user, 'BA')) return '/ba/dashboard';
  if (hasRole(user, 'USER')) return '/dev/dashboard';
  return '/login';
}
