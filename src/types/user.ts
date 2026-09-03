export type RoleCode = 'ADMIN' | 'BA' | 'USER' | 'LEAD';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';

export const ROLE_CODES: RoleCode[] = ['ADMIN', 'BA', 'USER', 'LEAD'];

export const ROLE_LABEL: Record<RoleCode, string> = {
  ADMIN: 'Quản trị',
  BA: 'BA',
  USER: 'Lập trình viên',
  LEAD: 'Leader',
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngưng hoạt động',
  LOCKED: 'Đã khoá',
};

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: UserStatus;
  roles: RoleCode[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type SortOrder = 'asc' | 'desc';

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  role?: RoleCode;
  order?: SortOrder;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  roleCodes?: RoleCode[];
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  password?: string;
  username?: string;
  email?: string;
  status?: UserStatus;
  roleCodes?: RoleCode[];
}
