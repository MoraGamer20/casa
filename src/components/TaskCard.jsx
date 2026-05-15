import React, { useState, useEffect } from 'react';
import { Check, Edit2, Trash2, Clock, AlertCircle, Zap } from 'lucide-react';
import './TaskCard.css';

export function TaskCard({ task, persons, onToggle, onEdit, onDelete }) {
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [potentialPoints, setPotentialPoints] = useState(0);

  const assigneeIds = task.assigneeIds || [];
  const assignees = persons.filter(p => assigneeIds.includes(p.id));
  const isCompleted = task.status === 'completed';

  const basePoints = parseInt(task.difficulty || 0);

  useEffect(() => {
    if (isCompleted || !task.createdAt || !task.estimatedTime) {
      setTimeLeftStr('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(task.createdAt);
      const limit = new Date(start.getTime() + task.estimatedTime * 60000);
      const diffMs = limit - now;
      
      const absDiff = Math.abs(diffMs);
      const minutes = Math.floor(absDiff / 60000);
      const seconds = Math.floor((absDiff % 60000) / 1000);
      const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if (diffMs > 0) {
        setTimeLeftStr(formattedTime);
        setIsOverdue(false);
        setPotentialPoints(Math.round(basePoints * 1.5));
      } else {
        setTimeLeftStr(formattedTime);
        setIsOverdue(true);
        const extraHours = Math.floor(absDiff / 3600000);
        setPotentialPoints(Math.max(0, basePoints - extraHours));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [task.createdAt, task.estimatedTime, isCompleted, basePoints]);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (task.id) {
      onDelete(task.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''} ${isOverdue && !isCompleted ? 'overdue' : ''}`}>
      <div className="task-card-header">
        <div className="task-title-group">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-meta-compact">
             <Clock size={12} /> {task.estimatedTime}m • {isCompleted ? 'Completada' : 'En curso'}
          </div>
        </div>
        <div className="task-actions">
          <button className="icon-btn edit-btn" onClick={handleEdit} title="Editar">
            <Edit2 size={16} />
          </button>
          <button className="icon-btn delete-btn" onClick={handleDelete} title="Eliminar">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="task-main-content">
        <div className="points-display-container">
          <div className={`points-circle ${isOverdue && !isCompleted ? 'overdue' : ''} ${isCompleted ? 'completed' : ''}`}>
            <span className="points-value">{isCompleted ? (task.finalDiff || basePoints) : potentialPoints}</span>
            <span className="points-label">pts</span>
          </div>
          {!isCompleted && (
            <div className="points-bonus-tag">
              {isOverdue ? (
                <span className="delay-warning">Penalización activa</span>
              ) : (
                <span className="bonus-active"><Zap size={12} /> Bono 1.5x</span>
              )}
            </div>
          )}
        </div>

        {!isCompleted && timeLeftStr && (
          <div className={`timer-badge ${isOverdue ? 'overdue' : 'active'}`}>
            {isOverdue ? <AlertCircle size={16} /> : <Clock size={16} />}
            <span className="timer-text">{timeLeftStr}</span>
            <span className="timer-status">{isOverdue ? 'RETRASO' : 'RESTANTE'}</span>
          </div>
        )}
      </div>

      <div className="task-footer-info">
        <div className="assignees-list-full">
          {assignees.map(a => (
            <div key={a.id} className="assignee-tag-full" style={{ borderLeft: `4px solid ${a.color}` }}>
              {a.name}
            </div>
          ))}
          {assignees.length === 0 && <span className="unassigned-text">Sin asignar</span>}
        </div>
        
        <button className={`btn-complete-new ${isCompleted ? 'done' : ''}`} onClick={() => onToggle(task.id)}>
          {isCompleted ? <><Check size={18} /> Lista</> : 'Completar'}
        </button>
      </div>
    </div>
  );
}
