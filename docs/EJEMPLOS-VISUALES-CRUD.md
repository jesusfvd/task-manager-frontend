# 📖 Ejemplos Visuales de Operaciones CRUD

Esta guía muestra paso a paso cómo funcionan las operaciones CRUD con ejemplos visuales del código.

---

## 🆕 CREATE - Agregar Nueva Tarea

### Estado Inicial
```javascript
tasks = [
  { id: '1', title: 'Tarea 1', status: 'pending' },
  { id: '2', title: 'Tarea 2', status: 'completed' },
]
```

### Usuario Agrega "Tarea 3"

#### Código que se ejecuta:
```tsx
function handleAddTask(title: string) {
  const now = new Date().toISOString();
  
  // 1. Crear nueva tarea
  const newTask: Task = {
    id: crypto.randomUUID(),        // "3"
    title: "Tarea 3",
    status: 'pending',
    createdAt: now,                 // "2024-01-15T10:30:00.000Z"
    updatedAt: now,
  };

  // 2. Agregar al inicio con spread
  setTasks((currentTasks) => [
    newTask,           // ← Nueva tarea
    ...currentTasks,   // ← Todas las anteriores
  ]);
}
```

### Estado Final
```javascript
tasks = [
  { id: '3', title: 'Tarea 3', status: 'pending' },      // ← NUEVA
  { id: '1', title: 'Tarea 1', status: 'pending' },
  { id: '2', title: 'Tarea 2', status: 'completed' },
]
```

### 🎯 Puntos Clave
- ✅ Se crea un **nuevo array** (no se modifica el original)
- ✅ La nueva tarea aparece **al inicio**
- ✅ Genera **ID único** con `crypto.randomUUID()`
- ✅ Establece fechas de creación y actualización

---

## 📖 READ - Mostrar Lista de Tareas

### Datos en el Estado
```javascript
tasks = [
  { id: '1', title: 'Estudiar React', status: 'pending' },
  { id: '2', title: 'Hacer ejercicio', status: 'completed' },
  { id: '3', title: 'Leer documentación', status: 'pending' },
]
```

### Código que Renderiza:
```tsx
<div className="task-list">
  {tasks.map((task) => (
    <TaskItem
      key={task.id}           // ← ID único como key
      task={task}             // ← Pasa toda la tarea
      onToggleStatus={handleToggleStatus}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
    />
  ))}
</div>
```

### Resultado HTML Generado:
```html
<div class="task-list">
  <TaskItem key="1" /> <!-- Estudiar React -->
  <TaskItem key="2" /> <!-- Hacer ejercicio -->
  <TaskItem key="3" /> <!-- Leer documentación -->
</div>
```

### 🎯 Puntos Clave
- ✅ `map()` recorre el array y crea un componente por cada tarea
- ✅ `key={task.id}` es **obligatorio** para que React trackee cada elemento
- ✅ Pasa todas las funciones CRUD como props

---

## ✏️ UPDATE - Cambiar Estado (Completar/Reabrir)

### Estado Inicial
```javascript
tasks = [
  { id: '1', title: 'Tarea 1', status: 'pending' },
  { id: '2', title: 'Tarea 2', status: 'pending' },
  { id: '3', title: 'Tarea 3', status: 'completed' },
]
```

### Usuario Presiona "Completar" en Tarea 1

#### Código que se ejecuta:
```tsx
function handleToggleStatus(id: string) {  // id = '1'
  const now = new Date().toISOString();

  setTasks((currentTasks) =>
    currentTasks.map((task) => {
      
      // ¿Es la tarea que buscamos?
      if (task.id !== id) {
        return task;  // ← No es, devuélvela sin cambios
      }

      // Sí es, crea una NUEVA con cambios
      return {
        ...task,                              // Copia todo
        status: task.status === 'pending' 
          ? 'completed' 
          : 'pending',                        // Cambia status
        updatedAt: now,                       // Actualiza fecha
      };
    })
  );
}
```

#### Proceso detallado:

**Iteración 1** (Tarea 1):
```javascript
task = { id: '1', title: 'Tarea 1', status: 'pending' }
task.id === '1' ✓  // Es la que buscamos

// Crea nueva tarea:
return {
  id: '1',
  title: 'Tarea 1',
  status: 'completed',        // ← CAMBIÓ
  createdAt: '...',
  updatedAt: '2024-01-15...'  // ← CAMBIÓ
}
```

