# Task Manager Frontend

A complete Task Management application built with React, TypeScript, Vite, React Router, and PNPM.

## Features

- **Authentication**: User registration and login with JWT Bearer tokens
- **Session Management**: Automatic session restoration via sessionStorage
- **Protected Routes**: Route guards for authenticated users
- **Role-Based Access Control**: Admin-only delete functionality
- **CRUD Operations**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status and other criteria
- **Responsive Design**: Mobile-friendly interface
- **Automated Testing**: Vitest + Testing Library test suite
- **Production Deployment**: Render.yaml configuration for SPA deployment
- **Environment Configuration**: Build-time API URL configuration

## Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/tasks` - Task management page (protected)
- `/tasks/:taskId` - Task detail page (protected)
- `*` - 404 page

## Installation

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` with API proxy to `http://localhost:3000/api`

## Verification

Run linting, tests, and build verification:

```bash
pnpm verify
```

This command:
- Runs ESLint (`pnpm lint`)
- Runs all tests (`pnpm test`)
- Builds the project (`pnpm build`)

### Individual Commands

- `pnpm lint` - Run ESLint
- `pnpm test` - Run test suite (Vitest)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm build` - Build for production

## Testing

The project includes 9 automated tests covering:

- **Session Management** (4 tests): Token storage, retrieval, and clearing
- **Authentication Routes** (3 tests): Login, register, and route protection
- **HTTP Service** (2 tests): Bearer token injection and 401 handling

Run tests:

```bash
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
```

## Production Deployment

### Environment Variables

Create a `.env.production` file based on `.env.production.example`:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Render Deployment

1. Push branch to GitHub
2. Create a Render Blueprint from `render.yaml`
3. Set `VITE_API_URL` environment variable in Render
4. Ensure backend `CORS_ORIGIN` is set to your frontend URL

### Smoke Test

Run smoke tests to validate deployment:

```bash
FRONTEND_URL=https://your-frontend.onrender.com \
BACKEND_URL=https://your-backend.onrender.com \
pnpm smoke:production
```

## Architecture

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v7
- **Build Tool**: Vite 8
- **Testing**: Vitest + Testing Library
- **Styling**: CSS modules
- **Authentication**: Session-based with Bearer tokens
- **Storage**: sessionStorage for authentication tokens

## Security

- JWT Bearer tokens stored in sessionStorage (cleared on tab close)
- Protected routes prevent unauthorized access
- Role-based UI controls (no delete button for non-admin users)
- Backend authorization enforces access control
- CORS configuration prevents cross-origin attacks

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Limitations

- sessionStorage only (per-tab isolation, cleared on tab close)
- No refresh tokens (requires re-login after token expiration)
- Tasks are shared across all users (no per-user filtering)

## License

MIT

## Author

Jalil - 2025

