import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { firstErrorMessage } from '@/lib/errors';
import { ApiError } from '@/types/api';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // 401 đã được interceptor xử lý (refresh / đăng xuất) — không cần toast.
      if (error instanceof ApiError && error.status === 401) return;
      toast.error(firstErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Không retry lỗi phía client (4xx) — chỉ retry lỗi mạng/5xx.
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
