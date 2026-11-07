/**
 * Componente TaskItem - Representa una tarea individual
 * EC3 F2 A10 - Consumo de API REST (operaciones async)
 * EC3 F3 A11 - Botón delete visible solo para admin
 */
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router';
import type { Task } from '../models/Task';
import { taskApiService } from '../services/task.api.service';
import { formatTaskDate } from '../utils/date';
import { TASK_TITLE_MAX_LENGTH, validateTaskTitle } from '../utils/task-validation';
import { useAuth } from '../hooks/useAuth';

interface TaskItemProps {
  task: Task;
  onMutated: () => void;
}

const STATUS_LABELS: Record<Task['status'], string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
};

const NEXT_STATUS: Record<Task['status'], Task['status']> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending',
};

const TOGGLE_LABELS: Record<Task['status'], string> = {
  pending: 'Iniciar',
  in_progress: 'Completar',
  completed: 'Reabrir',
};

export function TaskItem({ task, onMutated }: TaskItemProps) {
  const { _id, title, status, updatedAt } = task;
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [fieldError, setFieldError] = useState('');
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState('');

  // Solo admin puede ver el botón de eliminar
  const canDelete = user?.role === 'admin';

  function handleStartEdit() {
    setDraftTitle(title);
    setFieldError('');
    setMutationError('');
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraftTitle(title);
    setFieldError('');
    setIsEditing(false);
  }

  function handleDraftChange(value: string): void {
    setDraftTitle(value);
    if (fieldError) {
      setFieldError(validateTaskTitle(value) ?? '');
    }
  }

  async function handleEditSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const validationMessage = validateTaskTitle(draftTitle);
    if (validationMessage) {
      setFieldError(validationMessage);
      return;
    }
    setIsMutating(true);
    setMutationError('');
    try {
      await taskApiService.updateTask(_id, { title: draftTitle.trim() });
      setFieldError('');
      setIsEditing(false);
      onMutated();
    } catch {
      setMutationError('No se pudo guardar el cambio. Intenta de nuevo.');
    } finally {
      setIsMutating(false);
    }
  }

  async function handleToggleStatus(): Promise<void> {
    setIsMutating(true);
    setMutationError('');
    try {
      await taskApiService.updateTask(_id, { status: NEXT_STATUS[status] });
      onMutated();
    } catch {
      setMutationError('No se pudo cambiar el estado. Intenta de nuevo.');
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!window.confirm(`¿Eliminar la tarea "${title}"?`)) return;
    setIsMutating(true);
    setMutationError('');
    try {
      await taskApiService.deleteTask(_id);
      onMutated();
    } catch {
      setMutationError('No se pudo eliminar la tarea. Intenta de nuevo.');
      setIsMutating(false);
    }
  }

  return (
    <article
      className={`task-item task-item--${status}`}
      role="listitem"
    >
      <div className="task-item__content">
        {isEditing ? (
          <form
            className="task-item__edit-form"
            onSubmit={handleEditSubmit}
            noValidate
          >
            <label className="sr-only" htmlFor={`edit-task-${_id}`}>
              Editar título de la tarea
            </label>
            <input
              id={`edit-task-${_id}`}
              className="task-item__edit-input"
              value={draftTitle}
              maxLength={TASK_TITLE_MAX_LENGTH}
              onChange={(event) => handleDraftChange(event.target.value)}
              disabled={isMutating}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? `edit-error-${_id}` : undefined}
              autoFocus
            />
            {fieldError && (
              <p id={`edit-error-${_id}`} className="field-error" role="alert">
                {fieldError}
              </p>
            )}
            <div className="task-item__edit-actions">
              <button type="submit" disabled={isMutating} aria-busy={isMutating}>
                {isMutating ? 'Guardando…' : 'Guardar'}
              </button>
              <button type="button" onClick={handleCancelEdit} disabled={isMutating}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3 className="task-item__title">{title}</h3>
            <span className={`status-badge status-badge--${status}`}>
              {STATUS_LABELS[status]}
            </span>
            <p className="task-item__date">
              Actualizada:{' '}
              <time dateTime={updatedAt}>{formatTaskDate(updatedAt)}</time>
            </p>
          </>
        )}
        {mutationError && (
          <p className="field-error" role="alert">{mutationError}</p>
        )}
      </div>

      <div
        className="task-item__actions"
        role="group"
        aria-label={`Acciones para ${title}`}
      >
        {!isEditing && (
          <Link
            className="button-link button-link--secondary"
            to={`/tasks/${_id}`}
          >
            Ver detalle
          </Link>
        )}
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={isEditing || isMutating}
          aria-busy={isMutating}
        >
          {TOGGLE_LABELS[status]}
        </button>
        <button
          type="button"
          onClick={handleStartEdit}
          disabled={isEditing || isMutating}
        >
          Editar
        </button>
        {canDelete && (
          <button
            type="button"
            className="button-danger"
            onClick={handleDelete}
            disabled={isEditing || isMutating}
            aria-busy={isMutating}
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
}
