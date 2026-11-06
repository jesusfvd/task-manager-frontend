export type TaskFilter = 'all' | 'pending' | 'in_progress' | 'completed';

export type TaskSort =
  | 'updated-desc'
  | 'created-desc'
  | 'title-asc';

export interface TaskQueryParams {
  page: number;
  limit: number;
  search: string;
  status: TaskFilter;
  sortBy: string;
  order: 'asc' | 'desc';
}
