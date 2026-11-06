import { Link } from 'react-router';

export function HomePage() {
  return (
    <div className="page-stack">
      <section
        className="panel welcome-panel"
        aria-labelledby="home-title"
      >
        <p className="section-heading__eyebrow">Inicio</p>
        <h2 id="home-title">Organiza y consulta tus actividades</h2>
        <p>
          Registra tareas, actualiza su estado y utiliza las herramientas de
          consulta. Los datos se guardan en el servidor backend (API REST).
        </p>
        <div className="welcome-panel__actions">
          <Link className="button-link" to="/tasks">
            Administrar tareas
          </Link>
        </div>
      </section>
    </div>
  );
}