**Iteración 2** (Tarea 2):
```javascript
task = { id: '2', title: 'Tarea 2', status: 'pending' }
task.id !== '1' ✓  // No es la que buscamos

return task  // Sin cambios
```

**Iteración 3** (Tarea 3):
```javascript
task = { id: '3', title: 'Tarea 3', status: 'completed' }
task.id !== '1' ✓  // No es la que buscamos

return task  // Sin cambios
```

### Estado Final
```javascript
tasks = [
  { id: '1', title: 'Tarea 1', status: 'completed' },   // ← CAMBIÓ
  { id: '2', title: 'Tarea 2', status: 'pending' },     // Sin cambios
  { id: '3', title: 'Tarea 3', status: 'completed' },   // Sin cambios
]
```

### 🎯 Puntos Clave
- ✅ `map()` crea un **nuevo array**
- ✅ Solo la tarea con `id` coincidente se modifica
- ✅ Las demás tareas se devuelven **sin cambios**
- ✅ `spread operator` copia todas las propiedades

---

## ✏️ UPDATE - Editar Título

### Estado Inicial
```javascript
tasks = [
  { id: '1', title: 'Tarea original', status: 'pending' },
]
```

### Usuario Edita y Guarda "Tarea modificada"

#### Código:
```tsx
function handleEditTask(id: string, title: string) {
  const now = new Date().toISOString();

  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === id
        ? { 
            ...task,           // Conserva todo
            title,             // Cambia título
            updatedAt: now,    // Actualiza fecha
          }
        : task                 // No es, devuelve sin cambios
    )
  );
}
```

### Estado Final
```javascript
tasks = [
  { 
    id: '1',                              // ← MISMO ID
    title: 'Tarea modificada',            // ← NUEVO TÍTULO
    status: 'pending',                    // ← MISMO STATUS
    createdAt: '2024-01-10T10:00:00Z',   // ← MISMA FECHA CREACIÓN
    updatedAt: '2024-01-15T14:30:00Z',   // ← NUEVA FECHA ACTUALIZACIÓN
  },
]
```

### 🎯 Puntos Clave
- ✅ Preserva `id` y `createdAt`
- ✅ Solo cambia `title` y `updatedAt`
- ✅ Operador ternario para brevedad

---

## 🗑️ DELETE - Eliminar Tarea

### Estado Inicial
```javascript
tasks = [
  { id: '1', title: 'Tarea 1', status: 'pending' },
  { id: '2', title: 'Tarea 2', status: 'completed' },
  { id: '3', title: 'Tarea 3', status: 'pending' },
]
```

### Usuario Elimina Tarea 2

#### Código:
```tsx
function handleDeleteTask(id: string) {  // id = '2'
  // 1. Buscar para mostrar en confirmación
  const selectedTask = tasks.find(task => task.id === id);
  
  if (!selectedTask) return;

  // 2. Pedir confirmación
  const shouldDelete = window.confirm(
    `¿Eliminar la tarea "Tarea 2"?`
  );
  
  if (!shouldDelete) return;  // Usuario canceló

  // 3. Filtrar: conservar todas EXCEPTO la id='2'
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== id)
  );
}
```

#### Proceso de filter():

**Evalúa Tarea 1:**
```javascript
task.id = '1'
task.id !== '2' → true  ✓ SE CONSERVA
```

**Evalúa Tarea 2:**
```javascript
task.id = '2'
task.id !== '2' → false  ✗ SE ELIMINA
```

**Evalúa Tarea 3:**
```javascript
task.id = '3'
task.id !== '2' → true  ✓ SE CONSERVA
```

### Estado Final
```javascript
tasks = [
  { id: '1', title: 'Tarea 1', status: 'pending' },
  // Tarea 2 ELIMINADA
  { id: '3', title: 'Tarea 3', status: 'pending' },
]
```

### 🎯 Puntos Clave
- ✅ `filter()` crea un **nuevo array**
- ✅ Conserva elementos donde la condición es `true`
- ✅ Elimina elementos donde la condición es `false`
- ✅ `window.confirm()` previene eliminaciones accidentales

---

## 🔄 Comparación de Métodos

