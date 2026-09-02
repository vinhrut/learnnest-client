import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Đã có lỗi xảy ra';
  let detail = 'Vui lòng tải lại trang hoặc quay về trang chủ.';

  if (isRouteErrorResponse(error)) {
    title = `Lỗi ${error.status}`;
    detail =
      error.status === 404
        ? 'Không tìm thấy trang bạn yêu cầu.'
        : detail;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <p className="text-2xl font-bold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-muted">{detail}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Tải lại
        </Button>
        <Button onClick={() => navigate('/dashboard', { replace: true })}>
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
