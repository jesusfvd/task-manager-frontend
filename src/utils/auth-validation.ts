/**
 * Funciones de validación para autenticación
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): boolean {
  // Mínimo 15 caracteres según la guía
  return password.length >= 15;
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.length <= 80;
}
