import { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';
import { KanbanBoard, TaskDetailDrawer, TaskForm } from '@/components/feature/task';
import { AddMemberModal } from '@/components/feature/project/AddMemberModal';
import {
  useProjectQuery,
  useProjectMembersQuery,
  useRemoveProjectMember,
} from '@/hooks/projects/project.queries';
import {
  useTasksByProjectQuery,
  useCreateTask,
  useUpdateTask,
  useUpdateTaskStatus,
} from '@/hooks/tasks/task.queries';
import { useAuth } from '@/hooks/useAuth';
import { canCreateTask, canManageProject, canMoveTask } from '@/lib/permissions';
import {
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_COLOR,
  PROJECT_MEMBER_ROLE_LABEL,
} from '@/types/project';
import type {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@/types/task';
import { ChatBox } from '@/components/chatBoxs/chatBoxs';

import "./ProjectDetailPage.css"

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const projectsPath = location.pathname.replace(/\/projects\/[^/]+$/, '/projects');

  const { data: project, isLoading: projectLoading } = useProjectQuery(id);
  const { data: members, isLoading: membersLoading } = useProjectMembersQuery(id);
  const removeMember = useRemoveProjectMember();

  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useTasksByProjectQuery(id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const updateTaskStatus = useUpdateTaskStatus();

  const [showAddMember, setShowAddMember] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{ userId: string; name: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [turnOn, setTurnOn] = useState(false)
  const isOwner = canManageProject(user, project);
  const canCreate = canCreateTask(user);

  const visibleTasks = useMemo(() => {
    const all = tasks ?? [];
    if (!user) return [];
    if (isOwner || user.roles.includes('LEAD')) return all;
    return all.filter(
      (task) => task.assignee_id === user.id || task.creator_id === user.id,
    );
  }, [tasks, user, isOwner]);

  if (projectLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted">Không tìm thấy dự án</p>
        <Button variant="secondary" onClick={() => navigate(projectsPath)}>
          <FiArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }
  const handleRemoveMember = async () => {
    if (!removeConfirm || !id) return;
    await removeMember
      .mutateAsync({ projectId: id, userId: removeConfirm.userId })
      .then(() => setRemoveConfirm(null))
      .catch(() => undefined);
  };

  const handleFormSubmit = (data: CreateTaskRequest | UpdateTaskRequest) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, payload: data },
        {
          onSuccess: () => {
            setFormOpen(false);
            refetchTasks();
          },
        },
      );
    } else if (id) {
      createTask.mutate(
        { projectId: id, payload: data as CreateTaskRequest },
        {
          onSuccess: () => {
            setFormOpen(false);
            refetchTasks();
          },
        },
      );
    }
  };

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus.mutate(
      { id: taskId, payload: { status: newStatus } },
      { onSuccess: () => refetchTasks() },
    );
  };

  // chatBox
  const handleTurnOnBox = () => {
    turnOn ? setTurnOn(false) : setTurnOn(true)
  }
  return (
    <div>
      <div>
        <PageHeader
          title={project.name}
          subtitle={`Mã dự án: ${project.code}`}
          actions={
            <Button variant="secondary" onClick={() => navigate(projectsPath)}>
              <FiArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          }
        />

        <div className="mb-6 rounded-xl border border-line bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Trạng thái</p>
              <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${PROJECT_STATUS_COLOR[project.status]}`}>
                {PROJECT_STATUS_LABEL[project.status]}
              </span>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Mã dự án</p>
              <p className="text-sm font-medium text-ink">{project.code}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Ngày tạo</p>
              <p className="text-sm text-ink">
                {new Date(project.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Chủ sở hữu</p>
              <p className="text-sm font-medium text-ink">
                {members?.find((m) => m.project_role === 'OWNER')?.user.full_name || '-'}
              </p>
            </div>
          </div>

          {project.description && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-1 text-xs font-medium text-muted">Mô tả</p>
              <p className="text-sm text-ink">{project.description}</p>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-xl border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Thành viên</h2>
            {isOwner && (
              <Button size="sm" onClick={() => setShowAddMember(true)}>
                <FiPlus className="h-4 w-4" />
                Thêm thành viên
              </Button>
            )}
          </div>

          {membersLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner />
            </div>
          ) : members && members.length > 0 ? (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between rounded-lg border border-line p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.user.avatar_url}
                      name={member.user.full_name || member.user.username}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {member.user.full_name || member.user.username}
                        {member.project_role === 'OWNER' && (
                          <span className="ml-2 text-xs text-primary">(Chủ sở hữu)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-canvas px-2 py-0.5 text-xs font-medium text-muted">
                      {PROJECT_MEMBER_ROLE_LABEL[member.project_role]}
                    </span>
                    {isOwner && member.project_role !== 'OWNER' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRemoveConfirm({
                            userId: member.user_id,
                            name: member.user.full_name || member.user.username,
                          })
                        }
                        className="text-danger hover:bg-danger/10"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">Chưa có thành viên nào</p>
          )}
        </div>

        <div className="rounded-xl border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Công việc</h2>
              <p className="text-xs text-muted">
                {isOwner || user?.roles.includes('LEAD')
                  ? 'Toàn bộ công việc của dự án.'
                  : 'Công việc bạn được giao hoặc đã tạo.'}
              </p>
            </div>
            {canCreate && (
              <Button
                size="sm"
                onClick={() => {
                  setEditingTask(null);
                  setFormOpen(true);
                }}
              >
                <FiPlus className="h-4 w-4" />
                Tạo công việc
              </Button>
            )}
          </div>

          <div className="h-[560px] overflow-hidden kanban-scroll">
            <KanbanBoard
              tasks={visibleTasks}
              loading={tasksLoading}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setDrawerOpen(true);
              }}
              onTaskMove={handleTaskMove}
              canMove={(task, newStatus) => canMoveTask(user, task, newStatus)}
            />
          </div>
        </div>

        {id && (
          <AddMemberModal
            projectId={id}
            open={showAddMember}
            onClose={() => setShowAddMember(false)}
          />
        )}

        <ConfirmDialog
          open={!!removeConfirm}
          onClose={() => setRemoveConfirm(null)}
          onConfirm={handleRemoveMember}
          title="Xóa thành viên"
          description={`Bạn có chắc muốn xóa "${removeConfirm?.name}" khỏi dự án?`}
          confirmLabel="Xóa"
          danger
          loading={removeMember.isPending}
        />

        <TaskDetailDrawer
          task={selectedTask}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onEdit={(task) => {
            setEditingTask(task);
            setFormOpen(true);
          }}
          onRefresh={refetchTasks}
        />

        <TaskForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          task={editingTask ?? undefined}
          projectId={id}
          loading={createTask.isPending || updateTask.isPending}
        />
      </div>

      <div className=''>
        <div
          onClick={() => handleTurnOnBox()}
          className='bg-blue-400 text-white w-12 h-12 rounded-[100%] flex justify-center items-center text-2xl  cursor-pointer fixItem'>
          c

        </div>
        <div style={{ display: turnOn ? "block" : "none" }}
          className='w-70 bg-white chatBox border border-gray-200 rounded-3xl overflow-hidden'>
            <div onClick={() => handleTurnOnBox()} className='cursor-pointer h-8 flex justify-end p-2 text-3xl items-center border border-b-gray-200 border-t-gray-200 border-l-gray-200 border-r-white '>
              -
            </div>
          {
            id && <ChatBox id={id} />
          }
        </div>

      </div>

    </div>
  );
}
