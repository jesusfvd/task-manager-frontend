# 📋 Administrador de Tareas - Frontend

Aplicación web interactiva para gestión de tareas desarrollada con React 18, TypeScript y Vite.

**Asignatura:** Diseño Frontend con Frameworks  
**Actividades:** EC2 F1 A5, A6 y EC2 F2 A7  
**Proyecto:** Administrador de tareas con operaciones CRUD

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev
# o
npx vite

# Compilar para producción
pnpm build

# Validar código
pnpm lint
```

**URL desarrollo:** http://localhost:5173

---

## ✨ Alcance Actual (Actividad 7)

La aplicación administra una colección local de tareas mediante estado de React. Actualmente permite:

- ✅ **Registrar tareas** - Agregar nuevas tareas con título validado
- ✅ **Consultar la colección** - Ver todas las tareas registradas
- ✅ **Completar y reabrir tareas** - Cambiar el estado entre pending/completed
- ✅ **Editar títulos** - Modificar el texto de las tareas
- ✅ **Cancelar edición** - Restaurar el título original si se cancela
- ✅ **Eliminar con confirmación** - Borrar tareas con diálogo de confirmación
- ✅ **Calcular resumen automáticamente** - Estadísticas en tiempo real
- ✅ **Mostrar colección vacía** - Mensaje cuando no hay tareas

⚠️ **Los cambios permanecen en memoria y se reinician al recargar la página.**

---

## 🎯 Operaciones CRUD

| Operación | Acción | Implementación |
|-----------|--------|----------------|
| **Create** | Registrar una tarea | Formulario controlado con `spread` |
| **Read** | Mostrar la colección | Renderizado con `map()` |
| **Update** | Cambiar estado o título | `map()` y `spread` inmutables |
| **Delete** | Eliminar una tarea | `filter()` con confirmación |

---

## 📁 Estructura del Proyecto

```
task-manager-frontend/
├── docs/
│   ├── preguntas-cierre-ec2-f2-a7.md    # 14 preguntas respondidas
│   └── RESUMEN-ACTIVIDAD-7.md           # Guía de estudio
├── src/
│   ├── components/
│   │   ├── AppHeader.tsx                # Encabezado
│   │   ├── TaskForm.tsx                 # ✨ Formulario controlado
│   │   ├── TaskFilters.tsx              # Filtros (deshabilitados A7)
│   │   ├── TaskSummary.tsx              # Resumen dinámico
│   │   ├── TaskList.tsx                 # Lista con funciones CRUD
│   │   └── TaskItem.tsx                 # ✨ Item con edición inline
│   ├── models/
│   │   └── Task.ts                      # ✨ Interfaz actualizada
│   ├── data/
│   │   └── seedTasks.ts                 # 5 tareas iniciales
│   ├── styles/
│   │   └── index.css                    # ✨ Estilos con edición
│   ├── App.tsx                          # ✨ Estado y funciones CRUD
│   └── main.tsx
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔑 Conceptos Implementados

### 1. **Estado de React (useState)**

```tsx
const [tasks, setTasks] = useState<Task[]>(() => [...seedTasks]);
```

- Almacena la colección de tareas
- Se mantiene entre renderizados
- Actualiza la UI automáticamente

### 2. **Formulario Controlado**

```tsx
const [title, setTitle] = useState('');

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

- El estado controla el valor del input
- React es la fuente única de verdad
- Permite validación en tiempo real

### 3. **Eventos y Callbacks**

```tsx
// App define y pasa funciones
<TaskForm onAddTask={handleAddTask} />

// TaskForm las ejecuta
function handleSubmit(event) {
  event.preventDefault();
  onAddTask(normalizedTitle);
}
```

### 4. **Actualización Inmutable**

```tsx
// ❌ NUNCA
tasks.push(newTask);

