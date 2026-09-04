import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { UserListPage } from '@/pages/users/UserListPage';
import { Comment } from '@/components/comments/comment';
import { ChatBox } from '@/components/chatBoxs/chatBoxs';
import { RoleRoute } from './RoleRoute';
import { RoleHome } from './RoleHomeRedirect';
import { RouteError } from './RouteError';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ProfilePage } from '@/pages/ba/ProfilePage';
import { TaskPage } from '@/pages/task/TaskPage';

import { ProjectDetailPage } from '@/pages/project/ProjectDetailPage';
import { LeaderDashboardPage } from '@/pages/leader/DashboardPage';
import { LeaderProjectPage } from '@/pages/leader/ProjectPage';
import { BADashboardPage } from '@/pages/ba/DashboardPage';
import { BAProjectPage } from '@/pages/ba/ProjectPage';
import { BATaskPage } from '@/pages/ba/BATaskPage';
import { DevDashboardPage } from '@/pages/dev/DashboardPage';
import { DevProjectPage } from '@/pages/dev/ProjectPage';
import { DevTaskPage } from '@/pages/dev/DevTaskPage';
import { Forbidden, NotFound } from '@/pages/error/NotFound';
export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        element: <RoleHome />,
      },

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

      {
        element: (
          <RoleRoute allowedRoles={['ADMIN']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/admin/users', element: <UserListPage /> },
          { path: '/admin/profile', element: <ProfilePage /> },
        ],
      },

      {
        element: (
          <RoleRoute allowedRoles={['LEAD']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/leader/dashboard', element: <LeaderDashboardPage /> },
          { path: '/leader/projects', element: <LeaderProjectPage /> },
          { path: '/leader/projects/:id', element: <ProjectDetailPage /> },
          { path: '/leader/tasks', element: <TaskPage /> },
          { path: '/leader/profile', element: <ProfilePage /> },
        ],
      },

      {
        element: (
          <RoleRoute allowedRoles={['BA']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/ba/dashboard', element: <BADashboardPage /> },
          { path: '/ba/projects', element: <BAProjectPage /> },
          { path: '/ba/projects/:id', element: <ProjectDetailPage /> },
          { path: '/ba/tasks', element: <BATaskPage /> },
          { path: '/ba/profile', element: <ProfilePage /> },
        ],
      },
      
      { path: '/403', element: <Forbidden /> },

      {
        element: (
          <RoleRoute allowedRoles={['USER']}>
            <AppLayout />
          </RoleRoute>
        ),
        children: [
          { path: '/dev/dashboard', element: <DevDashboardPage /> },
          { path: '/dev/projects', element: <DevProjectPage /> },
          { path: '/dev/projects/:id', element: <ProjectDetailPage /> },
          { path: '/dev/tasks', element: <DevTaskPage /> },
          { path: '/dev/profile', element: <ProfilePage /> },
        ],
      },

      { path: '/dashboard', element: <RoleHome /> },
      { path: '/profile', element: <RoleHome /> },
      { path: '/projects', element: <RoleHome /> },
      { path: '/tasks', element: <RoleHome /> },
      { path: '/users', element: <RoleHome /> },

      { path: '*', element: <NotFound /> },
    ],
  },
]);
