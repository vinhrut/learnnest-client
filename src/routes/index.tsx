import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RoleRoute } from './RoleRoute';
import { RouteError } from './RouteError';
import { NotFound } from '@/pages/error/NotFound';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Shared pages
import { ProfilePage } from '@/pages/ba/ProfilePage';
import { TaskPage } from '@/pages/task/TaskPage';

// Leader pages
import { LeaderDashboardPage } from '@/pages/leader/DashboardPage';
import { LeaderProjectPage } from '@/pages/leader/ProjectPage';
import { LeaderProjectDetailPage } from '@/pages/leader/ProjectDetailPage';
import { UserManagerPage } from '@/pages/leader/UserManagerPage';

// BA pages
import { BADashboardPage } from '@/pages/ba/DashboardPage';
import { BAProjectPage } from '@/pages/ba/ProjectPage';
import { BATaskPage } from '@/pages/ba/BATaskPage';

// Dev pages
import { DevDashboardPage } from '@/pages/dev/DashboardPage';
import { DevProjectPage } from '@/pages/dev/ProjectPage';
import { DevTaskPage } from '@/pages/dev/DevTaskPage';

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      // Root redirect based on role
      {
        path: '/',
        element: <Navigate to="/leader/dashboard" replace />,
      },

      // Auth routes
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

      // ===== LEADER ROUTES =====
      {
        element: (
          <RoleRoute allowedRoles={['LEAD']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/leader/dashboard', element: <LeaderDashboardPage /> },
          { path: '/leader/projects', element: <LeaderProjectPage /> },
          { path: '/leader/projects/:id', element: <LeaderProjectDetailPage /> },
          { path: '/leader/tasks', element: <TaskPage /> },
          { path: '/leader/users', element: <UserManagerPage /> },
          { path: '/leader/profile', element: <ProfilePage /> },
        ],
      },

      // ===== BA ROUTES =====
      {
        element: (
          <RoleRoute allowedRoles={['BA']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/ba/dashboard', element: <BADashboardPage /> },
          { path: '/ba/projects', element: <BAProjectPage /> },
          { path: '/ba/tasks', element: <BATaskPage /> },
          { path: '/ba/profile', element: <ProfilePage /> },
        ],
      },

      // ===== DEV ROUTES =====
      {
        element: (
          <RoleRoute allowedRoles={['USER']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/dev/dashboard', element: <DevDashboardPage /> },
          { path: '/dev/projects', element: <DevProjectPage /> },
          { path: '/dev/tasks', element: <DevTaskPage /> },
          { path: '/dev/profile', element: <ProfilePage /> },
        ],
      },

      // Legacy routes - redirect to role-based routes
      { path: '/dashboard', element: <Navigate to="/leader/dashboard" replace /> },
      { path: '/profile', element: <Navigate to="/leader/profile" replace /> },
      { path: '/projects', element: <Navigate to="/leader/projects" replace /> },
      { path: '/projects/:id', element: <Navigate to="/leader/projects/:id" replace /> },
      { path: '/tasks', element: <Navigate to="/leader/tasks" replace /> },
      { path: '/users', element: <Navigate to="/leader/users" replace /> },

      { path: '*', element: <NotFound /> },
    ],
  },
]);
