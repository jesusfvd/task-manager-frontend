/**
 * Página de gestión de tareas
 * EC3 F2 A10 - Consumo de API REST con paginación y filtros remotos
 */
import { useCallback, useState } from 'react';
import { AsyncStatus } from '../components/AsyncStatus';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { TaskPagination } from '../components/TaskPagination';
import { TaskSummary } from '../components/TaskSummary';
import { useTaskList } from '../hooks/useTaskList';
import type { TaskFilter } from '../models/task-view.types';

const DEFAULT_LIMIT = 10;

export function TasksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskFilter>('all');

  const { tasks, status: loadStatus, error, meta, loadTasks, reload } =
    useTaskList({ page, limit: DEFAULT_LIMIT, search, status });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    loadTasks({ page: newPage, limit: DEFAULT_LIMIT, search, status });
  }, [loadTasks, search, status]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
    loadTasks({ page: 1, limit: DEFAULT_LIMIT, search: value, status });
  }, [loadTasks, status]);

  const handleStatusChange = useCallback((value: TaskFilter) => {
    setStatus(value);
    setPage(1);
    loadTasks({ page: 1, limit: DEFAULT_LIMIT, search, status: value });
  }, [loadTasks, search]);

  const handleClear = useCallback(() => {
    setSearch('');
    setStatus('all');
    setPage(1);
    loadTasks({ page: 1, limit: DEFAULT_LIMIT, search: '', status: 'all' });
  }, [loadTasks]);

  const emptyMessage =
    search.trim() !== '' || status !== 'all'
      ? 'No hay tareas que coincidan con los criterios.'
      : 'Utiliza el formulario para registrar una nueva actividad.';

  return (
    <div className="page-stack">
      <section
        className="page-introduction"
        aria-labelledby="tasks-page-title"
      >
        <p className="section-heading__eyebrow">Gestión</p>
        <h2 id="tasks-page-title">Mis tareas</h2>
        <p>
          Registra, consulta y actualiza las actividades almacenadas en el
          servidor.
        </p>
      </section>

      <TaskForm onTaskCreated={reload} />

      <TaskFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onClear={handleClear}
      />

      <TaskSummary meta={meta} />

      <AsyncStatus
        status={loadStatus}
        error={error}
        isEmpty={loadStatus === 'success' && tasks.length === 0}
        emptyMessage={emptyMessage}
        onRetry={reload}
      />

      {loadStatus === 'success' && tasks.length > 0 && (
        <>
          <TaskList tasks={tasks} onMutated={reload} />
          {meta && <TaskPagination meta={meta} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  );
}
