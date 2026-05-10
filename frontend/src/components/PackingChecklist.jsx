import React, { useState, useEffect } from 'react';
import Header from './Header';
import { packingApi, tripsApi } from '../api/client';

export default function PackingChecklist() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 1 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      fetchItems(selectedTripId);
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const res = await tripsApi.getAll();
      setTrips(res.data);
      if (res.data.length > 0) {
        setSelectedTripId(res.data[0].id.toString());
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load trips.');
      setLoading(false);
    }
  };

  const fetchItems = async (tripId) => {
    setLoading(true);
    try {
      const res = await packingApi.getAll(tripId);
      setItems(res.data);
    } catch (err) {
      setError('Failed to load packing items.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (item) => {
    try {
      const res = await packingApi.update(selectedTripId, item.id, { is_packed: !item.is_packed });
      setItems(items.map(i => i.id === item.id ? res.data : i));
    } catch (err) {
      setError('Failed to update item.');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return;
    setSaving(true);
    try {
      const res = await packingApi.create(selectedTripId, {
        name: newItem.name,
        category: newItem.category || null,
        quantity: newItem.quantity || 1,
      });
      setItems([...items, res.data]);
      setNewItem({ name: '', category: '', quantity: 1 });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await packingApi.delete(selectedTripId, itemId);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm('Reset all packing items?')) return;
    try {
      await packingApi.resetAll(selectedTripId);
      setItems([]);
    } catch (err) {
      setError('Failed to reset items.');
    }
  };

  // Group items by category
  const categories = {};
  items.forEach(item => {
    const cat = item.category || 'Uncategorized';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  const totalItems = items.length;
  const packedItems = items.filter(i => i.is_packed).length;
  const progressPercentage = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search checklist..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">Packing checklist</h1>
        
        <div className="mb-6 relative w-full sm:w-1/2">
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

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        {totalItems > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-600">Progress: {packedItems}/{totalItems} items packed</span>
              <span className="text-sm font-bold text-indigo-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Add Item Form */}
            {showAddForm && (
              <form onSubmit={handleAddItem} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Item name..."
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                    className="sm:col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <input
                    type="text"
                    placeholder="Category (e.g. Documents)"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 text-slate-600 font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400">
                    {saving ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-6 mb-10">
              {Object.keys(categories).length === 0 && selectedTripId && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <p className="text-4xl mb-3">🎒</p>
                  <p className="text-slate-500 font-medium">No packing items yet. Add some!</p>
                </div>
              )}
              {Object.entries(categories).map(([categoryName, categoryItems]) => {
                const catPacked = categoryItems.filter(i => i.is_packed).length;
                const catTotal = categoryItems.length;
                return (
                  <div key={categoryName} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="font-bold text-slate-800">{categoryName}</h2>
                      <span className="text-sm font-semibold text-slate-500">{catPacked}/{catTotal}</span>
                    </div>
                    <div className="p-4 sm:p-6 space-y-3">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between group">
                          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors flex-1">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                checked={item.is_packed} 
                                onChange={() => toggleItem(item)}
                                className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                              />
                              <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className={`text-slate-700 font-medium transition-all ${item.is_packed ? 'line-through text-slate-400' : 'group-hover:text-indigo-600'}`}>
                              {item.name} {item.quantity > 1 ? `(×${item.quantity})` : ''}
                            </span>
                          </label>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                + add item to checklist
              </button>
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={handleResetAll}
                  className="flex-1 sm:flex-none px-8 py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Reset all
                </button>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
