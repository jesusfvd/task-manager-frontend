# Resumen Ejecutivo - Actividad 7
## Estado local, eventos y operaciones CRUD

---

## 🎯 ¿Qué hicimos en esta actividad?

Convertimos la aplicación **estática** de la Actividad 6 en una aplicación **interactiva** que permite:

✅ Registrar nuevas tareas  
✅ Completar y reabrir tareas  
✅ Editar el título de tareas  
✅ Eliminar tareas con confirmación  
✅ Ver el resumen actualizado en tiempo real  

---

## 🔑 Conceptos fundamentales

### 1. Estado de React (useState)

**¿Qué es?**
Una forma de "recordar" información entre renderizados.

**Sintaxis:**
```tsx
const [tasks, setTasks] = useState<Task[]>([]);
```

**¿Por qué usar estado?**
- Las variables normales se reinician en cada render
- El estado se mantiene y actualiza la UI automáticamente

---

### 2. Formulario controlado

**Antes (no controlado):**
```tsx
<input type="text" /> // El input controla su propio valor
```

**Ahora (controlado):**
```tsx
const [title, setTitle] = useState('');

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

**Ventajas:**
- React conoce el valor en todo momento
- Fácil validar, limpiar o transformar
- Una sola fuente de verdad

---

### 3. Flujo de eventos (Props drilling)

```
┌────────────────────┐
│       App          │ ← Define las funciones CRUD
│  handleAddTask()   │
└──────────┬─────────┘
           │ props
           ↓
┌──────────────────┐
│   TaskForm       │ ← Recibe onAddTask
│  onAddTask()     │ ← La ejecuta cuando el usuario envía
└──────────────────┘
```

**Clave:** Los hijos NO modifican el estado directamente, notifican al padre.

---

### 4. Inmutabilidad (Lo más importante)

**❌ NUNCA hacer esto:**
```tsx
tasks.push(newTask);      // Modifica el array original
setTasks(tasks);          // React NO detecta el cambio
```

**✅ SIEMPRE hacer esto:**
```tsx
setTasks([newTask, ...tasks]); // Crea un NUEVO array
```

**¿Por qué?**
React compara por **referencia** (dirección de memoria), no por contenido.

---

## 🛠️ Operaciones CRUD explicadas

### CREATE - Agregar tarea

```tsx
function handleAddTask(title: string) {
  const newTask: Task = {
    id: crypto.randomUUID(),        // ID único
    title,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  setTasks((currentTasks) => [
    newTask,           // ← Nuevo al inicio
    ...currentTasks,   // ← Resto del array
  ]);
}
```

**Operador usado:** `spread (...)`

---

### READ - Mostrar tareas

```tsx
<div className="task-list">
  {tasks.map((task) => (
    <TaskItem
      key={task.id}        // ← Clave única (obligatorio)
      task={task}
      onToggleStatus={handleToggleStatus}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
    />
  ))}
</div>
```

**Método usado:** `map()`  
**Clave importante:** Siempre agregar `key` única

---

### UPDATE - Actualizar tarea

```tsx
function handleToggleStatus(id: string) {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === id
        ? { ...task, status: toggleStatus(task.status), updatedAt: now }
        : task
    )
  );
}
```

**Método usado:** `map()` + `spread`

**¿Cómo funciona?**
1. Recorre cada tarea
2. Si el ID coincide → crea una NUEVA tarea con cambios
3. Si no coincide → devuelve la misma tarea
4. Resultado: nuevo array con solo UNA tarea modificada

---

### DELETE - Eliminar tarea

```tsx
function handleDeleteTask(id: string) {
  const shouldDelete = window.confirm(
    `¿Eliminar la tarea "${task.title}"?`
  );
  
  if (!shouldDelete) return;

  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== id)
  );
}
```

**Método usado:** `filter()`

**¿Cómo funciona?**
- Conserva todas las tareas cuyo `id` sea DIFERENTE
- Elimina la que coincide con el `id`

---

## 📊 Tabla resumen CRUD

| Operación | Método JS | Operador | Ejemplo |
|-----------|-----------|----------|---------|
| **Create** | spread | `...` | `[newItem, ...array]` |
| **Read** | map | - | `array.map(item => ...)` |
| **Update** | map + spread | `...` | `array.map(item => item.id === id ? {...item, cambios} : item)` |
| **Delete** | filter | - | `array.filter(item => item.id !== id)` |

---

## 🎨 Componentes y responsabilidades

### App.tsx
- **Almacena el estado principal** (`tasks`)
- **Define todas las funciones CRUD**
- **Es la fuente de verdad**
- **Distribuye datos y funciones a los hijos**

### TaskForm.tsx
- **Captura input del usuario** (campo controlado)
- **Valida título** (no vacío)
- **Notifica al padre** cuando se envía (`onAddTask`)
- **Limpia el campo** después de agregar

### TaskList.tsx
- **Recibe el array de tareas**
- **Renderiza con map()**
- **Muestra estado vacío** si no hay tareas
- **Distribuye funciones a TaskItem**

### TaskItem.tsx
- **Muestra una tarea**
- **Maneja estado LOCAL de edición** (temporal)
- **Ejecuta las funciones del padre** (toggle, edit, delete)
- **NO modifica el estado global directamente**

---

## 🔄 Ciclo de vida de una acción

Ejemplo: **Usuario agrega una tarea**

```
1. Usuario escribe "Preparar exposición"
   ↓
2. onChange actualiza el estado local (title)
   ↓
3. Usuario presiona "Agregar tarea"
   ↓
4. handleSubmit ejecuta preventDefault()
   ↓
