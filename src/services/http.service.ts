/**
 * Cliente HTTP base con Fetch API
 * EC3 F2 A10 - Consumo de API REST
 */
import { API_URL } from '../config/env';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  body?: unknown;
}

async function httpClient<T>(
  path: string,
  method: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const init: RequestInit = {
    method,
    headers,
    signal: options.signal,
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('[httpClient] Error de red:', error);
    throw new HttpError(0, 'Error de conexión. Verifica tu red e intenta de nuevo.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new HttpError(response.status, `Error al procesar la respuesta del servidor (${response.status}).`);
  }

  if (!response.ok) {
    const errorBody = data as { error?: { message?: string } };
    const message =
      errorBody?.error?.message ??
      `Error del servidor (${response.status}).`;
    console.error('[httpClient] Error HTTP:', response.status, data);
    throw new HttpError(response.status, message, data);
  }

  return data as T;
}

export const http = {
  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return httpClient<T>(path, 'GET', { signal });
  },
  post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return httpClient<T>(path, 'POST', { body, signal });
  },
  patch<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return httpClient<T>(path, 'PATCH', { body, signal });
  },
  delete<T>(path: string, signal?: AbortSignal): Promise<T> {
    return httpClient<T>(path, 'DELETE', { signal });
  },
};
