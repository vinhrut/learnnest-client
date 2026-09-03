import { useMutation, useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';
import { toast } from '@/components/ui/toast/toast.store';
import { firstErrorMessage } from '@/lib/errors';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => ['analytics', 'overview'] as const,
  taskHistory: (taskId: string) => ['analytics', 'task-history', taskId] as const,
};

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: analyticsApi.getOverview,
  });
}

export function useTaskHistoryQuery(taskId: string | undefined) {
  return useQuery({
    queryKey: analyticsKeys.taskHistory(taskId ?? ''),
    queryFn: () => analyticsApi.getTaskHistory(taskId!),
    enabled: !!taskId,
  });
}

export function useExportDashboardExcel() {
  return useMutation({
    mutationFn: analyticsApi.exportDashboardExcel,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dashboard.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success('Da tai bao cao Dashboard');
    },
    onError: (error: unknown) => {
      toast.error(firstErrorMessage(error) || 'Xuat bao cao that bai');
    },
  });
}
