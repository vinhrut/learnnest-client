import { api } from '@/lib/axios';
import type {
  Project,
  ProjectMember,
  AvailableUser,
  CreateProjectRequest,
  UpdateProjectRequest,
  AddMemberRequest,
} from '@/types/project';

export const projectApi = {
  /** Lấy danh sách project của user hiện tại */
  getProjects: () => api.get<Project[]>('/projects').then((r) => r.data),

  /** Lấy chi tiết một project */
  getProject: (id: string) =>
    api.get<Project>(`/projects/${id}`).then((r) => r.data),

  /** Tạo project mới (chỉ LEAD) */
  createProject: (payload: CreateProjectRequest) =>
    api.post<Project>('/projects', payload).then((r) => r.data),

  /** Cập nhật project (chỉ owner) */
  updateProject: (id: string, payload: UpdateProjectRequest) =>
    api.patch<Project>(`/projects/${id}`, payload).then((r) => r.data),

  /** Xóa project (chỉ owner) */
  deleteProject: (id: string) =>
    api.delete(`/projects/${id}`).then((r) => r.data),

  /** Lấy danh sách members của project */
  getMembers: (projectId: string) =>
    api.get<ProjectMember[]>(`/projects/${projectId}/members`).then((r) => r.data),

  /** Lấy danh sách user có thể thêm vào project */
  getAvailableUsers: (projectId: string) =>
    api.get<AvailableUser[]>(`/projects/${projectId}/available-users`).then((r) => r.data),

  /** Thêm member vào project (chỉ owner) */
  addMember: (projectId: string, payload: AddMemberRequest) =>
    api.post<ProjectMember>(`/projects/${projectId}/members`, payload).then((r) => r.data),

  /** Xóa member khỏi project (chỉ owner) */
  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`).then((r) => r.data),
};
