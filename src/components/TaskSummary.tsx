/**
 * Componente TaskSummary - Resumen de tareas desde la API
 * EC3 F2 A10 - Usa PageMeta en lugar de array local
 */
import type { PageMeta } from '../models/api.types';

interface TaskSummaryProps {
  meta: PageMeta | null;
}

export function TaskSummary({ meta }: TaskSummaryProps) {
  const total = meta?.total ?? '—';

  return (
    <section className="summary-grid" aria-label="Resumen de tareas">
      <article className="summary-card">
        <span>Total en servidor</span>
        <strong>{total}</strong>
      </article>
    </section>
  );
}
