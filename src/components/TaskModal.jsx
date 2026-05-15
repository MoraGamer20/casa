import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATALOG_TASKS } from '../hooks/useTasks';
import './TaskModal.css';

export function TaskModal({ isOpen, onClose, onSave, taskToEdit, persons }) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [assigneeIds, setAssigneeIds] = useState([]);
  const [catalogItem, setCatalogItem] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title || '');
        setDifficulty(taskToEdit.difficulty || 5);
        const totalMin = taskToEdit.estimatedTime || 30;
        setHours(Math.floor(totalMin / 60));
        setMinutes(totalMin % 60);
        setAssigneeIds(taskToEdit.assigneeIds || []);
      } else {
        setTitle('');
        setDifficulty(5);
        setHours(0);
        setMinutes(30);
        setAssigneeIds([]);
      }
      setCatalogItem('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCatalogChange = (e) => {
    const val = e.target.value;
    setCatalogItem(val);
    if (val !== '') {
      const selected = CATALOG_TASKS.find(t => t.title === val);
      if (selected) {
        setTitle(selected.title);
        setDifficulty(selected.diff);
        const totalMin = selected.estimatedTime || 30;
        setHours(Math.floor(totalMin / 60));
        setMinutes(totalMin % 60);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const totalMinutes = (parseInt(hours) * 60) + parseInt(minutes);
    onSave({
      title: title.trim(),
      difficulty: parseInt(difficulty),
      estimatedTime: totalMinutes,
      assigneeIds: assigneeIds
    });
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {!taskToEdit && (
            <div className="form-group">
              <label>Catálogo</label>
              <select value={catalogItem} onChange={handleCatalogChange}>
                <option value="">-- Personalizada --</option>
                {CATALOG_TASKS.map((t, idx) => (
                  <option key={idx} value={t.title}>{t.title} ({t.diff} pts)</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Puntos ({difficulty})</label>
            <input type="range" min="1" max="20" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label>Tiempo Estimado</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Horas</span>
                <input type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>Minutos</span>
                <input type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Asignar a</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {persons.map(p => {
                const isSelected = assigneeIds.includes(p.id);
                return (
                  <button key={p.id} type="button" onClick={() => setAssigneeIds(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                    style={{ padding: '0.5rem', borderRadius: '20px', border: `2px solid ${isSelected ? p.color : '#ccc'}`, backgroundColor: isSelected ? p.color + '22' : 'transparent' }}>
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
