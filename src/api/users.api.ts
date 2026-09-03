import { api } from '@/lib/axios';
import { toFileFormData } from '@/lib/upload';
import type { Paginated } from '@/types/api';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListQuery,
} from '@/types/user';

export const usersApi = {
  list: (query: UserListQuery) =>
    api
      .get<Paginated<User>>('/users', { params: cleanQuery(query) })
      .then((r) => r.data),

  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),

  create: (payload: CreateUserRequest) =>
    api.post<User>('/users', payload).then((r) => r.data),

  update: (id: string, payload: UpdateUserRequest) =>
    api.patch<User>(`/users/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    api.delete<{ success: boolean }>(`/users/${id}`).then((r) => r.data),

  lock: (id: string) =>
    api.patch<User>(`/users/${id}/lock`).then((r) => r.data),

  unlock: (id: string) =>
    api.patch<User>(`/users/${id}/unlock`).then((r) => r.data),

  // Upload ảnh đại diện từ máy. Gọi lại lần nữa = thay ảnh (ảnh cũ bị xoá
  // trên Cloudinary phía server).
  uploadAvatar: (id: string, file: File) =>
    api
      .post<User>(`/users/${id}/avatar`, toFileFormData(file))
      .then((r) => r.data),

  deleteAvatar: (id: string) =>
    api.delete<User>(`/users/${id}/avatar`).then((r) => r.data),
};

function cleanQuery(query: UserListQuery): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(query).filter(
      ([, v]) => v !== undefined && v !== '' && v !== null,
    ),
  );
}
