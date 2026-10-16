/**
 * Datos de ejemplo para el gestor de tareas
 * EC2 F1 A6 - Modelado y renderizado dinámico
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
    createdAt: new Date('2024-01-10T09:00:00'),
  },
  {
    id: '2',
    title: 'Implementar interfaz Task en TypeScript',
    status: 'completed',
    createdAt: new Date('2024-01-11T10:30:00'),
  },
  {
    id: '3',
    title: 'Refactorizar TaskList con map() y keys',
    status: 'in-progress',
    createdAt: new Date('2024-01-11T11:00:00'),
  },
  {
    id: '4',
    title: 'Agregar renderizado condicional para estados vacíos',
    status: 'in-progress',
    createdAt: new Date('2024-01-11T11:30:00'),
  },
  {
    id: '5',
    title: 'Implementar filtrado dinámico de tareas',
    status: 'pending',
    createdAt: new Date('2024-01-11T12:00:00'),
  },
  {
    id: '6',
    title: 'Estudiar para el examen de Matemática Discreta',
    status: 'pending',
    createdAt: new Date('2024-01-12T08:00:00'),
  },
  {
    id: '7',
    title: 'Revisar documentación de React hooks',
    status: 'in-progress',
    createdAt: new Date('2024-01-12T14:00:00'),
  },
  {
    id: '8',
    title: 'Preparar presentación del proyecto final',
    status: 'pending',
    createdAt: new Date('2024-01-13T09:00:00'),
  },
  {
    id: '9',
    title: 'Configurar ESLint y TypeScript en el proyecto',
    status: 'completed',
    createdAt: new Date('2024-01-09T16:00:00'),
  },
  {
    id: '10',
    title: 'Hacer ejercicios de algoritmos en LeetCode',
    status: 'pending',
    createdAt: new Date('2024-01-14T10:00:00'),
  },
  {
    id: '11',
    title: 'Actualizar el README con instrucciones de instalación',
    status: 'completed',
    createdAt: new Date('2024-01-10T15:00:00'),
  },
  {
    id: '12',
    title: 'Investigar patrones de diseño en React',
    status: 'in-progress',
    createdAt: new Date('2024-01-13T11:00:00'),
  },
];
