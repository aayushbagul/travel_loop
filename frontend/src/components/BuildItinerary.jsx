import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { stopsApi, tripsApi, citiesApi } from '../api/client';

export default function BuildItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([
    { id: Date.now(), title: 'Stop 1', description: '', startDate: '', endDate: '', budget: '', city_id: '', isNew: true },
  ]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  const fetchTripData = async () => {
    setLoading(true);
    try {
      const [tripRes, citiesRes] = await Promise.all([
        tripsApi.getById(tripId),
        citiesApi.getAll()
      ]);
      setTrip(tripRes.data);
      setCities(citiesRes.data);

      const stopsRes = await stopsApi.getAll(tripId);
      if (stopsRes.data.length > 0) {
        setSections(stopsRes.data.map((stop, i) => ({
          id: stop.id,
          title: stop.city?.name ? `Stop ${i + 1}: ${stop.city.name}` : `Stop ${i + 1}`,
          description: stop.notes || '',
          startDate: stop.start_date || '',
          endDate: stop.end_date || '',
          budget: '',
          city_id: stop.city_id,
          isNew: false,
        })));
      }
    } catch (err) {
      setError('Failed to load trip data.');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newNum = sections.length + 1;
    setSections([...sections, { 
      id: Date.now(), 
      title: `Stop ${newNum}`, 
      description: '', 
      startDate: '', 
      endDate: '', 
      budget: '',
      city_id: '',
      isNew: true 
    }]);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  const removeSection = async (id, isNew) => {
    if (!isNew) {
      if (!window.confirm("Are you sure you want to delete this stop from your itinerary?")) return;
      try {
        await stopsApi.delete(tripId, id);
      } catch (err) {
        alert("Failed to delete stop from database.");
        return;
      }
    }
    setSections(sections.filter(sec => sec.id !== id));
  };

  const moveSection = async (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === sections.length - 1) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;
    
    setSections(newSections);

    const stopIds = newSections.filter(s => !s.isNew).map(s => s.id);
    if (stopIds.length > 1) {
      try {
        await stopsApi.reorder(tripId, stopIds);
      } catch (err) {
        console.error("Failed to reorder stops in DB");
      }
    }
  };

  const handleSave = async () => {
    if (!tripId) {
      setError('No trip selected. Create a trip first.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      for (const section of sections) {
        const payload = {
          city_id: section.city_id,
          start_date: section.startDate || null,
          end_date: section.endDate || null,
          notes: section.description || null,
        };
        
        if (section.isNew) {
          await stopsApi.create(tripId, payload);
        } else {
          await stopsApi.update(tripId, section.id, {
            start_date: payload.start_date,
            end_date: payload.end_date,
            notes: payload.notes
          });
        }
      }
      setSuccess('Itinerary saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchTripData();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to save itinerary.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Build Your Itinerary</h1>
            {trip && <p className="text-slate-500 mt-1">For: <span className="font-semibold text-indigo-600">{trip.title}</span></p>}
            {!tripId && <p className="text-amber-600 text-sm mt-1 font-medium">⚠️ No trip selected — <button className="underline" onClick={() => navigate('/create-trip')}>create one first</button></p>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !tripId}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            {saving ? 'Saving...' : 'Save Itinerary'}
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl font-medium border border-green-200 mb-6">{success}</div>}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading itinerary...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 relative group transition-all hover:shadow-md hover:border-indigo-200">
                  
                  {/* Order Arrows */}
                  <div className="absolute top-4 right-14 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-indigo-500 disabled:opacity-30">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                    <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="text-slate-300 hover:text-indigo-500 disabled:opacity-30">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>

                  {/* Delete Button (visible on hover) */}
                  <button 
                    onClick={() => removeSection(section.id, section.isNew)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Stop"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>

                  {section.isNew && (
                    <span className="absolute top-4 right-12 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">New</span>
                  )}

                  <div className="mb-4">
                    <input 
                      type="text" 
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className="text-xl font-bold text-indigo-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full placeholder-indigo-300"
                      placeholder="e.g. Stop 1: Paris"
                    />
                    <select
                      value={section.city_id}
                      onChange={(e) => updateSection(section.id, 'city_id', e.target.value)}
                      className="w-full sm:w-1/2 mt-3 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="" disabled>Select destination city...</option>
                      {cities.map(c => (
                        <option key={c.id} value={c.id}>{c.name}, {c.country}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <textarea 
                      value={section.description}
                      onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                      rows="2"
                      className="w-full text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
                      placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity..."
                    ></textarea>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <input 
                        type="date" 
                        value={section.startDate}
                        onChange={(e) => updateSection(section.id, 'startDate', e.target.value)}
                        placeholder="Start Date"
                        className="w-full sm:w-1/2 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={addSection}
                className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 font-bold rounded-xl transition-all shadow-sm group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add another Section
              </button>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
