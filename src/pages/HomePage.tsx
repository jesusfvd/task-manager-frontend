import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const { status } = useAuth();

  return (
    <div className="page-stack">
      <section
        className="panel welcome-panel"
        aria-labelledby="home-title"
      >
        <p className="section-heading__eyebrow">Inicio</p>
        <h2 id="home-title">
          {status === 'authenticated'
            ? 'Organiza y consulta tus actividades'
            : 'Bienvenido al Administrador de Tareas'}
        </h2>
        <p>
          {status === 'authenticated'
            ? 'Registra tareas, actualiza su estado y utiliza las herramientas de consulta. Los datos se guardan en el servidor backend (API REST).'
            : 'Inicia sesión o crea una cuenta para comenzar a administrar tus tareas.'}
        </p>
        <div className="welcome-panel__actions">
          {status === 'authenticated' ? (
            <Link className="button-link" to="/tasks">
              Administrar tareas
            </Link>
          ) : (
            <>
              <Link className="button-link" to="/login">
                Iniciar sesión
              </Link>
              <Link className="button-link button-link--secondary" to="/register">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
