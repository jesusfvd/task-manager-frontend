# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-06

### Agregado
- **Navigation**: AppHeader component with user name display and logout button
- **API REST Client**: http.service.ts with GET/POST/PUT/DELETE methods and Bearer token injection
- **Authentication**: User registration and login with email/password validation
- **Session Management**: sessionStorage-based token persistence with automatic session restoration via GET /api/auth/me
- **Protected Routes**: ProtectedRoute and PublicOnlyRoute components for route guards
- **Role-Based Access Control**: Delete button visible only for admin users, UI-level access control
- **Responsive Design**: Mobile-friendly CSS and component layout
- **Automated Tests**: Complete Vitest + Testing Library test suite (9 tests)
  - Session service tests (4): token storage, retrieval, clearing, user management
  - Authentication routes tests (3): login, register, route protection
  - HTTP service tests (2): Bearer token injection, 401 handling
- **Environment Configuration**: Build-time VITE_API_URL configuration for different environments
- **Deployment**: render.yaml with SPA static configuration and route rewriting
- **Documentation**: README, deployment configuration matrix, smoke test script
- **Production Scripts**: smoke:production command for health checks

### Verificado
- ✅ CRUD operations (create, read, update tasks)
- ✅ Task filtering and search functionality
- ✅ Pagination working correctly
- ✅ 401 Unauthorized: token cleared, user logged out
- ✅ 403 Forbidden: error shown, user stays authenticated
- ✅ 204 No Content: DELETE response properly handled
- ✅ Deep route rewriting: /, /login, /register, /tasks, /tasks/:id all return index.html
- ✅ HTTPS + MongoDB Atlas: Backend connection validated
- ✅ Bearer token injection: All requests include Authorization header
- ✅ Session restoration: Automatic user restoration after page reload
- ✅ 9/9 automated tests passing

### Limitaciones
- **sessionStorage only**: Per-tab isolation, cleared when tab is closed (no cross-tab persistence)
- **No refresh tokens**: Requires re-login after token expiration (expired JWT causes 401)
- **Shared tasks**: All tasks are shared across users (no per-user filtering in backend)

## [0.1.0] - Previous Releases

- Initial task management with localStorage
- CRUD operations with local storage persistence
- Task filtering and search
- Responsive design
- React Router navigation
- TypeScript type safety
- ESLint configuration

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## Release Notes

### v1.0.0: Complete Task Manager with Authentication
- First production-ready release
- Full authentication flow (register → login → session persistence → logout)
- Role-based access control
- Automated test suite
- Production deployment configuration
- API integration with backend service

For upgrade instructions, see MIGRATION.md (not yet created - will be added for v2.0.0)
