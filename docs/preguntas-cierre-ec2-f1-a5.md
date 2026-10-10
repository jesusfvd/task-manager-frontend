# Preguntas de cierre - EC2 F1 A5

## 1. ¿Qué problema resuelve React al construir una interfaz?

React resuelve el problema de mantener la interfaz de usuario sincronizada con los datos de la aplicación. En lugar de manipular directamente el DOM, React permite describir cómo debería verse la interfaz en función del estado actual, y se encarga automáticamente de actualizar solo las partes necesarias cuando los datos cambian. Además, facilita la organización del código mediante componentes reutilizables e independientes.

## 2. ¿Qué es un componente?

Un componente es una función de JavaScript/TypeScript que retorna elementos de interfaz (TSX/JSX). Es una pieza reutilizable y auto-contenida de la UI que encapsula su propia estructura, lógica y presentación. Los componentes permiten dividir la interfaz en partes más pequeñas y manejables, facilitando el desarrollo, mantenimiento y reutilización del código.

## 3. ¿Por qué los componentes comienzan con mayúscula?

Los componentes comienzan con mayúscula (PascalCase) para que React pueda distinguirlos de los elementos HTML nativos. Esta convención es necesaria porque en TSX/JSX, las etiquetas que comienzan con minúscula son tratadas como elementos HTML estándar (como `<div>`, `<button>`), mientras que las que comienzan con mayúscula son reconocidas como componentes personalizados de React.

## 4. ¿Qué diferencia existe entre HTML y TSX?

Las principales diferencias son:
- TSX usa `className` en lugar de `class` (porque `class` es una palabra reservada en JavaScript)
- TSX usa `htmlFor` en lugar de `for` en las etiquetas `<label>`
- En TSX todas las etiquetas deben cerrarse, incluso las auto-cerradas como `<input />` o `<br />`
- TSX permite insertar expresiones de JavaScript usando llaves `{}`
- TSX requiere que los atributos numéricos o booleanos se pasen entre llaves, por ejemplo `maxLength={120}`

## 5. ¿Para qué se utiliza className?

`className` se utiliza para asignar clases CSS a los elementos en TSX. Es el equivalente al atributo `class` de HTML, pero se usa este nombre alternativo porque `class` es una palabra reservada en JavaScript (usada para definir clases). Permite aplicar estilos CSS y mantener la separación entre estructura y presentación.

## 6. ¿Qué son las propiedades o props?

Las propiedades (props) son el mecanismo que permite pasar información desde un componente padre hacia un componente hijo. Son valores que se envían a un componente cuando se utiliza, similar a los parámetros de una función. Las props permiten que los componentes sean configurables y reutilizables, ya que el mismo componente puede renderizar diferentes resultados dependiendo de las props que reciba.

## 7. ¿Cómo ayuda TypeScript a validar las propiedades?

TypeScript ayuda a validar las propiedades mediante la definición de interfaces o tipos que especifican qué propiedades debe recibir un componente, qué tipo de dato debe tener cada una, y cuáles son obligatorias u opcionales. Esto permite detectar errores en tiempo de desarrollo antes de ejecutar la aplicación, como cuando se envía un tipo de dato incorrecto, falta una propiedad requerida, o se pasa una propiedad que no existe. El autocompletado del editor también mejora significativamente.

## 8. ¿Cuál es la responsabilidad de App.tsx?

App.tsx actúa como el componente raíz o coordinador principal de la aplicación. Su responsabilidad es organizar y componer los demás componentes en la estructura general de la interfaz, definiendo cómo se relacionan entre sí y en qué orden aparecen. Es el punto de entrada donde se ensambla la aplicación completa a partir de componentes más pequeños.

## 9. ¿Por qué la interfaz se dividió en varios componentes?

La interfaz se dividió en varios componentes para:
- **Responsabilidad única**: Cada componente tiene una función específica y bien definida
- **Reutilización**: Componentes como TaskItem pueden usarse múltiples veces con diferentes datos
- **Mantenibilidad**: Es más fácil encontrar y modificar código cuando está organizado en archivos pequeños
- **Legibilidad**: El código es más fácil de entender cuando está separado lógicamente
- **Testeo**: Los componentes individuales son más fáciles de probar de forma aislada
- **Escalabilidad**: Facilita el crecimiento de la aplicación sin que el código se vuelva inmanejable

## 10. ¿Por qué los botones todavía están deshabilitados?

Los botones están deshabilitados porque esta actividad se enfoca únicamente en construir la estructura visual estática de la aplicación mediante componentes y propiedades tipadas. Las funcionalidades interactivas como agregar, editar, completar o eliminar tareas requieren el uso de estado (useState), eventos y manejo de formularios, conceptos que se incorporarán en las actividades posteriores del curso.

## 11. ¿Qué componente consideras más reutilizable y por qué?

El componente **TaskItem** es el más reutilizable porque:
- Está diseñado para representar cualquier tarea independientemente de su contenido
- Recibe sus datos mediante props (title, status), por lo que puede mostrar diferentes tareas sin modificar su código interno
- Se utiliza múltiples veces en TaskList con diferentes valores
- Tiene una responsabilidad clara y acotada: mostrar una tarea individual
- No depende de datos específicos codificados internamente (hardcoded)
- Su estructura es genérica y puede adaptarse a cualquier tarea del sistema

## 12. ¿Qué dificultad encontraste y cómo la resolviste?

Una dificultad inicial fue entender la diferencia entre HTML y TSX, especialmente el uso de `className` en lugar de `class` y la necesidad de cerrar todas las etiquetas. Esto generaba errores de compilación que no eran inmediatamente obvios. La solución fue:
- Revisar cuidadosamente los mensajes de error de TypeScript y ESLint
- Consultar la documentación oficial de React sobre TSX
- Practicar la sintaxis correcta en cada componente
- Utilizar el autocompletado del editor para evitar errores de tipeo

Otra dificultad fue organizar correctamente la estructura de carpetas y asegurarme de que las importaciones fueran correctas. Esto se resolvió siguiendo la guía paso a paso y verificando que cada componente se importara y exportara correctamente antes de continuar con el siguiente.
