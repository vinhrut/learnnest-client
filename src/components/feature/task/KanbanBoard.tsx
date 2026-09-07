import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types/task';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
  loading?: boolean;
  canMove?: (task: Task, newStatus: TaskStatus) => boolean;
}

const KANBAN_COLUMNS: { status: TaskStatus; label: string; isProtected?: boolean }[] = [
  { status: 'DRAFT', label: 'Bản nháp', isProtected: true },
  { status: 'WAITING_APPROVAL', label: 'Chờ duyệt', isProtected: true },
  { status: 'NEW', label: 'Cần làm' },
  { status: 'DOING', label: 'Đang làm' },
  { status: 'DONE', label: 'Đã xong' },
  { status: 'REJECTED', label: 'Bị từ chối', isProtected: true },
];

export function KanbanBoard({ tasks, onTaskClick, onTaskMove, loading, canMove }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [syncedTasks, setSyncedTasks] = useState(tasks);

  // Sync local copy when the tasks prop changes (render-phase pattern).
  if (tasks !== syncedTasks) {
    setSyncedTasks(tasks);
    setLocalTasks(tasks);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status: TaskStatus) =>
    localTasks.filter((t) => t.status === status);

  const findTaskById = (id: string): Task | undefined => {
    return localTasks.find((task) => task.id === id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    if (task) {
      setActiveTask(task);
    }
  };

  const resolveTargetStatus = (overId: string): TaskStatus | undefined => {
    // Trường hợp 1: thả trực tiếp vào vùng column
    const directColumn = KANBAN_COLUMNS.find((col) => col.status === overId);
    if (directColumn) return directColumn.status;

    // Trường hợp 2: thả lên một task khác -> lấy status của task đó
    const overTask = localTasks.find((t) => t.id === overId);
    return overTask?.status;
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedTask = findTaskById(activeId);
    if (!draggedTask) return;

    const targetStatus = resolveTargetStatus(overId);
    if (
      targetStatus &&
      draggedTask.status !== targetStatus &&
      (canMove?.(draggedTask, targetStatus) ?? true)
    ) {
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: targetStatus } : task
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedTask = tasks.find((task) => task.id === activeId);
    if (!draggedTask) return;

    const targetStatus = resolveTargetStatus(overId);
    if (targetStatus && draggedTask.status !== targetStatus) {
      if (canMove && !canMove(draggedTask, targetStatus)) {
        setLocalTasks(tasks);
        return;
      }
      onTaskMove?.(activeId, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          return (
            <KanbanColumn
              key={column.status}
              title={column.label}
              tasks={columnTasks}
              count={columnTasks.length}
              status={column.status}
              onTaskClick={onTaskClick}
              isProtected={column.isProtected}
              loading={loading}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  );
}
