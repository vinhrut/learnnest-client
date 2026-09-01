import { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitTask, useApproveTask, useRejectTask } from '@/hooks/tasks/task.queries';
import type { Task } from '@/types/task';
import { TASK_STATUS_CONFIG, PRIORITY_CONFIG, APPROVAL_STATUS_CONFIG } from '@/types/task';

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onRefresh?: () => void;
}

export function TaskDetailDrawer({ task, open, onClose, onEdit, onRefresh }: TaskDetailDrawerProps) {
  const { user, hasRole } = useAuth();
  const isLeader = hasRole('LEAD');
  const isBAOrDEV = hasRole('BA', 'USER', 'ADMIN');

  const submitTask = useSubmitTask();
  const approveTask = useApproveTask();
  const rejectTask = useRejectTask();

  const [newComment, setNewComment] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!task) return null;

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const approvalConfig = APPROVAL_STATUS_CONFIG[task.assignment_status];

  const handleSubmit = () => {
    submitTask.mutate(
      { task_id: task.id },
      {
        onSuccess: () => {
          onRefresh?.();
        },
      }
    );
  };

  const handleApprove = () => {
    approveTask.mutate(
      { task_id: task.id },
      {
        onSuccess: () => {
          onRefresh?.();
        },
      }
    );
  };

  const handleReject = () => {
    rejectTask.mutate(
      { task_id: task.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectReason('');
          onRefresh?.();
        },
      }
    );
  };

  const tabs = [
    {
      id: 'discussion',
      label: (
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">forum</span>
          Thảo luận
        </span>
      ),
      content: (
        <div className="space-y-4">
          <p className="py-4 text-center text-body-md text-on-surface-variant">Chưa có bình luận nào.</p>
          {/* Comment Input */}
          <div className="flex gap-4 items-start">
            <Avatar name={user?.full_name} size="sm" />
            <div className="flex-1 rounded-xl border border-outline-variant bg-surface focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden transition-all">
              <textarea
                className="w-full resize-none border-none bg-transparent p-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:ring-0"
                placeholder="Viết bình luận..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex items-center justify-end border-t border-outline-variant bg-surface-container px-3 py-2">
                <Button size="sm">Gửi</Button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'files',
      label: (
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">attach_file</span>
          Tài liệu
        </span>
      ),
      content: <p className="text-body-md text-on-surface-variant py-4 text-center">Chưa có tài liệu đính kèm.</p>,
    },
    {
      id: 'activity',
      label: (
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">history</span>
          Nhật ký
        </span>
      ),
      content: <p className="text-body-md text-on-surface-variant py-4 text-center">Chưa có hoạt động nào.</p>,
    },
  ];

  // Render action buttons based on role and task state
  const renderActions = () => {
    const buttons: React.ReactNode[] = [];

    // Edit button - BA/DEV can edit
    if (isBAOrDEV && task.status !== 'CLOSED' && task.status !== 'DONE') {
      buttons.push(
        <Button key="edit" variant="secondary" onClick={() => onEdit?.(task)}>
          Sửa
        </Button>
      );
    }

    // Submit for approval - BA/DEV can submit when status is DRAFT
    if (isBAOrDEV && task.status === 'DRAFT') {
      buttons.push(
        <Button key="submit" onClick={handleSubmit} loading={submitTask.isPending}>
          Gửi duyệt
        </Button>
      );
    }

    // Approve/Reject - Only LEAD can do this when status is WAITING_APPROVAL
    if (isLeader && task.status === 'WAITING_APPROVAL') {
      buttons.push(
        <Button key="reject" variant="danger" onClick={() => setShowRejectDialog(true)}>
          Từ chối
        </Button>
      );
      buttons.push(
        <Button key="approve" onClick={handleApprove} loading={approveTask.isPending}>
          Phê duyệt
        </Button>
      );
    }

    // Final close - Only LEAD can close DONE tasks
    if (isLeader && task.status === 'DONE') {
      buttons.push(
        <Button key="close" onClick={handleApprove} loading={approveTask.isPending}>
          Hoàn thành
        </Button>
      );
    }

    return buttons;
  };

  const footer = (
    <div className="flex justify-end gap-3">
      {renderActions()}
    </div>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={task.code}
        footer={footer}
        size="xl"
        position="right"
      >
        <div className="space-y-6">
          {/* TOP SECTION: Meta Data */}
          <div className="space-y-4 border-b border-outline-variant pb-6">
            {/* Task ID + Status + Approval Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge tone="neutral">{task.code}</Badge>
              <Badge tone={
                task.status === 'DOING' ? 'primary' :
                task.status === 'DONE' || task.status === 'CLOSED' ? 'success' :
                task.status === 'REJECTED' ? 'danger' :
                task.status === 'WAITING_APPROVAL' ? 'warning' : 'neutral'
              }>
                {statusConfig.label}
              </Badge>
              {/* Approval Status Badge */}
              <Badge tone={task.assignment_status === 'APPROVED' || task.assignment_status === 'ASSIGNED' ? 'success' :
                task.assignment_status === 'REJECTED' ? 'danger' : 'warning'}>
                {approvalConfig.label}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-headline-md text-on-surface font-bold">{task.title}</h2>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4 text-body-md">
              {/* Assignee */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Người thực hiện
                  </span>
                  {task.assignee ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar
                        src={task.assignee.avatar_url}
                        name={task.assignee.full_name}
                        size="xs"
                      />
                      <span className="font-medium text-on-surface">
                        {task.assignee.full_name || task.assignee.username}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium text-on-surface-variant mt-1">Chưa giao</span>
                  )}
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">person_add</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Người tạo
                  </span>
                  {task.creator ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar
                        src={task.creator.avatar_url}
                        name={task.creator.full_name}
                        size="xs"
                      />
                      <span className="font-medium text-on-surface">
                        {task.creator.full_name || task.creator.username}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium text-on-surface-variant mt-1">-</span>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Hạn chót
                  </span>
                  <span className="font-medium text-on-surface mt-1">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString('vi-VN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Chưa có'}
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">flag</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Mức độ ưu tiên
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={priorityConfig.color}>
                      <span className="material-symbols-outlined text-base">{priorityConfig.icon}</span>
                    </span>
                    <span className={`font-medium ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">folder</span>
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Dự án
                  </span>
                  {task.project ? (
                    <span className="font-medium text-primary mt-1 hover:underline cursor-pointer">
                      {task.project.name}
                    </span>
                  ) : (
                    <span className="font-medium text-on-surface-variant mt-1">Chưa có</span>
                  )}
                </div>
              </div>

              {/* Rejection Reason */}
              {task.rejection_reason && (
                <div className="flex items-center gap-3 col-span-2 bg-error-container rounded-lg p-3">
                  <span className="material-symbols-outlined text-error">info</span>
                  <div className="flex flex-col">
                    <span className="text-label-md text-error uppercase tracking-wide">
                      Lý do từ chối
                    </span>
                    <span className="font-medium text-on-surface mt-1">
                      {task.rejection_reason}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE SECTION: Description */}
          <div className="space-y-8">
            {/* Description */}
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-body-lg text-on-surface font-semibold">
                <span className="material-symbols-outlined text-on-surface-variant">subject</span>
                Mô tả công việc
              </h3>
              <div className="rounded-xl border border-outline-variant bg-surface p-4">
                <p className="whitespace-pre-wrap text-body-md text-on-surface-variant leading-relaxed">
                  {task.description || 'Chưa có mô tả'}
                </p>
              </div>
            </section>

            {/* TABS: Discussion, Files, Activity */}
            <section>
              <Tabs tabs={tabs} />
            </section>
          </div>
        </div>
      </Drawer>

      {/* Reject Dialog */}
      <Modal
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        title="Từ chối công việc"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowRejectDialog(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleReject} loading={rejectTask.isPending}>
              Từ chối
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-body-md text-on-surface-variant">
            Bạn có chắc chắn muốn từ chối công việc này?
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-on-surface font-semibold">
              Lý do từ chối <span className="text-error">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-primary-container focus:ring-1 focus:ring-primary-container resize-none"
              placeholder="Nhập lý do từ chối..."
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
