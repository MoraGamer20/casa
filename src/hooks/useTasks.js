import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase';

const DEFAULT_PERSONS = [
  { id: '1', name: 'Karol', color: 'var(--color-p1)' },
  { id: '2', name: 'Fátima', color: 'var(--color-p2)' },
  { id: '3', name: 'Kevin', color: 'var(--color-p3)' },
  { id: '4', name: 'Alejandro', color: 'var(--color-p4)' },
  { id: '5', name: 'Adela', color: 'var(--color-p5)' }
];

export const CATALOG_TASKS = [
  { title: 'Trabajar (Jornada)', diff: 15, estimatedTime: 480 },
  { title: 'Estudiar / Escuela', diff: 10, estimatedTime: 120 },
  { title: 'Recoger el cuarto de los niños', diff: 6, estimatedTime: 30 },
  { title: 'Recoger el cuarto de los papás', diff: 4, estimatedTime: 20 },
  { title: 'Barrer', diff: 5, estimatedTime: 25 },
  { title: 'Trapear', diff: 6, estimatedTime: 30 },
  { title: 'Sacudir muebles', diff: 3, estimatedTime: 15 },
  { title: 'Cocinar', diff: 10, estimatedTime: 60 },
  { title: 'Lavar trastes', diff: 7, estimatedTime: 25 },
  { title: 'Limpiar barras, tarja y cocina', diff: 3, estimatedTime: 15 },
  { title: 'Limpiar refrigerador', diff: 7, estimatedTime: 40 },
  { title: 'Organizar despensa', diff: 4, estimatedTime: 20 },
  { title: 'Lavar ropa', diff: 10, estimatedTime: 120 },
  { title: 'Tender ropa', diff: 10, estimatedTime: 30 },
  { title: 'Doblar ropa', diff: 4, estimatedTime: 20 },
  { title: 'Guardar ropa', diff: 3, estimatedTime: 15 },
  { title: 'Lavar baño', diff: 8, estimatedTime: 40 },
  { title: 'Vaciar botes de basura', diff: 2, estimatedTime: 10 },
  { title: 'Lavar la camioneta', diff: 7, estimatedTime: 60 },
  { title: 'Regar plantas', diff: 2, estimatedTime: 10 },
  { title: 'Limpiar cochera', diff: 6, estimatedTime: 35 },
  { title: 'Sacar basura', diff: 2, estimatedTime: 5 },
  { title: 'Mantenimiento general', diff: 9, estimatedTime: 60 },
  { title: 'Alimentar mascotas', diff: 2, estimatedTime: 5 },
  { title: 'Limpiar abanicos/aires acondicionados', diff: 7, estimatedTime: 40 },
  { title: 'Revisar productos de limpieza que faltan', diff: 3, estimatedTime: 10 }
];

const calculateFinalPoints = (task) => {
  if (!task) return 0;
  const diff = parseInt(task.difficulty || 0);
  if (!task.completedAt || !task.createdAt || !task.estimatedTime) return diff;

  const start = new Date(task.createdAt);
  const end = new Date(task.completedAt);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return diff;

  const elapsedMinutes = (end - start) / (1000 * 60);
  const estimated = parseInt(task.estimatedTime);

  if (elapsedMinutes <= estimated) {
    return Math.round(diff * 1.5);
  } else {
    const extraHours = Math.floor((elapsedMinutes - estimated) / 60);
    const final = diff - extraHours;
    return isNaN(final) ? diff : Math.max(0, final);
  }
};

