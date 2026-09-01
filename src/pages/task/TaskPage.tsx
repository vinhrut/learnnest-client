import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { KanbanBoard, TaskDetailDrawer, TaskForm } from '@/components/feature/task';
import { useTasksQuery, useCreateTask, useUpdateTask } from '@/hooks/tasks/task.queries';
import type { Task } from '@/types/task';

export function TaskPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Use real API data when backend is ready
  const { data: tasksData, isLoading, refetch } = useTasksQuery();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  // Use API tasks if available, otherwise empty
  const displayTasks = tasksData?.data ?? [];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, payload: data },
        {
          onSuccess: () => {
            setFormOpen(false);
            refetch();
          },
        }
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
          refetch();
        },
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Project name + View toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-headline-md text-on-surface font-bold">Dự án Alpha</h2>
            <div className="flex overflow-hidden rounded-lg border border-outline-variant">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-soft text-primary text-label-md font-semibold border-r border-outline-variant">
                <span className="material-symbols-outlined text-base">view_kanban</span>
                Bảng
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container text-label-md transition-colors">
                <span className="material-symbols-outlined text-base">list</span>
                Danh sách
              </button>
            </div>
          </div>

          {/* Right: Create Task */}
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleCreateTask} leftIcon="add">
              Tạo công việc
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden p-6 kanban-scroll">
        <KanbanBoard
          tasks={displayTasks}
          onTaskClick={handleTaskClick}
          loading={isLoading}
        />
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEditTask}
        onRefresh={handleRefresh}
      />

      {/* Create/Edit Task Form */}
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask ?? undefined}
        loading={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
}
