/**
 * Componente de paginación para la lista de tareas
 * EC3 F2 A10 - Consumo de API REST
 */
import type { PageMeta } from '../models/api.types';

interface TaskPaginationProps {
  meta: PageMeta;
  onPageChange: (page: number) => void;
}

export function TaskPagination({
  meta,
  onPageChange,
}: TaskPaginationProps) {
  const { page, totalPages, total } = meta;

  if (totalPages <= 1) return null;

  return (
    <nav
      className="pagination-controls"
      aria-label="Paginación de tareas"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      <span aria-current="page">
        Página {page} de {totalPages}
        <span className="pagination-controls__total">
          {' '}({total} {total === 1 ? 'tarea' : 'tareas'})
        </span>
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
      >
        Siguiente →
      </button>
    </nav>
  );
}
