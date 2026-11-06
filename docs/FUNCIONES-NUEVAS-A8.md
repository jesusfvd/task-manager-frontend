# 🔧 Funciones Nuevas - Actividad 8

## 📋 ÍNDICE DE FUNCIONES

### **Validación**
1. `validateTaskTitle()` - Valida título de tarea

### **Consulta y Filtrado**
2. `getVisibleTasks()` - Búsqueda + filtro + ordenamiento
3. `compareTasks()` - Comparación para ordenamiento

### **Persistencia**
4. `saveTasks()` - Guarda en localStorage
5. `loadTasks()` - Carga con validación
6. `isTask()` - Type guard (valida estructura)
7. `isTaskStatus()` - Type guard (valida status)

---

## 🔍 1. validateTaskTitle()

**Archivo:** `src/utils/task-validation.ts`

### **Signatura:**
```typescript
function validateTaskTitle(value: string): string | null
```

### **¿Qué hace?**
Valida el título de una tarea y retorna mensaje de error o `null` si es válido.

### **Parámetros:**
- `value` (string): Título a validar

### **Retorno:**
- `string`: Mensaje de error en español
- `null`: Todo está bien ✅

### **Lógica:**
```typescript
export function validateTaskTitle(value: string): string | null {
  // 1. Limpiar espacios
  const title = value.trim();
  
  // 2. Verificar vacío
  if (!title) {
    return 'Escribe el título de la tarea.';
  }
  
  // 3. Verificar mínimo
  if (title.length < 3) {
    return 'El título debe tener al menos 3 caracteres.';
  }
  
  // 4. Verificar máximo
  if (title.length > 120) {
    return 'El título no puede superar 120 caracteres.';
  }
  
  // 5. Todo bien
  return null;
}
```

### **Casos de uso:**

```typescript
// ❌ Vacío
validateTaskTitle('')         // → "Escribe el título de la tarea."
validateTaskTitle('   ')      // → "Escribe el título de la tarea."

// ❌ Muy corto
validateTaskTitle('ab')       // → "El título debe tener al menos 3 caracteres."

// ❌ Muy largo
validateTaskTitle('a'.repeat(121)) 
// → "El título no puede superar 120 caracteres."

// ✅ Válido
validateTaskTitle('Estudiar React')  // → null
validateTaskTitle('   ok   ')        // → null (trim lo limpia)
```

### **Dónde se usa:**
- `TaskForm.tsx` → Al crear tarea
- `TaskItem.tsx` → Al editar tarea

### **Ventajas:**
- ✅ Un solo lugar para reglas
- ✅ Mismo comportamiento en crear y editar
- ✅ Fácil de probar
- ✅ Mensajes personalizados en español

---

## 🔍 2. getVisibleTasks()

**Archivo:** `src/services/task-query.service.ts`

### **Signatura:**
```typescript
function getVisibleTasks(
  tasks: Task[],
  options: TaskQueryOptions
): Task[]
```

### **¿Qué hace?**
Aplica búsqueda, filtrado y ordenamiento a una lista de tareas.

### **Parámetros:**
- `tasks` (Task[]): Lista completa de tareas
- `options` (TaskQueryOptions):
  - `query` (string): Texto de búsqueda
  - `filter` (TaskStatusFilter): 'all' | 'pending' | 'completed'
  - `sortBy` (TaskSortBy): 'updated-desc' | 'created-desc' | 'title-asc'

### **Retorno:**
- `Task[]`: Lista filtrada y ordenada

### **Flujo:**

```
┌─────────────────────────────────────────┐
│ 1. ENTRADA: tasks + options            │
├─────────────────────────────────────────┤
│ tasks = [A, B, C, D, E]                 │
│ options = {                             │
│   query: "react",                       │
│   filter: "pending",                    │
│   sortBy: "title-asc"                   │
│ }                                       │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 2. NORMALIZAR BÚSQUEDA                  │
├─────────────────────────────────────────┤
│ "react" → trim() → toLocaleLowerCase()  │
│ Resultado: "react"                      │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 3. FILTRAR POR BÚSQUEDA                 │
├─────────────────────────────────────────┤
│ A: "Estudiar React"    → ✅ contiene    │
│ B: "Hacer ejercicio"   → ❌ no contiene │
│ C: "React Native"      → ✅ contiene    │
│ D: "Programar login"   → ❌ no contiene │
│ E: "React hooks"       → ✅ contiene    │
│                                         │
│ Resultado: [A, C, E]                    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 4. FILTRAR POR ESTADO                   │
├─────────────────────────────────────────┤
│ A: pending    → ✅ coincide             │
│ C: completed  → ❌ no coincide          │
│ E: pending    → ✅ coincide             │
│                                         │
│ Resultado: [A, E]                       │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 5. ORDENAR (inmutable)                  │
├─────────────────────────────────────────┤
│ [...filteredTasks].sort()               │
│ title-asc:                              │
│ A: "Estudiar React"                     │
│ E: "React hooks"                        │
│                                         │
│ Resultado: [A, E] (ya ordenado)         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 6. RETORNO                              │
├─────────────────────────────────────────┤
│ [A, E]                                  │
└─────────────────────────────────────────┘
```

