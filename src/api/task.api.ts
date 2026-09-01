import { api } from '@/lib/axios';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskFilters,
  SubmitTaskRequest,
  ApproveTaskRequest,
  RejectTaskRequest,
} from '@/types/task';

export const taskApi = {
  /** Lấy danh sách task với filters */
  getTasks: (params?: TaskFilters) =>
    api.get<Task[]>('/tasks', { params }).then((r) => r.data),

  /** Lấy task theo project */
  getTasksByProject: (projectId: string) =>
    api.get<Task[]>(`/tasks/project/${projectId}`).then((r) => r.data),

  /** Lấy chi tiết một task */
  getTask: (id: string) =>
    api.get<Task>(`/tasks/${id}`).then((r) => r.data),

  /** Tạo task mới trong project */
  createTask: (projectId: string, payload: CreateTaskRequest) =>
    api.post<Task>(`/tasks/project/${projectId}`, payload).then((r) => r.data),

  /** Cập nhật task */
  updateTask: (id: string, payload: UpdateTaskRequest) =>
    api.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),

  /** Cập nhật status (Drag & Drop) */
  updateTaskStatus: (id: string, payload: UpdateTaskStatusRequest) =>
    api.patch<Task>(`/tasks/${id}/status`, payload).then((r) => r.data),

  /** Xóa task */
  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`).then((r) => r.data),

  /** Submit task để duyệt */
  submitTask: (payload: SubmitTaskRequest) =>
    api.post<Task>('/tasks/submit', payload).then((r) => r.data),

  /** Phê duyệt task (LEADER only) */
  approveTask: (payload: ApproveTaskRequest) =>
    api.post<Task>('/tasks/approve', payload).then((r) => r.data),

  /** Từ chối task (LEADER only) */
  rejectTask: (payload: RejectTaskRequest) =>
    api.post<Task>('/tasks/reject', payload).then((r) => r.data),
};
