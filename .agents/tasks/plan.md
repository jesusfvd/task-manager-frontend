# Plan de Implementación: EC3-F2-A10 — Consumo de API REST y CRUD Remoto

Reemplazar completamente la persistencia localStorage del proyecto task-manager-frontend por llamadas HTTP a una API REST Express/MongoDB en http://localhost:3000.

**Proyecto**: React 18.3 + TypeScript 5.5 + Vite 5.4 + React Router 7.18
**Package manager**: pnpm
**Comandos verificación**: `pnpm build` y `pnpm lint`

---

## FASE 1: Configuración Base de Variables y Tipos

- [ ] 1. Crear archivo `.env.example` en la raíz del proyecto con la variable `VITE_API_URL=/api` y documentar el propósito de cada variable.
      Files: `.env.example`
      Verify: `cat .env.example` — confirmar que el archivo existe y contiene la variable.

- [ ] 2. Crear archivo `.env.local` en la raíz del proyecto con el mismo contenido que `.env.example` para desarrollo local.
      Files: `.env.local`
      Verify: `cat .env.local` — confirmar que el archivo existe (no se commitea pero debe existir localmente).

- [ ] 3. Crear `src/config/env.ts` que exporte `API_URL = import.meta.env.VITE_API_URL || '/api'` con validación y tipo string garantizado.
      Files: `src/config/env.ts`
      Verify: `pnpm build` — el compilador TypeScript debe procesar el archivo sin errores.

- [ ] 4. Actualizar `vite.config.ts` para agregar proxy que redirija `/api` → `http://localhost:3000` en el servidor de desarrollo.
      Files: `vite.config.ts`
      Verify: `pnpm build` — la configuración debe ser válida y el build debe completarse.

- [ ] 5. Crear `src/models/api.types.ts` con los tipos: `ApiResponse<T>` (data: T), `ApiError` (code, message, details?, requestId?), `PageMeta` (total, page, limit, totalPages), `PaginatedResponse<T>` (data: T[], meta: PageMeta).
      Files: `src/models/api.types.ts`
      Verify: `pnpm build` — TypeScript debe compilar los tipos sin errores.

- [ ] 6. Crear `src/models/request-status.type.ts` con el tipo `RequestStatus = 'idle' | 'loading' | 'success' | 'error'` para tracking de estados asíncronos.
      Files: `src/models/request-status.type.ts`
      Verify: `pnpm build` — TypeScript debe compilar el tipo sin errores.

- [ ] 7. Actualizar `src/models/Task.ts` para reflejar el contrato de la API: cambiar `id: string` a `_id: string`, agregar 'in_progress' al union type de status, agregar campos `priority: 'low' | 'medium' | 'high'`, `tags: string[]`, `description?: string`, `dueDate?: string`. Crear también `CreateTaskInput` (title, description?, priority?, tags?, dueDate?, status?) y `UpdateTaskInput` (Partial de Task sin _id, createdAt, updatedAt).
      Files: `src/models/Task.ts`
      Verify: `pnpm build` — TypeScript debe compilar sin errores. Los errores en componentes que usan Task aparecerán pero esto es esperado en este paso.

---

## FASE 2: Servicios HTTP y API Client

- [ ] 8. Crear `src/services/http.service.ts` con función genérica `httpClient<T>(endpoint: string, options?: RequestInit & { signal?: AbortSignal }): Promise<T>`. Debe construir URL completa usando `API_URL`, agregar headers `Content-Type: application/json` y `Accept: application/json`, hacer fetch, verificar ok (throw en errores 4xx/5xx con mensaje del body parseado si existe), parsear y retornar JSON tipado. Manejar errores de red con mensajes en español.
      Files: `src/services/http.service.ts`
      Verify: `pnpm build` — TypeScript debe compilar el servicio sin errores.

