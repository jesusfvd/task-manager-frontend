import type { TaskFilter } from '../models/task-view.types';

interface TaskFiltersProps {
  search: string;
  status: TaskFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskFilter) => void;
  onClear: () => void;
}

export function TaskFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: TaskFiltersProps) {
  const hasActiveCriteria = search.trim() !== '' || status !== 'all';

  return (
    <section className="panel" aria-labelledby="task-filters-title">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Consulta</p>
          <h2 id="task-filters-title">Buscar y organizar</h2>
        </div>
      </div>

      <div className="filters-grid">
        <label className="filter-field">
          <span>Buscar por título</span>
          <input
            type="search"
            value={search}
            placeholder="Ejemplo: documentación"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="filter-field">
          <span>Estado</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as TaskFilter)}
          >
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completadas</option>
          </select>
        </label>

        <button type="button" onClick={onClear} disabled={!hasActiveCriteria}>
          Limpiar criterios
        </button>
      </div>
    </section>
  );
}
