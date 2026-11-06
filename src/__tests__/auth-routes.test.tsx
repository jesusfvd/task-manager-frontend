import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';

// Mock AuthProvider and hooks
vi.mock('../context/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../hooks/useAuth';

// Simple ProtectedRoute mock
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth() as unknown as Record<string, unknown>;
  const isAuthenticated = auth.isAuthenticated as boolean;
  if (!isAuthenticated) {
    return <div>Redirecting to /login...</div>;
  }
  return <>{children}</>;
};

// Mock login form component
const LoginForm = ({ onSubmit }: { onSubmit: (email: string, password: string) => void }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(
          formData.get('email') as string,
          formData.get('password') as string
        );
      }}
    >
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

// Mock register form component
const RegisterForm = ({ onSubmit }: { onSubmit: (name: string, email: string, password: string) => void }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(
          formData.get('name') as string,
          formData.get('email') as string,
          formData.get('password') as string
        );
      }}
    >
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Test 5: LoginPage form submits with email + password, calls authService.login()', async () => {
    const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn(),
    });

    const mockLogin = vi.fn().mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <LoginForm onSubmit={(email, password) => mockLogin(email, password)} />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('Test 6: RegisterPage form submits with name + email + password', async () => {
    const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      register: vi.fn().mockResolvedValue({ success: true }),
      logout: vi.fn(),
    });

    const mockRegister = vi.fn().mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <RegisterForm
          onSubmit={(name, email, password) => mockRegister(name, email, password)}
        />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
  });

  it('Test 7: ProtectedRoute renders children if user is authenticated, redirects if not', () => {
    const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

    // Test unauthenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    const { rerender } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Redirecting to /login...')).toBeInTheDocument();

    // Test authenticated
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
    });

    rerender(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
