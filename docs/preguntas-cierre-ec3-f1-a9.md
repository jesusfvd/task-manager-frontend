# Preguntas de cierre - EC3 F1 A9

## 1. ¿Qué es una aplicación de página única?

Una SPA (Single Page Application) es una aplicación web que carga una única página HTML y actualiza dinámicamente el contenido mediante JavaScript sin recargar completamente la página. React Router permite cambiar las vistas (páginas) manipulando la URL del navegador y renderizando diferentes componentes según la ruta activa.

## 2. ¿Qué responsabilidad tiene BrowserRouter?

BrowserRouter proporciona el contexto de navegación para toda la aplicación. Utiliza la API de historial del navegador (History API) para sincronizar la interfaz con la URL y permite que los componentes hijos accedan a las funcionalidades de enrutamiento mediante hooks como useParams, useNavigate, etc.

## 3. ¿Cuál es la diferencia entre Routes y Route?

- `Routes`: Es el contenedor que selecciona qué ruta debe mostrarse según la URL actual. Evalúa todas las rutas definidas dentro y renderiza la que coincida.
- `Route`: Define una ruta individual asociando un path (dirección) con un elemento (componente) que debe renderizarse cuando esa ruta esté activa.

## 4. ¿Qué es una ruta índice?

Una ruta índice es la página predeterminada que se muestra cuando se accede a la ruta padre sin agregar segmentos adicionales. Se define con la prop `index` en lugar de `path`. En este proyecto, la ruta índice (`/`) muestra la HomePage.

## 5. ¿Qué beneficio ofrece un layout?

Un layout permite reutilizar la estructura visual común (encabezado, navegación, pie de página) en todas las páginas sin duplicar código. Concentra los elementos compartidos en un solo componente y utiliza `<Outlet />` para renderizar el contenido específico de cada página.

## 6. ¿Qué función cumple Outlet?

Outlet es un marcador de posición que indica dónde debe renderizarse la página hija seleccionada por React Router. Es como un "hueco" en el layout que se llena con el componente correspondiente a la ruta activa.

## 7. ¿Qué diferencia existe entre Link y NavLink?

- `Link`: Crea enlaces de navegación interna que previenen la recarga completa de la página.
- `NavLink`: Extiende Link agregando información sobre si la ruta está activa o no. Útil para menús de navegación porque permite aplicar estilos visuales diferentes al enlace activo mediante la función `className`.

## 8. ¿Por qué no se utilizan enlaces `<a>` para navegar internamente?

Los enlaces `<a>` tradicionales provocan una recarga completa de la página, perdiendo el estado de la aplicación y descargando todos los recursos nuevamente. Link y NavLink de React Router previenen este comportamiento y realizan navegación del lado del cliente, manteniendo el estado y mejorando el rendimiento.

## 9. ¿Qué representa `:taskId`?

`:taskId` es un parámetro dinámico en la URL que representa el identificador único de una tarea. El prefijo `:` indica que es una parte variable de la ruta, permitiendo que URLs como `/tasks/123` o `/tasks/abc-xyz` coincidan con la misma ruta pero con diferentes valores.

## 10. ¿Cómo se recupera un parámetro dinámico?

Se utiliza el hook `useParams()` de React Router, que retorna un objeto con todos los parámetros dinámicos de la ruta actual. Por ejemplo: `const { taskId } = useParams<{ taskId: string }>()`.

## 11. ¿Cuándo debe utilizarse useNavigate?

`useNavigate` debe utilizarse para navegación programática, es decir, cuando se necesita cambiar de ruta en respuesta a una acción o evento (no a un clic directo en un enlace). Por ejemplo: después de eliminar una tarea desde su página de detalle, se navega automáticamente de regreso a la lista con `navigate('/tasks', { replace: true })`.

## 12. ¿Qué función cumple la ruta `*`?

La ruta `*` (comodín) actúa como una ruta de captura general que coincide con cualquier dirección que no haya sido definida explícitamente. Se utiliza para mostrar una página 404 cuando el usuario intenta acceder a una ruta inexistente.

## 13. ¿Por qué el estado continúa administrado por App?

App mantiene el estado principal porque actúa como la fuente única de verdad (single source of truth). Las páginas son componentes de presentación que reciben datos y funciones mediante props, manteniendo una arquitectura limpia donde la lógica de negocio está centralizada y las vistas solo se encargan de renderizar.

## 14. ¿Por qué localStorage permanece en esta actividad?

La actividad 9 se centra en la reorganización de la navegación y la estructura de la aplicación, no en la integración con la API. localStorage se mantiene para preservar la persistencia de datos mientras se prepara la arquitectura SPA. La conexión con la API REST se implementará en la Actividad 10.

## 15. ¿Qué dificultad encontraste y cómo la resolviste?

La principal dificultad fue actualizar el tipo de retorno de `onDeleteTask` de `void` a `boolean` para que TaskDetailPage pudiera detectar si la eliminación fue exitosa y navegar automáticamente de regreso a `/tasks`. Se resolvió modificando la función `handleDeleteTask` en App.tsx para que retornara `true` cuando se confirmaba la eliminación y `false` en caso contrario, permitiendo que useNavigate solo se ejecutara después de una eliminación exitosa.
