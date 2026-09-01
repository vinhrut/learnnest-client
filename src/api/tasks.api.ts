import { api } from '@/lib/axios';
import type { CreateTaskVinhRequest, ProjectOption, TaskCard } from '@/types/task';

export const taskVinhApi = {
  create: (payload: CreateTaskVinhRequest) =>
    api.post<TaskCard>('/task-vinh', payload).then((r) => r.data),

  listAssignedToMe: () =>
    api.get<TaskCard[]>('/task-vinh/assigned-to-me').then((r) => r.data),

  listProjects: () =>
    api.get<ProjectOption[]>('/task-vinh/projects').then((r) => r.data),
};
