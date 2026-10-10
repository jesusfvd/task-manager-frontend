# Administrador de tareas - Frontend

Aplicación desarrollada durante el elemento de competencia 2
de Diseño Frontend con Frameworks.

## Tecnologías

- React
- TypeScript
- Vite
- PNPM
- CSS

## Alcance actual

La versión actual contiene la estructura visual del Administrador
de tareas y tres tareas de demostración. Los formularios, filtros
y acciones todavía no tienen comportamiento.

## Instalación

```bash
pnpm install
```

## Ejecución

```bash
pnpm dev
```

## Compilación

```bash
pnpm build
```

## Análisis estático

```bash
pnpm lint
```

## Componentes principales

- **AppHeader**: Encabezado con título y descripción de la aplicación
- **TaskForm**: Formulario visual para registro de nuevas tareas
- **TaskFilters**: Controles de búsqueda, filtrado y ordenamiento
- **TaskSummary**: Resumen estadístico con contadores de tareas
- **TaskList**: Contenedor de la lista de tareas
- **TaskItem**: Componente reutilizable para representar cada tarea
- **AppFooter**: Pie de página con nombre del curso (desafío individual)

## Estructura del proyecto

```
task-manager-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── AppFooter.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskSummary.tsx
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Características implementadas

- ✅ Proyecto independiente de GIFinder
- ✅ Configuración con React, TypeScript y Vite
- ✅ Gestión de dependencias con PNPM
- ✅ Organización mediante componentes separados
- ✅ Uso de propiedades tipadas con TypeScript
- ✅ Sintaxis TSX correcta (className, htmlFor, llaves para expresiones)
- ✅ Composición de componentes en App.tsx
- ✅ Tres tareas de demostración (1 completada, 2 pendientes)
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Botones deshabilitados (funcionalidad pendiente para siguientes actividades)
- ✅ Desafío individual: AppFooter con propiedad tipada

## Pendiente para próximas actividades

- Estado mediante useState
- Eventos personalizados y formularios controlados
- Operaciones CRUD
- Arreglos tipados y renderizado mediante map
- Persistencia local
- Consumo de API REST
- MongoDB Atlas y autenticación

## Autor

Estudiante de Diseño Frontend con Frameworks - EC2 F1 A5
