# 🧪 Guía de Pruebas - Actividad 8

## 🚀 1. INICIAR EL PROYECTO

```bash
cd /Users/shumafire/Desktop/FILE/Tareas\ UES/FE\ Jalil\ ues/task-manager-frontend
pnpm run dev
```

✅ **URL:** http://localhost:5173

---

## 📁 2. ARCHIVOS NUEVOS CREADOS EN A8

### **A. Modelos (Tipos TypeScript)**

#### `src/models/task-view.types.ts`
```typescript
// Define los tipos para filtros y ordenamiento

export type TaskStatusFilter = 'all' | 'pending' | 'completed';
export type TaskSortBy = 'updated-desc' | 'created-desc' | 'title-asc';

export interface TaskQueryOptions {
  query: string;           // Texto de búsqueda
  filter: TaskStatusFilter; // Filtro por estado
  sortBy: TaskSortBy;      // Criterio de ordenamiento
}
```

**¿Para qué sirve?**
- Define los valores válidos para filtros
- Evita errores de tipado
- TypeScript te alerta si usas un valor inválido

---

### **B. Utilidades (Validación)**

#### `src/utils/task-validation.ts`
```typescript
// Validación reutilizable del título

export function validateTaskTitle(value: string): string | null {
  const title = value.trim();
  
  if (!title) {
    return 'Escribe el título de la tarea.';
  }
  
  if (title.length < 3) {
    return 'El título debe tener al menos 3 caracteres.';
  }
  
  if (title.length > 120) {
    return 'El título no puede superar 120 caracteres.';
  }
  
  return null; // ✅ Sin errores
}
```

**¿Para qué sirve?**
- Validación centralizada
- Mismas reglas en crear Y editar
- Fácil de cambiar (un solo lugar)

**🧪 PRUEBA:**
```typescript
// En consola del navegador:
import { validateTaskTitle } from './src/utils/task-validation';

validateTaskTitle('');          // → "Escribe el título..."
validateTaskTitle('ab');        // → "El título debe tener al menos 3..."
validateTaskTitle('ok tarea');  // → null (válido)
```

---

### **C. Servicios (Lógica de Negocio)**

#### `src/services/task-query.service.ts`
```typescript
// Búsqueda, filtrado y ordenamiento

export function getVisibleTasks(
  tasks: Task[],
  options: TaskQueryOptions
): Task[] {
  // PASO 1: Normalizar búsqueda
  const normalizedQuery = options.query
    .trim()
    .toLocaleLowerCase('es-MX');
  
  // PASO 2: Filtrar por búsqueda Y estado
  const filteredTasks = tasks.filter(task => {
    const matchesQuery = task.title
      .toLocaleLowerCase('es-MX')
      .includes(normalizedQuery);
    
    const matchesFilter = 
      options.filter === 'all' || 
      task.status === options.filter;
    
    return matchesQuery && matchesFilter;
  });
  
  // PASO 3: Ordenar (inmutable)
  return [...filteredTasks].sort((a, b) => 
    compareTasks(a, b, options.sortBy)
  );
}

function compareTasks(a: Task, b: Task, sortBy: TaskSortBy): number {
  switch (sortBy) {
    case 'updated-desc':
      return b.updatedAt.localeCompare(a.updatedAt);
    
    case 'created-desc':
      return b.createdAt.localeCompare(a.createdAt);
    
    case 'title-asc':
      return a.title.localeCompare(b.title, 'es-MX', {
        sensitivity: 'base'
      });
  }
}
```

**¿Para qué sirve?**
- Búsqueda inteligente (sin importar mayúsculas)
- Filtrado por estado
- Ordenamiento configurable
- Código separado de la UI

**🧪 PRUEBA:**
1. Escribe "react" en el buscador
2. Cambia a "REACT" → Mismo resultado
3. Filtra por "Pendientes" → Solo pending
4. Cambia ordenamiento → Lista se reordena

---

