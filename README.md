# 📋 Gestor de Tareas - React + TypeScript

Aplicación web para gestión de tareas desarrollada con React 18, TypeScript y Vite.

**Asignatura:** Diseño Frontend con Frameworks  
**Actividades:** EC2 F1 A5 y A6  
**Estudiante:** [Tu nombre]

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

**URL desarrollo:** http://localhost:5173

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── TaskForm.tsx
│   ├── TaskFilters.tsx
│   ├── TaskSummary.tsx
│   ├── TaskList.tsx
│   └── TaskItem.tsx
├── models/             # 🆕 Interfaces TypeScript (A6)
│   └── Task.ts
├── data/               # 🆕 Datos semilla (A6)
│   └── seedTasks.ts
├── styles/
│   └── index.css
├── App.tsx             # Componente raíz con estado
└── main.tsx
```

---

## ✨ Actividad 5 (A5) - Componentes React

### Características implementadas:

- ✅ 7 componentes React funcionales
- ✅ Props tipadas con TypeScript
- ✅ Estructura semántica con HTML5
- ✅ CSS modular y responsive
- ✅ Accesibilidad con ARIA labels
- ✅ Diseño mobile-first

### Componentes:

1. **AppHeader** - Encabezado con navegación
2. **TaskForm** - Formulario para crear tareas
3. **TaskFilters** - Filtros de búsqueda y estado
4. **TaskSummary** - Tarjetas con estadísticas
5. **TaskList** - Lista de tareas
6. **TaskItem** - Tarjeta individual de tarea
7. **AppFooter** - Pie de página

---

## 🎯 Actividad 6 (A6) - Renderizado Dinámico

### Nuevas características:

#### 1. **Interfaz Task con TypeScript**

```typescript
interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}
```

#### 2. **Array de 12 Tareas Semilla**

- 3 completadas
- 4 en progreso
- 5 pendientes

#### 3. **Renderizado con map() y key única**

```tsx
{filteredTasks.map((task) => (
  <TaskItem key={task.id} task={task} />
))}
```

#### 4. **Filtrado Dinámico**

```typescript
const filteredTasks = tasks.filter((task) => {
  if (filterStatus === 'all') return true;
  return task.status === filterStatus;
});
```

#### 5. **Renderizado Condicional**

- Mensaje cuando la lista está vacía
- Mensajes específicos por filtro activo

#### 6. **Cálculos Dinámicos**

```typescript
const totalTasks = tasks.length;
const completedTasks = tasks.filter(t => t.status === 'completed').length;
const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
const pendingTasks = tasks.filter(t => t.status === 'pending').length;
```

---

## 🏗️ Arquitectura

```
App.tsx (Estado centralizado)
  ├── useState(seedTasks) ────┐
  └── useState(currentFilter) │
      ↓ Props                 │
  ├─ TaskSummary ←────────────┤
  │   └─ Calcula estadísticas │
  ├─ TaskFilters              │
  │   └─ Callback: setFilter  │
  └─ TaskList ←───────────────┘
      ├─ filter() por estado
      ├─ map() con keys
      └─ TaskItem (individual)
```

---

## 🎨 Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **ESLint** - Linter
- **CSS3** - Estilos (sin frameworks)

---

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.6.3",
  "vite": "^5.4.10"
}
```

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Ejecuta ESLint |

---

## ✅ Preguntas de Cierre (A6)

### 1. ¿Por qué React necesita key con map()?

React usa keys para identificar qué elementos cambiaron, agregaron o eliminaron. Sin keys, React no puede trackear correctamente los elementos, causando:
- Rendimiento degradado
- Bugs de estado (componentes reutilizan estado incorrecto)
- Animaciones incorrectas

### 2. Index vs. ID único como key

| Aspecto | Index | ID único |
|---------|-------|----------|
| Estabilidad | Cambia al reordenar | Siempre igual |
| Performance | Puede causar re-renders | Óptimo |
| Bugs | Componentes reciben estado incorrecto | Estado correcto |
| Cuándo usar | Listas estáticas | Listas dinámicas ✅ |

### 3. Ventajas de cálculos dinámicos

1. **Single source of truth** - Datos vienen del array tasks
2. **Sincronización automática** - Stats se actualizan al modificar tareas
3. **Menos errores** - No hay riesgo de datos desincronizados
4. **Mantenibilidad** - Un solo lugar para la lógica
5. **Escalabilidad** - Funciona con 3 o 300 tareas

### 4. Renderizado condicional mejora UX

1. **Evita confusión** - Usuario entiende que no hay datos
2. **Guía al usuario** - Sugiere acciones ("¡Crea tu primera tarea!")
3. **Contexto del filtro** - Mensaje específico por filtro activo
4. **Accesibilidad** - Mensajes leídos por screen readers
5. **Feedback inmediato** - Usuario comprende el estado de la app

### 5. Importancia del tipado con TypeScript

1. **Detección temprana de errores** - Antes de ejecutar
2. **Documentación automática** - Interfaces documentan contratos
3. **IntelliSense** - Autocompletado en el editor
4. **Refactoring seguro** - TypeScript señala cambios necesarios
5. **Colaboración** - El equipo sabe qué espera cada componente
6. **Prevención de runtime errors** - Bugs eliminados en desarrollo

---

## 📊 Estadísticas del Proyecto

- **Componentes React:** 7
- **Archivos TypeScript:** 11
- **Tareas de ejemplo:** 12
- **Estados de tarea:** 3 (pending, in-progress, completed)
- **Líneas de código:** ~1,200

---

## 🎓 Aprendizajes Clave

### A5 - Componentes React
- Composición de componentes
- Props y tipado con TypeScript
- Estructura semántica HTML5
- CSS responsive sin frameworks
- Accesibilidad web (ARIA)

### A6 - Renderizado Dinámico
- Arrays en React con map()
- Prop key única y su importancia
- Filtrado dinámico con filter()
- Renderizado condicional
- Estado centralizado con useState
- Flujo unidireccional de datos
- Cálculos derivados del estado

---

## 🚀 Resultado Final

- ✅ 12 tareas renderizadas dinámicamente
- ✅ Filtrado funcional por estado
- ✅ Estadísticas que se actualizan automáticamente
- ✅ Estado vacío con mensajes contextuales
- ✅ Props tipadas con TypeScript
- ✅ Keys únicas en todas las listas
- ✅ Código mantenible y escalable

---

## 📝 Convenciones de Commits

```
chore: iniciar proyecto
feat: implementar componentes (A5)
feat: implementar renderizado dinámico (A6)
docs: actualizar documentación
```

---

## 👨‍💻 Desarrollo

```bash
# Clonar repositorio
git clone <tu-repo>
cd task-manager-frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

**¡El proyecto está listo para desarrollo y entrega!** 🎉
