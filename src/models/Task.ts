/**
 * Interfaz que define la estructura de una tarea desde la API REST
 * EC3 F2 A10 - Consumo de API REST y CRUD Remoto
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = Task['status'];

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Task['priority'];
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Task['priority'];
  tags?: string[];
  dueDate?: string;
}
