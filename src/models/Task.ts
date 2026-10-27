/**
 * Interfaz que define la estructura de una tarea
 * EC2 F2 A7 - Estado local, eventos y operaciones CRUD
 */
export interface Task {
  id: string;
  
  /** Título */
  title: string;
  
  /** Estado actual de la tarea */
  status: 'pending' | 'completed';
  
  /** Fecha de creación tarea*/
  createdAt: string;
  
  updatedAt: string;
}

export type TaskStatus = Task['status'];
