export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'APPROVAL_REQUEST'
  | 'APPROVAL_APPROVED'
  | 'APPROVAL_REJECTED'
  | 'STATUS_CHANGED'
  | 'TASK_DUE'
  | 'SYSTEM'
  | 'ACCOUNT_CREATED'
  | 'ACCOUNT_UPDATED'
  | 'PROJECT_MEMBER_ADDED'
  | 'DEADLINE_EXTENSION_REQUEST'
  | 'DEADLINE_EXTENSION_APPROVED'
  | 'DEADLINE_EXTENSION_REJECTED';

/** Thông báo về tài khoản người dùng — điều hướng tới trang Hồ sơ cá nhân. */
export const ACCOUNT_NOTIFICATION_TYPES: NotificationType[] = [
  'ACCOUNT_CREATED',
  'ACCOUNT_UPDATED',
];

/** Thông báo về dự án — điều hướng tới trang chi tiết dự án. */
export const PROJECT_NOTIFICATION_TYPES: NotificationType[] = [
  'PROJECT_MEMBER_ADDED',
];

export interface NotificationItem {
  id: string;
  user_id: string;
  task_id: string | null;
  project_id: string | null;
  type: NotificationType;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}
