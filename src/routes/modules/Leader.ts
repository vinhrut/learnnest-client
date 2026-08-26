import { lazy } from 'react'
import type { RouteObject } from 'react-router'

// Admin Pages
const Dashboard = lazy(() => import('../../../pages/admin/AdminDashboard'))
const Task = lazy(() => import('../../../pages/admin/AppointmentsManagement'))
const Project = lazy(() => import('../../../pages/admin/ServicesManagement'))
const ManagerUser = lazy(() => import('../../../pages/admin/DoctorsManagement'))


export const adminRoutes: RouteObject[] = [
  {
    path: '',
    index: true,
    element: <AdminDashboard />
  },
  {
    path: 'task',
    element: <CustomersManagement />
  },
  {
    path: 'project',
    element: <AppointmentsManagement />
  },
  {
    path: 'manageruser',
    element: <DoctorsManagement />
  },
]