- [ ] 9. Crear `src/services/task.api.service.ts` con las funciones: `getTasks(params?: { page?, limit?, search?, status?, sortBy?, order? }, signal?: AbortSignal): Promise<PaginatedResponse<Task>>`, `getTaskById(id: string, signal?: AbortSignal): Promise<Task>`, `createTask(input: CreateTaskInput, signal?: AbortSignal): Promise<Task>`, `updateTask(id: string, input: UpdateTaskInput, signal?: AbortSignal): Promise<Task>`, `deleteTask(id: string, signal?: AbortSignal): Promise<void>`. Todas usan httpClient y construyen query strings donde aplique. Los endpoints son: GET /api/tasks, GET /api/tasks/:id, POST /api/tasks, PATCH /api/tasks/:id, DELETE /api/tasks/:id. Las respuestas GET/POST/PATCH vienen en `{ data: ... }`, extrae data; DELETE es 204 sin contenido.
      Files: `src/services/task.api.service.ts`
      Verify: `pnpm build` — TypeScript debe compilar el servicio sin errores.

---

## FASE 3: Custom Hooks para Estado Asíncrono

- [ ] 10. Crear `src/hooks/useTaskList.ts` que retorne `{ tasks: Task[], status: RequestStatus, error: string | null, meta: PageMeta | null, loadTasks: (params?) => Promise<void>, reload: () => Promise<void> }`. Internamente usa `useState` para tasks/status/error/meta/lastParams. `loadTasks` acepta queryParams opcionales, guarda en lastParams, setea status a 'loading', llama `getTasks` con AbortController, maneja éxito (actualiza tasks/meta/status='success') y error (actualiza error/status='error'). `reload` llama `loadTasks(lastParams)`. useEffect con cleanup cancela peticiones en unmount. Mensajes de error en español.
      Files: `src/hooks/useTaskList.ts`
      Verify: `pnpm build` — TypeScript debe compilar el hook sin errores.

---

## FASE 4: Componentes de Estado Asíncrono y Paginación

- [ ] 11. Crear `src/components/AsyncStatus.tsx` que acepte props `{ status: RequestStatus, error: string | null, isEmpty?: boolean, emptyMessage?: string, onRetry?: () => void }`. Renderiza: spinner de carga si status='loading', mensaje de error con botón "Reintentar" si status='error' y onRetry existe, mensaje vacío si isEmpty=true, null en caso contrario. Usar clases CSS `.loading-spinner`, `.error-message`, `.empty-state` (ya existe en el proyecto). Accesibilidad: role="status" para loading, role="alert" para error.
      Files: `src/components/AsyncStatus.tsx`
      Verify: `pnpm build` — TypeScript debe compilar el componente sin errores.

- [ ] 12. Crear `src/components/TaskPagination.tsx` que acepte props `{ meta: PageMeta, onPageChange: (page: number) => void }`. Renderiza botones "Anterior" y "Siguiente", deshabilitados en los bordes (página 1 y última página), indicador "Página X de Y". Usar clase CSS `.pagination-controls`. Accesibilidad: aria-label en botones, aria-current="page" en indicador.
      Files: `src/components/TaskPagination.tsx`
      Verify: `pnpm build` — TypeScript debe compilar el componente sin errores.

---

## FASE 5: Actualizar Componentes Existentes para API

- [ ] 13. Actualizar `src/components/TaskForm.tsx` para manejar operaciones async. Cambiar handler `onAddTask` para que sea async y retorne Promise<void>. Agregar estado `isSubmitting: boolean`. Durante submit, setear isSubmitting=true, llamar onAddTask (await), manejar errores con try/catch, setear isSubmitting=false al final. Botón de submit debe tener disabled={isSubmitting} y mostrar texto "Agregando..." cuando isSubmitting=true usando clase `.btn-loading`. Mostrar errores del servidor en español debajo del formulario.
      Files: `src/components/TaskForm.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

- [ ] 14. Actualizar `src/components/TaskItem.tsx` para operaciones async de toggle y delete. Agregar estados `isTogglingStatus: boolean` y `isDeleting: boolean`. Handlers para toggle y delete deben ser async, setear estado loading correspondiente, await la operación, manejar errores, setear loading=false. Los botones deben tener disabled cuando está su operación en curso o isEditing=true. Usar clase `.btn-loading` para indicar loading. Mensajes de error en español. El campo `_id` del Task debe mapearse a `id` para uso interno del componente (o actualizar todas las referencias id→_id). Status 'in_progress' debe mostrarse como "En progreso".
      Files: `src/components/TaskItem.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

