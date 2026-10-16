/**
 * Componente principal App
 * EC2 F1 A6 - Orquestación con estado y datos dinámicos
 */
import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskSummary } from './components/TaskSummary';
import { TaskList } from './components/TaskList';
import { AppFooter } from './components/AppFooter';
import { seedTasks } from './data/seedTasks';

function App() {
  // Estado: lista de tareas (inicializada con datos semilla)
  const [tasks] = useState(seedTasks);
  
  // Estado: filtro actual
  const [currentFilter, setCurrentFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  return (
    <div className="app-container">
      <AppHeader />

      <main className="main-content">
        <TaskForm />
        <TaskFilters 
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />
        <TaskSummary tasks={tasks} />
        <TaskList 
          tasks={tasks} 
          filterStatus={currentFilter}
        />
      </main>

      <AppFooter />
    </div>
  );
}

export default App;
