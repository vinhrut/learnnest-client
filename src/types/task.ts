export type TaskStatus = 'DRAFT' | 'TODO' | 'IN_PROGRESS' | 'DONE';

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

/** Approval status for task workflow */
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  approval_status: ApprovalStatus;
  project_id: string;
  assignee_id: string;
  creator_id: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  assignee?: TaskAssignee;
  creator?: TaskCreator;
  project?: TaskProject;
  subtasks?: SubTask[];
  comments?: Comment[];
  rejection_reason?: string | null;
}

export interface TaskAssignee {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface TaskCreator {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface TaskProject {
  id: string;
  name: string;
  code: string;
}

export interface SubTask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: CommentUser;
}

export interface CommentUser {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string;
  assignee_id?: string;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: string;
  due_date?: string;
}

export interface SubmitTaskRequest {
  task_id: string;
}

export interface ApproveTaskRequest {
  task_id: string;
}

export interface RejectTaskRequest {
  task_id: string;
  reason: string;
}

// Query params for task list
export interface TaskFilters {
  project_id?: string;
  assignee_id?: string;
  status?: TaskStatus;
  approval_status?: ApprovalStatus;
  search?: string;
}

// Status configs
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  DRAFT: 'Bản nháp',
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang làm',
  DONE: 'Đã xong',
};

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  DRAFT: {
    label: 'Bản nháp',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-variant',
  },
  TODO: {
    label: 'Cần làm',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-variant',
  },
  IN_PROGRESS: {
    label: 'Đang làm',
    color: 'text-primary',
    bgColor: 'bg-primary-fixed',
  },
  DONE: {
    label: 'Đã xong',
    color: 'text-success',
    bgColor: 'bg-success-soft',
  },
};

// Priority configs
export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: 'Cao',
  MEDIUM: 'Trung bình',
  LOW: 'Thấp',
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  HIGH: {
    label: 'Cao',
    color: 'text-danger',
    bgColor: 'bg-error-container',
    icon: 'keyboard_double_arrow_up',
  },
  MEDIUM: {
    label: 'Trung bình',
    color: 'text-warning',
    bgColor: 'bg-tertiary-fixed',
    icon: 'drag_handle',
  },
  LOW: {
    label: 'Thấp',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-container-high',
    icon: 'keyboard_arrow_down',
  },
};

// Approval status configs
export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

export const APPROVAL_STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: 'Chờ duyệt',
    color: 'text-warning',
    bgColor: 'bg-warning-soft',
  },
  APPROVED: {
    label: 'Đã duyệt',
    color: 'text-success',
    bgColor: 'bg-success-soft',
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'text-danger',
    bgColor: 'bg-error-container',
  },
};
