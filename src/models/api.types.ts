/**
 * Tipos de respuesta de la API REST
 * EC3 F2 A10 - Consumo de API REST
 */
export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export interface ApiError {
  error: ApiErrorBody;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}
