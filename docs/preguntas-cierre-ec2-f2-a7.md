# Preguntas de cierre - EC2 F2 A7

## 1. ¿Qué diferencia existe entre una variable local y el estado de React?

Una **variable local** es una variable normal de JavaScript que se declara dentro de una función. Cuando el componente se vuelve a renderizar, la variable se reinicia y pierde su valor anterior. Además, cambiar una variable local NO hace que React vuelva a renderizar el componente.

El **estado de React** (con `useState`) es una forma especial de almacenar información que React "recuerda" entre renderizados. Cuando cambias el estado usando la función `set`, React detecta el cambio, guarda el nuevo valor y vuelve a renderizar el componente para mostrar la información actualizada en la interfaz.

**Ejemplo:**
```tsx
// Variable local - se reinicia en cada render
let contador = 0;

// Estado de React - se mantiene entre renders
const [contador, setContador] = useState(0);
```

---

## 2. ¿Qué valores devuelve useState?

`useState` devuelve un **array con exactamente 2 elementos**:

1. **El valor actual del estado** - Es el dato que queremos guardar
2. **Una función para actualizar ese estado** - Permite cambiar el valor

Usamos **desestructuración** para obtener ambos valores:

```tsx
const [tasks, setTasks] = useState<Task[]>([]);
//     ↑        ↑
//   valor   función
//  actual    setter
```

---

## 3. ¿Por qué useState se declara en el nivel superior del componente?

`useState` **DEBE** estar en el nivel superior por estas razones:

1. **React depende del orden de los hooks**: React identifica cada hook por su posición en el código
2. **No puede estar dentro de condicionales o loops**: Si el hook se ejecuta solo a veces, React pierde el seguimiento
3. **Debe ejecutarse en cada renderizado**: React necesita mantener la consistencia

**❌ INCORRECTO:**
```tsx
if (condicion) {
  const [valor, setValor] = useState(0); // ¡ERROR!
}
```

**✅ CORRECTO:**
```tsx
const [valor, setValor] = useState(0);
```

---

## 4. ¿Qué significa que un campo sea controlado?

Un **campo controlado** es un input cuyo valor está **sincronizado con el estado de React**. Significa que:

1. El `value` del input viene del estado
2. El `onChange` actualiza ese estado
3. React es la "fuente de verdad" del valor del input

**Ejemplo en TaskForm:**
```tsx
const [title, setTitle] = useState('');

<input
  value={title}  // ← El valor viene del estado
  onChange={(event) => setTitle(event.target.value)}  // ← Actualiza el estado
/>
```

**Ventajas:**
- Control total sobre el valor
- Validación en tiempo real
- Fácil reseteo del campo

---

## 5. ¿Por qué handleSubmit utiliza preventDefault?

`preventDefault()` **evita el comportamiento por defecto del formulario**, que es recargar la página cuando se envía.

Sin `preventDefault()`:
- El formulario se envía al servidor
- La página se recarga completamente
- Se pierde todo el estado de React

Con `preventDefault()`:
- El formulario no recarga la página
- Mantenemos el control en JavaScript
- Podemos manejar el envío con React

**Código en TaskForm:**
```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); // ← Evita la recarga
  
  if (!normalizedTitle) return;
  
  onAddTask(normalizedTitle); // Enviamos al padre
  setTitle(''); // Limpiamos el campo
}
```

---

## 6. ¿Cómo comunica TaskForm una nueva tarea a App?

TaskForm comunica mediante **una función callback** que recibe como prop desde App:

**Flujo completo:**

1. **App** define la función y la pasa como prop:
```tsx
function handleAddTask(title: string) {
  // Crea la tarea y actualiza el estado
}

<TaskForm onAddTask={handleAddTask} />
```

2. **TaskForm** recibe la función en sus props:
```tsx
interface TaskFormProps {
  onAddTask: (title: string) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  // Cuando el usuario envía el formulario...
  onAddTask(normalizedTitle); // ← Llama a la función del padre
}
```

3. **App** ejecuta la función, actualiza su estado y React re-renderiza la lista

Este patrón se llama **"lifting state up"** (elevar el estado).

---

## 7. ¿Por qué App funciona como fuente de verdad?

App es la **fuente de verdad** porque:

1. **Almacena el estado principal**: La colección `tasks` vive en App
2. **Es el único que modifica el estado**: Solo App tiene `setTasks`
3. **Distribuye los datos**: App pasa `tasks` a TaskSummary y TaskList
4. **Coordina las acciones**: Todas las funciones CRUD están en App

