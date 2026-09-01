import type { RoleCode } from './user';

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type ProjectMemberRole = 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string | null;
  owner_id: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  project_role: ProjectMemberRole;
  joined_at: string;
  user: ProjectMemberUser;
}

export interface ProjectMemberUser {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface AvailableUser {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: RoleCode;
}

export interface CreateProjectRequest {
  name: string;
  code: string;
  description?: string;
  status?: ProjectStatus;
  member_ids?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface AddMemberRequest {
  user_id: string;
  project_role?: ProjectMemberRole;
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  PLANNING: 'Lên kế hoạch',
  ACTIVE: 'Đang chạy',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ',
};

export const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  PLANNING: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  ARCHIVED: 'bg-yellow-100 text-yellow-700',
};
