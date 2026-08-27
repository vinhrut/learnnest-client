import type { RoleCode, UserStatus } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User rút gọn trả về từ /auth/login và /auth/me.
 * (Backend đã bổ sung `roles` vào cả hai response.)
 */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  status: UserStatus;
  roles: RoleCode[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface MessageResponse {
  message: string;
}
