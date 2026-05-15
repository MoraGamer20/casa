import React, { useState } from 'react';
import { Trophy, CheckCircle, Clock, BarChart2, X, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';

export function Dashboard({ persons, tasks, stats, progress }) {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const sortedPersons = [...persons].sort((a, b) => {
    const pointsA = stats[a.id]?.points || 0;
    const pointsB = stats[b.id]?.points || 0;
    return pointsB - pointsA;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const chartData = persons.map(p => ({
    name: p.name,
    puntos: stats[p.id]?.points || 0,
    color: p.color,
    id: p.id
  })).sort((a, b) => b.puntos - a.puntos); // Sort by points for the chart too

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const personId = data.activePayload[0].payload.id;
      const person = persons.find(p => p.id === personId);
      if (person) setSelectedPerson(person);
    }
  };

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-stats">
        
        <div className="stat-card progress-card">
          <div className="stat-header">
            <h3>Progreso General</h3>
            <span className="progress-text">{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="task-counts mt-4 flex gap-4">
            <div className="flex items-center gap-2"><CheckCircle size={18} color="var(--success)"/> {completedCount} Completadas</div>
            <div className="flex items-center gap-2"><Clock size={18} color="var(--warning)"/> {pendingCount} Pendientes</div>
          </div>
        </div>

        <div className="stat-card leaderboard-card">
          <div className="stat-header">
            <h3 className="flex items-center gap-2"><Trophy size={20} color="var(--warning)"/> Leaderboard</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(Click para detalles)</span>
          </div>
          <div className="leaderboard-list">
    {sortedPersons.slice(0, 3).map((p, index) => {
              const personStats = stats[p.id] || { points: 0, tasksCompleted: 0 };
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div 
                  key={p.id} 
                  className="leaderboard-item" 
                  onClick={() => setSelectedPerson(p)}
                  style={{ cursor: 'pointer' }}
                  title="Ver desglose de puntos"
                >
                  <div className="flex items-center gap-2">
                    <div className="rank-badge" style={{ fontSize: '1.25rem' }}>
                      {medals[index] || index + 1}
                    </div>
                    <div className="person-avatar" style={{ backgroundColor: p.color }}>
                      {p.name.charAt(0)}
                    </div>
                    <span className="person-name">{p.name}</span>
                  </div>
                  <div className="points-badge">
                    {personStats.points} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="stat-card chart-card mt-4">
        <div className="stat-header">
          <h3 className="flex items-center gap-2"><BarChart2 size={20} color="var(--primary)"/> Rendimiento (Puntos)</h3>
        </div>
        <div className="chart-container" style={{ width: '100%', height: 250, cursor: 'pointer' }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} onClick={handleBarClick}>
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                cursor={{fill: 'rgba(0,0,0,0.05)'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
              />
              <Bar dataKey="puntos" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedPerson && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="person-avatar" style={{ backgroundColor: selectedPerson.color }}>
                  {selectedPerson.name.charAt(0)}
                </div>
                <h2>Desglose de {selectedPerson.name}</h2>
              </div>
              <button className="icon-btn" onClick={() => setSelectedPerson(null)}><X size={20} /></button>
            </div>
            
            <div className="breakdown-content" style={{ marginTop: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '1rem', backgroundColor: selectedPerson.color + '15', borderRadius: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: selectedPerson.color }}>
                  {stats[selectedPerson.id]?.points || 0}
                </span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>Puntos Totales</span>
              </div>

              {(!stats[selectedPerson.id]?.completedTasksList || stats[selectedPerson.id].completedTasksList.length === 0) ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>No ha completado ninguna tarea esta semana.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {stats[selectedPerson.id].completedTasksList.map((t, i) => (
                    <div key={i} style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' 
                    }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{t.title}</div>
                        {t.sharedWith > 0 && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Compartida con {t.sharedWith} {t.sharedWith === 1 ? 'persona' : 'personas'}
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', color: 'var(--success)', 
                        backgroundColor: 'var(--success)15', padding: '4px 8px', borderRadius: '12px',
                        fontSize: '14px'
                      }}>
                        +{t.pointsEarned}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
