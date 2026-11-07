/**
 * Servicio de API para tareas
 * EC3 F2 A10 - Consumo de API REST
 */
import type { ApiResponse, PaginatedResponse } from '../models/api.types';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../models/Task';
import type { TaskQueryParams } from '../models/task-view.types';
import { http } from './http.service';

function buildQueryString(params: Partial<TaskQueryParams>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== '' && value !== 'all',
  );

  if (entries.length === 0) return '';

  const qs = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `?${qs}`;
}

export const taskApiService = {
  getTasks(
    params: Partial<TaskQueryParams> = {},
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Task>> {
    const qs = buildQueryString(params);
    return http.get<PaginatedResponse<Task>>(`/tasks${qs}`, signal);
  },

  getTaskById(
    id: string,
    signal?: AbortSignal,
  ): Promise<ApiResponse<Task>> {
    return http.get<ApiResponse<Task>>(`/tasks/${id}`, signal);
  },

  createTask(
    input: CreateTaskInput,
    signal?: AbortSignal,
  ): Promise<ApiResponse<Task>> {
    return http.post<ApiResponse<Task>>('/tasks', input, signal);
  },

  updateTask(
    id: string,
    updates: UpdateTaskInput,
    signal?: AbortSignal,
  ): Promise<ApiResponse<Task>> {
    return http.patch<ApiResponse<Task>>(`/tasks/${id}`, updates, signal);
  },

  deleteTask(
    id: string,
    signal?: AbortSignal,
  ): Promise<void> {
    return http.delete<void>(`/tasks/${id}`, signal);
  },
};
