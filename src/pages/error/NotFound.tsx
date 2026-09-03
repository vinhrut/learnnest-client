import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-canvas p-4">
      <FiAlertCircle className="h-16 w-16 text-muted" />
      <h1 className="text-2xl font-bold text-ink">404</h1>
      <p className="text-muted">Không tìm thấy trang bạn yêu cầu</p>
      <Link
        to="/dashboard"
        className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Quay về Dashboard
      </Link>
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-canvas p-4">
      <FiAlertCircle className="h-16 w-16 text-danger" />
      <h1 className="text-2xl font-bold text-ink">403</h1>
      <p className="text-muted">Bạn không có quyền truy cập trang này</p>
      <Link
        to="/dashboard"
        className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Quay về Dashboard
      </Link>
    </div>
  );
}
