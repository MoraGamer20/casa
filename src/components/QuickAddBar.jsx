import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { CATALOG_TASKS } from '../hooks/useTasks';
import { Check } from 'lucide-react';
import './QuickAddBar.css';

export function QuickAddBar({ persons, onSave }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [customDiff, setCustomDiff] = useState(5);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const options = CATALOG_TASKS.map(t => ({
    value: t.title,
    label: `${t.title} (${t.diff} pts, ${t.estimatedTime}m)`,
    diff: t.diff,
    estimatedTime: t.estimatedTime
  }));

  const handleChange = (newValue) => {
    setSelectedTask(newValue);
    if (newValue) {
      setCustomDiff(newValue.diff || 5);
      const totalMin = newValue.estimatedTime || 30;
      setCustomHours(Math.floor(totalMin / 60));
      setCustomMinutes(totalMin % 60);
    }
  };

  const handleSave = () => {
    if (!selectedTask) return;
    const totalMinutes = (parseInt(customHours) * 60) + parseInt(customMinutes);
    onSave({
      title: selectedTask.value,
      difficulty: parseInt(customDiff),
      estimatedTime: totalMinutes,
      assigneeIds: selectedAssignees
    });
    setSelectedTask(null);
    setCustomDiff(5);
    setCustomHours(0);
    setCustomMinutes(30);
    setSelectedAssignees([]);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      background: 'var(--white)',
      borderColor: 'var(--border-color)',
      color: 'var(--text-main)',
      borderRadius: '12px',
      minHeight: '44px'
    }),
    menu: (base) => ({
      ...base,
      background: 'var(--white)',
      border: '1px solid var(--border-color)',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'var(--primary-light)' : 'transparent',
      color: state.isFocused ? 'var(--primary)' : 'var(--text-main)',
      cursor: 'pointer'
    }),
    singleValue: (base) => ({ ...base, color: 'var(--text-main)' }),
    input: (base) => ({ ...base, color: 'var(--text-main)' }),
    placeholder: (base) => ({ ...base, color: 'var(--text-muted)' })
  };

  return (
    <div className="quick-add-bar-container">
      <div className="quick-add-inputs">
        <div className="select-wrapper">
          <CreatableSelect 
            isClearable 
            options={options} 
            value={selectedTask} 
            onChange={handleChange} 
            placeholder="Añadir tarea..." 
            styles={customStyles}
          />
        </div>
        {selectedTask && (
          <div className="time-pts-inputs animate-fade-in">
            <div className="input-mini">
              <span>Pts</span>
              <input type="number" value={customDiff} onChange={(e) => setCustomDiff(e.target.value)} />
            </div>
            <div className="input-mini">
              <span>Hrs</span>
              <input type="number" min="0" value={customHours} onChange={(e) => setCustomHours(e.target.value)} />
            </div>
            <div className="input-mini">
              <span>Min</span>
              <input type="number" min="0" max="59" value={customMinutes} onChange={(e) => setCustomMinutes(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div className="quick-add-footer">
        <div className="assignees-selector">
          {persons.map(p => {
            const isSelected = selectedAssignees.includes(p.id);
            return (
              <button 
                key={p.id} 
                onClick={() => setSelectedAssignees(prev => isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                className={`assignee-btn-full ${isSelected ? 'active' : ''}`}
                style={{ '--person-color': p.color }}
              >
                {isSelected && <Check size={12} />}
                {p.name}
              </button>
            );
          })}
        </div>
        <button className="btn-save-task" onClick={handleSave} disabled={!selectedTask}>
          Guardar Tarea
        </button>
      </div>
    </div>
  );
}