#### `src/services/task-storage.service.ts`
```typescript
// Persistencia con localStorage

const STORAGE_KEY = 'task-manager.tasks';

// GUARDAR
export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error guardando tareas:', error);
  }
}

// CARGAR (con validación)
export function loadTasks(fallbackTasks: Task[]): Task[] {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    
    if (!savedTasks) {
      return [...fallbackTasks];
    }
    
    const parsedValue: unknown = JSON.parse(savedTasks);
    
    // Validar estructura antes de usar
    if (!Array.isArray(parsedValue) || !parsedValue.every(isTask)) {
      console.error('Datos inválidos en localStorage');
      return [...fallbackTasks];
    }
    
    return parsedValue;
  } catch (error) {
    console.error('Error cargando tareas:', error);
    return [...fallbackTasks];
  }
}

// TYPE GUARD: Valida que sea una Task válida
function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  const task = value as Partial<Task>;
  
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    isTaskStatus(task.status) &&
    typeof task.createdAt === 'string' &&
    Number.isFinite(Date.parse(task.createdAt)) &&
    typeof task.updatedAt === 'string' &&
    Number.isFinite(Date.parse(task.updatedAt))
  );
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'pending' || value === 'completed';
}
```

**¿Para qué sirve?**
- Guarda tareas automáticamente
- Valida datos antes de usarlos
- No crashea si localStorage está corrupto
- Retorna datos por defecto en caso de error

**🧪 PRUEBA:**
1. Crea una tarea
2. Abre DevTools → Application → Local Storage
3. Verás: `task-manager.tasks` con JSON
4. Recarga la página (F5)
5. ✅ La tarea sigue ahí

**🧪 PRUEBA AVANZADA (Type Guards):**
1. DevTools → Console
2. Corrompe los datos:
   ```javascript
   localStorage.setItem('task-manager.tasks', 'datos-invalidos');
   ```
3. Recarga la página
4. ✅ App NO crashea, usa datos por defecto

---

### **D. Componentes (UI)**

#### `src/components/TaskFilters.tsx` (NUEVO)
```typescript
interface TaskFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  
  filter: TaskStatusFilter;
  onFilterChange: (filter: TaskStatusFilter) => void;
  
  sortBy: TaskSortBy;
  onSortByChange: (sortBy: TaskSortBy) => void;
  
  resultCount: number;
}

export function TaskFilters({ 
  query, onQueryChange, 
  filter, onFilterChange, 
  sortBy, onSortByChange, 
  resultCount 
}: TaskFiltersProps) {
  return (
    <div className="filters">
      {/* Buscador */}
      <input
        type="search"
        placeholder="Buscar tareas..."
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      
      {/* Filtro por estado */}
      <select value={filter} onChange={e => onFilterChange(...)}>
        <option value="all">Todas</option>
        <option value="pending">Pendientes</option>
        <option value="completed">Completadas</option>
      </select>
      
      {/* Ordenamiento */}
      <select value={sortBy} onChange={e => onSortByChange(...)}>
        <option value="updated-desc">Más recientes</option>
        <option value="created-desc">Más nuevas</option>
        <option value="title-asc">A-Z</option>
      </select>
      
      {/* Contador */}
      <p>{resultCount} resultados visibles</p>
    </div>
  );
}
```

**¿Para qué sirve?**
- Controla búsqueda, filtros y ordenamiento
- Muestra contador de resultados
- Componente reutilizable

**🧪 PRUEBA:**
- Lo ves arriba de la lista de tareas
- Tiene 3 controles + contador

---

## 🔄 3. ARCHIVOS MODIFICADOS EN A8

### **A. App.tsx (Centro de Control)**

**CAMBIOS PRINCIPALES:**

#### **1. Estados nuevos para filtros**
```typescript
const [query, setQuery] = useState('');
const [filter, setFilter] = useState<TaskStatusFilter>('all');
const [sortBy, setSortBy] = useState<TaskSortBy>('updated-desc');
```

#### **2. Inicialización diferida + localStorage**
```typescript
const [tasks, setTasks] = useState<Task[]>(() => 
  loadTasks(seedTasks)  // ← Se ejecuta SOLO al montar
);
```

**Antes (A7):**
```typescript
const [tasks, setTasks] = useState<Task[]>(seedTasks);
```

#### **3. useEffect para guardar automáticamente**
```typescript
useEffect(() => {
  saveTasks(tasks);
}, [tasks]);  // ← Cuando tasks cambia, guarda
```

#### **4. Datos derivados (NO estado)**
```typescript
const visibleTasks = getVisibleTasks(tasks, { 
  query, 
  filter, 
  sortBy 
});
```

**❌ NO hacemos:**
```typescript
const [visibleTasks, setVisibleTasks] = useState([]);
```