export function useTasks() {
  const [persons, setPersons] = useState(() => {
    const saved = localStorage.getItem('home_persons_v2');
    return saved ? JSON.parse(saved) : DEFAULT_PERSONS;
  });

  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem('home_persons_v2', JSON.stringify(persons));
  }, [persons]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => {
        const data = doc.data();
        let ids = Array.isArray(data.assigneeIds) ? data.assigneeIds : (data.assigneeId ? [String(data.assigneeId)] : []);
        return { ...data, id: doc.id, assigneeIds: ids };
      });
      setTasks(tasksData);
    }, (error) => console.error("Firestore Tasks Error:", error));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'history'), (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        const dateA = new Date(a.resetAt || 0);
        const dateB = new Date(b.resetAt || 0);
        return dateB - dateA;
      });
      setHistory(historyData);
    }, (error) => console.error("Firestore History Error:", error));
    return () => unsubscribe();
  }, []);

  const addTask = async (taskData) => {
    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskData.title,
        difficulty: parseInt(taskData.difficulty || 5),
        estimatedTime: parseInt(taskData.estimatedTime || 30),
        assigneeIds: taskData.assigneeIds || [],
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const addTasksBatch = async (tasksArray) => {
    try {
      const batch = writeBatch(db);
      tasksArray.forEach(taskData => {
        const docRef = doc(collection(db, 'tasks'));
        batch.set(docRef, {
          title: taskData.title,
          difficulty: parseInt(taskData.difficulty || 5),
          estimatedTime: parseInt(taskData.estimatedTime || 30),
          assigneeIds: taskData.assigneeIds || [],
          status: 'pending',
          createdAt: new Date().toISOString(),
          completedAt: null
        });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error batch adding tasks:", error);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'tasks', id), updates);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (!id) {
      console.error("No se pudo eliminar: ID no encontrado");
      return;
    }
    if (!window.confirm('¿Eliminar esta tarea definitivamente?')) return;
    
    try {
      const docRef = doc(db, 'tasks', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error al eliminar la tarea de Firebase:", error);
      alert("No se pudo eliminar la tarea. Revisa tu conexión.");
    }
  };

  const resetWeekly = async () => {
    if (!confirm('¿Reiniciar puntos?')) return;
    try {
      const batch = writeBatch(db);
      const completedTasks = tasks.filter(t => t.status === 'completed');
      if (completedTasks.length > 0) {
        const historyRef = doc(collection(db, 'history'));
        batch.set(historyRef, {
          resetAt: new Date().toISOString(),
          tasks: completedTasks.map(t => ({
            title: t.title,
            difficulty: t.difficulty,
            estimatedTime: t.estimatedTime || 0,
            assigneeIds: t.assigneeIds,
            createdAt: t.createdAt || new Date().toISOString(),
            completedAt: t.completedAt
          }))
        });
        completedTasks.forEach(t => batch.delete(doc(db, 'tasks', t.id)));
        await batch.commit();
      }
    } catch (error) {
      console.error("Error resetting:", error);
    }
  };

  const getPointsByPerson = () => {
    const stats = {};
    persons.forEach(p => {
      stats[p.id] = { points: 0, tasksCompleted: 0, completedTasksList: [] };
    });

    tasks.forEach(t => {
      if (t && t.status === 'completed' && Array.isArray(t.assigneeIds)) {
        const finalDifficulty = calculateFinalPoints(t);
        const pointsPerPerson = t.assigneeIds.length > 0 ? Math.round(finalDifficulty / t.assigneeIds.length) : 0;
        
        t.assigneeIds.forEach(assigneeId => {
          if (stats[assigneeId]) {
            stats[assigneeId].points += pointsPerPerson;
            stats[assigneeId].tasksCompleted += 1;
            stats[assigneeId].completedTasksList.push({
              title: t.title,
              originalDiff: t.difficulty,
              finalDiff: finalDifficulty,
              pointsEarned: pointsPerPerson,
              sharedWith: t.assigneeIds.length - 1
            });
          }
        });
      }
    });
    return stats;
  };

  const getAccumulatedStats = () => {
    const accum = {};
    persons.forEach(p => { accum[p.id] = { points: 0, tasksCompleted: 0 }; });

    history.forEach(session => {
      if (session && Array.isArray(session.tasks)) {
        session.tasks.forEach(t => {
          if (t && Array.isArray(t.assigneeIds)) {
            const finalDifficulty = calculateFinalPoints(t);
            const pointsPerPerson = t.assigneeIds.length > 0 ? Math.round(finalDifficulty / t.assigneeIds.length) : 0;
            t.assigneeIds.forEach(id => {
              if (accum[id]) {
                accum[id].points += pointsPerPerson;
                accum[id].tasksCompleted += 1;
              }
            });
          }
        });
      }
    });
    return accum;
  };

  const toggleTaskStatus = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const isCompleting = task.status === 'pending';
    try {
      await updateDoc(doc(db, 'tasks', id), {
        status: isCompleting ? 'completed' : 'pending',
        completedAt: isCompleting ? new Date().toISOString() : null
      });

      if (isCompleting && window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']
        });
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return {
    persons, tasks, history, addTask, addTasksBatch, updateTask, 
    deleteTask, toggleTaskStatus, resetWeekly, getPointsByPerson, 
    getAccumulatedStats, getOverallProgress: () => {
      if (tasks.length === 0) return 0;
      return Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100);
    }
  };
}
