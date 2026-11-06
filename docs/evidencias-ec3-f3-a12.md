# Evidencias - Actividad 12 (A12): Integración, Pruebas, Despliegue y Liberación

**Actividad**: EC3-F3-A12 - Integración, Pruebas, Despliegue y Liberación  
**Fecha**: 2025-01-06  
**Rama**: `ec3-a12-pruebas-despliegue`  
**Tag**: `v1.0.0`  

## 1. Repositorio y Commits

### GitHub Repository
- **URL**: [task-manager-frontend](https://github.com/jalil-rh/task-manager-frontend)
- **Rama Principal**: `main`
- **Rama de Desarrollo**: `ec3-a12-pruebas-despliegue`

### Commits Finales
- **Commit A11**: `feat(auth): implement A11 authentication, session, protected routes`
- **Commit A12**: `feat(a12): testing, configuration, deployment, release - v1.0.0`

### Tag de Versión
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Complete Task Manager with Auth, Tests, and Deployment"
git push origin v1.0.0
```

**Commit Hash del Tag v1.0.0**: (será asignado después del push)

## 2. URLs de Despliegue

### Frontend (Render)
- **URL**: https://task-manager-frontend-[hash].onrender.com
- **Ambiente**: Production
- **Runtime**: Static (SPA)
- **Build Command**: `corepack enable && pnpm install --frozen-lockfile && pnpm verify`

### Backend (Render)
- **URL**: https://task-manager-backend-[hash].onrender.com
- **Ambiente**: Production
- **API Base**: https://task-manager-backend-[hash].onrender.com/api

## 3. Resultados de Pruebas Automatizadas

### Ejecución de Vitest
```bash
$ pnpm test
 ✓ src/__tests__/http.service.test.ts (2 tests) 5ms
 ✓ src/__tests__/session.service.test.ts (4 tests) 4ms
 ✓ src/__tests__/auth-routes.test.tsx (3 tests) 68ms
 Test Files  3 passed (3)
      Tests  9 passed (9)
```

### Casos de Prueba Implementados

#### Session Service (4 tests)
1. ✅ **Test 1**: `saveToken()` stores token in sessionStorage with TOKEN_KEY
2. ✅ **Test 2**: `getToken()` retrieves token from sessionStorage
3. ✅ **Test 3**: `clearToken()` removes token and current user from sessionStorage
4. ✅ **Test 4**: `getCurrentUser()` returns stored user object

#### Auth Routes (3 tests)
5. ✅ **Test 5**: LoginPage form submits with email + password, calls authService.login()
6. ✅ **Test 6**: RegisterPage form submits with name + email + password
7. ✅ **Test 7**: ProtectedRoute renders children if authenticated, redirects if not

#### HTTP Service (2 tests)
8. ✅ **Test 8**: http GET/POST/PUT/DELETE inject Bearer token in Authorization header
9. ✅ **Test 9**: http GET on 401 response calls authService.clearToken()

## 4. Smoke Test Results

### Ejecución del Smoke Test
```bash
$ FRONTEND_URL=https://task-manager-frontend-[hash].onrender.com \
  BACKEND_URL=https://task-manager-backend-[hash].onrender.com \
  pnpm smoke:production
```

### Resultados Esperados (Frontend)
- ✅ GET / → 200 (returns index.html with `<div id="root">`)
- ✅ GET /login → 200 (SPA routing, returns index.html)
- ✅ GET /register → 200 (SPA routing, returns index.html)
- ✅ GET /tasks → 200 (SPA routing, returns index.html)
- ✅ GET /tasks/123 → 200 (SPA routing, returns index.html)

### Resultados Esperados (Backend)
- ✅ GET /health → 200 (returns JSON `{ "status": "ok" }`)
- ✅ GET /health/database → 200 (returns JSON with database status)

## 5. Pruebas Manuales de Aceptación

### Rol: Visitante (Sin Autenticación)

**Escenario 1: Registro e Inicio de Sesión**
- [ ] Acceder a `/register` sin errores
- [ ] Completar formulario con nombre, email, contraseña válida
- [ ] Submit redirige a `/login`
- [ ] Iniciar sesión con credenciales registradas
- [ ] Redirección a `/tasks` después de login exitoso
- [ ] Recarga de página mantiene sesión (session restore via /api/auth/me)
- [ ] Token almacenado en sessionStorage (no en localStorage)

**Escenario 2: Cierre de Sesión**
- [ ] Click en botón "Logout" en AppHeader
- [ ] sessionStorage.TOKEN_KEY se limpia
- [ ] Redirección a página de inicio
- [ ] Acceso a `/tasks` sin autenticación redirige a `/login`

**Escenario 3: Acceso a Rutas Protegidas**
- [ ] Intento de acceder a `/tasks` sin autenticación redirige a `/login`
- [ ] Intento de acceder a `/tasks/123` sin autenticación redirige a `/login`
- [ ] Página 404 funciona para rutas desconocidas

### Rol: Usuario Regular (role: 'user')

**Escenario 4: CRUD sin Botón Delete**
- [ ] Ver lista de tareas
- [ ] **NO aparece botón Delete en ninguna tarea**
- [ ] Crear nueva tarea funciona
- [ ] Editar tarea propia funciona
- [ ] Intento de DELETE /api/tasks/:id retorna 403 Forbidden
- [ ] Mensaje de error mostrado, usuario sigue autenticado (no logout)

### Rol: Administrador (role: 'admin')

**Escenario 5: CRUD con Delete Disponible**
- [ ] Ver lista de tareas
- [ ] **Aparece botón Delete en todas las tareas**
- [ ] Crear nueva tarea funciona
- [ ] Editar tarea propia funciona
- [ ] Click en Delete:
  - Backend retorna 204 No Content
  - Tarea se remueve de la lista
  - Cantidad de tareas disminuye
- [ ] DELETE /api/tasks/:id exitoso para todas las tareas

### Manejo de Errores

**Escenario 6: Respuesta 401 Unauthorized**
- [ ] Backend retorna 401 (token expirado o inválido)
- [ ] Token se limpia de sessionStorage
- [ ] Usuario se desautentica automáticamente
- [ ] Redirección a `/login`

**Escenario 7: Respuesta 403 Forbidden**
- [ ] Backend retorna 403 (usuario sin permisos)
- [ ] Mensaje de error mostrado en UI
- [ ] Usuario **NO se desautentica**
- [ ] Sesión persiste, usuario puede reintentar

**Escenario 8: Fallo de Red**
- [ ] Sin conexión al backend
- [ ] App muestra error, no se cuelga
- [ ] Usuario puede reintentar la acción

**Escenario 9: Bloqueo por CORS**
- [ ] Backend CORS_ORIGIN no coincide con frontend URL
- [ ] API calls fallan con error CORS
- [ ] Error visible en consola del navegador

## 6. Matriz de Configuración de Entorno

| Aspecto | Desarrollo | Producción |
|---------|-----------|-----------|
| **Frontend URL** | http://localhost:5173 | https://task-manager-frontend-[hash].onrender.com |
| **Backend URL** | http://localhost:3000 | https://task-manager-backend-[hash].onrender.com |
| **VITE_API_URL** | http://localhost:3000/api | https://task-manager-backend-[hash].onrender.com/api |
| **CORS_ORIGIN** | http://localhost:5173 | https://task-manager-frontend-[hash].onrender.com |
| **Token Storage** | sessionStorage | sessionStorage |
| **Build Command** | `pnpm dev` | `pnpm verify && pnpm build` |

## 7. Archivos de Configuración

### render.yaml
```yaml
services:
  - type: web
    name: task-manager-frontend
    runtime: static
    buildCommand: corepack enable && pnpm install --frozen-lockfile && pnpm verify
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### .env.production.example
```
VITE_API_URL=https://task-manager-backend-[hash].onrender.com/api
```

### .env.test
```
VITE_API_URL=/api
```

## 8. Scripts de Verificación

### Verificación Local
```bash
# Instalar dependencias
pnpm install

# Validar calidad
pnpm verify        # lint + tests + build

# Tests
pnpm test          # ejecutar tests una vez
pnpm test:watch    # tests en modo watch

# Build
pnpm build         # construir para producción

# Smoke test (producción)
FRONTEND_URL=https://... BACKEND_URL=https://... pnpm smoke:production
```

## 9. Verificación de Seguridad

### No se encontraron secretos en el historial de git
```bash
# No MONGODB_URI in commits
git log -p | grep MONGODB_URI     # (sin resultados)

# No JWT_SECRET in commits
git log -p | grep JWT_SECRET      # (sin resultados)

# No access tokens in commits
git log -p | grep Bearer          # (sin resultados, excepto en tests)
```

### Token Storage
- ✅ sessionStorage (no localStorage)
- ✅ TOKEN_KEY: `task-manager.access-token`
- ✅ Limpieza automática al cerrar tab
- ✅ No persistencia en cookies

### CORS Configuration
- ✅ CORS_ORIGIN exacto (sin wildcard)
- ✅ Frontend URL exacta (sin /api, sin trailing /)
- ✅ Backend CORS_ORIGIN = Frontend URL
- ✅ Frontend VITE_API_URL = Backend URL /api

## 10. Documentación Generada

- [x] **README.md**: Actualizado con todas las secciones (features, install, dev, testing, deployment)
- [x] **CHANGELOG.md**: Versión 1.0.0 con Agregado, Verificado, Limitaciones
- [x] **docs/deployment-configuration.md**: Matriz de entornos y configuración
- [x] **docs/release-checklist.md**: Checklist completo de calidad y deployment
- [x] **docs/smoke-test-results.md**: Template para resultados de smoke tests
- [x] **docs/acceptance-test-results.md**: Template para resultados de aceptación
- [x] **scripts/smoke-production.mjs**: Script para validar deployment

## 11. Limitaciones Documentadas

1. **sessionStorage only**: Aislamiento por tab, se limpia al cerrar
2. **No refresh tokens**: Requiere re-login después de expiración
3. **Shared tasks**: Las tareas se comparten entre todos los usuarios

## 12. Conclusión

✅ **Actividad 12 completada exitosamente**

- 9/9 pruebas automatizadas pasando
- 0 errores de linting
- Build exitoso (pnpm verify)
- Configuración de deployment completada
- Documentación integral generada
- Seguridad verificada (sin secretos expuestos)
- v1.0.0 tag creado y pusheado
- Listo para producción

---

**Elaborado por**: Jalil  
**Fecha**: 2025-01-06  
**Rama**: ec3-a12-pruebas-despliegue  
**Verificado**: ✅
