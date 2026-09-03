import { hasRole } from '@/stores/auth.store';
import type { AuthUser } from '@/types/auth';
import {
  ACCOUNT_NOTIFICATION_TYPES,
  PROJECT_NOTIFICATION_TYPES,
} from '@/types/notification';

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

export function projectsPathForUser(
  user: AuthUser | null | undefined,
): string | null {
  if (!user) return null;
  if (hasRole(user, 'ADMIN')) return null; // ADMIN không có màn hình dự án
  if (hasRole(user, 'LEAD')) return '/leader/projects';
  if (hasRole(user, 'BA')) return '/ba/projects';
  if (hasRole(user, 'USER')) return '/dev/projects';
  return null;
}

export function projectDetailPathForUser(
  user: AuthUser | null | undefined,
  projectId: string,
): string | null {
  const base = projectsPathForUser(user);
  return base ? `${base}/${projectId}` : null;
}

export function profilePathForUser(user: AuthUser | null | undefined): string {
  if (!user) return '/login';
  if (hasRole(user, 'ADMIN')) return '/admin/profile';
  if (hasRole(user, 'LEAD')) return '/leader/profile';
  if (hasRole(user, 'BA')) return '/ba/profile';
  if (hasRole(user, 'USER')) return '/dev/profile';
  return '/login';
}

export interface NotificationTarget {
  type: string;
  taskId?: string | null;
  projectId?: string | null;
}

/**
 * Đích điều hướng khi bấm vào một thông báo — theo LOẠI thông báo:
 * - Tài khoản (tạo mới / cập nhật thông tin / đổi mật khẩu) -> Hồ sơ cá nhân
 * - Dự án (được thêm vào dự án) -> chi tiết dự án (fallback: danh sách dự án)
 * - Còn lại, nếu có task -> deep-link mở task
 * - Không xác định -> trang chủ theo role
 */
export function notificationTargetPath(
  user: AuthUser | null | undefined,
  notification: NotificationTarget,
): string {
  const { type, taskId, projectId } = notification;

  if ((ACCOUNT_NOTIFICATION_TYPES as string[]).includes(type)) {
    return profilePathForUser(user);
  }

  if ((PROJECT_NOTIFICATION_TYPES as string[]).includes(type)) {
    const detail = projectId ? projectDetailPathForUser(user, projectId) : null;
    return detail ?? projectsPathForUser(user) ?? homePathForUser(user);
  }

  if (taskId) {
    const tasksPath = tasksPathForUser(user);
    return tasksPath ? `${tasksPath}?task=${taskId}` : homePathForUser(user);
  }

  return homePathForUser(user);
}