- [ ] 15. Actualizar `src/components/TaskFilters.tsx` para emitir cambios al padre sin filtrar localmente. Mantener la interfaz de props actual (query, filter, sortBy, resultCount, handlers). Agregar 'in_progress' como opción en el select de estado con label "En progreso". NO filtrar las tareas dentro de este componente — toda la lógica de filtrado ahora es responsabilidad del servidor vía queryParams en la API.
      Files: `src/components/TaskFilters.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

- [ ] 16. Actualizar `src/components/TaskSummary.tsx` para recibir `meta: PageMeta` en lugar de `tasks: Task[]`. Cambiar cálculos: totalTasks = meta.total, eliminar cálculos de completedTasks y pendingTasks (ya no son posibles sin las tareas). Simplificar a mostrar solo "Total: {meta.total}" en una card o mantener las 3 cards pero con "—" en completadas/pendientes si no se pueden obtener del servidor. Decisión: mostrar solo el total, ya que el backend no provee conteos por status en el meta. Mantener accesibilidad aria-label.
      Files: `src/components/TaskSummary.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

---

## FASE 6: Reescribir Páginas para Consumir API

- [ ] 17. Reescribir completamente `src/pages/TasksPage.tsx` para usar `useTaskList`. Eliminar todas las props excepto handlers de UI que ahora serán internos. Usar estado local `queryParams: { page: number, limit: number, search: string, status: string, sortBy: string, order: string }` con valores iniciales page=1, limit=10, search='', status='', sortBy='updatedAt', order='desc'. useEffect que llama `loadTasks(queryParams)` cuando cambian queryParams. Handlers para filtros (onQueryChange, onFilterChange, onSortChange) actualizan queryParams y resetean page a 1. Handler onClearCriteria resetea todos los params a valores iniciales. Handlers CRUD: `handleAddTask` async llama `createTask`, luego `reload()`; `handleToggleStatus` async llama `getTaskById`, determina nuevo status, llama `updateTask`, luego `reload()`; `handleEditTask` async llama `updateTask`, luego `reload()`; `handleDeleteTask` async llama `deleteTask`, luego `reload()`. Renderizar AsyncStatus antes de TaskList, pasar loading/error/isEmpty. Renderizar TaskPagination después de TaskList. Mantener estructura semántica y accesibilidad existente.
      Files: `src/pages/TasksPage.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

- [ ] 18. Reescribir `src/pages/TaskDetailPage.tsx` para cargar tarea por ID desde API. Eliminar prop `tasks`, mantener prop `onDeleteTask` pero ahora llamará la API. Obtener id de `useParams<{ taskId: string }>()`. Usar estados: `task: Task | null`, `status: RequestStatus`, `error: string | null`. useEffect con AbortController que llama `getTaskById(taskId)` al montar, maneja 404 (setea error específico), maneja otros errores, guarda task en éxito, limpia en unmount. Renderizar AsyncStatus mientras carga. Si status='error' y el error indica 404, renderizar NotFoundPage. Si status='success' y task existe, renderizar el detalle. Handler `handleDeleteTask` async llama `deleteTask`, navega a /tasks en éxito. Mapear campos del API (_id, priority, tags, description, dueDate) en la UI si existen. Status 'in_progress' → "En progreso". Mantener accesibilidad.
      Files: `src/pages/TaskDetailPage.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

