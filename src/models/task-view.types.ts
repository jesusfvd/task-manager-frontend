
import type { TaskStatus } from './Task';


export type TaskFilter = 'all' | TaskStatus;


export type TaskSort =
  | 'updated-desc'
  | 'created-desc'
  | 'title-asc';


export interface TaskViewOptions {
  /** Texto de búsqueda para filtrar por título */
  query: string;
  /** Filtro por estado */
  filter: TaskFilter;
  /** Criterio de ordenamiento */
  sortBy: TaskSort;
}
