# Preguntas de cierre EC2 F3 A8

## 1. ¿Por qué las reglas de validación se colocaron en una utilidad?

Para reutilizar la misma lógica de validación tanto en el formulario de registro (TaskForm) como en la edición inline (TaskItem). Esto evita duplicar código y garantiza que las reglas sean consistentes en toda la aplicación. Si necesitamos cambiar las reglas (por ejemplo, cambiar el mínimo de caracteres), solo lo hacemos en un lugar.

## 2. ¿Qué significa el retorno `string | null` de `validateTaskTitle`?

Significa que la función puede retornar dos tipos de valores:
- `string`: Un mensaje de error si la validación falla
- `null`: Si el título es válido

Este retorno obliga a verificar si existe un mensaje antes de proceder con la operación, lo que hace el código más seguro. Si hay un string, detenemos la operación y mostramos el error. Si es null, continuamos.

## 3. ¿Qué función cumplen `aria-invalid`, `aria-describedby` y `role="alert"`?

Son atributos de accesibilidad que ayudan a usuarios con lectores de pantalla:

- **`aria-invalid`**: Indica si un campo tiene un error de validación. Los lectores de pantalla anuncian "inválido" al enfocarlo.
- **`aria-describedby`**: Vincula el campo con los elementos que lo describen (mensaje de ayuda y error). El lector lee estos mensajes al enfocar el campo.
- **`role="alert"`**: Marca el mensaje de error como una alerta importante que se anuncia inmediatamente al aparecer, sin necesidad de que el usuario navegue hasta él.

## 4. ¿Por qué `query`, `filter` y `sortBy` son estados controlados?

Porque React necesita controlar estos valores para que la interfaz se actualice automáticamente cuando cambian. Al ser estados controlados:
- Los inputs siempre reflejan el valor del estado
- React maneja los cambios mediante `onChange`
- Podemos implementar el botón "Limpiar criterios" que resetea todos los valores
- La vista derivada (`visibleTasks`) se recalcula automáticamente en cada render

## 5. ¿Por qué `visibleTasks` no debe almacenarse como estado independiente?

Porque es un **dato derivado** que se puede calcular a partir del estado principal (`tasks`, `query`, `filter`, `sortBy`). Guardarlo como estado independiente causaría:

- **Duplicación**: Tendríamos dos copias de información relacionada
- **Inconsistencias**: Si `tasks` cambia pero olvidamos actualizar `visibleTasks`, quedan desincronizados
- **Complejidad**: Necesitaríamos sincronizar manualmente ambos estados

Al calcularlo en cada render, siempre está actualizado y sincronizado automáticamente.

## 6. ¿Cómo se normaliza una búsqueda?

Se normaliza en dos pasos:

1. **`.trim()`**: Elimina espacios al inicio y final
2. **`.toLocaleLowerCase('es-MX')`**: Convierte todo a minúsculas respetando el idioma español

Esto permite que "Programar", "  PROGRAMAR  " y "programar" produzcan la misma comparación, haciendo la búsqueda insensible a mayúsculas y espacios externos.

## 7. ¿Por qué se crea una copia antes de utilizar `sort`?

Porque `sort()` **muta el array original**. Si ejecutamos `tasks.sort()` directamente:

- Modificaríamos el array de entrada
- Podríamos alterar el estado sin que React lo detecte
- Violaríamos el principio de inmutabilidad de React

Al usar `[...filteredTasks].sort()`, creamos una copia con spread y ordenamos esa copia, dejando el array original intacto.

## 8. ¿Qué responsabilidad tiene `task-query.service.ts`?

Transformar la colección de tareas según los criterios de consulta:

1. **Normalizar** el texto de búsqueda
2. **Filtrar** las tareas que coincidan con la búsqueda y el estado seleccionado
3. **Ordenar** los resultados según el criterio elegido

