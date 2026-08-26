import { lazy } from 'react'
import type { RouteObject } from 'react-router'

// Admin Pages
const Dashboard = lazy(() => import('../../pages/BA/BaDashboard'))
const Task = lazy(() => import('../../pages/BA/BaTask'))
const Project = lazy(() => import('../../pages/BA/BaTask'))


export const adminRoutes: RouteObject[] = [
  {
    path: '',
    index: true,
    element: <Dashboard />
  },
  {
    path: 'task',
    element: <Task />
  },
  {
    path: 'project',
    element: <Project />
  },

]
