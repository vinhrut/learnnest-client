import { useState } from 'react';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Field, inputBaseClass } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/useAuth';
import { canReviewExtension } from '@/lib/permissions';
import type { TaskExtensionRequest } from '@/types/task';

interface ExtensionRequestBannerProps {
  request: TaskExtensionRequest;
  onApprove: () => void;
  onReject: (reason: string) => void;
  approving?: boolean;
  rejecting?: boolean;
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Chưa có';
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ExtensionRequestBanner({
  request,
  onApprove,
  onReject,
  approving,
  rejecting,
}: ExtensionRequestBannerProps) {
  const { user } = useAuth();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const canReview = canReviewExtension(user, request);
  const requesterName =
    request.requester?.full_name || request.requester?.username || 'Thành viên';

  const handleReject = () => {
    onReject(rejectReason.trim());
    setShowRejectDialog(false);
    setRejectReason('');
  };

  return (
    <>
      <div className="rounded-xl bg-warning-soft p-4">
        <div className="flex items-start gap-3">
          <FiClock className="mt-0.5 shrink-0 text-warning" />
          <div className="flex-1 space-y-2">
            <span className="text-label-md text-warning uppercase tracking-wide">
              Yêu cầu gia hạn — chờ duyệt
            </span>

            <div className="flex items-center gap-2 text-body-md text-on-surface font-medium">
              <span className="line-through opacity-70">
                {formatDate(request.current_due_date)}
              </span>
              <FiArrowRight className="text-on-surface-variant" />
              <span>{formatDate(request.requested_due_date)}</span>
            </div>

            <p className="whitespace-pre-wrap text-body-md text-on-surface-variant">
              {request.reason}
            </p>

            <p className="text-label-md text-on-surface-variant">
              {requesterName} · {new Date(request.requested_at).toLocaleString('vi-VN')}
            </p>

            {canReview && (
              <div className="flex justify-end gap-3 pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowRejectDialog(true)}
                >
                  Từ chối
                </Button>
                <Button size="sm" onClick={onApprove} loading={approving}>
                  Duyệt gia hạn
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        title="Từ chối yêu cầu gia hạn"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowRejectDialog(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleReject} loading={rejecting}>
              Từ chối
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-body-md text-on-surface-variant">
            Hạn chót của công việc sẽ được giữ nguyên.
          </p>
          <Field label="Lý do từ chối" hint="Có thể để trống.">
            <textarea
              className={cn(inputBaseClass, 'resize-none border-outline-variant py-2')}
              placeholder="Nhập lý do từ chối..."
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
