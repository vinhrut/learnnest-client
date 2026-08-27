import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { UserListPage } from '@/features/users/UserListPage';
import { Forbidden, NotFound } from '@/pages/error/NotFound';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteError } from './RouteError';

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },

      {
        element: <GuestRoute />,
        children: [
          {
            path: '/login',
            element: (
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            ),
          },
          {
            path: '/forgot-password',
            element: (
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            ),
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/profile', element: <ProfilePage /> },
            ],
          },
        ],
      },

      {
        element: <ProtectedRoute requiredRoles={['ADMIN']} />,
        children: [
          {
            element: <AppLayout />,
            children: [{ path: '/users', element: <UserListPage /> }],
          },
        ],
      },

      { path: '/403', element: <Forbidden /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
