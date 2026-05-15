import React, { useState } from 'react';
import { History, Calendar, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import './FamilyHistory.css';

export function FamilyHistory({ history, persons, accumulatedStats }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const hasHistory = history && history.length > 0;
  const totalAccumulatedPoints = Object.values(accumulatedStats).reduce((acc, s) => acc + s.points, 0);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <div className={`family-history-container glass ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="history-main-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-3">
          <Trophy size={28} className="icon-gold" />
          <div>
            <h2>Historial y Tabla General</h2>
            <p className="subtitle">Progreso acumulado: {totalAccumulatedPoints} pts</p>
          </div>
        </div>
        <div className="toggle-icon">
          {isCollapsed ? <ChevronDown size={28} /> : <ChevronUp size={28} />}
        </div>
      </div>

      {!isCollapsed && (
        <div className="history-content animate-slide-down">
          <section className="accumulated-section">
            <div className="inner-header">
              <h3>Suma Total de Puntos</h3>
              <p>Incluye historial y tareas completadas hoy</p>
            </div>
            
            <div className="accumulated-table-wrapper">
              <table className="accumulated-table">
                <thead>
                  <tr>
                    <th>Integrante</th>
                    <th>Tareas</th>
                    <th>Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {persons.map(p => {
                    const stats = accumulatedStats[p.id] || { points: 0, tasksCompleted: 0 };
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="person-info">
                            <div className="avatar" style={{ backgroundColor: p.color }}>
                              {p.name.charAt(0)}
                            </div>
                            <span className="name">{p.name}</span>
                          </div>
                        </td>
                        <td>{stats.tasksCompleted}</td>
                        <td className="points-cell">{stats.points} pts</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="history-log-section">
            <div className="inner-header">
              <h3>Log de Días Pasados</h3>
            </div>

            {!hasHistory ? (
              <div className="empty-history">
                <p>No hay sesiones archivadas todavía. Pulsa "Reinicio" para archivar el día actual.</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map(session => (
                  <div key={session.id} className="history-session">
                    <div className="session-date">
                      <Calendar size={16} />
                      <span>{formatDate(session.resetAt)}</span>
                    </div>
                    
                    <div className="session-summary">
                      {persons.map(p => {
                        let sessionPoints = 0;
                        let sessionTasks = 0;
                        session.tasks.forEach(t => {
                          if (t.assigneeIds.includes(p.id)) {
                            sessionPoints += Math.round(t.difficulty / t.assigneeIds.length);
                            sessionTasks += 1;
                          }
                        });

                        if (sessionTasks === 0) return null;

                        return (
                          <div key={p.id} className="person-session-mini">
                            <div className="mini-avatar" style={{ backgroundColor: p.color }}>
                              {p.name.charAt(0)}
                            </div>
                            <span className="mini-points">{sessionPoints} pts</span>
                          </div>
                        );
                      })}
                    </div>

                    <details className="session-details">
                      <summary>Ver tareas realizadas</summary>
                      <ul className="history-tasks-list">
                        {session.tasks.map((t, idx) => (
                          <li key={idx}>
                            <span className="task-name">{t.title}</span>
                            <div className="task-meta">
                              <span className="task-points">{t.difficulty} pts</span>
                              <div className="task-assignees">
                                {t.assigneeIds.map(id => {
                                  const person = persons.find(per => per.id === id);
                                  return person ? (
                                    <div key={id} className="tiny-avatar" style={{ backgroundColor: person.color }}>
                                      {person.name.charAt(0)}
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