- [ ] 19. Actualizar `src/pages/HomePage.tsx` para usar la nueva interfaz de TaskSummary. Eliminar prop `tasks: Task[]` ya que TaskSummary ahora necesita `meta: PageMeta`. Decisión: HomePage ya no puede mostrar resumen sin hacer una llamada API. Dos opciones: (A) Hacer llamada a getTasks con limit=1 solo para obtener meta.total y pasar a TaskSummary, o (B) Eliminar TaskSummary de HomePage y actualizar texto para reflejar que la gestión se hace en /tasks. Elegimos opción B por simplicidad — el HomePage será solo presentacional. Actualizar texto: cambiar "almacenadas en el navegador" a "utilizando la API REST del backend". Eliminar componente TaskSummary del render.
      Files: `src/pages/HomePage.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

- [ ] 20. Actualizar `src/App.tsx` para eliminar toda la lógica de localStorage y estado global de tareas. Eliminar: imports de seedTasks, task-storage.service, task-query.service, useState de tasks/query/filter/sortBy, useEffect de saveTasks, función getVisibleTasks, todos los handlers (handleAddTask, handleToggleStatus, etc.). Simplificar a solo el router con rutas: index (HomePage sin props), tasks (TasksPage sin props), tasks/:taskId (TaskDetailPage sin props tasks), * (NotFoundPage). Mantener AppLayout. El App.tsx ahora es puramente declarativo — cada página maneja su propio estado y comunicación con API.
      Files: `src/App.tsx`
      Verify: `pnpm build` — TypeScript debe compilar sin errores.

---

## FASE 7: Limpieza de Archivos y Estilos

- [ ] 21. Eliminar archivos obsoletos de persistencia local: `src/services/task-storage.service.ts`, `src/services/task-query.service.ts`, `src/data/seedTasks.ts`. Estos ya no se usan y deben removerse del proyecto.
      Files: `src/services/task-storage.service.ts` (delete), `src/services/task-query.service.ts` (delete), `src/data/seedTasks.ts` (delete)
      Verify: `git status` — confirmar que los archivos fueron eliminados. `pnpm build` debe completarse sin errores de imports faltantes.

- [ ] 22. Agregar estilos CSS para estados asíncronos en `src/styles/index.css`. Agregar reglas para: `.loading-spinner` (spinner animado, puede usar @keyframes spin con transform rotate, border spinner circular), `.error-message` (color rojo/naranja, padding, border-radius), `.pagination-controls` (flex layout, gap entre botones, centrado), `.btn-loading` (cursor wait, posiblemente opacity reducida o icono/spinner inline). La clase `.empty-state` ya existe. Mantener consistencia con el estilo existente del proyecto (colores, tipografía, espaciado). Accesibilidad: asegurar contraste de color suficiente.
      Files: `src/styles/index.css`
      Verify: `pnpm build` — el build debe completarse. Inspección visual: abrir el proyecto y verificar que los estilos se aplican correctamente.

---

## FASE 8: Documentación, Git y Testing Manual

- [ ] 23. Actualizar `README.md` con sección de configuración API. Agregar subsección "Configuración de variables de entorno" explicando `.env.local` y `VITE_API_URL`. Agregar subsección "Backend API" explicando que se requiere el servidor Express/MongoDB en http://localhost:3000 antes de `pnpm dev`. Incluir comandos: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`. Actualizar sección "Funciones actuales" para reemplazar "Persistencia mediante localStorage" con "Persistencia remota mediante API REST". Mantener tono y formato del README original.
      Files: `README.md`
      Verify: `cat README.md | grep "API REST"` — confirmar que la documentación menciona API REST.

- [ ] 24. Crear `docs/pruebas-api-rest-ec3-a10.md` con tabla de casos de prueba: listar tareas (GET /api/tasks con distintos filtros), obtener detalle (GET /api/tasks/:id), crear tarea (POST), actualizar tarea (PATCH), eliminar tarea (DELETE), paginación (page/limit), búsqueda (search param), filtros (status param), ordenamiento (sortBy/order params), manejo de errores 404/400/500. Para cada caso: descripción, endpoint, parámetros, resultado esperado, campo para evidencia (screenshot o descripción de resultado). Formato markdown tabla o lista estructurada.
      Files: `docs/pruebas-api-rest-ec3-a10.md`
      Verify: `cat docs/pruebas-api-rest-ec3-a10.md | head -20` — confirmar que el archivo existe y tiene estructura de casos de prueba.

- [ ] 25. Crear `docs/preguntas-cierre-ec3-a10.md` con las 5 preguntas de cierre de la actividad (proporcionadas por el profesor) y sus respuestas. Las preguntas típicas son sobre: ventajas de API REST sobre localStorage, cómo funciona el ciclo de vida de una petición HTTP, diferencias entre fetch y localStorage, rol de async/await, manejo de estados de carga/error. Responder con claridad técnica y referencias al código implementado.
      Files: `docs/preguntas-cierre-ec3-a10.md`
      Verify: `cat docs/preguntas-cierre-ec3-a10.md | head -10` — confirmar que el archivo existe y contiene preguntas respondidas.

