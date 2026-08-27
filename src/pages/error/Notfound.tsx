import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

function ErrorScreen({
  code,
  codeClass,
  title,
  description,
}: {
  code: string;
  codeClass: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <p className={`text-6xl font-bold ${codeClass}`}>{code}</p>
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      <Link to="/dashboard">
        <Button variant="secondary" leftIcon={<FiArrowLeft />}>
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
}

export function NotFound() {
  return (
    <ErrorScreen
      code="404"
      codeClass="text-primary"
      title="Không tìm thấy trang"
      description="Trang bạn tìm không tồn tại hoặc đã bị di chuyển."
    />
  );
}

export function Forbidden() {
  return (
    <ErrorScreen
      code="403"
      codeClass="text-danger"
      title="Không có quyền truy cập"
      description="Tài khoản của bạn không được phép xem trang này."
    />
  );
}
