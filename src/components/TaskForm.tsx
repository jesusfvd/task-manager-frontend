/**
 * Componente TaskForm - Formulario de registro de tareas
 * EC3 F2 A10 - Consumo de API REST (async/await)
 */
import type { FormEvent } from 'react';
import { useState } from 'react';
import { HttpError } from '../services/http.service';
import { taskApiService } from '../services/task.api.service';
import { TASK_TITLE_MAX_LENGTH, validateTaskTitle } from '../utils/task-validation';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTitleChange(value: string): void {
    setTitle(value);
    if (error) {
      setError(validateTaskTitle(value) ?? '');
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const validationMessage = validateTaskTitle(title);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await taskApiService.createTask({ title: title.trim() });
      setTitle('');
      onTaskCreated();
    } catch (err) {
      if (err instanceof HttpError && err.status === 400) {
        setError('El título no es válido según el servidor.');
      } else {
        setError('No se pudo crear la tarea. Intenta de nuevo.');
      }
      console.error('[TaskForm] Error al crear tarea:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="task-form-title">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Registro</p>
          <h2 id="task-form-title">Nueva tarea</h2>
        </div>
      </div>

      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="task-title">Título de la tarea</label>
        <div className="task-form__row">
          <input
            id="task-title"
            name="title"
            type="text"
            placeholder="Ejemplo: revisar documentación"
            maxLength={TASK_TITLE_MAX_LENGTH}
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'task-title-help task-title-error' : 'task-title-help'}
          />
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Agregar tarea'}
          </button>
        </div>
        <p id="task-title-help" className="helper-text">
          {title.length}/{TASK_TITLE_MAX_LENGTH} caracteres
        </p>
        {error && (
          <p id="task-title-error" className="field-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