// ✅ SIEMPRE
setTasks([newTask, ...tasks]);
```

---

## 🛠️ Implementación CRUD Detallada

### CREATE - Agregar Tarea

```tsx
function handleAddTask(title: string) {
  const now = new Date().toISOString();
  
  const newTask: Task = {
    id: crypto.randomUUID(),  // ID único
    title,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  setTasks((currentTasks) => [
    newTask,           // Nueva al inicio
    ...currentTasks,   // Resto del array
  ]);
}
```

**Operador:** `spread (...)`  
**Resultado:** Nuevo array sin modificar el original

---

### UPDATE - Toggle Status

```tsx
function handleToggleStatus(id: string) {
  const now = new Date().toISOString();

  setTasks((currentTasks) =>
    currentTasks.map((task) => {
      if (task.id !== id) return task;
      
      return {
        ...task,
        status: task.status === 'pending' ? 'completed' : 'pending',
        updatedAt: now,
      };
    })
  );
}
```

**Método:** `map()`  
**Lógica:** Solo modifica la tarea con el ID coincidente

---

### UPDATE - Editar Título

```tsx
function handleEditTask(id: string, title: string) {
  const now = new Date().toISOString();

  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === id
        ? { ...task, title, updatedAt: now }
        : task
    )
  );
}
```

**Preserva:** `id` y `createdAt`  
**Actualiza:** `title` y `updatedAt`

---

### DELETE - Eliminar con Confirmación

```tsx
function handleDeleteTask(id: string) {
  const selectedTask = tasks.find(task => task.id === id);
  
  if (!selectedTask) return;

  const shouldDelete = window.confirm(
    `¿Eliminar la tarea "${selectedTask.title}"?`
  );
  
  if (!shouldDelete) return;

  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== id)
  );
}
```

**Método:** `filter()`  
**Resultado:** Array sin la tarea eliminada

---

## 🏗️ Arquitectura y Flujo de Datos

```
┌─────────────────────────────────────────┐
│              App.tsx                    │
│  ┌───────────────────────────────────┐  │
│  │ const [tasks, setTasks] = ...     │  │ ← Fuente de verdad
│  │                                   │  │
│  │ handleAddTask()                   │  │
│  │ handleToggleStatus()              │  │
│  │ handleEditTask()                  │  │
│  │ handleDeleteTask()                │  │
│  └───────────────────────────────────┘  │
└──────────┬───────────────────┬──────────┘
           │                   │
    ┌──────▼─────┐      ┌─────▼──────┐
    │ TaskForm   │      │ TaskList   │
    │            │      │            │
    │ onAddTask()│      │ tasks[]    │
    └────────────┘      │ onToggle() │
                        │ onEdit()   │
                        │ onDelete() │
                        └─────┬──────┘
                              │
                        ┌─────▼──────┐
                        │ TaskItem   │
                        │            │
                        │ Ejecuta    │
                        │ funciones  │
                        └────────────┘
