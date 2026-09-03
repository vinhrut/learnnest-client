import type { TaskStatus } from './task';

export interface DashboardOverview {
  totalTasks: number;
  status: Record<'new' | 'doing' | 'done' | 'closed' | 'draft' | 'waitingApproval' | 'rejected', number>;
  priority: Record<'low' | 'medium' | 'high' | 'urgent', number>;
  deadline: {
    overdue: number;
    dueSoon: number;
  };
}

export type HistoryAction =
  | 'CREATED'
  | 'UPDATED'
  | 'ASSIGNED'
  | 'REASSIGNED'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'STATUS_CHANGED'
  | 'COMMENTED'
  | 'CLOSED';

export interface TaskHistoryItem {
  id: string;
  task_id: string;
  actor_id: string;
  action: HistoryAction;
  old_status: TaskStatus | null;
  new_status: TaskStatus | null;
  old_assignee_id: string | null;
  new_assignee_id: string | null;
  old_assigner_id: string | null;
  new_assigner_id: string | null;
  comment: string | null;
  metadata: unknown;
  created_at: string;
}

export const HISTORY_ACTION_LABEL: Record<HistoryAction, string> = {
  CREATED: 'Tao moi',
  UPDATED: 'Cap nhat',
  ASSIGNED: 'Giao viec',
  REASSIGNED: 'Giao lai',
  SUBMITTED: 'Gui duyet',
  APPROVED: 'Phe duyet',
  REJECTED: 'Tu choi',
  STATUS_CHANGED: 'Doi trang thai',
  COMMENTED: 'Binh luan',
  CLOSED: 'Dong task',
};
