/**
 * Interfaz que define la estructura de una tarea
 * EC2 F2 A7 - Estado local, eventos y operaciones CRUD
 */
export interface Task {
  /** Identificador único de la tarea */
  id: string;
  
  /** Título o descripción de la tarea */
  title: string;
  
  /** Estado actual de la tarea */
  status: 'pending' | 'completed';
  
  /** Fecha de creación de la tarea (ISO string) */
  createdAt: string;
  
  /** Fecha de última actualización de la tarea (ISO string) */
  updatedAt: string;
}

/**
 * Tipo para los posibles estados de una tarea
 */
export type TaskStatus = Task['status'];
