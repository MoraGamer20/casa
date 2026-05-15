import React, { useState } from 'react';
import { CATALOG_TASKS } from '../hooks/useTasks';
import { Dices, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import './Roulette.css';

export function Roulette({ persons, onBatchSave }) {
  const [activePersons, setActivePersons] = useState(
    persons.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
  );
  const [selectedTasks, setSelectedTasks] = useState({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const togglePerson = (id) => {
    setActivePersons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTask = (title) => {
    setSelectedTasks(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const getActivePersonsList = () => persons.filter(p => activePersons[p.id]);
  const getSelectedTasksList = () => CATALOG_TASKS.filter(t => selectedTasks[t.title]);

  const handleSpin = () => {
    const participants = getActivePersonsList();
    const tasksToAssign = getSelectedTasksList();

    if (participants.length === 0) {
      alert('Debes seleccionar al menos un participante.');
      return;
    }
    if (tasksToAssign.length === 0) {
      alert('Debes seleccionar al menos una tarea del catálogo.');
      return;
    }

    setIsSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      const sortedTasks = [...tasksToAssign].sort((a, b) => b.diff - a.diff);
      const buckets = participants.map(p => ({
        person: p,
        totalPoints: 0,
        assignedTasks: []
      }));

      sortedTasks.forEach(task => {
        for (let i = buckets.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [buckets[i], buckets[j]] = [buckets[j], buckets[i]];
        }
        buckets.sort((a, b) => a.totalPoints - b.totalPoints);
        buckets[0].assignedTasks.push(task);
        buckets[0].totalPoints += task.diff;
      });

      const finalTasks = [];
      buckets.forEach(b => {
        b.assignedTasks.forEach(t => {
          finalTasks.push({
            title: t.title,
            difficulty: t.diff,
            assigneeId: b.person.id
          });
        });
      });

      setSpinResult({ buckets, finalTasks });
      setIsSpinning(false);
    }, 2000);
  };

  const handleAccept = () => {
    if (spinResult) {
      onBatchSave(spinResult.finalTasks);
      setSelectedTasks({});
      setSpinResult(null);
      setIsCollapsed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setSpinResult(null);
  };

  return (
    <div className={`roulette-container glass animate-fade-in ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="roulette-main-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-3">
          <Dices size={28} className="header-icon" />
          <div>
            <h2>Repartidor Automático (Ruleta)</h2>
            <p className="subtitle">Selecciona hoy y reparte de forma justa</p>
          </div>
        </div>
        <div className="toggle-icon">
          {isCollapsed ? <ChevronDown size={28} /> : <ChevronUp size={28} />}
        </div>
      </div>

      {!isCollapsed && (
        <div className="roulette-content animate-slide-down">
          <div className="roulette-section">
            <h3>1. ¿Quiénes participan hoy?</h3>
            <div className="persons-toggles">
              {persons.map(p => {
                const isActive = activePersons[p.id];
                return (
                  <button 
                    key={p.id}
                    className={`person-toggle ${isActive ? 'active' : ''}`}
                    style={{ '--btn-color': p.color }}
                    onClick={(e) => { e.stopPropagation(); togglePerson(p.id); }}
                  >
                    <div className="avatar">{p.name.charAt(0)}</div>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="roulette-section">
            <h3>2. ¿Qué hay que hacer hoy?</h3>
            <div className="tasks-grid-selection">
              {CATALOG_TASKS.map(t => {
                const isSelected = selectedTasks[t.title];
                let diffColor = 'var(--success)';
                if (t.diff >= 4) diffColor = 'var(--primary)';
                if (t.diff >= 7) diffColor = 'var(--warning)';
                if (t.diff >= 9) diffColor = 'var(--danger)';

                return (
                  <div 
                    key={t.title} 
                    className={`task-checkbox-card ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleTask(t.title); }}
                    style={{ borderColor: isSelected ? diffColor : 'transparent' }}
                  >
                    <div className="check-indicator" style={{ backgroundColor: isSelected ? diffColor : 'var(--bg-color)' }}>
                      {isSelected && <Check size={14} color="white" />}
                    </div>
                    <div className="task-info">
                      <span className="title">{t.title}</span>
                      <span className="diff-pts" style={{ color: diffColor }}>{t.diff} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="roulette-actions">
            <button 
              className="btn-spin" 
              onClick={(e) => { e.stopPropagation(); handleSpin(); }}
              disabled={isSpinning}
            >
              {isSpinning ? 'Calculando reparto...' : '¡Girar Ruleta!'}
            </button>
          </div>
        </div>
      )}

      {isSpinning && (
        <div className="spin-overlay">
          <div className="spinner">
            <Dices size={64} color="white" className="spin-icon" />
            <h2>Sorteando de forma justa...</h2>
          </div>
        </div>
      )}

      {spinResult && !isSpinning && (
        <div className="spin-result-overlay animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="spin-result-modal">
            <h2>¡Reparto Completado!</h2>
            <div className="result-buckets">
              {spinResult.buckets.map(b => (
                <div key={b.person.id} className="result-bucket">
                  <div className="bucket-header" style={{ backgroundColor: b.person.color }}>
                    <span className="name">{b.person.name}</span>
                    <span className="total-pts">{b.totalPoints} pts</span>
                  </div>
                  <ul className="bucket-tasks">
                    {b.assignedTasks.length === 0 ? (
                      <li className="empty-tasks">¡Hoy descansa!</li>
                    ) : (
                      b.assignedTasks.map(t => (
                        <li key={t.title}>
                          <span>{t.title}</span>
                          <span className="pts">{t.diff}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))}
            </div>
            <div className="result-actions">
              <button className="btn btn-outline" onClick={handleCancel}>
                <X size={18} /> Descartar y re-intentar
              </button>
              <button className="btn btn-primary" onClick={handleAccept}>
                <Check size={18} /> Aceptar y enviar al Tablero
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
