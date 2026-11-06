/**
 * Componente TaskList - Lista de tareas con renderizado dinámico
 * EC3 F2 A10 - Adaptado para API REST (usa _id)
 */
import type { Task } from '../models/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onMutated: () => void;
}

export function TaskList({ tasks, onMutated }: TaskListProps) {
  const resultLabel =
    tasks.length === 1 ? '1 tarea' : `${tasks.length} tareas`;

  return (
    <section className="panel" aria-labelledby="task-list-title">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Actividades</p>
          <h2 id="task-list-title">Tareas registradas</h2>
        </div>
        <span className="result-count">{resultLabel}</span>
      </div>

      <div className="task-list" role="list">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onMutated={onMutated} />
        ))}
      </div>
    </section>
  );
}
