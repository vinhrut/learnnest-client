import { api } from '@/lib/axios';
import type { DashboardOverview, TaskHistoryItem } from '@/types/analytics';

export const analyticsApi = {
  getOverview: () =>
    api.get<DashboardOverview>('/dashboard/overview').then((r) => r.data),

  getTaskHistory: (taskId: string) =>
    api.get<TaskHistoryItem[]>(`/task-history/${taskId}`).then((r) => r.data),

  exportDashboardExcel: () =>
    api
      .get<Blob>('/export/dashboard/excel', { responseType: 'blob' })
      .then((r) => r.data),
};