### **Código completo:**

```typescript
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
    // Búsqueda case-insensitive
    const matchesQuery = task.title
      .toLocaleLowerCase('es-MX')
      .includes(normalizedQuery);

    // Filtro por estado
    const matchesFilter = 
      options.filter === 'all' || 
      task.status === options.filter;

    // Ambas condiciones deben cumplirse
    return matchesQuery && matchesFilter;
  });

  // PASO 3: Ordenar (inmutable con spread)
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    compareTasks(a, b, options.sortBy)
  );

  return sortedTasks;
}
```

### **Casos de uso:**

```typescript
const tasks = [
  { id: '1', title: 'Estudiar React', status: 'pending', ... },
  { id: '2', title: 'PROGRAMAR', status: 'completed', ... },
  { id: '3', title: 'react hooks', status: 'pending', ... },
];

// Caso 1: Búsqueda sin filtros
getVisibleTasks(tasks, {
  query: 'react',
  filter: 'all',
  sortBy: 'title-asc'
});
// → [tarea 1, tarea 3] (encuentra 2, ignora mayúsculas)

// Caso 2: Solo filtro de estado
getVisibleTasks(tasks, {
  query: '',
  filter: 'pending',
  sortBy: 'created-desc'
});
// → [tarea 1, tarea 3] (solo pending)

// Caso 3: Búsqueda + filtro
getVisibleTasks(tasks, {
  query: 'react',
  filter: 'pending',
  sortBy: 'title-asc'
});
// → [tarea 1, tarea 3] (contienen "react" Y son pending)
```

### **Dónde se usa:**
- `App.tsx` → Cada render para calcular `visibleTasks`

### **Por qué es inmutable:**
```typescript
// ❌ MALO: Muta el array original
const sorted = filteredTasks.sort(...);

// ✅ BUENO: Crea copia antes de ordenar
const sorted = [...filteredTasks].sort(...);
```

---

## 🔍 3. compareTasks()

**Archivo:** `src/services/task-query.service.ts`

### **Signatura:**
```typescript
function compareTasks(a: Task, b: Task, sortBy: TaskSortBy): number
```

### **¿Qué hace?**
Compara dos tareas según el criterio de ordenamiento.

### **Parámetros:**
- `a`, `b` (Task): Tareas a comparar
- `sortBy` (TaskSortBy): Criterio

### **Retorno:**
- Número negativo: `a` va antes de `b`
- Número positivo: `b` va antes de `a`
- 0: Mismo orden

### **Lógica:**

```typescript
function compareTasks(a: Task, b: Task, sortBy: TaskSortBy): number {
  switch (sortBy) {
    case 'updated-desc':
      // Más reciente primero (DESC)
      return b.updatedAt.localeCompare(a.updatedAt);
    
    case 'created-desc':
      // Más nueva primero (DESC)
      return b.createdAt.localeCompare(a.createdAt);
    
    case 'title-asc':
      // Alfabético A-Z (ASC)
      return a.title.localeCompare(b.title, 'es-MX', {
        sensitivity: 'base'  // Ignora acentos/mayúsculas
      });
  }
}
```

### **Ejemplos:**

```typescript
const taskA = { 
  title: 'Zebra', 
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-03T14:00:00Z'
};

const taskB = { 
  title: 'Apple', 
  createdAt: '2024-01-02T11:00:00Z',
  updatedAt: '2024-01-02T11:00:00Z'
};

// updated-desc (más reciente primero)
compareTasks(taskA, taskB, 'updated-desc')
// → positivo (taskA.updatedAt > taskB.updatedAt)
// → taskA va primero

// created-desc (más nueva primero)
compareTasks(taskA, taskB, 'created-desc')
// → negativo (taskB.createdAt > taskA.createdAt)
// → taskB va primero

// title-asc (alfabético)
compareTasks(taskA, taskB, 'title-asc')
// → positivo ("Zebra" > "Apple")
// → taskB va primero
```

---

## 💾 4. saveTasks()

