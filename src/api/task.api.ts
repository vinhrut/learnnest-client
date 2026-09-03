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
  TaskExtensionRequest,
  CreateExtensionRequest,
  ApproveExtensionRequest,
  RejectExtensionRequest,
} from '@/types/task';

export const taskApi = {
  getTasks: (params?: TaskFilters) =>
    api.get<Task[]>('/tasks', { params }).then((r) => r.data),

  getTasksByProject: (projectId: string) =>
    api.get<Task[]>(`/tasks/project/${projectId}`).then((r) => r.data),

  getTask: (id: string) =>
    api.get<Task>(`/tasks/${id}`).then((r) => r.data),

  createTask: (projectId: string, payload: CreateTaskRequest) =>
    api.post<Task>(`/tasks/project/${projectId}`, payload).then((r) => r.data),

  updateTask: (id: string, payload: UpdateTaskRequest) =>
    api.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),

  updateTaskStatus: (id: string, payload: UpdateTaskStatusRequest) =>
    api.patch<Task>(`/tasks/${id}/status`, payload).then((r) => r.data),

  deleteTask: (id: string) =>
    api.delete(`/tasks/${id}`).then((r) => r.data),

  submitTask: (payload: SubmitTaskRequest) =>
    api.post<Task>('/tasks/submit', payload).then((r) => r.data),

  approveTask: (payload: ApproveTaskRequest) =>
    api.post<Task>('/tasks/approve', payload).then((r) => r.data),

  rejectTask: (payload: RejectTaskRequest) =>
    api.post<Task>('/tasks/reject', payload).then((r) => r.data),

  getExtensionRequests: (taskId: string) =>
    api
      .get<TaskExtensionRequest[]>(`/task-extensions/task/${taskId}`)
      .then((r) => r.data),

  createExtensionRequest: (payload: CreateExtensionRequest) =>
    api
      .post<TaskExtensionRequest>('/task-extensions', payload)
      .then((r) => r.data),

  approveExtensionRequest: (payload: ApproveExtensionRequest) =>
    api
      .post<TaskExtensionRequest>('/task-extensions/approve', payload)
      .then((r) => r.data),

  rejectExtensionRequest: (payload: RejectExtensionRequest) =>
    api
      .post<TaskExtensionRequest>('/task-extensions/reject', payload)
      .then((r) => r.data),
};
