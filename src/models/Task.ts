/**
 * Interfaz que define la estructura de una tarea
 * EC2 F1 A6 - Modelado y renderizado dinámico
 */
export interface Task {
  /** Identificador único de la tarea */
  id: string;
  
  /** Título o descripción de la tarea */
  title: string;
  
  /** Estado actual de la tarea */
  status: 'pending' | 'in-progress' | 'completed';
  
  /** Fecha de creación de la tarea */
  createdAt: Date;
}

/**
 * Tipo para los posibles estados de una tarea
 */
export type TaskStatus = Task['status'];