- [ ] 26. Crear branch `feature/api-rest-crud-remoto` en git. Verificar que estamos en branch main con working tree limpio, luego `git checkout -b feature/api-rest-crud-remoto`. NO hacer checkout si ya hay cambios sin commitear — en ese caso, primero hacer el branch y luego los commits iterativos. Esta es la preparación antes de commits.
      Files: (git operation, no files)
      Verify: `git branch --show-current` — debe mostrar "feature/api-rest-crud-remoto".

- [ ] 27. Hacer commit final con todo el trabajo: `git add .` (verificar con `git status` que se incluyen todos los cambios: archivos nuevos en src/services, src/hooks, src/config, src/components actualizados, archivos eliminados, .env.example, docs/, vite.config.ts, etc.), luego `git commit -m "feat: integrar api rest y crud remoto (EC3-F2-A10)"`. Verificar que el commit incluye todos los cambios. NO hacer push (según las instrucciones del task).
      Files: (git operation, includes all modified/created/deleted files)
      Verify: `git log --oneline -1` — debe mostrar el commit con mensaje "feat: integrar api rest y crud remoto (EC3-F2-A10)". `git status` debe mostrar working tree clean.

- [ ] 28. Ejecutar `pnpm lint` para verificar que no hay errores de linting. Si hay errores, corregirlos y hacer un commit de correcciones: `git add .` y `git commit -m "fix: corregir errores de linting"`.
      Files: (source files if corrections needed)
      Verify: `pnpm lint` — debe completarse sin errores.

- [ ] 29. Ejecutar `pnpm build` para verificar que el proyecto compila correctamente. Si hay errores de compilación, corregirlos y hacer un commit de correcciones: `git add .` y `git commit -m "fix: corregir errores de compilación"`.
      Files: (source files if corrections needed)
      Verify: `pnpm build` — debe completarse sin errores y generar la carpeta dist con los archivos compilados.

- [ ] 30. Testing manual de integración: levantar el backend API en http://localhost:3000, luego `pnpm dev` del frontend. Probar en el navegador: (1) HomePage carga sin errores, (2) /tasks muestra spinner de carga y luego lista de tareas del backend, (3) filtros/búsqueda/paginación funcionan, (4) crear nueva tarea funciona, (5) editar tarea funciona, (6) toggle status funciona, (7) eliminar tarea funciona, (8) /tasks/:id carga detalle correctamente, (9) /tasks/id-inexistente muestra 404, (10) desconectar backend y verificar que se muestran mensajes de error apropiados. Documentar resultados en `docs/pruebas-api-rest-ec3-a10.md` con screenshots o descripciones.
      Files: `docs/pruebas-api-rest-ec3-a10.md` (updated with test results)
      Verify: Manual testing — todas las funcionalidades CRUD deben funcionar correctamente con el backend API. Verificar que la documentación de pruebas tiene evidencias completas.

---

## Notas Finales

- **Orden de dependencias**: Los pasos están ordenados por dependencia. No saltar pasos — cada fase depende de las anteriores.
- **Mensajes de error**: Todos los mensajes de error mostrados al usuario deben estar en español.
- **Accesibilidad**: Mantener aria-labels, roles, y atributos de accesibilidad existentes en el proyecto original.
- **Consistencia de estilo**: Usar las convenciones del código existente: formato de comentarios JSDoc, nombres de archivos kebab-case, componentes PascalCase, hooks con prefijo use, tipos en *.types.ts.
- **Testing**: No hay framework de testing configurado — la verificación es manual y mediante build/lint.
- **Estado de la API**: El backend debe estar corriendo en http://localhost:3000 antes de las pruebas. No es responsabilidad de este frontend levantar el backend.
- **Campos opcionales del Task**: Los campos nuevos (priority, tags, description, dueDate) son opcionales en la API. La UI debe manejar su ausencia gracefully. Si no están presentes, no mostrarlos o mostrar "—" / "Sin especificar".
- **Mapeo _id ↔ id**: La API usa `_id` pero el código existente usa `id` internamente en varios lugares. Decisión: mantener `_id` en el modelo Task para reflejar la API exactamente, y actualizar todas las referencias en componentes para usar `_id` en lugar de `id`. Esto es más consistente con el backend MongoDB.

