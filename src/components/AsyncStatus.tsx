/**
 * Componente para estados asíncronos (loading / error / vacío)
 * EC3 F2 A10 - Consumo de API REST
 */
import type { RequestStatus } from '../models/request-status.type';

interface AsyncStatusProps {
  status: RequestStatus;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}

export function AsyncStatus({
  status,
  error,
  isEmpty,
  emptyMessage = 'No hay tareas que mostrar.',
  onRetry,
}: AsyncStatusProps) {
  if (status === 'loading') {
    return (
      <div className="async-status" role="status" aria-live="polite">
        <span className="loading-spinner" aria-hidden="true" />
        <p>Cargando tareas…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="async-status async-status--error" role="alert">
        <p className="error-message">
          {error ?? 'Ocurrió un error al cargar los datos.'}
        </p>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (status === 'success' && isEmpty) {
    return (
      <div className="async-status empty-state" role="status">
        <h3>Sin resultados</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return null;
}
