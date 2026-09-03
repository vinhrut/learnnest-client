import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { taskApi } from '@/api/task.api';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskFilters,
  SubmitTaskRequest,
  ApproveTaskRequest,
  RejectTaskRequest,
  CreateExtensionRequest,
  ApproveExtensionRequest,
  RejectExtensionRequest,
} from '@/types/task';
import { toast } from '@/components/ui/toast/toast.store';
import { firstErrorMessage } from '@/lib/errors';

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters?: TaskFilters) => ['tasks', 'list', filters] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
  byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
  extensions: (taskId: string) => ['tasks', 'extensions', taskId] as const,
};

export function useTasksQuery(filters?: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.getTasks(filters),
    placeholderData: keepPreviousData,
  });
}

export function useTasksByProjectQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.byProject(projectId ?? ''),
    queryFn: () => taskApi.getTasksByProject(projectId!),
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });
}

export function useTaskQuery(id: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ''),
    queryFn: () => taskApi.getTask(id!),
    enabled: !!id,
  });
}

function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: taskKeys.all });
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: CreateTaskRequest }) =>
      taskApi.createTask(projectId, payload),
    onSuccess: () => {
      invalidate();
      toast.success('Tạo công việc thành công');
    },
    onError: () => {
      toast.error('Tạo công việc thất bại');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskRequest }) =>
      taskApi.updateTask(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      toast.success('Cập nhật công việc thành công');
    },
    onError: () => {
      toast.error('Cập nhật công việc thất bại');
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskStatusRequest }) =>
      taskApi.updateTaskStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      invalidate();
      toast.success('Xóa công việc thành công');
    },
    onError: () => {
      toast.error('Xóa công việc thất bại');
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitTaskRequest) => taskApi.submitTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Đã gửi công việc để duyệt');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Gửi duyệt thất bại');
    },
  });
}

export function useApproveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApproveTaskRequest) => taskApi.approveTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Đã phê duyệt công việc');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Phê duyệt thất bại');
    },
  });
}

export function useRejectTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RejectTaskRequest) => taskApi.rejectTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Đã từ chối công việc');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Từ chối thất bại');
    },
  });
}

export function useTaskExtensionsQuery(taskId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.extensions(taskId ?? ''),
    queryFn: () => taskApi.getExtensionRequests(taskId!),
    enabled: !!taskId,
  });
}

function useInvalidateExtensions() {
  const queryClient = useQueryClient();
  return (taskId: string) => {
    queryClient.invalidateQueries({ queryKey: taskKeys.all });
    queryClient.invalidateQueries({ queryKey: taskKeys.extensions(taskId) });
  };
}

export function useRequestExtension() {
  const invalidate = useInvalidateExtensions();
  return useMutation({
    mutationFn: (payload: CreateExtensionRequest) =>
      taskApi.createExtensionRequest(payload),
    onSuccess: (_, { task_id }) => {
      invalidate(task_id);
      toast.success('Đã gửi yêu cầu gia hạn');
    },
    onError: (error: unknown) => {
      toast.error(firstErrorMessage(error) || 'Gửi yêu cầu gia hạn thất bại');
    },
  });
}

export function useApproveExtension() {
  const invalidate = useInvalidateExtensions();
  return useMutation({
    mutationFn: ({ payload }: { taskId: string; payload: ApproveExtensionRequest }) =>
      taskApi.approveExtensionRequest(payload),
    onSuccess: (_, { taskId }) => {
      invalidate(taskId);
      toast.success('Đã duyệt gia hạn');
    },
    onError: (error: unknown) => {
      toast.error(firstErrorMessage(error) || 'Duyệt gia hạn thất bại');
    },
  });
}

export function useRejectExtension() {
  const invalidate = useInvalidateExtensions();
  return useMutation({
    mutationFn: ({ payload }: { taskId: string; payload: RejectExtensionRequest }) =>
      taskApi.rejectExtensionRequest(payload),
    onSuccess: (_, { taskId }) => {
      invalidate(taskId);
      toast.success('Đã từ chối yêu cầu gia hạn');
    },
    onError: (error: unknown) => {
      toast.error(firstErrorMessage(error) || 'Từ chối yêu cầu gia hạn thất bại');
    },
  });
}
