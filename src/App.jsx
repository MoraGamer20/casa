import React, { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { Dashboard } from './components/Dashboard';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { QuickAddBar } from './components/QuickAddBar';
import { Roulette } from './components/Roulette';
import { FamilyNotes } from './components/FamilyNotes';
import { FamilyHistory } from './components/FamilyHistory';
import { Plus, RefreshCcw, Filter, Moon, Sun } from 'lucide-react';
import './App.css';

function App() {
  const { 
    persons, 
    tasks, 
    history,
    addTask, 
    addTasksBatch,
    updateTask, 
    deleteTask, 
    toggleTaskStatus, 
    resetWeekly,
    getPointsByPerson,
    getAccumulatedStats,
    getOverallProgress
  } = useTasks();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filterPerson, setFilterPerson] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = harder first
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const stats = getPointsByPerson();
  const progress = getOverallProgress();

  const handleOpenModal = (task = null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  let filteredTasks = tasks.filter(t => {
    const assigneeIds = t.assigneeIds || (t.assigneeId ? [t.assigneeId] : []);
    
    if (filterPerson !== 'all') {
      if (filterPerson === '') {
        if (assigneeIds.length > 0) return false;
      } else {
        if (!assigneeIds.includes(filterPerson)) return false;
      }
    }
    
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (sortOrder === 'desc') return b.difficulty - a.difficulty;
    return a.difficulty - b.difficulty;
  });

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días, familia!';
    if (hour < 18) return '¡Buenas tardes, equipo!';
    return '¡Buenas noches, casa!';
  };

  const inspirationalMessages = [
    "Un hogar limpio es un hogar feliz. ✨",
    "Pequeñas acciones hacen grandes cambios. 💪",
    "¡Hoy es un gran día para colaborar! 🤝",
    "El trabajo en equipo hace el sueño realidad. 🏠",
    "¡Dale con todo, familia! 🚀"
  ];
  
  const [randomMsg] = useState(() => inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <p className="subtitle" style={{ fontWeight: '600', color: 'var(--primary)', marginBottom: '0.25rem' }}>{getTimeGreeting()}</p>
          <h1>Home Tasks</h1>
          <p className="subtitle">{randomMsg}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline icon-only" onClick={toggleTheme} title="Cambiar Tema">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="btn btn-outline" onClick={resetWeekly} title="Reinicio Semanal">
            <RefreshCcw size={18} />
            <span className="hidden-mobile">Reinicio</span>
          </button>
        </div>
      </header>

      <main>
        <Dashboard 
          persons={persons} 
          tasks={tasks} 
          stats={stats} 
          progress={progress} 
        />

        <FamilyNotes />

        <div className="tasks-section">
          <QuickAddBar persons={persons} onSave={handleSaveTask} />
          
          <div className="tasks-header" style={{ marginTop: '1.5rem' }}>
            <h2>Tareas Activas</h2>
          </div>

          <div className="filters-bar">
            <div className="filter-group">
              <Filter size={16} color="var(--text-muted)" />
              <select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)}>
                <option value="all">Todas las personas</option>
                <option value="">Sin asignar</option>
                {persons.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="completed">Completadas</option>
              </select>

              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="desc">Más difíciles primero</option>
                <option value="asc">Más fáciles primero</option>
              </select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No hay tareas que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  persons={persons}
                  onToggle={toggleTaskStatus}
                  onEdit={handleOpenModal}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        persons={persons}
      />

      <Roulette persons={persons} onBatchSave={addTasksBatch} />
      
      <FamilyHistory 
        history={history} 
        persons={persons} 
        accumulatedStats={getAccumulatedStats()} 
      />
    </div>

  );
}

export default App;