**✅ Ventaja:**
- Siempre sincronizado
- Se recalcula automáticamente

---

### **B. TaskForm.tsx (Validación ARIA)**

**CAMBIOS:**

#### **1. Validación con mensajes accesibles**
```typescript
const [error, setError] = useState<string | null>(null);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const validationError = validateTaskTitle(title);
  
  if (validationError) {
    setError(validationError);
    return;
  }
  
  onAddTask(title);
  setTitle('');
  setError(null);
};
```

#### **2. ARIA attributes**
```typescript
<input
  aria-invalid={Boolean(error)}
  aria-describedby="task-title-help task-title-error"
  ...
/>

{error && (
  <p id="task-title-error" role="alert" className="field-error">
    {error}
  </p>
)}
```

**🧪 PRUEBA:**
1. Intenta enviar vacío → Mensaje de error
2. Escribe "ab" → "Debe tener al menos 3..."
3. Escribe "ok tarea" → Se envía ✅

---

### **C. TaskItem.tsx (Validación inline)**

**CAMBIOS:**

Similar a TaskForm, pero al editar:

```typescript
const handleSaveEdit = () => {
  const validationError = validateTaskTitle(editedTitle);
  
  if (validationError) {
    setEditError(validationError);
    return;
  }
  
  onEditTitle(task.id, editedTitle);
  setIsEditing(false);
  setEditError(null);
};
```

**🧪 PRUEBA:**
1. Doble clic en una tarea para editarla
2. Borra el texto → Mensaje de error
3. Escribe título válido → Se guarda ✅

---

### **D. TaskList.tsx (Mensaje personalizado)**

**CAMBIO:**

```typescript
{tasks.length === 0 ? (
  <p>
    {filter === 'all' 
      ? 'No hay tareas. ¡Crea tu primera tarea arriba!'
      : `No hay tareas ${filter === 'pending' ? 'pendientes' : 'completadas'}.`
    }
  </p>
) : (
  <ul>...</ul>
)}
```

**🧪 PRUEBA:**
1. Filtra por "Completadas" sin tareas completadas
2. Mensaje: "No hay tareas completadas."

---

## 🎨 4. NUEVAS FUNCIONALIDADES - PRUEBAS PASO A PASO

### **🔍 FUNCIONALIDAD 1: Búsqueda Normalizada**

**¿Qué hace?**
Encuentra tareas sin importar mayúsculas o espacios.

**Cómo probar:**

1. **Preparación:**
   - Crea tareas: "Estudiar React", "PROGRAMAR LOGIN", "  react native  "

2. **Prueba básica:**
   - Escribe en buscador: `react`
   - ✅ Debe encontrar las 3 tareas

3. **Prueba con mayúsculas:**
   - Escribe: `REACT`
   - ✅ Mismo resultado (case-insensitive)

4. **Prueba con espacios:**
   - Escribe: `  react  `
   - ✅ Mismo resultado (trim automático)

5. **Prueba sin resultados:**
   - Escribe: `angular`
   - ✅ "No hay tareas."

**Código responsable:**
```typescript
// src/services/task-query.service.ts
const normalizedQuery = options.query
  .trim()
  .toLocaleLowerCase('es-MX');

const matchesQuery = task.title
  .toLocaleLowerCase('es-MX')
  .includes(normalizedQuery);
```

---

### **📊 FUNCIONALIDAD 2: Filtrado por Estado**

**¿Qué hace?**
Muestra solo tareas según su estado.

**Cómo probar:**

1. **Preparación:**
   - Crea 3 tareas pendientes
   - Marca 2 como completadas

2. **Prueba "Todas":**
   - Filtro: `Todas`
   - ✅ Muestra 5 tareas
   - Contador: "5 resultados visibles"

3. **Prueba "Pendientes":**
   - Filtro: `Pendientes`
   - ✅ Muestra 3 tareas pending
   - Contador: "3 resultados visibles"

4. **Prueba "Completadas":**
   - Filtro: `Completadas`
   - ✅ Muestra 2 tareas completed
   - Contador: "2 resultados visibles"

**Código responsable:**
```typescript
const matchesFilter = 
  options.filter === 'all' || 
  task.status === options.filter;
```

---

### **🔤 FUNCIONALIDAD 3: Ordenamiento**

**¿Qué hace?**
Ordena la lista según criterio seleccionado.

**Cómo probar:**

