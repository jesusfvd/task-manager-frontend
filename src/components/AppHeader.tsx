import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function AppHeader() {
  const navigate = useNavigate();
  const { user, logout, status } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="app-header">
      <div className="app-header__content">
        <p className="eyebrow">
          Diseño Frontend con Frameworks
        </p>

        <h1>Administrador de tareas</h1>

        <p className="app-header__description">
          Organiza las actividades pendientes y consulta
          el avance del trabajo.
        </p>
      </div>

      {status === 'authenticated' && user && (
        <div className="app-header__user-section">
          <span className="app-header__user-name">{user.name}</span>
          <button
            type="button"
            className="button-link"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
