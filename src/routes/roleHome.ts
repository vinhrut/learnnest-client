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

export function tasksPathForUser(user: AuthUser | null | undefined): string | null {
  if (!user) return null;
  if (hasRole(user, 'ADMIN')) return null;
  if (hasRole(user, 'LEAD')) return '/leader/tasks';
  if (hasRole(user, 'BA')) return '/ba/tasks';
  if (hasRole(user, 'USER')) return '/dev/tasks';
  return null;
}

export function notificationTargetPath(
  user: AuthUser | null | undefined,
  taskId: string | null | undefined,
): string {
  const tasksPath = tasksPathForUser(user);
  if (!tasksPath) return homePathForUser(user);
  return taskId ? `${tasksPath}?task=${taskId}` : tasksPath;
}