```

**Principio:** Flujo unidireccional de datos (top-down)

---

## 📊 Modelo de Datos

```typescript
interface Task {
  id: string;              // UUID único
  title: string;           // Máximo 120 caracteres
  status: 'pending' | 'completed';
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

---

## ✅ Validaciones Implementadas

| Campo | Validación | Implementación |
|-------|-----------|----------------|
| Título | No vacío | `required` + `disabled={!normalizedTitle}` |
| Título | Máximo 120 chars | `maxLength={120}` |
| Título | Sin espacios extra | `title.trim()` |
| Eliminación | Confirmación | `window.confirm()` |

---

## 🎨 Tecnologías

- **React 18.3** - Biblioteca UI con hooks
- **TypeScript 5.5** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **ESLint 9** - Linter configurado
- **CSS3 puro** - Sin frameworks

---

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo en puerto 5173 |
| `pnpm build` | Compila TypeScript y genera bundle |
| `pnpm lint` | Valida código con ESLint |
| `pnpm preview` | Preview del build de producción |

---

## 🧪 Pruebas Funcionales

### Checklist de Verificación

- [ ] **Agregar tarea:** Escribe "Tarea de prueba" y presiona "Agregar tarea"
  - ✓ Aparece al inicio de la lista
  - ✓ Estado inicial: "Pendiente"
  - ✓ Campo se limpia automáticamente
  - ✓ Resumen se actualiza (+1 total, +1 pendiente)

- [ ] **Validación:** Intenta agregar con campo vacío
  - ✓ Botón "Agregar tarea" está deshabilitado

- [ ] **Completar tarea:** Presiona "Completar" en una tarea pendiente
  - ✓ Insignia cambia a "Completada"
  - ✓ Estilo visual cambia
  - ✓ Resumen se actualiza (-1 pendiente, +1 completada)

- [ ] **Reabrir tarea:** Presiona "Reabrir" en una tarea completada
  - ✓ Vuelve a "Pendiente"
  - ✓ Resumen se actualiza

- [ ] **Editar título:** Presiona "Editar", cambia el texto y "Guardar"
  - ✓ Muestra formulario inline
  - ✓ El nuevo título se guarda
  - ✓ Fecha de actualización cambia

- [ ] **Cancelar edición:** Presiona "Editar", modifica y "Cancelar"
  - ✓ Título original se conserva
  - ✓ Cambios se descartan

- [ ] **Eliminar (cancelar):** Presiona "Eliminar" y cancela
  - ✓ Aparece confirmación
  - ✓ Tarea permanece en la lista

- [ ] **Eliminar (confirmar):** Presiona "Eliminar" y acepta
  - ✓ Tarea desaparece
  - ✓ Resumen se actualiza

- [ ] **Estado vacío:** Elimina todas las tareas
  - ✓ Mensaje "No hay tareas registradas"
  - ✓ Resumen muestra ceros

- [ ] **Recargar página:** Presiona F5
  - ✓ Vuelven las 5 tareas iniciales (comportamiento esperado)

- [ ] **Consola del navegador:** Revisa durante el uso
  - ✓ Sin errores
  - ✓ Sin warnings

---

## 🔄 Progreso del Proyecto

| Actividad | Estado | Descripción |
|-----------|--------|-------------|
| **A5** | ✅ Completado | Componentes React estáticos |
| **A6** | ✅ Completado | Modelado y renderizado dinámico |
| **A7** | ✅ Completado | Estado local, eventos y CRUD |
| **A8** | ⏳ Pendiente | Validación, búsqueda y localStorage |
| **EC3** | ⏳ Pendiente | Integración con API REST |

---

## 📚 Recursos de Estudio

Dentro de la carpeta `docs/` encontrarás:

1. **preguntas-cierre-ec2-f2-a7.md**
   - 14 preguntas respondidas en detalle
   - Ejemplos de código explicados
   - Conceptos fundamentales

2. **RESUMEN-ACTIVIDAD-7.md**
   - Resumen ejecutivo completo
   - Puntos clave para explicar oralmente
   - Errores comunes y soluciones
   - Tabla comparativa CRUD

---

## 🎓 Aprendizajes Clave

### Actividad 7 - Estado y CRUD

1. **useState** - Hook para agregar memoria a componentes
2. **Formulario controlado** - React controla el valor del input
3. **Props drilling** - Pasar funciones a componentes hijos
4. **Inmutabilidad** - Crear nuevos arrays/objetos, nunca modificar directamente
5. **CRUD inmutable** - `spread`, `map()`, `filter()`
6. **Fuente de verdad** - Un solo lugar almacena cada dato
7. **preventDefault** - Evitar recarga de página en formularios
8. **Estado local vs global** - Cuándo usar cada uno
9. **Función actualizadora** - `setState(prev => ...)` cuando dependes del estado anterior
10. **window.confirm()** - Confirmación nativa para acciones destructivas

---

## ⚙️ Configuración del Entorno

```bash
# Node.js
node --version  # v18 o superior

# PNPM
pnpm --version  # v8 o superior

# Git
git --version   # Cualquier versión reciente
```

---

## 🚀 Próximos Pasos (Actividad 8)

- ✨ Mensajes de validación detallados
- 🔍 Búsqueda por título en tiempo real
- 🎯 Filtros funcionales por estado
- 📊 Ordenamiento (recientes, antiguas, alfabético)
- 💾 **Persistencia con localStorage**
- 🔄 Sincronización automática

---

## 📝 Convenciones de Commits

```bash
feat: agregar formulario controlado (A7)
feat: implementar operaciones CRUD (A7)
feat: agregar estado local con useState (A7)
style: agregar estilos para edición inline (A7)
docs: actualizar README con información de A7
docs: responder preguntas de cierre A7
```

---

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Limpiar y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Advertencia de esbuild
```bash
# Usar npx vite directamente
npx vite
```

### Errores de TypeScript
```bash
# Verificar tipos
pnpm tsc --noEmit
```

---

## 📄 Licencia

Proyecto educativo - Universidad de El Salvador  
Diseño Frontend con Frameworks - 2024

---

## 👨‍💻 Autor

[Tu nombre completo]  
[Tu carnet]  
Universidad de El Salvador

---

**✨ La aplicación está completamente funcional con operaciones CRUD en memoria.**

**📚 Consulta los documentos en `docs/` para preparar tu explicación oral.**

**🎉 ¡Éxito en tu presentación!**
