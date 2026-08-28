import { RouterProvider } from 'react-router-dom';
import { useBootstrapAuth } from '@/hooks/useAuth';
import { router } from '@/routes';

/** Component gốc: xác thực lại phiên khi khởi động rồi render router. */
export function Root() {
  useBootstrapAuth();
  return <RouterProvider router={router} />;
}
