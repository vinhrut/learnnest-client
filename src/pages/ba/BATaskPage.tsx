import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { KanbanBoard, TaskDetailDrawer, TaskForm } from '@/components/feature/task';
import { useTasksQuery, useCreateTask } from '@/hooks/tasks/task.queries';
import type { Task } from '@/types/task';

// Mock tasks for BA
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    code: 'TSK-1001',
    title: 'Phân tích yêu cầu dự án CRM',
    description: 'Thu thập và phân tích yêu cầu từ khách hàng',
    status: 'TODO',
    priority: 'HIGH',
    approval_status: 'PENDING',
    project_id: 'p1',
    assignee_id: 'u1',
    creator_id: 'u1',
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: '2',
    code: 'TSK-1002',
    title: 'Viết tài liệu specification',
    description: 'Viết tài liệu spec chi tiết cho module',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    approval_status: 'APPROVED',
    project_id: 'p1',
    assignee_id: 'u1',
    creator_id: 'u1',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: '3',
    code: 'TSK-1003',
    title: 'Review thiết kế database',
    description: 'Review schema database mới',
    status: 'DONE',
    priority: 'MEDIUM',
    approval_status: 'APPROVED',
    project_id: 'p1',
    assignee_id: 'u1',
    creator_id: 'u1',
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  },
];

export function BATaskPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Try to use real API data, fallback to mock
  const { data: tasksData, isLoading, refetch, isError } = useTasksQuery();
  const createTask = useCreateTask();

  // Use API tasks if available, otherwise use mock
  const displayTasks = isError ? MOCK_TASKS : (tasksData?.data ?? MOCK_TASKS);

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
    createTask.mutate(data, {
      onSuccess: () => {
        setFormOpen(false);
        refetch();
      },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-headline-md text-on-surface font-bold">Công việc của tôi</h2>
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Create Task Button */}
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
          loading={isLoading && !isError}
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
        loading={createTask.isPending}
      />
    </div>
  );
}
