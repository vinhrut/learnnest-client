export type RoleCode = 'ADMIN' | 'BA' | 'USER' | 'LEAD';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';

export const ROLE_CODES: RoleCode[] = ['ADMIN', 'BA', 'USER', 'LEAD'];

export const ROLE_LABEL: Record<RoleCode, string> = {
  ADMIN: 'Quản trị',
  BA: 'BA',
  USER: 'Người dùng',
  LEAD: 'Leader',
};

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngưng hoạt động',
  LOCKED: 'Đã khoá',
};

/**
 * User như backend trả về qua `sanitizeUser` (GET /users, POST /users, ...).
 */
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

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
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
  /** Các trường dưới đây backend chỉ cho ADMIN sửa. */
  username?: string;
  email?: string;
  status?: UserStatus;
  roleCodes?: RoleCode[];
}
