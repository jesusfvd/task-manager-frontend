# Administrador de tareas Frontend

Aplicación desarrollada con React, TypeScript, Vite, React Router y PNPM.

## Funciones actuales

- Navegación SPA.
- Página de inicio.
- Administración de tareas.
- Detalle mediante una ruta dinámica.
- Página 404.
- Operaciones CRUD.
- Validación de títulos.
- Búsqueda, filtros y ordenamiento.
- Persistencia mediante localStorage.
- Interfaz adaptable.

## Rutas

- `/` - Página de inicio
- `/tasks` - Administración de tareas
- `/tasks/:taskId` - Detalle de una tarea
- `*` - Página 404

## Ejecución

```bash
pnpm install
pnpm dev
```

## Validación técnica

```bash
pnpm lint
pnpm build
```

## Alcance

Esta versión utiliza almacenamiento local. La API REST se integrará en la Actividad 10.