**Diagrama del flujo:**
```
        ┌─────────────────┐
        │      APP        │ ← Fuente de verdad
        │  tasks: Task[]  │
        └────────┬────────┘
                 │
        ┌────────┴──────────┐
        │                   │
   TaskSummary          TaskList
   (recibe tasks)    (recibe tasks y funciones)
                           │
                      TaskItem
                   (recibe funciones)
```

**Ventajas:**
- No hay duplicación de datos
- No hay problemas de sincronización
- Un solo lugar para actualizar

---

## 8. ¿Cómo se implementa Create sin utilizar push?

Usamos el **operador spread (`...`)** para crear un **nuevo array** sin modificar el original:

```tsx
function handleAddTask(title: string) {
  const newTask: Task = {
    id: crypto.randomUUID(),
    title,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  setTasks((currentTasks) => [
    newTask,           // ← Nueva tarea al inicio
    ...currentTasks,   // ← Todas las tareas anteriores
  ]);
}
```

**¿Por qué NO usar `push`?**
```tsx
// ❌ INCORRECTO - modifica el array original
currentTasks.push(newTask);
setTasks(currentTasks); // React no detecta el cambio

// ✅ CORRECTO - crea un nuevo array
setTasks([newTask, ...currentTasks]); // React detecta el cambio
```

React compara arrays por **referencia**, no por contenido. Si modificas el array directamente, React no detecta el cambio porque la referencia es la misma.

---

## 9. ¿Cómo permite map actualizar una sola tarea?

`map()` recorre todo el array y nos permite **reemplazar selectivamente** un elemento:

```tsx
function handleToggleStatus(id: string) {
  const now = new Date().toISOString();

  setTasks((currentTasks) =>
    currentTasks.map((task) => {
      // Si NO es la tarea que buscamos, la devolvemos sin cambios
      if (task.id !== id) {
        return task;
      }

      // Si ES la tarea, creamos una NUEVA con los cambios
      return {
        ...task,                    // ← Copia todas las propiedades
        status: task.status === 'pending' 
          ? 'completed' 
          : 'pending',              // ← Cambia solo el status
        updatedAt: now,             // ← Actualiza la fecha
      };
    }),
  );
}
```

**Proceso:**
1. `map()` crea un nuevo array
2. Recorre cada tarea
3. Si el `id` coincide, crea una nueva tarea con cambios
4. Si no coincide, devuelve la tarea original
5. React detecta el nuevo array y re-renderiza

---

## 10. ¿Cómo utiliza filter la operación Delete?

`filter()` crea un **nuevo array** que solo incluye los elementos que cumplen una condición:

```tsx
function handleDeleteTask(id: string) {
  // 1. Buscar la tarea para mostrar su título
  const selectedTask = tasks.find((task) => task.id === id);
  
  if (!selectedTask) return;

  // 2. Pedir confirmación
  const shouldDelete = window.confirm(
    `¿Eliminar la tarea "${selectedTask.title}"?`
  );
  
  if (!shouldDelete) return;

  // 3. Filtrar: conservar todas EXCEPTO la que tiene ese id
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== id)
    //                           ↑
    //          Devuelve true para TODAS menos la que queremos eliminar
  );
}
```

**¿Cómo funciona?**
- `filter()` evalúa cada tarea
- Si `task.id !== id` es `true`, la tarea se conserva
- Si `task.id !== id` es `false`, la tarea se elimina
- Devuelve un nuevo array sin la tarea eliminada

---

## 11. ¿Por qué se emplea una función actualizadora en setTasks?

Usamos una **función actualizadora** cuando el nuevo estado depende del estado anterior:

```tsx
// Con función actualizadora
setTasks((currentTasks) => [
  newTask,
  ...currentTasks,
]);
```

**Razones:**

1. **Garantiza el estado más reciente**: React puede procesar múltiples actualizaciones en lotes
2. **Evita problemas de concurrencia**: Si hay múltiples cambios rápidos, cada uno ve el valor correcto
3. **Mejor para operaciones encadenadas**: Cuando varias actualizaciones dependen entre sí

**Comparación:**

```tsx
// ❌ PUEDE fallar en actualizaciones rápidas
setTasks([newTask, ...tasks]);

// ✅ SIEMPRE correcto - recibe el estado pendiente más reciente
setTasks((currentTasks) => [newTask, ...currentTasks]);
```

---

## 12. ¿Qué información conserva TaskItem como estado local?

TaskItem conserva **SOLO el estado temporal de la edición**:

```tsx
const [isEditing, setIsEditing] = useState(false);  // ¿Está editando?
const [draftTitle, setDraftTitle] = useState(title); // Borrador temporal
```

**¿Por qué solo esto?**

- `isEditing`: Controla si mostrar el formulario de edición o el título normal
- `draftTitle`: Guarda temporalmente lo que el usuario está escribiendo