**Archivo:** `src/services/task-storage.service.ts`

### **Signatura:**
```typescript
function saveTasks(tasks: Task[]): void
```

### **¿Qué hace?**
Guarda la lista de tareas en localStorage.

### **Parámetros:**
- `tasks` (Task[]): Lista a guardar

### **Retorno:**
- `void` (no retorna nada)

### **Código:**

```typescript
const STORAGE_KEY = 'task-manager.tasks';

export function saveTasks(tasks: Task[]): void {
  try {
    const json = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Error al guardar tareas en localStorage:', error);
  }
}
```

### **Flujo:**

```
┌──────────────────────────────┐
│ ENTRADA: tasks = [A, B, C]   │
└──────────────────────────────┘
           ↓
┌──────────────────────────────┐
│ JSON.stringify()             │
├──────────────────────────────┤
│ Convierte a string JSON      │
└──────────────────────────────┘
           ↓
┌──────────────────────────────┐
│ localStorage.setItem()       │
├──────────────────────────────┤
│ Guarda con key:              │
│ 'task-manager.tasks'         │
└──────────────────────────────┘
           ↓
     ✅ Guardado
```

### **Manejo de errores:**

```typescript
// Si falla (ej: localStorage lleno):
try {
  localStorage.setItem(...);
} catch (error) {
  console.error(...); // Log pero no crashea
}
```

### **Dónde se usa:**
- `App.tsx` → useEffect cada vez que `tasks` cambia

```typescript
useEffect(() => {
  saveTasks(tasks);
}, [tasks]);
```

---

## 💾 5. loadTasks()

**Archivo:** `src/services/task-storage.service.ts`

### **Signatura:**
```typescript
function loadTasks(fallbackTasks: Task[]): Task[]
```

### **¿Qué hace?**
Carga tareas desde localStorage con validación defensiva.

### **Parámetros:**
- `fallbackTasks` (Task[]): Datos por defecto si falla

### **Retorno:**
- `Task[]`: Tareas válidas o fallback

### **Flujo completo:**

```
┌────────────────────────────────────────┐
│ 1. Leer de localStorage                │
├────────────────────────────────────────┤
│ const saved = localStorage.getItem(...)│
└────────────────────────────────────────┘
           ↓
      ¿Existe?
    /          \
  NO            SÍ
   ↓             ↓
Return      ┌─────────────────────┐
fallback    │ 2. Parsear JSON     │
            ├─────────────────────┤
            │ JSON.parse(saved)   │
            └─────────────────────┘
                     ↓
              ¿Parseó bien?
              /          \
            NO            SÍ
             ↓             ↓
          Return      ┌──────────────────┐
          fallback    │ 3. Validar tipo  │
                      ├──────────────────┤
                      │ isTask() cada uno│
                      └──────────────────┘
                           ↓
                    ¿Todos válidos?
                    /            \
                  NO              SÍ
                   ↓               ↓
                Return          Return
                fallback        parsed ✅
```

### **Código completo:**

```typescript
export function loadTasks(fallbackTasks: Task[]): Task[] {
  try {
    // PASO 1: Leer
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    
    if (!savedTasks) {
      return [...fallbackTasks];  // No hay nada guardado
    }
    
    // PASO 2: Parsear
    const parsedValue: unknown = JSON.parse(savedTasks);
    
    // PASO 3: Validar estructura
    if (!Array.isArray(parsedValue)) {
      console.error('localStorage no contiene un array');
      return [...fallbackTasks];
    }
    
    if (!parsedValue.every(isTask)) {
      console.error('localStorage contiene datos inválidos');
      return [...fallbackTasks];
    }
    
    // PASO 4: Todo bien
    return parsedValue;
    
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    return [...fallbackTasks];
  }
}
```

### **Casos de prueba:**

```typescript
// Caso 1: localStorage vacío
localStorage.clear();
loadTasks(seedTasks);
// → seedTasks

// Caso 2: JSON válido
localStorage.setItem('task-manager.tasks', 
  '[{"id":"1","title":"Ok","status":"pending",...}]'
);
loadTasks(seedTasks);
// → [tarea parseada]

// Caso 3: JSON inválido
localStorage.setItem('task-manager.tasks', 'not-json{');
loadTasks(seedTasks);
// → seedTasks (catch error)

// Caso 4: Array pero con estructura incorrecta
localStorage.setItem('task-manager.tasks', 
  '[{"id":"1","title":"Sin status"}]'
);
loadTasks(seedTasks);
// → seedTasks (isTask retorna false)
```

### **Dónde se usa:**
- `App.tsx` → useState con inicialización diferida

