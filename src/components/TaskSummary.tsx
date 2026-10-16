/**
 * Componente TaskSummary - Resumen estadístico de tareas
 * EC2 F1 A6 - Cálculo dinámico con filter() y array methods
 */
import { Task } from '../models/Task';

interface TaskSummaryProps {
  tasks: Task[];
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
  // Cálculos dinámicos usando filter()
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;

  return (
    <section className="summary-grid" aria-label="Resumen de tareas">
      <article className="summary-card">
        <span>Total</span>
        <strong>{totalTasks}</strong>
      </article>

      <article className="summary-card">
        <span>Pendientes</span>
        <strong>{pendingTasks}</strong>
      </article>

      <article className="summary-card">
        <span>En progreso</span>
        <strong>{inProgressTasks}</strong>
      </article>

      <article className="summary-card">
        <span>Completadas</span>
        <strong>{completedTasks}</strong>
      </article>
    </section>
  );
}