1. **Preparación:**
   - Crea 3 tareas con títulos diferentes
   - Espera 2 segundos entre cada una

2. **Ordenar por "Más recientes" (updated-desc):**
   - Selecciona: `Más recientes`
   - ✅ La última actualizada arriba

3. **Ordenar por "Más nuevas" (created-desc):**
   - Selecciona: `Más nuevas`
   - ✅ La última creada arriba

4. **Ordenar por "A-Z" (title-asc):**
   - Selecciona: `A-Z`
   - ✅ Orden alfabético

5. **Prueba combinada:**
   - Edita la tarea más vieja
   - Cambia a "Más recientes"
   - ✅ La editada sube arriba (updatedAt cambió)

**Código responsable:**
```typescript
switch (sortBy) {
  case 'updated-desc':
    return b.updatedAt.localeCompare(a.updatedAt);
  case 'created-desc':
    return b.createdAt.localeCompare(a.createdAt);
  case 'title-asc':
    return a.title.localeCompare(b.title, 'es-MX');
}
```

---

### **💾 FUNCIONALIDAD 4: Persistencia localStorage**

**¿Qué hace?**
Guarda tareas automáticamente para que sobrevivan recarga.

**Cómo probar:**

1. **Prueba básica:**
   - Crea 3 tareas
   - Recarga página (F5)
   - ✅ Las 3 tareas siguen ahí

2. **Prueba crear + recargar:**
   - Crea tarea "Nueva"
   - F5
   - ✅ "Nueva" aparece

3. **Prueba editar + recargar:**
   - Edita título de una tarea
   - F5
   - ✅ Título editado se mantiene

4. **Prueba eliminar + recargar:**
   - Elimina una tarea
   - F5
   - ✅ No reaparece

5. **Verificar en DevTools:**
   - F12 → Application → Local Storage
   - Busca: `task-manager.tasks`
   - ✅ Ves JSON con tus tareas

**Código responsable:**
```typescript
// App.tsx
useEffect(() => {
  saveTasks(tasks);
}, [tasks]);
```

---

### **🛡️ FUNCIONALIDAD 5: Type Guards (Datos Corruptos)**

**¿Qué hace?**
Valida datos de localStorage antes de usarlos.

**Cómo probar:**

1. **Simular datos corruptos:**
   - F12 → Console
   ```javascript
   localStorage.setItem('task-manager.tasks', 'datos-invalidos');
   ```
   - Recarga (F5)
   - ✅ App NO crashea
   - ✅ Usa seedTasks por defecto

2. **Simular array con objeto inválido:**
   ```javascript
   localStorage.setItem('task-manager.tasks', 
     '[{"id":"123","title":"Sin status"}]'
   );
   ```
   - F5
   - ✅ App NO crashea (falta 'status')

3. **Verificar consola:**
   - ✅ Console muestra: "Datos inválidos en localStorage"

**Código responsable:**
```typescript
if (!Array.isArray(parsedValue) || !parsedValue.every(isTask)) {
  console.error('Datos inválidos en localStorage');
  return [...fallbackTasks];
}
```

---

### **♿ FUNCIONALIDAD 6: Accesibilidad ARIA**

**¿Qué hace?**
Permite que lectores de pantalla entiendan errores y campos.

**Cómo probar (sin lector):**

1. **Inspeccionar atributos ARIA:**
   - F12 → Inspeccionar input de título
   - ✅ `aria-invalid="false"` (sin error)
   - ✅ `aria-describedby="task-title-help task-title-error"`

2. **Simular error:**
   - Intenta enviar vacío
   - Inspecciona input nuevamente
   - ✅ `aria-invalid="true"`
   - ✅ Aparece `<p role="alert">` con error

**Cómo probar (con lector de pantalla):**

**macOS (VoiceOver):**
1. Cmd + F5 (activar VoiceOver)
2. Tab hasta input de título
3. Intenta enviar vacío
4. ✅ VoiceOver anuncia: "Campo inválido. Escribe el título de la tarea."

---

## 🧪 5. PRUEBA COMPLETA COMBINADA

**Escenario realista:**

