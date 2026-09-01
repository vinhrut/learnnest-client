import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskVinhApi } from '@/api/tasks.api';
import type { CreateTaskRequest } from '@/types/task';

export const taskKeys = {
  all: ['tasks'] as const,
  assignedToMe: ['tasks', 'assigned-to-me'] as const,
  projects: ['tasks', 'projects'] as const,
};

export function useMyTasksQuery() {
  return useQuery({
    queryKey: taskKeys.assignedToMe,
    queryFn: taskVinhApi.listAssignedToMe,
  });
}

export function useProjectOptionsQuery() {
  return useQuery({
    queryKey: taskKeys.projects,
    queryFn: taskVinhApi.listProjects,
    staleTime: 5 * 60_000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskRequest) => taskVinhApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.assignedToMe });
    },
  });
}
