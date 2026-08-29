export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'APPROVAL_REQUEST'
  | 'APPROVAL_APPROVED'
  | 'APPROVAL_REJECTED'
  | 'STATUS_CHANGED'
  | 'TASK_DUE'
  | 'SYSTEM';

/** Bản ghi thông báo như backend trả về (GET /notifications). */
export interface NotificationItem {
  id: string;
  user_id: string;
  task_id: string | null;
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