| Método | Devuelve | Modifica Original | Uso en CRUD |
|--------|----------|-------------------|-------------|
| **spread `[...arr]`** | Nuevo array | ❌ No | **CREATE** - Agregar elementos |
| **map()** | Nuevo array | ❌ No | **UPDATE** - Modificar elementos |
| **filter()** | Nuevo array | ❌ No | **DELETE** - Remover elementos |
| **push()** | Número | ✅ Sí | ❌ **NUNCA** en React |
| **splice()** | Array | ✅ Sí | ❌ **NUNCA** en React |
| **sort()** | Array | ✅ Sí | ❌ **NUNCA** en React |

---

## 🎨 Flujo Visual Completo

```
USUARIO INTERACTÚA
        ↓
┌───────────────────────┐
│   Componente Hijo     │
│   (TaskForm/TaskItem) │
│                       │
│   Ejecuta función     │
│   recibida por props  │
└───────────┬───────────┘
            │
            │ onAddTask('Tarea nueva')
            │ onToggleStatus('1')
            │ onEditTask('1', 'Nuevo título')
            │ onDeleteTask('1')
            ↓
┌───────────────────────┐
│      App.tsx          │
│                       │
│  handleAddTask()      │
│  handleToggleStatus() │
│  handleEditTask()     │
│  handleDeleteTask()   │
│                       │
│  setTasks(newArray)   │
└───────────┬───────────┘
            │
            │ React detecta cambio
            ↓
┌───────────────────────┐
│   React re-renderiza  │
│   todos los           │
│   componentes que     │
│   dependen de tasks   │
└───────────┬───────────┘
            │
    ┌───────┴────────┐
    │                │
    ↓                ↓
TaskSummary      TaskList
(nuevo resumen)  (nueva lista)
                     ↓
                 TaskItem
                (actualizado)
```

---

## 💡 Principios de Inmutabilidad

### ❌ INCORRECTO (Mutable)

```tsx
// Modifica el array original
function handleAddTask(title: string) {
  const newTask = { id: '4', title, status: 'pending' };
  tasks.push(newTask);        // ← Modifica directamente
  setTasks(tasks);            // ← React NO detecta cambio
}

// El objeto es el mismo en memoria
tasks === tasks  // true (misma referencia)
```

### ✅ CORRECTO (Immutable)

```tsx
// Crea un nuevo array
function handleAddTask(title: string) {
  const newTask = { id: '4', title, status: 'pending' };
  setTasks([newTask, ...tasks]);  // ← Nuevo array
}

// Diferentes objetos en memoria
oldTasks === newTasks  // false (diferente referencia)
```

### ¿Por qué React necesita inmutabilidad?

React compara por **referencia** para detectar cambios:

```javascript
// Si la referencia es la misma, React ignora el cambio
if (oldState === newState) {
  // No re-renderizar
}

// Si la referencia es diferente, React re-renderiza
if (oldState !== newState) {
  // Re-renderizar ✓
}
```

---

## 🎯 Resumen de Operaciones

### CREATE
```tsx
setTasks([newTask, ...currentTasks]);
```
**Resultado:** Array con nuevo elemento al inicio

### READ
```tsx
tasks.map(task => <TaskItem key={task.id} task={task} />)
```
**Resultado:** Componente React por cada tarea

### UPDATE
```tsx
tasks.map(task => 
  task.id === id ? { ...task, cambios } : task
)
```
**Resultado:** Array con un elemento modificado

### DELETE
```tsx
tasks.filter(task => task.id !== id)
```
**Resultado:** Array sin el elemento eliminado

---

## 📚 Para Estudiar

1. **Practica con arrays pequeños** en la consola del navegador
2. **Dibuja el flujo** en papel para cada operación
3. **Explica en voz alta** cada línea de código
4. **Compara** operaciones mutables vs inmutables
5. **Ejecuta paso a paso** con debugger

---

## 🎤 Frases Clave para la Explicación Oral

> "Uso spread para agregar porque crea un nuevo array sin modificar el original"

> "Map recorre cada elemento y solo modifica el que coincide con el ID"

> "Filter conserva todos los elementos excepto el que quiero eliminar"

> "React compara por referencia, por eso necesito crear un nuevo array"

> "La inmutabilidad garantiza que React detecte los cambios correctamente"

> "App es la fuente de verdad, los componentes hijos solo ejecutan callbacks"

---

**✨ Con estos ejemplos visuales puedes explicar cada operación CRUD con confianza!**
