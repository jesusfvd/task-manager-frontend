/**
 * Servicio de persistencia local con localStorage
 * EC2 F3 A8 - Almacenamiento y recuperación con type guards
 */
import type {
  Task,
  TaskStatus,
} from '../models/Task';

const STORAGE_KEY = 'task-manager.tasks';


function isTaskStatus(
  value: unknown,
): value is TaskStatus {
  return value === 'pending' || value === 'completed';
}


function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const task = value as Partial<Task>;

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    isTaskStatus(task.status) &&
    typeof task.createdAt === 'string' &&
    Number.isFinite(Date.parse(task.createdAt)) &&
    typeof task.updatedAt === 'string' &&
    Number.isFinite(Date.parse(task.updatedAt))
  );
}

/**
 * Carga las tareas desde localStorage
 * 
 * @param fallbackTasks - Tareas por defecto si no hay datos válidos guardados
 * @returns Array de tareas recuperadas o fallback
 * 
 * Manejo defensivo:
 * - Si no hay datos guardados → retorna fallback
 * - Si los datos están corruptos → retorna fallback
 * - Si la estructura es inválida → retorna fallback
 */
export function loadTasks(
  fallbackTasks: Task[],
): Task[] {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [...fallbackTasks];
    }

    const parsedValue: unknown = JSON.parse(savedTasks);

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(isTask)
    ) {
      return [...fallbackTasks];
    }

    return parsedValue;
  } catch {
    return [...fallbackTasks];
  }
}

/**
 * Guarda las tareas en localStorage
 * 
 * @param tasks - Array de tareas a guardar
 * 
 * Manejo de errores:
 * - Captura excepciones (cuota excedida, localStorage deshabilitado)
 * - Registra el error en consola
 * - No detiene la aplicación
 */
export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks),
    );
  } catch (error) {
    console.error(
      'No fue posible guardar las tareas localmente.',
      error,
    );
  }
}
