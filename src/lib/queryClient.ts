import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { firstErrorMessage } from '@/lib/errors';
import { ApiError } from '@/types/api';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        return;
      }
      toast.error(firstErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
