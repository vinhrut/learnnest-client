import { lazy } from 'react'
import type { RouteObject } from 'react-router'
import GuestOnlyRoute from '../guestOnlyRoute'

// Lazy-loaded auth pages
const LoginPage = lazy(() => import('../../../pages/auth/Login'))

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <GuestOnlyRoute element={<LoginPage />} /> },
]