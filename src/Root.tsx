import { RouterProvider } from 'react-router-dom';
import { useBootstrapAuth } from '@/hooks/useAuth';
import { router } from '@/routes';

export function Root() {
  useBootstrapAuth();
  return <RouterProvider router={router} />;
}
