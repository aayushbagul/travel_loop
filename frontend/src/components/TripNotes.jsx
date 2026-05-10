import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { notesApi, tripsApi } from '../api/client';

export default function TripNotes() {
  const { tripId: paramTripId } = useParams();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(paramTripId || '');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add note form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  // Edit note
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      fetchNotes(selectedTripId);
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const res = await tripsApi.getAll();
      setTrips(res.data);
      if (!selectedTripId && res.data.length > 0) {
        setSelectedTripId(res.data[0].id.toString());
      }
    } catch (err) {
      setError('Failed to load trips.');
    }
  };

  const fetchNotes = async (tripId) => {
    setLoading(true);
    try {
      const res = await notesApi.getAll(tripId);
      setNotes(res.data);
    } catch (err) {
      setError('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return;
    setSaving(true);
    try {
      const res = await notesApi.create(selectedTripId, newNote);
      setNotes([res.data, ...notes]);
      setNewNote({ title: '', content: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add note.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!selectedTripId || !editingNote) return;
    setSaving(true);
    try {
      const res = await notesApi.update(selectedTripId, editingNote.id, {
        title: editingNote.title,
        content: editingNote.content,
      });
      setNotes(notes.map(n => n.id === editingNote.id ? res.data : n));
      setEditingNote(null);
    } catch (err) {
      setError('Failed to update note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesApi.delete(selectedTripId, noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      setError('Failed to delete note.');
    }
  };

  const selectedTrip = trips.find(t => t.id.toString() === selectedTripId.toString());

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Trip notes</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <select 
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold cursor-pointer"
            >
              <option value="">Select a trip...</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>Trip: {t.title}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <button 
            onClick={() => { setShowAddForm(true); setEditingNote(null); }}
            className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shrink-0"
          >
            + Add Note
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        {/* Add Note Form */}
        {showAddForm && (
          <form onSubmit={handleAddNote} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm mb-6 space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold"
            />
            <textarea
              placeholder="Note content..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              required
              rows="3"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 text-slate-600 font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400">
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        )}

        {/* Edit Note Form */}
        {editingNote && (
          <form onSubmit={handleUpdateNote} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm mb-6 space-y-4">
            <p className="text-sm font-bold text-amber-600">Editing note</p>
            <input
              type="text"
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold"
            />
            <textarea
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              required
              rows="3"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditingNote(null)} className="px-5 py-2 text-slate-600 font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400">
                {saving ? 'Updating...' : 'Update Note'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.length === 0 && selectedTripId && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <p className="text-4xl mb-3">📝</p>
                <p className="text-slate-500 font-medium">No notes yet for this trip.</p>
              </div>
            )}
            {notes.map(note => (
              <div key={note.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingNote({ ...note }); setShowAddForm(false); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors" 
                    title="Edit Note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors" 
                    title="Delete Note"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-800 pr-20">{note.title}</h3>
                <p className="text-slate-600 mt-2">{note.content}</p>
                <p className="text-slate-400 text-sm font-semibold mt-4">
                  {new Date(note.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
