/**
 * Datos de ejemplo para el gestor de tareas
 * EC2 F2 A7 - Estado local, eventos y operaciones CRUD
 */
import { Task } from '../models/Task';

/**
 * Array de tareas semilla para demostrar el renderizado dinámico
 */
export const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Completar la Actividad 5 del Frontend',
    status: 'completed',
    createdAt: new Date('2024-01-10T09:00:00').toISOString(),
    updatedAt: new Date('2024-01-10T09:00:00').toISOString(),
  },
  {
    id: '2',
    title: 'Implementar interfaz Task en TypeScript',
    status: 'completed',
    createdAt: new Date('2024-01-11T10:30:00').toISOString(),
    updatedAt: new Date('2024-01-11T10:30:00').toISOString(),
  },
  {
    id: '3',
    title: 'Refactorizar TaskList con map() y keys',
    status: 'pending',
    createdAt: new Date('2024-01-11T11:00:00').toISOString(),
    updatedAt: new Date('2024-01-11T11:00:00').toISOString(),
  },
  {
    id: '4',
    title: 'Agregar renderizado condicional para estados vacíos',
    status: 'pending',
    createdAt: new Date('2024-01-11T11:30:00').toISOString(),
    updatedAt: new Date('2024-01-11T11:30:00').toISOString(),
  },
  {
    id: '5',
    title: 'Implementar estado local y eventos en React',
    status: 'pending',
    createdAt: new Date('2024-01-11T12:00:00').toISOString(),
    updatedAt: new Date('2024-01-11T12:00:00').toISOString(),
  },
];
