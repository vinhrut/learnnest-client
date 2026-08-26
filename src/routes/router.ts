/**
 * routes.tsx — Cấu hình router chính
 *
 * Cấu trúc route theo ROLE từ backend (SYSADMIN, RECEPTIONIST, DOCTOR):
 *  - publicRoutes  : không cần auth
 *  - authRoutes    : guest only — /login, /register
 *  - adminRoutes   : chỉ SYSADMIN — /admin/*
 *  - receptionistRoutes : RECEPTIONIST — /dashboard/*
 *  - doctorRoutes  : DOCTOR — /doctor-portal/*
 *
 * Route protection dùng ProtectedLayout:
 *  Kiểm tra loadingInfo → logged → role (dùng hasRole / hasAnyRole)
 */
import { lazy, type ReactNode } from 'react'
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores'
import {  getDashboardPath, hasAnyRole, hasRole, type RoleCode } from '@/interface/user/user'
import { authRoutes } from './modules/auth'
import { Leader } from './modules/Leader'
import { Ba } from './modules/Ba'
import { Dev } from './modules/Dev'
import PageLoading from '../components/common/PageLoading'

// Lazy-loaded layouts
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'))
const AuthLayout = lazy(() => import('../layouts/AuthLayout'))
const NotFound = lazy(() => import('../../pages/error/NotFound'))

// =============================================================================
// AUTH ROUTE WRAPPER
// =============================================================================
const authWrapper: RouteObject = {
  path: '/',
  element: <AuthLayout><Outlet /></AuthLayout>,
  children: authRoutes,
}

// =============================================================================
// PROTECTED LAYOUT — Kiểm tra auth + role
// =============================================================================
interface ProtectedLayoutProps {
  requiredRole?: RoleCode
  requiredRoles?: RoleCode[]
  children?: ReactNode
}

const ProtectedLayout = ({ requiredRole, requiredRoles, children }: ProtectedLayoutProps) => {
  const { logged, currentUser, loadingInfo, loading } = useSelector((state: RootState) => state.auth)
  if (loadingInfo) return <PageLoading />
  if (!logged || !currentUser) return <NotFound/>;

  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(currentUser, requiredRoles)) {
      return <Navigate to={getDashboardPath(currentUser)} replace />
    }
  }

  if (requiredRole && !hasRole(currentUser, requiredRole)) {
    return <Navigate to={getDashboardPath(currentUser)} replace />
  }

  return (
    <DashboardLayout>
      {children ?? <Outlet />}
    </DashboardLayout>
  )
}

// =============================================================================
// FULL ROUTE LIST
// =============================================================================
const routeList: RouteObject[] = [
  { path: '/', element: <Navigate to="/login" replace /> },
  ...publicRoutes,
  authWrapper,

  // ── ADMIN ROUTE (chỉ SYSADMIN) ─────────────────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedLayout requiredRole="SYSADMIN"><Outlet /></ProtectedLayout>,
    children: [
      { path: '', element: <Navigate to="dashboard" replace /> },
      ...adminRoutes,
    ],
  },

  // ── RECEPTIONIST ROUTES ────────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <ProtectedLayout requiredRoles={["SYSADMIN", "RECEPTIONIST"]}><Outlet /></ProtectedLayout>,
    children: receptionistRoutes,
  },

  // ── DOCTOR PORTAL ROUTES ──────────────────────────────────────────────────
  {
    path: '/doctor-portal',
    element: <ProtectedLayout requiredRole="DOCTOR"><Outlet /></ProtectedLayout>,
    children: doctorRoutes,
  },

  // ── 404 FALLBACK ──────────────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
]

const RenderRouter = createBrowserRouter(routeList)
export default RenderRouter
