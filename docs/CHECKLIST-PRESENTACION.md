# ✅ Checklist para Presentación - Actividad 7

## 📋 Antes de la Presentación

### Preparación Técnica

- [ ] **Servidor funcionando**
  ```bash
  cd task-manager-frontend
  pnpm dev
  # o
  npx vite
  ```
  - URL: http://localhost:5173

- [ ] **Navegador abierto** con:
  - [ ] Página de la aplicación
  - [ ] Consola de desarrollador (F12) abierta
  - [ ] Pestaña Console visible (sin errores)

- [ ] **Editor de código abierto** mostrando:
  - [ ] `src/App.tsx` (estado y funciones CRUD)
  - [ ] `src/components/TaskForm.tsx` (formulario controlado)
  - [ ] `src/components/TaskItem.tsx` (edición inline)

- [ ] **Documentos de respaldo**:
  - [ ] `docs/preguntas-cierre-ec2-f2-a7.md`
  - [ ] `docs/RESUMEN-ACTIVIDAD-7.md`
  - [ ] `README.md` actualizado

---

## 🎤 Durante la Presentación

### 1️⃣ Introducción (2 minutos)

- [ ] **Objetivo de la actividad:**
  > "Convertir la aplicación estática en interactiva mediante estado de React y operaciones CRUD"

- [ ] **Tecnologías usadas:**
  - React 18 con Hooks (useState)
  - TypeScript para tipado
  - Operaciones inmutables (spread, map, filter)

- [ ] **Alcance actual:**
  - CRUD completo en memoria
  - Formularios controlados
  - Validación básica
  - Confirmación de eliminación

---

### 2️⃣ Demostración en Vivo (5 minutos)

#### CREATE - Agregar Tarea
- [ ] Escribir: "Preparar exposición"
- [ ] Mostrar contador: "22/120 caracteres"
- [ ] Presionar "Agregar tarea"
- [ ] **Señalar:**
  - ✓ Aparece al inicio
  - ✓ Estado "Pendiente"
  - ✓ Campo se limpia automáticamente
  - ✓ Resumen se actualiza (+1 total, +1 pendiente)

#### Validación
- [ ] Intentar agregar con campo vacío
- [ ] **Señalar:**
  - ✓ Botón deshabilitado
  - ✓ Formulario controlado funciona

#### UPDATE - Completar Tarea
- [ ] Presionar "Completar" en la tarea recién creada
- [ ] **Señalar:**
  - ✓ Cambia a "Completada"
  - ✓ Estilo visual cambia
  - ✓ Resumen se actualiza

#### UPDATE - Editar Título
- [ ] Presionar "Editar" en una tarea
- [ ] Modificar el texto
- [ ] Presionar "Guardar"
- [ ] **Señalar:**
  - ✓ Formulario inline funcional
  - ✓ Fecha de actualización cambia
  - ✓ Solo esa tarea se modifica

#### Cancelar Edición
- [ ] Presionar "Editar" en otra tarea
- [ ] Modificar texto
- [ ] Presionar "Cancelar"
- [ ] **Señalar:**
  - ✓ Título original se conserva
  - ✓ Estado local de edición se descarta

#### DELETE - Eliminar
- [ ] Presionar "Eliminar"
- [ ] **Mostrar diálogo de confirmación**
- [ ] Cancelar primero
- [ ] **Señalar:** ✓ Tarea permanece
- [ ] Eliminar de nuevo y confirmar
- [ ] **Señalar:**
  - ✓ Tarea desaparece
  - ✓ Resumen se actualiza

#### Consola sin Errores
- [ ] Mostrar pestaña Console
- [ ] **Señalar:**
  - ✓ Sin errores rojos
  - ✓ Sin warnings amarillos

---

### 3️⃣ Explicación del Código (8 minutos)

#### A. Estado en App.tsx
```tsx
const [tasks, setTasks] = useState<Task[]>(() => [...seedTasks]);
```

- [ ] **Explicar:**
  - useState guarda las tareas en memoria
  - App es la fuente de verdad
  - Función inicializadora con spread

---

#### B. Formulario Controlado (TaskForm.tsx)
```tsx
const [title, setTitle] = useState('');

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

- [ ] **Explicar:**
  - `value` viene del estado
  - `onChange` actualiza el estado
  - React controla completamente el input
  - `preventDefault()` evita recarga de página

---

#### C. CREATE con Spread
```tsx
const newTask: Task = {
  id: crypto.randomUUID(),
  title,
  status: 'pending',
  createdAt: now,
  updatedAt: now,
};

setTasks([newTask, ...currentTasks]);
```

- [ ] **Explicar:**
  - Genera ID único
  - Crea nuevo array sin modificar original
  - Inmutabilidad: nunca usar `push()`

---

#### D. UPDATE con Map
```tsx
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === id
      ? { ...task, status: newStatus, updatedAt: now }
      : task
  )
);
```

- [ ] **Explicar:**
  - `map()` crea nuevo array
  - Solo modifica tarea con ID coincidente
  - Spread copia propiedades y sobrescribe las necesarias
  - Las demás tareas no se tocan

---

#### E. DELETE con Filter
```tsx
const shouldDelete = window.confirm(`¿Eliminar "${task.title}"?`);

