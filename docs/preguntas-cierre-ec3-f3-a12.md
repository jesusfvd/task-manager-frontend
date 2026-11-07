# Preguntas de Cierre - Actividad 12 (A12)

Respuestas reflexivas sobre la implementación de Testing, Configuration, Deployment y Release.

---

## 1. ¿Cuál es la diferencia entre pruebas automatizadas, smoke test, y pruebas de aceptación?

**Respuesta:**

Las tres son nivel de validación diferentes:

- **Pruebas Automatizadas (Unit/Integration Tests)**:
  - Ejecutadas automáticamente en CI/CD pipeline
  - Validan comportamiento de funciones específicas (unitarias) o flujos integrados
  - Base de código TypeScript/JavaScript
  - En A12: 9 tests de Vitest validando sessionStorage, rutas autenticadas, inyección de Bearer token
  - Rápidas, repetibl, ejecutadas en cada commit

- **Smoke Test**:
  - Prueba de "humo" - validación superficial de endpoints críticos
  - Verifica que la aplicación "está viva" (alive check)
  - En A12: script `smoke-production.mjs` que chequea frontend deep routes (/, /login, /tasks, etc.)
  - Ejecutado después de deployment, antes de manual testing
  - Valida infraestructura sin entrar en lógica de negocio

- **Pruebas de Aceptación**:
  - Manuales, orientadas al usuario
  - Validan que el sistema cumple requisitos del negocio
  - Incluyen flujos completos: registro → login → CRUD → logout
  - Verifican rol-based access control (usuario no ve delete, admin sí)
  - Pruebas de error scenarios (401, 403, network failures)
  - Esencial antes de dar por finalizado el feature

**Relación**: Automatizadas → Smoke Test → Aceptación Manual (verificación en piramide)

---

## 2. ¿Por qué simular Fetch en las pruebas automatizadas no prueba verdaderamente Atlas (MongoDB)?

**Respuesta:**

Cuando los tests simulan (`vi.fn().mockResolvedValueOnce()`) la respuesta fetch, **no están tocando la base de datos real**:

- **Tests Automatizados**: Validan que el frontend inyecte Bearer token correctamente, que guarde en sessionStorage, que parsee JSON responses. Pero la respuesta es mock (inventada por `vi.fn()`), no viene de una BD real.

- **Lo que NO validan los tests**:
  - ¿Existe realmente la colección en MongoDB Atlas?
  - ¿El esquema de datos es correcto?
  - ¿Las queries backend funcionan contra la BD real?
  - ¿La conexión TCP a Atlas está activa?
  - ¿Los índices están optimizados?

- **Por eso se necesita Smoke Test**:
  - `GET /health/database` en el backend hace una query real contra MongoDB Atlas
  - Si Atlas está down o no hay conexión, `/health/database` retorna 500/error
  - Smoke test chequea que este endpoint retorna 200, **probando Atlas está vivo**

- **Conclusión**: Tests + Smoke Test + Manual Testing forman la pirámide completa
  - Tests validar lógica del frontend
  - Smoke test valida infraestructura (Atlas, deployment)
  - Manual testing valida flujos de usuario

---

## 3. ¿Cuál es la diferencia entre guardias de ruta en el frontend y autorización en el backend?

**Respuesta:**

Son dos capas de seguridad **independientes**, ambas necesarias:

- **Guardias de Ruta (Frontend - ProtectedRoute)**:
  - `if (!isAuthenticated) return redirect('/login')`
  - Mejora UX: no deja navegar a `/tasks` sin token
  - **NO es seguridad**: un usuario puede abrir DevTools y borrar el check
  - O llamar directo al API sin pasar por el frontend

- **Autorización en Backend**:
  - `DELETE /api/tasks/:id` chequea `requireRole('admin')`
  - Retorna 403 Forbidden si el usuario no es admin
  - **Sí es seguridad**: no hay forma de bypasear desde el cliente
  - Se ejecuta en servidor donde el usuario no tiene control

