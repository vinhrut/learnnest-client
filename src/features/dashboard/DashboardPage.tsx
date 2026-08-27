import { useAuth } from '@/hooks/useAuth';
import { AdminDashboardPage } from './AdminDashboardPage';
import { UserDashboardPage } from './UserDashboardPage';

/**
 * `/dashboard` hiển thị theo vai trò: admin thấy tổng quan hệ thống,
 * người dùng thường thấy dashboard cá nhân (không gọi API quản trị).
 */
export function DashboardPage() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboardPage /> : <UserDashboardPage />;
}
