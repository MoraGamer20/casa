import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import './FamilyNotes.css';

export function FamilyNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addDoc(collection(db, 'notes'), {
        text: newNote,
        createdAt: serverTimestamp()
      });
      setNewNote('');
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <section className="family-notes glass">
      <div className="notes-header">
        <MessageSquare size={20} />
        <h3>Muro de Notas</h3>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-notes">No hay notas. ¡Deja un mensaje!</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-item animate-fade-in">
              <p className="note-text">{note.text}</p>
              <button className="note-delete" onClick={() => handleDelete(note.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <form className="notes-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Escribe una nota familiar..." 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button type="submit" className="btn-send">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}
