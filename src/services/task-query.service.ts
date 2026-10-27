/**
 * Servicio de consulta de tareas
 * EC2 F3 A8 - Búsqueda, filtros y ordenamiento
 */
import type { Task } from '../models/Task';
import type {
  TaskSort,
  TaskViewOptions,
} from '../models/task-view.types';


const titleCollator = new Intl.Collator('es-MX', {
  sensitivity: 'base',
});

/**
 * Función de comparación para ordenar tareas
 * 
 * @param firstTask - Primera tarea a comparar
 * @param secondTask - Segunda tarea a comparar
 * @param sortBy - Criterio de ordenamiento
 * @returns Número negativo, cero o positivo según el orden
 */
function compareTasks(
  firstTask: Task,
  secondTask: Task,
  sortBy: TaskSort,
): number {
  switch (sortBy) {
    case 'created-desc':
      return (
        Date.parse(secondTask.createdAt) -
        Date.parse(firstTask.createdAt)
      );

    case 'title-asc':
      return titleCollator.compare(
        firstTask.title,
        secondTask.title,
      );

    case 'updated-desc':
    default:
      return (
        Date.parse(secondTask.updatedAt) -
        Date.parse(firstTask.updatedAt)
      );
  }
}

/**
 * Obtiene las tareas visibles según los criterios de búsqueda, filtro y ordenamiento
 * 
 * NO modifica el array original - Todas las operaciones son inmutables
 * 
 * @param tasks - Colección completa de tareas
 * @param options - Criterios de consulta
 * @returns Array filtrado y ordenado de tareas visibles
 */
export function getVisibleTasks(
  tasks: Task[],
  options: TaskViewOptions,
): Task[] {
  const normalizedQuery = options.query
    .trim()
    .toLocaleLowerCase('es-MX');

  const filteredTasks = tasks.filter((task) => {
    const matchesQuery = task.title
      .toLocaleLowerCase('es-MX')
      .includes(normalizedQuery);

    const matchesFilter =
      options.filter === 'all' ||
      task.status === options.filter;

    return matchesQuery && matchesFilter;
  });

  return [...filteredTasks].sort((firstTask, secondTask) =>
    compareTasks(firstTask, secondTask, options.sortBy),
  );
}
