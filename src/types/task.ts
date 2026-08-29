export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus =
  | 'DRAFT'
  | 'WAITING_APPROVAL'
  | 'NEW'
  | 'DOING'
  | 'DONE'
  | 'CLOSED'
  | 'REJECTED';

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  DRAFT: 'Nháp',
  WAITING_APPROVAL: 'Chờ duyệt',
  NEW: 'Mới',
  DOING: 'Đang làm',
  DONE: 'Hoàn thành',
  CLOSED: 'Đã đóng',
  REJECTED: 'Bị từ chối',
};

export interface ProjectOption {
  id: string;
  name: string;
  code: string;
}

interface TaskPerson {
  id: string;
  full_name: string | null;
  email: string;
}

/** Card mà backend `task-vinh` trả về (POST /task-vinh, GET /task-vinh/*). */
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
  projectId: string;
  assigneeId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

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