Es un servicio puro: no conoce componentes, no modifica el estado, solo transforma datos de entrada y retorna un nuevo array.

## 9. ¿Por qué el resultado de `JSON.parse` se trata como `unknown`?

Porque `JSON.parse()` puede retornar **cualquier tipo de dato**. El contenido de localStorage es **untrusted** (no confiable):

- Puede haber sido modificado manualmente desde DevTools
- Puede haberse corrompido
- Puede no tener la estructura esperada

Tratarlo como `unknown` nos obliga a validar la estructura con **type guards** antes de usarlo como `Task[]`, evitando errores en tiempo de ejecución.

## 10. ¿Qué comprueba la función `isTask`?

Verifica que un valor desconocido tenga la estructura correcta de `Task`:

1. Que sea un objeto (no null, undefined, string, etc.)
2. Que tenga la propiedad `id` de tipo string
3. Que tenga la propiedad `title` de tipo string
4. Que `status` sea un TaskStatus válido ('pending' | 'completed')
5. Que `createdAt` sea un string con fecha válida
6. Que `updatedAt` sea un string con fecha válida

Solo retorna `true` si **todas** las condiciones se cumplen.

## 11. ¿Qué ventaja ofrece la inicialización diferida de `useState`?

```typescript
const [tasks, setTasks] = useState(() => loadTasks(seedTasks));
```

La función se ejecuta **solo una vez** al montar el componente, no en cada render. Sin inicialización diferida:

```typescript
const [tasks, setTasks] = useState(loadTasks(seedTasks));
```

`loadTasks()` se ejecutaría en **cada render** (aunque solo use el resultado la primera vez), leyendo localStorage innecesariamente. La inicialización diferida optimiza el rendimiento.

## 12. ¿Por qué `localStorage` se sincroniza mediante `useEffect`?

Porque localStorage es un **sistema externo** a React. `useEffect` permite sincronizarlo después de que el estado cambia:

```typescript
useEffect(() => {
  saveTasks(tasks);
}, [tasks]);
```

Cada vez que `tasks` cambia:
1. React actualiza la UI
2. Después ejecuta el efecto
3. El efecto guarda en localStorage

La dependencia `[tasks]` evita guardados innecesarios: solo se ejecuta cuando `tasks` realmente cambia.

## 13. ¿Por qué `TaskSummary` recibe `tasks` y `TaskList` recibe `visibleTasks`?

Porque tienen propósitos diferentes:

- **`TaskSummary`**: Muestra el **resumen global** (total de tareas, pendientes, completadas). Debe usar la colección completa sin filtrar.
- **`TaskList`**: Muestra solo las tareas **visibles** según los criterios de búsqueda y filtro actual.

Si ambos recibieran `visibleTasks`, el resumen cambiaría al buscar, mostrando información incorrecta.

## 14. ¿Qué información se pierde y cuál permanece al recargar?

**Permanece (guardado en localStorage):**
- Todas las tareas con sus operaciones CRUD
- Títulos editados
- Estados (pending/completed)
- Fechas de creación y actualización

**Se pierde (no se guarda):**
- Texto de búsqueda (`query`)
- Filtro seleccionado (`filter`)
- Orden seleccionado (`sortBy`)
- Estado de edición inline

Los criterios de consulta no se guardan porque son temporales: cada sesión empieza con la vista por defecto.

## 15. ¿Qué dificultad encontraste y cómo la resolviste?

La mayor dificultad fue entender la diferencia entre **estado principal** y **datos derivados**. Al principio intenté guardar `visibleTasks` como estado, lo que causaba inconsistencias.

La solución fue:
1. Mantener solo `tasks` como estado
2. Calcular `visibleTasks` en cada render con `getVisibleTasks()`
3. Confiar en que React es lo suficientemente eficiente para recalcular en cada render

También fue importante usar correctamente `useEffect` con la dependencia `[tasks]` para evitar guardados infinitos en localStorage.