if (shouldDelete) {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== id)
  );
}
```

- [ ] **Explicar:**
  - Confirmación previene eliminaciones accidentales
  - `filter()` conserva todos excepto el que queremos eliminar
  - Crea nuevo array

---

#### F. Props Drilling (Flujo de Eventos)
```tsx
// App pasa función
<TaskForm onAddTask={handleAddTask} />

// TaskForm la ejecuta
onAddTask(normalizedTitle);
```

- [ ] **Explicar:**
  - Los hijos NO modifican estado directamente
  - Usan callbacks recibidos por props
  - Flujo unidireccional de datos

---

### 4️⃣ Conceptos Clave (3 minutos)

- [ ] **useState**
  > "Hook que agrega memoria a componentes funcionales"

- [ ] **Inmutabilidad**
  > "React compara por referencia. Si modifico directamente, React no detecta el cambio"

- [ ] **CRUD Inmutable**
  | Operación | Método |
  |-----------|--------|
  | CREATE | `[newItem, ...array]` |
  | UPDATE | `array.map(...)` |
  | DELETE | `array.filter(...)` |

- [ ] **Fuente de verdad**
  > "App almacena el estado. Los demás componentes lo reciben y notifican cambios"

- [ ] **Estado local vs global**
  > "TaskItem solo guarda el estado temporal de edición. La tarea real vive en App"

---

### 5️⃣ Preguntas Frecuentes que Pueden Hacer

#### P: ¿Por qué no usar push()?
**R:** "Porque push modifica el array original. React compara por referencia, entonces no detecta el cambio y no re-renderiza."

#### P: ¿Qué es un formulario controlado?
**R:** "Es cuando React controla completamente el valor del input mediante value y onChange. Esto permite validación, transformación y reseteo fácil."

#### P: ¿Por qué los cambios desaparecen al recargar?
**R:** "Porque el estado vive solo en memoria durante la sesión. En la Actividad 8 implementaremos localStorage para persistencia."

#### P: ¿Qué es preventDefault()?
**R:** "Evita el comportamiento por defecto del formulario, que es recargar la página. Así mantenemos todo en JavaScript y React."

#### P: ¿Por qué App es la fuente de verdad?
**R:** "Porque almacena el estado principal una sola vez. Si cada componente tuviera su copia, podríamos tener datos desincronizados."

#### P: ¿Cómo sabe React qué tarea actualizar?
**R:** "Mediante el ID único. map() recorre todas las tareas y solo modifica la que coincide con el ID que recibimos."

---

## 📊 Material de Apoyo Sugerido

### Opcional: Diagrama en Pizarra

```
┌─────────────┐
│    App      │ ← Estado: tasks[]
└──────┬──────┘
       │ props
   ┌───┴────┐
   ↓        ↓
TaskForm  TaskList
   │          │
   │          ↓
   │       TaskItem
   │          │
   └──────────┘
    callbacks
```

---

## ⏱️ Distribución de Tiempo (Total: 20 min)

| Sección | Tiempo | Contenido |
|---------|--------|-----------|
| Intro | 2 min | Objetivo y alcance |
| Demo en vivo | 5 min | Todas las operaciones CRUD |
| Código explicado | 8 min | useState, CRUD, props |
| Conceptos clave | 3 min | Inmutabilidad, fuente de verdad |
| Preguntas | 2 min | Respuestas del profesor |

---

## 🎯 Mensajes Clave para Dejar Claros

1. ✅ "App es la fuente de verdad que almacena el estado principal"
2. ✅ "Siempre creamos nuevos arrays/objetos, nunca modificamos directamente"
3. ✅ "Los componentes hijos comunican mediante callbacks, no modifican el estado"
4. ✅ "Usamos spread para CREATE, map para UPDATE y filter para DELETE"
5. ✅ "React compara por referencia, por eso la inmutabilidad es crítica"
6. ✅ "El formulario controlado permite validación y control total del input"
7. ✅ "Los cambios son en memoria, se reinician al recargar (esperado en A7)"

---

## 🔍 Auto-evaluación Final

Antes de presentar, verifica:

- [ ] ¿Puedo explicar qué es useState sin leer?
- [ ] ¿Puedo explicar por qué NO usar push()?
- [ ] ¿Puedo mostrar cada operación CRUD funcionando?
- [ ] ¿Entiendo la diferencia entre estado local y global?
- [ ] ¿Puedo explicar qué es un formulario controlado?
- [ ] ¿Puedo explicar el flujo de datos (props drilling)?
- [ ] ¿Puedo responder por qué los cambios desaparecen al recargar?

---

## 💪 Frases de Confianza

> "Implementé un sistema CRUD completo con operaciones inmutables"

> "La aplicación funciona sin errores de consola y pasa las validaciones de ESLint"

> "Usé los patrones recomendados de React: formularios controlados, props drilling y estado en el nivel correcto"

> "El código sigue principios de inmutabilidad para garantizar que React detecte todos los cambios"

---

## 📝 Recordatorios de Última Hora

- [ ] Batería del portátil cargada
- [ ] Servidor corriendo ANTES de comenzar
- [ ] Navegador sin extensiones que interfieran
- [ ] Editor de código con tamaño de fuente legible
- [ ] README.md actualizado (por si preguntan)
- [ ] Documentación en docs/ disponible

---

## 🎉 ¡Mucha Suerte!

**Has completado exitosamente la Actividad 7. Tu implementación está correcta, funcional y sigue las mejores prácticas de React.**

**Confía en tu trabajo y explica con seguridad. ¡Lo hiciste genial! 🚀**
