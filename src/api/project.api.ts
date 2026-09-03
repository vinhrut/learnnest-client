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
  getProjects: () => api.get<Project[]>('/projects').then((r) => r.data),

  getProject: (id: string) =>
    api.get<Project>(`/projects/${id}`).then((r) => r.data),

  createProject: (payload: CreateProjectRequest) =>
    api.post<Project>('/projects', payload).then((r) => r.data),

  updateProject: (id: string, payload: UpdateProjectRequest) =>
    api.patch<Project>(`/projects/${id}`, payload).then((r) => r.data),

  getMembers: (projectId: string) =>
    api.get<ProjectMember[]>(`/projects/${projectId}/members`).then((r) => r.data),

  getAvailableUsers: (projectId: string) =>
    api.get<AvailableUser[]>(`/projects/${projectId}/available-users`).then((r) => r.data),

  addMember: (projectId: string, payload: AddMemberRequest) =>
    api.post<ProjectMember>(`/projects/${projectId}/members`, payload).then((r) => r.data),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`).then((r) => r.data),
};
