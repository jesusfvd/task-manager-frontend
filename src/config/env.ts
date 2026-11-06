/**
 * Configuración de variables de entorno
 * EC3 F2 A10 - Consumo de API REST
 */
const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error('VITE_API_URL no está definida en las variables de entorno.');
}

export const API_URL: string = rawApiUrl as string;
