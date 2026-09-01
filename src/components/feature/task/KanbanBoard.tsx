import { useState, useMemo } from 'react';
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
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/types/task';
import { TASK_STATUS_LABEL } from '@/types/task';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
  loading?: boolean;
}

const COLUMNS: { status: TaskStatus; isProtected?: boolean }[] = [
  { status: 'DRAFT', isProtected: true },
  { status: 'TODO' },
  { status: 'IN_PROGRESS' },
  { status: 'DONE' },
];

export function KanbanBoard({ tasks, onTaskClick, onTaskMove, loading }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Update local tasks when props change
  useMemo(() => {
    setLocalTasks(tasks);
  }, [tasks]);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the containers
    const activeTask = findTaskById(activeId);
    if (!activeTask) return;

    // Check if over is a column (status)
    const overStatus = COLUMNS.find((col) => col.status === overId)?.status;
    if (overStatus && activeTask.status !== overStatus) {
      // Move task to new column (optimistic update)
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === activeId ? { ...task, status: overStatus } : task
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

    const draggedTask = findTaskById(activeId);
    if (!draggedTask) return;

    // Check if dropped on a column
    const newStatus = COLUMNS.find((col) => col.status === overId)?.status;
    if (newStatus && draggedTask.status !== newStatus) {
      onTaskMove?.(activeId, newStatus);
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
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          return (
            <KanbanColumn
              key={column.status}
              title={TASK_STATUS_LABEL[column.status]}
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <TaskCard task={activeTask} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  );
}