**Lo que NO guarda:**
- ❌ La tarea completa
- ❌ El título real (está en App)
- ❌ El estado (pending/completed)
- ❌ Las fechas

**Flujo de edición:**

1. Usuario presiona "Editar" → `setIsEditing(true)`
2. Usuario escribe → `setDraftTitle(nuevoTexto)`
3. Usuario presiona "Guardar" → Llama a `onEditTask(id, draftTitle)`
4. Usuario presiona "Cancelar" → `setDraftTitle(title)` y `setIsEditing(false)`

La tarea real SIEMPRE vive en App.

---

## 13. ¿Por qué los cambios desaparecen al recargar la página?

Porque el estado de React vive **solo en la memoria del navegador** durante la sesión actual:

**Ciclo actual:**
```
Usuario abre página
    ↓
useState inicializa con seedTasks
    ↓
Usuario hace cambios (se guardan en RAM)
    ↓
Usuario recarga página (RAM se borra)
    ↓
useState inicializa DE NUEVO con seedTasks originales
```

**En esta actividad NO hay persistencia porque:**
- No usamos `localStorage` (Actividad 8)
- No usamos una base de datos
- No usamos una API

Este es el comportamiento **esperado y correcto** para la Actividad 7.

**En la Actividad 8 implementaremos:**
- `localStorage` para guardar en el navegador
- Los cambios se conservarán entre recargas

---

## 14. ¿Qué dificultad encontraste y cómo la resolviste?

**(Responde con tu experiencia personal, aquí te doy ejemplos comunes):**

**Ejemplo 1:**
Al principio no entendía por qué usar `map()` en lugar de modificar directamente el array. Investigué sobre inmutabilidad en React y entendí que React compara por referencia, no por contenido. Por eso necesitamos crear un nuevo array para que React detecte el cambio y re-renderice.

**Ejemplo 2:**
Tuve problemas con el campo controlado porque el input no dejaba escribir. Me di cuenta que faltaba el `onChange` para actualizar el estado. Aprendí que en un campo controlado SIEMPRE necesitas tanto `value` como `onChange`.

**Ejemplo 3:**
La eliminación no funcionaba porque no pedía confirmación. Implementé `window.confirm()` y entendí la importancia de validar acciones destructivas antes de ejecutarlas.

**Ejemplo 4:**
Al editar una tarea, los cambios no se guardaban. Descubrí que necesitaba llamar a `onEditTask()` pasando el id y el nuevo título, y que el estado real de la tarea vive en App, no en TaskItem.

---

## Resumen de conceptos clave para la explicación oral

### 1. **useState**
- Hook que permite agregar estado a componentes funcionales
- Devuelve [valor, función]
- Debe estar en el nivel superior

### 2. **Formulario controlado**
- `value` viene del estado
- `onChange` actualiza el estado
- React controla el input completamente

### 3. **Funciones mediante props**
- Los hijos comunican con padres mediante callbacks
- El padre define la función y la pasa como prop
- El hijo la ejecuta cuando necesita notificar algo

### 4. **Operaciones CRUD inmutables**

| Operación | Método | Descripción |
|-----------|--------|-------------|
| **Create** | spread | `[newItem, ...array]` |
| **Read** | map | Renderizar la lista |
| **Update** | map + spread | Reemplazar el item modificado |
| **Delete** | filter | Conservar todos excepto el eliminado |

### 5. **Fuente de verdad (Single Source of Truth)**
- Un solo lugar almacena cada dato
- Evita duplicación y desincronización
- App es la fuente de verdad para las tareas

### 6. **Estado local vs estado global**
- **Estado local (TaskItem)**: Solo para UI temporal (edición)
- **Estado global (App)**: Datos que afectan múltiples componentes

### 7. **Inmutabilidad**
- NUNCA modificar arrays/objetos directamente
- SIEMPRE crear nuevos con spread, map, filter
- React detecta cambios por referencia

---

## Comandos importantes

```bash
# Instalar dependencias
pnpm install

# Ejecutar servidor de desarrollo
pnpm dev
# o
npx vite

# Validar código
pnpm lint

# Compilar para producción
pnpm build
```

---

## Estructura de archivos clave

```
src/
├── App.tsx              # Estado principal y funciones CRUD
├── components/
│   ├── TaskForm.tsx     # Formulario controlado
│   ├── TaskList.tsx     # Lista con map()
│   └── TaskItem.tsx     # Item con estado de edición
├── models/
│   └── Task.ts          # Interfaz TypeScript
├── data/
│   └── seedTasks.ts     # Datos iniciales
└── styles/
    └── index.css        # Estilos incluyendo edición
```
