import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskQuery } from '@/hooks/tasks/task.queries';
import type { Task } from '@/types/task';

export function useTaskDeepLink(
  tasks: Task[] | undefined,
  setSelectedTask: (task: Task) => void,
  setDrawerOpen: (open: boolean) => void,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get('task');
  const openedIdRef = useRef<string | null>(null);

  const taskFromList = tasks?.find((t) => t.id === taskId) ?? null;
  const fetched = useTaskQuery(taskId && !taskFromList ? taskId : undefined);
  const linkedTask = taskFromList ?? fetched.data ?? null;

  useEffect(() => {
    if (!taskId) {
      openedIdRef.current = null;
      return;
    }
    if (!linkedTask || openedIdRef.current === linkedTask.id) return;
    openedIdRef.current = linkedTask.id;
    setSelectedTask(linkedTask);
    setDrawerOpen(true);
  }, [taskId, linkedTask, setSelectedTask, setDrawerOpen]);

  const clearTaskParam = useCallback(() => {
    setSearchParams(
      (prev) => {
        prev.delete('task');
        return prev;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return { clearTaskParam };
}