5. Valida que el título no esté vacío
   ↓
6. Llama a onAddTask(title)
   ↓
7. App ejecuta handleAddTask
   ↓
8. Crea newTask con crypto.randomUUID()
   ↓
9. setTasks([newTask, ...currentTasks])
   ↓
10. React detecta el cambio de estado
   ↓
11. React re-renderiza App
   ↓
12. TaskList recibe el nuevo array
   ↓
13. TaskList renderiza la nueva tarea
   ↓
14. TaskSummary recalcula el resumen
```

---

## ⚠️ Errores comunes y soluciones

### Error 1: El input no deja escribir

**Causa:** Falta `onChange`

```tsx
// ❌ INCORRECTO
<input value={title} />

// ✅ CORRECTO
<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

---

### Error 2: Los cambios no aparecen

**Causa:** Mutación directa del estado

```tsx
// ❌ INCORRECTO
tasks.push(newTask);
setTasks(tasks);

// ✅ CORRECTO
setTasks([...tasks, newTask]);
```

---

### Error 3: La página se recarga al enviar

**Causa:** Falta `preventDefault()`

```tsx
function handleSubmit(event: FormEvent) {
  event.preventDefault(); // ← ¡Importante!
  // ... resto del código
}
```

---

### Error 4: Cambian todas las tareas

**Causa:** No se valida el `id` en map

```tsx
// ❌ INCORRECTO
tasks.map(task => ({ ...task, status: 'completed' }))

// ✅ CORRECTO
tasks.map(task =>
  task.id === id
    ? { ...task, status: 'completed' }
    : task
)
```

---

## 🎤 Puntos clave para explicar oralmente

### 1. **useState**
"useState nos permite agregar memoria a nuestros componentes funcionales. Sin él, las variables se reiniciarían en cada render."

### 2. **Formulario controlado**
"Un campo controlado significa que React controla completamente su valor. El valor viene del estado y onChange lo actualiza."

### 3. **Props drilling**
"Los componentes hijos no pueden modificar el estado del padre directamente. El padre les pasa funciones como props, y los hijos las ejecutan para notificar cambios."

### 4. **Inmutabilidad**
"React compara arrays por referencia. Si modificamos el array directamente, React no detecta el cambio. Por eso SIEMPRE creamos un nuevo array con spread, map o filter."

### 5. **Fuente de verdad**
"App es la fuente de verdad porque almacena el estado principal. Todos los componentes reciben datos desde App, no los duplican."

### 6. **CRUD inmutable**
- "Para agregar uso spread"
- "Para actualizar uso map que crea un nuevo array"
- "Para eliminar uso filter que excluye el elemento"
- "Nunca uso push, splice o modificaciones directas"

---

## 📝 Diferencias con Actividad 6

| Aspecto | Actividad 6 | Actividad 7 |
|---------|-------------|-------------|
| Estado | Datos fijos | Estado dinámico con useState |
| Formulario | Deshabilitado | Controlado y funcional |
| Botones | Deshabilitados | Totalmente funcionales |
| CRUD | Solo lectura | Create, Read, Update, Delete |
| Interactividad | Estática | Totalmente interactiva |
| Persistencia | N/A | Solo en memoria (se reinicia al recargar) |

---

## 🚀 Lo que viene en Actividad 8

- ✨ Validación de formularios avanzada
- 🔍 Búsqueda por título
- 🎯 Filtrado por estado
- 📊 Ordenamiento de tareas
- 💾 **Persistencia con localStorage** (los cambios se guardan)

---

## 🧪 Cómo probar que todo funciona

1. **Create**: Agregar "Tarea de prueba" → Debe aparecer al inicio
2. **Read**: Ver la lista → Debe mostrar todas las tareas
3. **Update (toggle)**: Completar → Cambia a "Completada", resumen se actualiza
4. **Update (edit)**: Editar título → Guardar → Debe mostrar el nuevo título
5. **Delete**: Eliminar → Confirmar → Desaparece de la lista
6. **Validación**: Intentar agregar título vacío → Botón deshabilitado
7. **Cancelar**: Editar → Cambiar texto → Cancelar → Se restaura el original
8. **Estado vacío**: Eliminar todas → Mensaje "No hay tareas"
9. **Recargar**: Actualizar página → Vuelven las 5 tareas iniciales

---

## 🎓 Conceptos de programación aplicados

1. **Desestructuración**: `const [tasks, setTasks] = useState(...)`
2. **Arrow functions**: `() => { ... }`
3. **Operador ternario**: `status === 'pending' ? 'completed' : 'pending'`
4. **Template literals**: `` `¿Eliminar "${task.title}"?` ``
5. **Spread operator**: `[...tasks]`, `{...task}`
6. **Higher-order functions**: `map()`, `filter()`, `find()`
7. **Callbacks**: Funciones pasadas como props
8. **TypeScript**: Tipos e interfaces
9. **Immutability**: No modificar datos directamente

---

## ✅ Checklist de entrega

- [ ] Formulario controlado funcional
- [ ] Agregar tareas (CREATE)
- [ ] Completar/reabrir tareas (UPDATE)
- [ ] Editar títulos (UPDATE)
- [ ] Eliminar con confirmación (DELETE)
- [ ] Resumen dinámico actualizado
- [ ] Estado vacío funcional
- [ ] Sin errores en consola
- [ ] `pnpm lint` sin errores
- [ ] `pnpm build` exitoso
- [ ] README actualizado
- [ ] Preguntas de cierre respondidas
- [ ] Git commits descriptivos
- [ ] Repositorio en GitHub

---

**¡Éxito en tu presentación! 🎉**
