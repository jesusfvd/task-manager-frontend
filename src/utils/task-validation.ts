/**
 * Utilidad de validación para tareas
 * EC2 F3 A8 - Validación reutilizable
 */

/** Longitud máxima permitida para el título de una tarea */
export const TASK_TITLE_MAX_LENGTH = 120;

/**
 * Valida el título de una tarea
 * 
 * @param value - Título a validar
 * @returns Mensaje de error si la validación falla, null si es válido
 * 
 * Reglas:
 * - No puede estar vacío (después de trim)
 * - Mínimo 3 caracteres
 * - Máximo 120 caracteres
 */
export function validateTaskTitle(
  value: string,
): string | null {
  const title = value.trim();

  if (!title) {
    return 'Escribe el título de la tarea.';
  }

  if (title.length < 3) {
    return 'El título debe tener al menos 3 caracteres.';
  }

  if (title.length > TASK_TITLE_MAX_LENGTH) {
    return `El título no puede superar ${TASK_TITLE_MAX_LENGTH} caracteres.`;
  }

  return null;
}
