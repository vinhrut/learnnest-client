import { api } from '@/lib/axios';
import type {
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RefreshResponse,
  ResetPasswordRequest,
} from '@/types/auth';

export const authApi = {
  login: (payload: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api
      .post<RefreshResponse>('/auth/refresh', { refreshToken })
      .then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post<{ success: boolean }>('/auth/logout', { refreshToken }).then(
      (r) => r.data,
    ),

  me: () => api.get<AuthUser>('/auth/me').then((r) => r.data),

  forgotPassword: (payload: ForgotPasswordRequest) =>
    api
      .post<MessageResponse>('/auth/forgot-password', payload)
      .then((r) => r.data),

  resetPassword: (payload: ResetPasswordRequest) =>
    api
      .post<MessageResponse>('/auth/reset-password', payload)
      .then((r) => r.data),

  changePassword: (payload: ChangePasswordRequest) =>
    api
      .post<MessageResponse>('/auth/change-password', payload)
      .then((r) => r.data),
};