```
1. Crea 5 tareas:
   - "Estudiar React"
   - "Programar login"
   - "Hacer ejercicio"
   - "React Native tutorial"
   - "Comprar despensa"

2. Marca como completadas:
   - "Hacer ejercicio"
   - "Comprar despensa"

3. Busca "react":
   ✅ Muestra: Estudiar React, React Native tutorial
   ✅ Contador: "2 resultados visibles"

4. Filtra "Pendientes":
   ✅ Muestra solo: Estudiar React, React Native tutorial
   ✅ Contador: "2 resultados visibles"

5. Cambia a "Completadas":
   ✅ Muestra: [] (ninguna contiene "react")
   ✅ Contador: "0 resultados visibles"

6. Limpia búsqueda:
   ✅ Muestra: Hacer ejercicio, Comprar despensa
   ✅ Contador: "2 resultados visibles"

7. Ordena por "A-Z":
   ✅ Orden: Comprar despensa, Hacer ejercicio

8. Recarga página (F5):
   ✅ TODO se mantiene (estados + filtros reseteados)
```

---

## 📊 6. RESUMEN DE CLASES Y FUNCIONES NUEVAS

### **Clases/Tipos (Models):**
```typescript
// task-view.types.ts
TaskStatusFilter = 'all' | 'pending' | 'completed'
TaskSortBy = 'updated-desc' | 'created-desc' | 'title-asc'
TaskQueryOptions = { query, filter, sortBy }
```

### **Funciones de Validación:**
```typescript
// task-validation.ts
validateTaskTitle(value: string): string | null
```

### **Funciones de Consulta:**
```typescript
// task-query.service.ts
getVisibleTasks(tasks, options): Task[]
compareTasks(a, b, sortBy): number
```

### **Funciones de Persistencia:**
```typescript
// task-storage.service.ts
saveTasks(tasks): void
loadTasks(fallbackTasks): Task[]
isTask(value): value is Task          // Type guard
isTaskStatus(value): value is TaskStatus
```

### **Componentes:**
```typescript
// TaskFilters.tsx
TaskFilters({
  query, onQueryChange,
  filter, onFilterChange,
  sortBy, onSortByChange,
  resultCount
})
```

### **Hooks de React:**
```typescript
// App.tsx
useState(() => loadTasks(seedTasks))  // Inicialización diferida
useEffect(() => saveTasks(tasks), [tasks])  // Sincronización
```

---

## 🎯 7. CHECKLIST DE VERIFICACIÓN

Marca cuando hayas probado cada funcionalidad:

- [ ] ✅ Servidor corriendo en http://localhost:5173
- [ ] ✅ Búsqueda case-insensitive funciona
- [ ] ✅ Filtro por estado (All/Pending/Completed)
- [ ] ✅ Ordenamiento por 3 criterios
- [ ] ✅ Contador de resultados actualizado
- [ ] ✅ Validación con mensajes en español
- [ ] ✅ ARIA attributes en inputs
- [ ] ✅ localStorage guarda tareas
- [ ] ✅ F5 mantiene las tareas
- [ ] ✅ Type guards previenen crash con datos corruptos
- [ ] ✅ Datos derivados (visibleTasks no es estado)
- [ ] ✅ useEffect sincroniza con localStorage

---

## 🎓 8. PARA EXPLICAR AL PROFESOR

**Pregunta esperada:** *"¿Qué tiene de nuevo la Actividad 8?"*

**Respuesta:**

```
"Profesor, en A8 agregamos 5 funcionalidades profesionales:

1. BÚSQUEDA NORMALIZADA
   - Encuentra tareas sin importar mayúsculas
   - Código: toLocaleLowerCase() + includes()

2. FILTROS Y ORDENAMIENTO
   - Filtrar por estado (all/pending/completed)
   - Ordenar por updated/created/title
   - Componente TaskFilters reutilizable

3. PERSISTENCIA CON LOCALSTORAGE
   - Guarda automáticamente con useEffect
   - Type guards validan datos antes de usar
   - No crashea si localStorage está corrupto

4. VALIDACIÓN ACCESIBLE
   - Función validateTaskTitle() reutilizable
   - ARIA attributes para lectores de pantalla
   - Mensajes en español personalizados

5. DATOS DERIVADOS
   - visibleTasks se calcula, NO se guarda como estado
   - Siempre sincronizado automáticamente
   - Patrón profesional de React

Todo está documentado en:
- preguntas-cierre-ec2-f3-a8.md (15 preguntas)
- GUIA-PRUEBAS-A8.md (esta guía)
```

---

**¡Con esta guía puedes probar TODO y explicar cada funcionalidad nueva!** 🚀
