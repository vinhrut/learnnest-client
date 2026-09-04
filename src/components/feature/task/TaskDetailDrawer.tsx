import { useState } from 'react';
import { FiAlignLeft, FiCalendar, FiClock, FiFlag, FiFolder, FiInfo, FiMessageSquare, FiPaperclip, FiUser, FiUserPlus } from 'react-icons/fi';
import { Drawer } from '@/components/ui/Drawer';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Comment } from '@/components/comments/comment';
import { Badge as StatusChip } from '@/components/ui/Badge';
import { ExtensionRequestBanner } from './ExtensionRequestBanner';
import { ExtensionRequestModal } from './ExtensionRequestModal';
import { useAuth } from '@/hooks/useAuth';
import {
  useSubmitTask,
  useApproveTask,
  useRejectTask,
  useUpdateTask,
  useUpdateTaskStatus,
  useDeleteTask,
  useTaskExtensionsQuery,
  useRequestExtension,
  useApproveExtension,
  useRejectExtension,
} from '@/hooks/tasks/task.queries';
import { useProjectMembersQuery } from '@/hooks/projects/project.queries';
import {
  canApproveTask,
  canAssignTask,
  canCloseTask,
  canDeleteTask,
  canEditTask,
  canMoveTask,
  canRequestExtension,
  canSubmitTask,
} from '@/lib/permissions';
import type { Task, TaskStatus } from '@/types/task';
import { TASK_STATUS_CONFIG, PRIORITY_CONFIG, APPROVAL_STATUS_CONFIG, TASK_STATUS_LABEL, EXTENSION_STATUS_LABEL } from '@/types/task';

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onRefresh?: () => void;
}