- **Ejemplo A12**:
  - Frontend: Delete button no aparece para usuarios no-admin (UI convenience)
  - Backend: Aunque hagas DELETE manualmente desde curl, retorna 403 (verdadera seguridad)
  - Esconder el botón ≠ autorización real

- **Por qué ambas**:
  - Frontend: mejor experiencia (no mostrar botón que no funciona)
  - Backend: verdadera protección contra ataques

**Regla de Oro**: "Never trust the client" - siempre valida en backend

---

## 4. ¿Por qué VITE_API_URL es público pero JWT_SECRET no?

**Respuesta:**

Diferencia de naturaleza entre endpoints y secretos:

- **VITE_API_URL** (variable pública):
  - Es una URL HTTPS pública: `https://backend.onrender.com/api`
  - Todo el mundo ya la ve cuando el navegador hace requests (en Network tab del DevTools)
  - No hay secreto en que sea conocida
  - Necesita ser variable porque cambia entre local (http://localhost:3000) y producción
  - Embedded en el build en vite (`import.meta.env.VITE_API_URL`)

- **JWT_SECRET** (variable secreta):
  - Es la llave criptográfica que el backend usa para firmar tokens
  - Si alguien la obtiene, puede crear tokens falsos
  - **NUNCA debe exponerse**, ni en el frontend, ni en git
  - Reside SOLO en el backend como variable de entorno
  - El frontend no la necesita (recibe tokens JWT ya firmados)

- **En el proyecto A12**:
  - ✅ VITE_API_URL en `.env.production.example` (versionada)
  - ❌ JWT_SECRET en `.env.local` o variable de entorno del backend (NUNCA en git)

- **Seguridad**: Prefix `VITE_` expone las variables en el build final. Solo variables públicas aquí. Secretos se quedan en backend variables de entorno.

---

## 5. ¿Por qué cambiar VITE_API_URL requiere reconstruir (build)?

**Respuesta:**

Porque Vite **embebe las variables en el código compilado en build time**, no en runtime:

- **Build Time vs Runtime**:
  - Build time: `pnpm build` compila TypeScript → JavaScript → dist/
  - Runtime: navegador ejecuta los archivos en dist/

- **Cómo Vite lo hace**:
  - `import.meta.env.VITE_API_URL` se reemplaza literalmente durante build
  - Si VITE_API_URL=`http://localhost:3000/api`, el código compilado contiene esa string
  - No es una referencia a la variable, **es la literal string compilada**

- **Consecuencia**:
  - Cambiar VITE_API_URL en `.env.production` NO hace efecto
  - Necesitas `pnpm build` de nuevo
  - Nuevo build genera nuevo dist/ con la URL correcta

- **Contraste con variables runtime**:
  - Un backend típico lee variables de entorno en startup
  - Cambiar variable de entorno = reiniciar servidor
  - Frontend es dist/ estático, necesita rebuild

- **En A12**:
  - Render build command: `pnpm verify && pnpm build`
  - Render asigna VITE_API_URL en el environment
  - Render ejecuta build, Vite embebe la URL
  - El dist/ resultante tiene la URL correcta

**Ventaja**: Garantiza que cada deployment tiene su URL exacta hardcoded

---

## 6. ¿Cómo la función de reescritura (rewrite) en render.yaml hace que sea una SPA?

**Respuesta:**

El rewrite `/* → /index.html` es la clave para Single Page Application:

- **Sin rewrite (servidor tradicional)**:
  - GET /tasks → servidor busca archivo `tasks.html` → 404 not found
  - Cada ruta necesita archivo HTML separado

- **Con rewrite (SPA)**:
  ```yaml
  routes:
    - type: rewrite
      source: /*
      destination: /index.html
  ```
  - GET /tasks → servidor rewrite → devuelve /index.html
  - GET /login → servidor rewrite → devuelve /index.html
  - GET /tasks/123 → servidor rewrite → devuelve /index.html
  - **Siempre devuelve el mismo index.html**

- **Qué pasa en el navegador**:
  - Descarga index.html único
  - index.html carga React + React Router
  - React Router parsea la URL actual (/tasks)
  - React Router renderiza el componente correcto en el DOM
  - **Routing es client-side**, no server-side

- **Ventaja SPA**:
  - Navegación es instantánea (sin network round-trip al servidor por cada ruta)
  - Experiencia similar a app nativa
  - Estado se mantiene en JavaScript (no perdido al recargar routes)

- **En A12**:
  - render.yaml configura static + rewrite
  - Smoketest valida que /, /login, /register, /tasks, /tasks/:id devuelven todas 200
  - Todas retornan el mismo index.html (invisible para el usuario)

---

## 7. ¿Cuál es la diferencia entre build, deploy, y release?

**Respuesta:**

Tres fases distintas del ciclo de vida del software:

- **Build** (compilación):
  - Comando: `pnpm build`
  - Entrada: código TypeScript/JSX en src/
  - Proceso: transpile, bundle, optimize
  - Salida: dist/ (production-ready assets)
  - Artefacto es local en tu máquina

- **Deploy** (despliegue):
  - Acción: subir dist/ a un servidor
  - En A12: Render Blueprint crea servicio web + executa build command + sube dist/ a CDN
  - Comando: push a rama en GitHub → Render webhook → auto-deploy
  - Resultado: app accesible en `https://task-manager-frontend-xyz.onrender.com`
  - API requests ahora van a producción

- **Release** (liberación):
  - Acción: marcar una versión específica como "lista para usuarios"
  - En A12: crear tag `v1.0.0`
  - Comando: `git tag -a v1.0.0 -m "Release v1.0.0"`
  - Propósito: trazabilidad (sé exactamente qué código está en v1.0.0)
  - Referencias: documentación, CHANGELOG, evidencias

- **Flujo típico**:
  ```
  1. Local Dev + Testing → 2. Build (pnpm build) → 
  3. Commit + Push → 4. Deploy (Render auto-builds) → 
  5. Smoke Test → 6. Release (git tag v1.0.0)
  ```

- **Analogía**:
  - Build = cocinar el plato
  - Deploy = servir en el restaurante
  - Release = publicar el menú diciendo "este plato está listo"

---

## 8. ¿Por qué CORS_ORIGIN debe ser exacto? ¿Qué pasa si está mal configurado?

**Respuesta:**

CORS (Cross-Origin Resource Sharing) es mecanismo de seguridad del navegador:

- **CORS_ORIGIN correcto**:
  ```
  Frontend: https://task-manager-frontend-xyz.onrender.com
  Backend: CORS_ORIGIN = https://task-manager-frontend-xyz.onrender.com
  ```
  - Backend responde con header: `Access-Control-Allow-Origin: https://task-manager-frontend-xyz.onrender.com`
  - Navegador: "OK, origin coincide, déjalo hacer requests"
  - API calls funcionan normalmente

- **CORS_ORIGIN con error**:
  - Frontend: https://task-manager-frontend-xyz.onrender.com
  - Backend: CORS_ORIGIN = https://task-manager-frontend-abc.onrender.com (URL diferente)
  - Backend responde con header: `Access-Control-Allow-Origin: https://task-manager-frontend-abc.onrender.com`
  - Navegador: "Origin frontend no coincide con CORS_ORIGIN, BLOQUEADO"
  - Error en consola: "CORS policy: No 'Access-Control-Allow-Origin' header"
  - API calls fallan silenciosamente (no JSON data, solo error de red)

- **Por qué debe ser exacto**:
  - CORS es whitelist, no wildcard permitido (excepto `*` que es inseguro)
  - Previene ataques: sitios maliciosos no pueden hacer requests a tu API
  - Requiere que frontend y backend "se conozcan"

- **Errores comunes en A12**:
  - Poner `/api` en CORS_ORIGIN (solo base URL)
  - Poner `http://` en producción (debe ser `https://`)
  - Trailing slash (debe ser exacto)

- **Debugging**:
  - DevTools → Network → request fallida
  - Response headers verifican `Access-Control-Allow-Origin`
  - Si no existe o no coincide = CORS blocked

---

## 9. ¿Cuál es la diferencia entre 401 Unauthorized y 403 Forbidden?

**Respuesta:**

Dos errores HTTP diferentes, frecuentemente confundidos:

- **401 Unauthorized** (problemas de autenticación):
  - Significado: "No sé quién eres" o "tu identidad es inválida"
  - Casos:
    - Token JWT expirado
    - No incluiste Bearer token
    - Token malformado o inválido
    - Credenciales incorrectas en login
  - Acción en frontend: **limpiar token y logout** (usuario necesita re-autenticarse)
  - En A12: `authService.clearToken()` cuando status === 401

- **403 Forbidden** (problemas de autorización):
  - Significado: "Sé quién eres, pero no tienes permisos"
  - Casos:
    - Usuario autenticado intenta DELETE pero no es admin
    - Intenta acceder a recurso de otro usuario
    - Intenta operación prohibida por su rol
  - Acción en frontend: **mostrar error, pero NO logout** (sesión sigue válida)
  - En A12: usuario intenta DELETE, backend retorna 403, UI muestra error

- **Tabla comparativa**:

| Aspecto | 401 | 403 |
|---------|-----|-----|
| **Problema** | Autenticación | Autorización |
| **Significa** | "¿Quién eres?" | "No tienes permiso" |
| **Causa** | Token inválido/expirado | Permisos insuficientes |
| **Acción** | Logout + re-login | Mostrar error |
| **Usuario** | Desautenticado | Sigue autenticado |

- **En A12 - Flujo**:
  - Usuario regular intenta: `DELETE /api/tasks/1`
  - Backend valida: `requireRole('admin')` falla
  - Backend retorna: 403 Forbidden
  - Frontend: muestra error "No tienes permisos"
  - Frontend: user sigue autenticado, puede hacer otras acciones

---

## 10. ¿Por qué ocultar el botón Delete no es verdadera autorización?

**Respuesta:**

"Security by obscurity" es una falacia - el frontend no es seguro:

- **Frontend: Ocultar botón**:
  - `{user?.role === 'admin' && <button>Delete</button>}`
  - No muestra botón para usuarios no-admin
  - **PERO**: no previene el ataque

- **Ataque simple**:
  - Usuario abre DevTools (F12)
  - Console: `fetch('/api/tasks/1', { method: 'DELETE' })`
  - Backend (sin validación): 200 OK, tarea borrada
  - **Autorización del frontend fue bypasseada**

- **Verdadera autorización (Backend)**:
  ```typescript
  DELETE /api/tasks/:id
    1. Verifica token JWT (401 si falla)
    2. Extrae user role del token
    3. if (user.role !== 'admin') return 403
    4. Ejecuta delete
  ```
  - No importa si frontend oculta botón
  - No importa si usuario hace curl desde terminal
  - Backend SIEMPRE valida

- **En A12**:
  - ✅ Frontend: no muestra botón (UX)
  - ✅ Backend: `DELETE` requiere `requireRole('admin')` (seguridad real)
  - Si una es suficiente: elige backend siempre

- **Regla**:
  - Frontend: mejora UX ocultando cosas no-accesibles
  - Backend: REQUIERE validación (es donde ocurre la verdadera seguridad)

---

## 11. ¿Cuál es la relación entre v1.0.0 y el commit hash?

**Respuesta:**

Un tag Git es un puntero inmutable a un commit específico:

- **Commit Hash**:
  - Identificador único de un commit: `abc123def456...` (SHA-1)
  - Generado automáticamente por Git
  - Inmutable (no cambia si le cambias al commit)

- **Tag**:
  - Nombre legible: `v1.0.0`
  - Apunta a un commit específico (mediante su hash)
  - Creación: `git tag -a v1.0.0 -m "Release message"`
  - Git internamente: `v1.0.0 → abc123def456`

- **Verificación**:
  ```bash
  git tag -l v1.0.0              # Listar tag
  git rev-list -n 1 v1.0.0       # Mostrar commit hash del tag
  git show v1.0.0                # Ver detalles del tag
  ```

- **En A12**:
  - Commit final A12: `c2c98c4 feat(auth): implement A11...`
  - Creamos: `git tag -a v1.0.0 -m "Release v1.0.0"`
  - `v1.0.0` ahora apunta a `c2c98c4`
  - Para siempre (tag es inmutable)

- **Ventajas del tag**:
  - No necesitas recordar hash largo
  - Easy reference en documentación
  - Release notes asociadas (`-m "message"`)
  - `v1.0.0` es legible, `c2c98c4` no

- **Analogía**:
  - Commit hash = DNI (identificador único técnico)
  - Tag = Nombre legible (referencia humana)

---

## 12. ¿Qué mejoras harías para un sistema con información sensible?

**Respuesta:**

Para un sistema con PII, datos financieros, o salud (ej: banking app), A12 necesita endurecimiento:

**Mejoras de Autenticación**:
1. **Refresh Tokens**:
   - Access token corta vida (15 min)
   - Refresh token larga vida (7 días)
   - Backend valida refresh → retorna nuevo access token
   - Mitiga daño si token se expone

2. **Two-Factor Authentication (2FA)**:
   - Además de password, requiere código SMS/app (TOTP)
   - Ej: `POST /auth/verify-2fa` después de login

3. **Rate Limiting**:
   - Backend limita intentos de login fallidos
   - Ej: max 5 intentos por IP por minuto
   - Previene brute force

**Mejoras de Storage**:
4. **Encrypted Cookies (HttpOnly)**:
   - No sessionStorage (visible en DevTools)
   - HttpOnly cookies (no accesible desde JS, automate requests)
   - Secure flag (solo HTTPS)
   - SameSite flag (previene CSRF)

5. **Encrypted Local Storage**:
   - Si debe ser local, encriptar valor
   - Ej: crypto-js library

**Mejoras de Red**:
6. **HTTPS Obligatorio**:
   - Redirect HTTP → HTTPS
   - Strict-Transport-Security header (HSTS)
   - Certificate pinning (advanced)

7. **CSRF Protection**:
   - Tokens CSRF en formularios POST/PUT/DELETE
   - Backend valida `X-CSRF-Token` header

**Mejoras de Backend**:
8. **Input Validation**:
   - Validar todos inputs (email, password, etc.)
   - Prevenir SQL injection, XSS, command injection

9. **Audit Logging**:
   - Log todas las acciones (logins, cambios, deletes)
   - Ej: "admin user borró task X a las 14:30"

10. **Encryption en BD**:
    - Encriptar campos sensibles en MongoDB (contraseñas con bcrypt, SSNs)
    - Never plain-text passwords

11. **API Security**:
    - API Key + Secret signing (no solo Bearer)
    - Request signing for integrity
    - Rate limiting por usuario

12. **Incident Response**:
    - Plan de respuesta si token se expone
    - Invalidar todos tokens de ese usuario
    - Alertar al usuario por email

**En contexto A12** (aplicación actual):
- ✅ Tiene: Bearer tokens, sessionStorage, 401/403 differentiation
- ❌ Faltan: refresh tokens, 2FA, encryption, CSRF protection, audit logs
- Próximas actividades podrían ser A13 (Security Hardening), A14 (Encryption), etc.

---

## Conclusión

A12 implementó las **bases sólidas** de testing, configuración y deployment. Para datos sensibles, se requiere iteración adicional con seguridad de nivel empresarial. 

**El flujo A11 → A12 es foundational**: autenticación + testing + deployment = producto deployable. El hardening viene en fases posteriores.

---

**Elaborado por**: Jalil  
**Actividad**: EC3-F3-A12  
**Fecha**: 2025-01-06
