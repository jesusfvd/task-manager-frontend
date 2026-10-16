/**
 * Componente TaskList - Lista de tareas con renderizado dinámico
 * EC2 F1 A6 - Implementa map() con key prop y renderizado condicional
 */
import { Task } from '../models/Task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filterStatus?: 'all' | 'pending' | 'in-progress' | 'completed';
}

export function TaskList({ tasks, filterStatus = 'all' }: TaskListProps) {
  // Filtrado dinámico de tareas
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  // Renderizado condicional: estado vacío
  if (filteredTasks.length === 0) {
    return (
      <section className="panel" aria-labelledby="task-list-title">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Actividades</p>
            <h2 id="task-list-title">Tareas registradas</h2>
          </div>
          <span className="result-count">0 tareas</span>
        </div>

        <div className="empty-state">
          <p>
            {filterStatus === 'all'
              ? 'No hay tareas registradas. ¡Crea tu primera tarea!'
              : `No hay tareas con estado "${filterStatus}".`}
          </p>
        </div>
      </section>
    );
  }

  // Renderizado dinámico con map() y key prop
  return (
    <section className="panel" aria-labelledby="task-list-title">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Actividades</p>
          <h2 id="task-list-title">Tareas registradas</h2>
        </div>
        <span className="result-count">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'tarea' : 'tareas'}
        </span>
      </div>

      <div className="task-list" role="list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