export function TaskDetailDrawer({ task, open, onClose, onEdit, onRefresh }: TaskDetailDrawerProps) {
  const { user } = useAuth();

  const submitTask = useSubmitTask();
  const approveTask = useApproveTask();
  const rejectTask = useRejectTask();
  const updateTask = useUpdateTask();
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const requestExtension = useRequestExtension();
  const approveExtension = useApproveExtension();
  const rejectExtension = useRejectExtension();

  const { data: extensionRequests } = useTaskExtensionsQuery(
    open ? task?.id : undefined,
  );

  const canAssign = canAssignTask(user);
  const { data: members } = useProjectMembersQuery(
    canAssign && open ? task?.project_id : undefined,
  );

  const [newComment, setNewComment] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  if (!task) return null;

  const extensions = extensionRequests ?? [];
  const pendingExtension = extensions.find((item) => item.status === 'PENDING') ?? null;
  const reviewedExtensions = extensions.filter((item) => item.status !== 'PENDING');

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const approvalConfig = APPROVAL_STATUS_CONFIG[task.assignment_status];

  const handleSubmit = () => {
    if (task.status === 'REJECTED') {
      handleMove('WAITING_APPROVAL');
      return;
    }
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

  const handleMove = (status: TaskStatus) => {
    updateStatus.mutate(
      { id: task.id, payload: { status } },
      { onSuccess: () => onRefresh?.() },
    );
  };

  const handleAssign = (assigneeId: string) => {
    updateTask.mutate(
      { id: task.id, payload: { assignee_id: assigneeId } },
      { onSuccess: () => onRefresh?.() },
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        onRefresh?.();
        onClose();
      },
    });
  };

  const handleRequestExtension = (payload: {
    requested_due_date: string;
    reason: string;
  }) => {
    requestExtension.mutate(
      { task_id: task.id, ...payload },
      {
        onSuccess: () => {
          setShowExtensionModal(false);
          onRefresh?.();
        },
      },
    );
  };

  const handleApproveExtension = () => {
    if (!pendingExtension) return;
    approveExtension.mutate(
      { taskId: task.id, payload: { request_id: pendingExtension.id } },
      { onSuccess: () => onRefresh?.() },
    );
  };

  const handleRejectExtension = (reason: string) => {
    if (!pendingExtension) return;
    rejectExtension.mutate(
      {
        taskId: task.id,
        payload: { request_id: pendingExtension.id, reason: reason || undefined },
      },
      { onSuccess: () => onRefresh?.() },
    );
  };

  const tabs = [
    {
      id: 'discussion',
      label: (
        <span className="flex items-center gap-2">
          <FiMessageSquare className="text-xl" />
          Thảo luận
        </span>
      ),
      content: (
        <div className="space-y-4">
          <p className="py-4 text-center text-body-md text-on-surface-variant">Chưa có bình luận nào.</p>
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
          <FiPaperclip className="text-xl" />
          Tài liệu
        </span>
      ),
      content: <p className="text-body-md text-on-surface-variant py-4 text-center">Chưa có tài liệu đính kèm.</p>,
    },
    {
      id: 'activity',
      label: (
        <span className="flex items-center gap-2">
          <FiClock className="text-xl" />
          Nhật ký
        </span>
      ),
      content: <p className="text-body-md text-on-surface-variant py-4 text-center">Chưa có hoạt động nào.</p>,
    },
  ];

  const renderActions = () => {
    const buttons: React.ReactNode[] = [];

    if (canDeleteTask(user, task)) {
      buttons.push(
        <Button key="delete" variant="danger" onClick={() => setShowDeleteDialog(true)}>
          Xoá
        </Button>
      );
    }

    if (canEditTask(user, task)) {
      buttons.push(
        <Button key="edit" variant="secondary" onClick={() => onEdit?.(task)}>
          Sửa
        </Button>
      );
    }

    if (canSubmitTask(user, task)) {
      buttons.push(
        <Button
          key="submit"
          onClick={handleSubmit}
          loading={submitTask.isPending || updateStatus.isPending}
        >
          {task.status === 'REJECTED' ? 'Gửi duyệt lại' : 'Gửi duyệt'}
        </Button>
      );
    }

    (['DOING', 'DONE', 'NEW'] as TaskStatus[])
      .filter((next) => next !== task.status && canMoveTask(user, task, next))
      .forEach((next) => {
        buttons.push(
          <Button
            key={`move-${next}`}
            variant="secondary"
            onClick={() => handleMove(next)}
            loading={updateStatus.isPending}
          >
            Chuyển sang “{TASK_STATUS_LABEL[next]}”
          </Button>
        );
      });

    if (canRequestExtension(user, task, pendingExtension)) {
      buttons.push(
        <Button
          key="request-extension"
          variant="secondary"
          onClick={() => setShowExtensionModal(true)}
        >
          Xin gia hạn
        </Button>
      );
    }

    if (canApproveTask(user, task)) {
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

    if (canCloseTask(user, task)) {
      buttons.push(
        <Button
          key="close"
          onClick={() => handleMove('CLOSED')}
          loading={updateStatus.isPending}
        >
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
          {pendingExtension && (
            <ExtensionRequestBanner
              request={pendingExtension}
              onApprove={handleApproveExtension}
              onReject={handleRejectExtension}
              approving={approveExtension.isPending}
              rejecting={rejectExtension.isPending}
            />
          )}

          <div className="space-y-4 border-b border-outline-variant pb-6">
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
              <Badge tone={task.assignment_status === 'APPROVED' || task.assignment_status === 'ASSIGNED' ? 'success' :
                task.assignment_status === 'REJECTED' ? 'danger' : 'warning'}>
                {approvalConfig.label}
              </Badge>
            </div>

            <h2 className="text-headline-md text-on-surface font-bold">{task.title}</h2>

            <div className="grid grid-cols-2 gap-4 text-body-md">
              <div className="flex items-center gap-3">
                <FiUser className="text-on-surface-variant" />
                <div className="flex flex-1 flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Người thực hiện
                  </span>
                  {canAssign ? (
                    <Select
                      className="mt-1"
                      value={task.assignee_id ?? ''}
                      disabled={updateTask.isPending}
                      onChange={(e) => handleAssign(e.target.value)}
                      onClear={() => handleAssign('')}
                      options={[
                        { value: '', label: 'Chưa giao' },
                        ...(members ?? []).map((member) => ({
                          value: member.user_id,
                          label: member.user.full_name || member.user.username,
                        })),
                      ]}
                    />
                  ) : task.assignee ? (
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

              <div className="flex items-center gap-3">
                <FiUserPlus className="text-on-surface-variant" />
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

              <div className="flex items-center gap-3">
                <FiCalendar className="text-on-surface-variant" />
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

              <div className="flex items-center gap-3">
                <FiFlag className="text-on-surface-variant" />
                <div className="flex flex-col">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
                    Mức độ ưu tiên
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className={priorityConfig.color}>
                      <priorityConfig.icon className="text-base" />
                    </span>
                    <span className={`font-medium ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFolder className="text-on-surface-variant" />
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

              {task.rejection_reason && (
                <div className="flex items-center gap-3 col-span-2 bg-error-container rounded-lg p-3">
                  <FiInfo className="text-error" />
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

          <div className="space-y-8">
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-body-lg text-on-surface font-semibold">
                <FiAlignLeft className="text-on-surface-variant" />
                Mô tả công việc
              </h3>
              <div className="rounded-xl border border-outline-variant bg-surface p-4">
                <p className="whitespace-pre-wrap text-body-md text-on-surface-variant leading-relaxed">
                  {task.description || 'Chưa có mô tả'}
                </p>
              </div>
            </section>

            {reviewedExtensions.length > 0 && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-body-lg text-on-surface font-semibold">
                  <FiClock className="text-on-surface-variant" />
                  Lịch sử gia hạn
                </h3>
                <ul className="space-y-2">
                  {reviewedExtensions.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-outline-variant bg-surface p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusChip
                          tone={item.status === 'APPROVED' ? 'success' : 'danger'}
                        >
                          {EXTENSION_STATUS_LABEL[item.status]}
                        </StatusChip>
                        <span className="text-body-md text-on-surface">
                          {new Date(item.requested_due_date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="mt-1 text-body-md text-on-surface-variant">
                        {item.reason}
                      </p>
                      {item.reject_reason && (
                        <p className="mt-1 text-label-md text-error">
                          Lý do từ chối: {item.reject_reason}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <Comment projectId={null} taskId={task?.id} />
              {/* <Tabs tabs={tabs} /> */}
            </section>
          </div>
        </div>
      </Drawer>

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

      {showExtensionModal && (
        <ExtensionRequestModal
          open
          onClose={() => setShowExtensionModal(false)}
          onSubmit={handleRequestExtension}
          task={task}
          loading={requestExtension.isPending}
        />
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xoá công việc"
        description={`Bạn có chắc muốn xoá "${task.title}"?`}
        confirmLabel="Xoá"
        danger
        loading={deleteTask.isPending}
      />
    </>
  );
}
