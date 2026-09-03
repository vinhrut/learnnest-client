import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { authStore } from '@/stores/auth.store';
import { ApiError, type ApiErrorBody } from '@/types/api';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
});

const bare = axios.create({
  baseURL: env.apiBaseUrl,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function runRefresh(): Promise<string> {
  const { refreshToken } = authStore.getState();
  if (!refreshToken) throw new Error('no refresh token');

  const { data } = await bare.post<{
    accessToken: string;
    refreshToken: string;
  }>('/auth/refresh', { refreshToken });

  authStore.getState().setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data.accessToken;
}

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password')
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint(original.url)
    ) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? runRefresh();
        const newToken = await refreshPromise;
        refreshPromise = null;

        original.headers.set('Authorization', `Bearer ${newToken}`);
        return api(original);
      } catch {
        refreshPromise = null;
        authStore.getState().clearSession();
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
      }
    }

    return Promise.reject(toApiError(error));
  },
);

function toApiError(error: AxiosError<ApiErrorBody>): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;

  let messages: string[];
  if (body && body.message) {
    messages = Array.isArray(body.message) ? body.message : [body.message];
  } else if (status === 0) {
    messages = ['Không kết nối được máy chủ. Kiểm tra backend đang chạy?'];
  } else {
    messages = ['Đã có lỗi xảy ra, vui lòng thử lại'];
  }

  return new ApiError(status, messages);
}
