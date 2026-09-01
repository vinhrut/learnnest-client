// Map BE enum to FE (for UI display)
export type TaskStatus = 'DRAFT' | 'WAITING_APPROVAL' | 'NEW' | 'DOING' | 'DONE' | 'CLOSED' | 'REJECTED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ApprovalStatus = 'NOT_ASSIGNED' | 'WAITING_APPROVAL' | 'APPROVED' | 'ASSIGNED' | 'REJECTED' | 'CANCELLED';

// Map to BE enum
export type TaskStatusBE = 'DRAFT' | 'WAITING_APPROVAL' | 'NEW' | 'DOING' | 'DONE' | 'CLOSED' | 'REJECTED';
export type TaskPriorityBE = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ApprovalStatusBE = 'NOT_ASSIGNED' | 'WAITING_APPROVAL' | 'APPROVED' | 'ASSIGNED' | 'REJECTED' | 'CANCELLED';

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignment_status: ApprovalStatus;
  project_id: string;
  assignee_id: string | null;
  creator_id: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: TaskAssignee;
  creator?: TaskCreator;
  project?: TaskProject;
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

export interface ProjectOption {
  id: string;
  name: string;
  code: string;
}

// Task Card (for vinh's task-vinh API)
interface TaskPerson {
  id: string;
  full_name: string | null;
  email: string;
}

export interface TaskCard {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignmentStatus: string;
  dueDate: string | null;
  createdAt: string;
  project: ProjectOption | null;
  assignee: TaskPerson | null;
  assigner: TaskPerson | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriorityBE;
  project_id?: string;
  assignee_id?: string;
  due_date?: string;
}

// Vinh's CreateTaskRequest for task-vinh API
export interface CreateTaskVinhRequest {
  projectId: string;
  assigneeId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriorityBE;
  assignee_id?: string;
  due_date?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatusBE;
}

export interface SubmitTaskRequest {
  task_id: string;
}

export interface ApproveTaskRequest {
  task_id: string;
}

export interface RejectTaskRequest {
  task_id: string;
  reason?: string;
}

// Query params for task list
export interface TaskFilters {
  project_id?: string;
  assignee_id?: string;
  status?: TaskStatusBE;
  approval_status?: ApprovalStatusBE;
  search?: string;
}

// Status configs for UI
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  DRAFT: 'Nháp',
  WAITING_APPROVAL: 'Chờ duyệt',
  NEW: 'Mới',
  DOING: 'Đang làm',
  DONE: 'Hoàn thành',
  CLOSED: 'Đã đóng',
  REJECTED: 'Bị từ chối',
};

// Kanban board mapping (FE UI states)
export const KANBAN_BOARD_STATUS: Record<string, TaskStatus> = {
  TODO: 'NEW',
  IN_PROGRESS: 'DOING',
};

export const KANBAN_BOARD_STATUS_REVERSE: Record<TaskStatus, string> = {
  NEW: 'TODO',
  DOING: 'IN_PROGRESS',
  DRAFT: 'DRAFT',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  DONE: 'DONE',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
};

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  DRAFT: {
    label: 'Nháp',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-variant',
  },
  WAITING_APPROVAL: {
    label: 'Chờ duyệt',
    color: 'text-warning',
    bgColor: 'bg-warning-soft',
  },
  NEW: {
    label: 'Mới',
    color: 'text-primary',
    bgColor: 'bg-primary-fixed',
  },
  DOING: {
    label: 'Đang làm',
    color: 'text-primary',
    bgColor: 'bg-primary-container',
  },
  DONE: {
    label: 'Hoàn thành',
    color: 'text-success',
    bgColor: 'bg-success-soft',
  },
  CLOSED: {
    label: 'Đã đóng',
    color: 'text-success',
    bgColor: 'bg-success-container',
  },
  REJECTED: {
    label: 'Bị từ chối',
    color: 'text-danger',
    bgColor: 'bg-error-container',
  },
};

// Priority configs
export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
};

// Alias for backward compatibility
export const PRIORITY_LABEL = TASK_PRIORITY_LABEL;

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
    bgColor: 'bg-warning-soft',
    icon: 'drag_handle',
  },
  LOW: {
    label: 'Thấp',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-container-high',
    icon: 'keyboard_arrow_down',
  },
  URGENT: {
    label: 'Khẩn cấp',
    color: 'text-danger',
    bgColor: 'bg-error',
    icon: 'priority_high',
  },
};

// Approval status configs
export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  NOT_ASSIGNED: 'Chưa giao',
  WAITING_APPROVAL: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  ASSIGNED: 'Đã giao',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};

export const APPROVAL_STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; color: string; bgColor: string }
> = {
  NOT_ASSIGNED: {
    label: 'Chưa giao',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-variant',
  },
  WAITING_APPROVAL: {
    label: 'Chờ duyệt',
    color: 'text-warning',
    bgColor: 'bg-warning-soft',
  },
  APPROVED: {
    label: 'Đã duyệt',
    color: 'text-success',
    bgColor: 'bg-success-soft',
  },
  ASSIGNED: {
    label: 'Đã giao',
    color: 'text-primary',
    bgColor: 'bg-primary-container',
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'text-danger',
    bgColor: 'bg-error-container',
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'text-on-surface-variant',
    bgColor: 'bg-surface-variant',
  },
};

/** Payload backend đẩy qua socket event `notification` (namespace `/realtime`). */
export interface RealtimeNotification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  taskId: string | null;
  priority: TaskPriority | null;
  dueDate: string | null;
  createdAt: string;
}
