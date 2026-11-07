/**
 * Página de detalle de tarea
 * EC3 F2 A10 - Carga remota por ID con AbortController
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AsyncStatus } from '../components/AsyncStatus';
import type { RequestStatus } from '../models/request-status.type';
import type { Task } from '../models/Task';
import { HttpError } from '../services/http.service';
import { taskApiService } from '../services/task.api.service';
import { formatTaskDate } from '../utils/date';

const STATUS_LABELS: Record<Task['status'], string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
};

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loadStatus, setLoadStatus] = useState<RequestStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const controller = new AbortController();
    setLoadStatus('loading');
    setError(null);

    taskApiService
      .getTaskById(taskId, controller.signal)
      .then((response) => {
        setTask(response.data);
        setLoadStatus('success');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (err instanceof HttpError && err.status === 404) {
          setError('La tarea solicitada no existe o fue eliminada.');
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar la tarea.',
          );
        }
        setLoadStatus('error');
      });

    return () => {
      controller.abort();
    };
  }, [taskId]);

  async function handleDelete(): Promise<void> {
    if (!task) return;
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
    setIsDeleting(true);
    try {
      await taskApiService.deleteTask(task._id);
      navigate('/tasks', { replace: true });
    } catch {
      setError('No se pudo eliminar la tarea. Intenta de nuevo.');
      setIsDeleting(false);
    }
  }

  return (
    <div className="page-stack">
      <AsyncStatus
        status={loadStatus}
        error={error}
        onRetry={() => navigate(0)}
      />

      {loadStatus === 'success' && task && (
        <article
          className="panel task-detail"
          aria-labelledby="task-detail-title"
        >
          <p className="section-heading__eyebrow">Detalle</p>
          <h2 id="task-detail-title">{task.title}</h2>

          <dl className="task-detail__grid">
            <div>
              <dt>Identificador</dt>
              <dd>{task._id}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{STATUS_LABELS[task.status]}</dd>
            </div>
            <div>
              <dt>Prioridad</dt>
              <dd>{task.priority}</dd>
            </div>
            {task.description && (
              <div>
                <dt>Descripción</dt>
                <dd>{task.description}</dd>
              </div>
            )}
            <div>
              <dt>Fecha de creación</dt>
              <dd>
                <time dateTime={task.createdAt}>
                  {formatTaskDate(task.createdAt)}
                </time>
              </dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>
                <time dateTime={task.updatedAt}>
                  {formatTaskDate(task.updatedAt)}
                </time>
              </dd>
            </div>
          </dl>

          <div className="task-detail__actions">
            <Link
              className="button-link button-link--secondary"
              to="/tasks"
            >
              Volver a tareas
            </Link>
            <button
              type="button"
              className="button-danger"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-busy={isDeleting}
            >
              {isDeleting ? 'Eliminando…' : 'Eliminar tarea'}
            </button>
          </div>
        </article>
      )}
    </div>
  );
}
