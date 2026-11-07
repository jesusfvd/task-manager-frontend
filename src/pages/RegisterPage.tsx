import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '../utils/auth-validation';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const displayError = localError || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setLocalError(null);

    // Validar campos
    const errors: Record<string, string> = {};

    if (!validateName(name)) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validateEmail(email)) {
      errors.email = 'Correo electrónico inválido';
    }

    if (!validatePassword(password)) {
      errors.password = 'La contraseña debe tener al menos 15 caracteres';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/tasks', { replace: true });
    } catch {
      // Error ya manejado en el contexto
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para empezar a gestionar tus tareas
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {displayError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{displayError}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña (mínimo 15 caracteres)
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Repetir contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Iniciar sesión
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
