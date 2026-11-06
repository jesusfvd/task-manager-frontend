/**
 * Hook para gestionar la lista de tareas desde la API
 * EC3 F2 A10 - Consumo de API REST
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PageMeta } from '../models/api.types';
import type { RequestStatus } from '../models/request-status.type';
import type { Task } from '../models/Task';
import type { TaskQueryParams } from '../models/task-view.types';
import { taskApiService } from '../services/task.api.service';

interface UseTaskListReturn {
  tasks: Task[];
  status: RequestStatus;
  error: string | null;
  meta: PageMeta | null;
  loadTasks: (params?: Partial<TaskQueryParams>) => void;
  reload: () => void;
}

export function useTaskList(
  initialParams: Partial<TaskQueryParams> = {},
): UseTaskListReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const lastParamsRef = useRef<Partial<TaskQueryParams>>(initialParams);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadTasks = useCallback((params?: Partial<TaskQueryParams>) => {
    const effectiveParams = params ?? lastParamsRef.current;
    lastParamsRef.current = effectiveParams;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setError(null);

    taskApiService
      .getTasks(effectiveParams, controller.signal)
      .then((response) => {
        setTasks(response.data);
        setMeta(response.meta);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las tareas.';
        setError(message);
        setStatus('error');
      });
  }, []);

  const reload = useCallback(() => {
    loadTasks(lastParamsRef.current);
  }, [loadTasks]);

  useEffect(() => {
    loadTasks(initialParams);
    return () => {
      abortControllerRef.current?.abort();
    };
    // Solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tasks, status, error, meta, loadTasks, reload };
}
