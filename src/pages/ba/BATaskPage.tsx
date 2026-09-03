import { useState } from 'react';
import { FiColumns, FiList } from 'react-icons/fi';
import { KanbanBoard, TaskDetailDrawer, TaskForm } from '@/components/feature/task';
import { useTasksQuery, useUpdateTask, useUpdateTaskStatus } from '@/hooks/tasks/task.queries';
import { useAuth } from '@/hooks/useAuth';
import { canMoveTask } from '@/lib/permissions';
import type { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

export function BATaskPage() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasksData, isLoading, refetch } = useTasksQuery(
    user ? { assignee_id: user.id } : undefined,
  );
  const updateTask = useUpdateTask();
  const updateTaskStatus = useUpdateTaskStatus();

  const displayTasks = tasksData ?? [];

  const handleFormSubmit = (data: CreateTaskRequest | UpdateTaskRequest) => {
    if (!editingTask) return;
    updateTask.mutate(
      { id: editingTask.id, payload: data },
      {
        onSuccess: () => {
          setFormOpen(false);
          refetch();
        },
      },
    );
  };

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus.mutate(
      { id: taskId, payload: { status: newStatus } },
      { onSuccess: () => refetch() },
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-headline-md text-on-surface font-bold">Công việc của tôi</h2>
            <div className="flex overflow-hidden rounded-lg border border-outline-variant">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-soft text-primary text-label-md font-semibold border-r border-outline-variant">
                <FiColumns className="text-base" />
                Bảng
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container text-label-md transition-colors">
                <FiList className="text-base" />
                Danh sách
              </button>
            </div>
          </div>

          <p className="text-body-md text-on-surface-variant">
            Tạo công việc mới ở trang chi tiết dự án.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 kanban-scroll">
        <KanbanBoard
          tasks={displayTasks}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setDrawerOpen(true);
          }}
          onTaskMove={handleTaskMove}
          canMove={(task, newStatus) => canMoveTask(user, task, newStatus)}
          loading={isLoading}
        />
      </div>

      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={(task) => {
          setEditingTask(task);
          setFormOpen(true);
        }}
        onRefresh={refetch}
      />

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask ?? undefined}
        projectId={editingTask?.project_id}
        loading={updateTask.isPending}
      />
    </div>
  );
}
