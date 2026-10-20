/**
 * Componente TaskFilters - Filtros de tareas
 * EC2 F2 A7 - Deshabilitado temporalmente
 */
export function TaskFilters() {
  return (
    <section
      className="panel"
      aria-labelledby="filters-title"
    >
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">
            Consulta
          </p>
          <h2 id="filters-title">
            Buscar y organizar
          </h2>
        </div>
      </div>

      <div className="filters-grid">
        <div>
          <label htmlFor="search">Buscar por título</label>
          <input
            id="search"
            type="text"
            placeholder="Escribe una palabra clave"
            disabled
          />
        </div>

        <div>
          <label htmlFor="filter-status">Estado</label>
          <select id="filter-status" disabled>
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by">Orden</label>
          <select id="sort-by" disabled>
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguas</option>
          </select>
        </div>
      </div>

      <p className="helper-text">
        Los filtros se activarán en la actividad 8.
      </p>
    </section>
  );
}