```typescript
const [tasks, setTasks] = useState<Task[]>(() => 
  loadTasks(seedTasks)
);
```

---

## 🛡️ 6. isTask()

**Archivo:** `src/services/task-storage.service.ts`

### **Signatura:**
```typescript
function isTask(value: unknown): value is Task
```

### **¿Qué hace?**
Type guard que verifica si un valor desconocido es una Task válida.

### **Parámetros:**
- `value` (unknown): Valor a verificar

### **Retorno:**
- `true`: Es una Task válida (TypeScript lo sabe)
- `false`: No cumple la estructura

### **Código:**

```typescript
function isTask(value: unknown): value is Task {
  // PASO 1: Verificar que sea objeto
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  // PASO 2: Type assertion segura
  const task = value as Partial<Task>;
  
  // PASO 3: Verificar cada propiedad
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
```

### **Verificaciones:**

```typescript
// ✅ Válido
isTask({
  id: '123',
  title: 'Tarea',
  status: 'pending',
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z'
});
// → true

// ❌ Falta 'status'
isTask({
  id: '123',
  title: 'Tarea',
  createdAt: '...',
  updatedAt: '...'
});
// → false

// ❌ createdAt no es fecha válida
isTask({
  id: '123',
  title: 'Tarea',
  status: 'pending',
  createdAt: 'not-a-date',
  updatedAt: '...'
});
// → false (Date.parse('not-a-date') = NaN)
```

### **Por qué `value is Task`:**

```typescript
// Sin type guard:
function validate(value: unknown): boolean {
  return typeof value === 'object' && ...;
}

const data: unknown = JSON.parse('...');
if (validate(data)) {
  // ❌ TypeScript NO sabe que data es Task
  console.log(data.title); // Error!
}

// Con type guard:
function isTask(value: unknown): value is Task {
  return typeof value === 'object' && ...;
}

const data: unknown = JSON.parse('...');
if (isTask(data)) {
  // ✅ TypeScript SABE que data es Task
  console.log(data.title); // OK!
}
```

---

## 🛡️ 7. isTaskStatus()

**Archivo:** `src/services/task-storage.service.ts`

### **Signatura:**
```typescript
function isTaskStatus(value: unknown): value is TaskStatus
```

### **¿Qué hace?**
Type guard que verifica si un valor es 'pending' o 'completed'.

### **Código:**

```typescript
function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'pending' || value === 'completed';
}
```

### **Casos:**

```typescript
isTaskStatus('pending')    // → true
isTaskStatus('completed')  // → true
isTaskStatus('invalid')    // → false
isTaskStatus(123)          // → false
isTaskStatus(null)         // → false
```

---

## 📊 RESUMEN DE FUNCIONES

| Función | Propósito | Retorno | Dónde se usa |
|---------|-----------|---------|--------------|
| `validateTaskTitle()` | Valida título | `string \| null` | TaskForm, TaskItem |
| `getVisibleTasks()` | Búsqueda + filtro + orden | `Task[]` | App.tsx (render) |
| `compareTasks()` | Compara para ordenar | `number` | getVisibleTasks() |
| `saveTasks()` | Guarda en localStorage | `void` | App.tsx (useEffect) |
| `loadTasks()` | Carga con validación | `Task[]` | App.tsx (useState) |
| `isTask()` | Valida estructura Task | `boolean` | loadTasks() |
| `isTaskStatus()` | Valida status | `boolean` | isTask() |

---

## 🎯 FLUJO COMPLETO DE DATOS

```
┌─────────────────────────────────────────────────────┐
│ MONTAJE (una sola vez)                              │
├─────────────────────────────────────────────────────┤
│ useState(() => loadTasks(seedTasks))                │
│          ↓                                           │
│   localStorage → JSON.parse() → isTask() → tasks    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ RENDER (cada vez)                                   │
├─────────────────────────────────────────────────────┤
│ visibleTasks = getVisibleTasks(tasks, {             │
│   query, filter, sortBy                             │
│ })                                                  │
│          ↓                                           │
│   Normalizar → Filtrar → Ordenar → visibleTasks     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│ CRUD (crear/editar/eliminar)                        │
├─────────────────────────────────────────────────────┤
│ 1. validateTaskTitle() → ¿Válido?                   │
│ 2. setTasks([...newTasks])                          │
│ 3. React re-renderiza                               │
│ 4. useEffect detecta cambio en [tasks]              │
│ 5. saveTasks(tasks) → localStorage                  │
└─────────────────────────────────────────────────────┘
```

---

**¡Con estas funciones tienes toda la lógica de la Actividad 8!** 🚀
