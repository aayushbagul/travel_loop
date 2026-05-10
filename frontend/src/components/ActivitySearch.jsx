import React, { useState, useEffect } from 'react';
import Header from './Header';
import { activitiesApi, tripsApi, stopsApi, itineraryApi } from '../api/client';

const TYPE_COLORS = {
  Adventure:   { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200' },
  Cultural:    { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200' },
  Food:        { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200' },
  Relaxation:  { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200'   },
  Sightseeing: { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200'   },
};
const defaultColor = { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

function fmtDuration(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

export default function ActivitySearch() {
  const [activities, setActivities]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterType, setFilterType]       = useState('All');
  const [sortBy, setSortBy]               = useState('none');
  const [groupBy, setGroupBy]             = useState('none');

  // Add-to-trip modal state
  const [trips, setTrips]                 = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedTripId, setSelectedTripId]     = useState('');
  const [stops, setStops]                 = useState([]);
  const [selectedStopId, setSelectedStopId]     = useState('');
  const [addingToTrip, setAddingToTrip]   = useState(false);
  const [addSuccess, setAddSuccess]       = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) { fetchStops(selectedTripId); }
    else { setStops([]); setSelectedStopId(''); }
  }, [selectedTripId]);

  const fetchActivities = async () => {
    try {
      const res = await activitiesApi.getAll();
      setActivities(res.data);
    } catch { setActivities([]); }
    finally { setLoading(false); }
  };

  const fetchTrips = async () => {
    try { const res = await tripsApi.getAll(); setTrips(res.data); } catch {}
  };

  const fetchStops = async (tripId) => {
    try { const res = await stopsApi.getAll(tripId); setStops(res.data); } catch {}
  };

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setSelectedTripId('');
    setSelectedStopId('');
    setAddSuccess(false);
  };

  const handleAddToTrip = async () => {
    if (!selectedStopId) return;
    setAddingToTrip(true);
    try {
      await itineraryApi.addActivity(selectedStopId, { activity_id: selectedActivity.id });
      setAddSuccess(true);
      setTimeout(() => { setSelectedActivity(null); setAddSuccess(false); }, 1200);
    } catch { alert('Failed to add to trip. Make sure the stop exists.'); }
    finally { setAddingToTrip(false); }
  };

  // Unique types for filter dropdown
  const activityTypes = ['All', ...new Set(activities.map(a => a.type).filter(Boolean))];

  // 1. Filter
  let processed = activities.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.type || '').toLowerCase().includes(q);
    const matchesType = filterType === 'All' || a.type === filterType;
    return matchesSearch && matchesType;
  });

  // 2. Sort
  if (sortBy === 'price_asc')       processed = [...processed].sort((a, b) => (a.price_estimate || 0) - (b.price_estimate || 0));
  else if (sortBy === 'price_desc') processed = [...processed].sort((a, b) => (b.price_estimate || 0) - (a.price_estimate || 0));
  else if (sortBy === 'duration_asc')  processed = [...processed].sort((a, b) => (a.duration_minutes || 0) - (b.duration_minutes || 0));
  else if (sortBy === 'duration_desc') processed = [...processed].sort((a, b) => (b.duration_minutes || 0) - (a.duration_minutes || 0));
  else if (sortBy === 'name_asc')   processed = [...processed].sort((a, b) => a.name.localeCompare(b.name));

  // 3. Group
  const grouped = groupBy === 'type'
    ? processed.reduce((acc, a) => { const k = a.type || 'Other'; if (!acc[k]) acc[k] = []; acc[k].push(a); return acc; }, {})
    : null;

  function ActivityCard({ result }) {
    const colors = TYPE_COLORS[result.type] || defaultColor;
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden group">
        {/* Image */}
        {result.image_url && (
          <img src={result.image_url} alt={result.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                {result.name}
              </h3>
              {result.type && (
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border mt-1 ${colors.bg} ${colors.text} ${colors.border}`}>
                  {result.type}
                </span>
              )}
            </div>
            {result.price_estimate != null && (
              <span className="text-xl font-bold text-slate-800 shrink-0">${result.price_estimate.toFixed(0)}</span>
            )}
          </div>

          {result.description && (
            <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{result.description}</p>
          )}

          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="flex flex-wrap gap-2">
              {result.duration_minutes && (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {fmtDuration(result.duration_minutes)}
                </span>
              )}
              {result.price_estimate != null && (
                <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  ${result.price_estimate.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => openModal(result)}
              className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-indigo-600/20"
            >
              + Add to Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Controls — stacked layout to prevent overflow */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 space-y-3">
          {/* Search bar — full width */}
          <div className="relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, type, or description..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
            />
          </div>

          {/* Filter controls — wrap on small screens */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm cursor-pointer text-sm"
            >
              <option value="All">Filter: All Types</option>
              {activityTypes.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 min-w-[150px] px-3 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm cursor-pointer text-sm"
            >
              <option value="none">Sort: Default</option>
              <option value="name_asc">Name: A–Z</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="duration_asc">Duration: Short → Long</option>
              <option value="duration_desc">Duration: Long → Short</option>
            </select>

            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm cursor-pointer text-sm"
            >
              <option value="none">Group: None</option>
              <option value="type">Group: By Category</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {loading ? 'Loading...' : `${processed.length} activit${processed.length === 1 ? 'y' : 'ies'} found`}
          </h2>
          {(filterType !== 'All' || sortBy !== 'none' || groupBy !== 'none' || searchQuery) && (
            <button
              onClick={() => { setFilterType('All'); setSortBy('none'); setGroupBy('none'); setSearchQuery(''); }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Clear filters ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading activities...</p>
          </div>
        ) : processed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500 font-medium">No activities found matching your criteria.</p>
            <button onClick={() => { setFilterType('All'); setSearchQuery(''); }} className="mt-4 text-sm font-bold text-indigo-600 hover:underline">Clear filters</button>
          </div>
        ) : grouped ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span className={(TYPE_COLORS[type] || defaultColor).text}>{type}</span>
                  <span className="text-slate-400 font-normal text-sm">({items.length})</span>
                  <div className="flex-1 h-px bg-slate-200 ml-2"></div>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map(a => <ActivityCard key={a.id} result={a} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {processed.map(a => <ActivityCard key={a.id} result={a} />)}
          </div>
        )}

        {/* Add to Trip Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              {addSuccess ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">✅</div>
                  <h2 className="text-xl font-bold text-slate-800">Added successfully!</h2>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-2xl font-bold text-slate-800">Add to Trip</h2>
                    <p className="text-indigo-600 font-semibold mt-1">{selectedActivity.name}</p>
                    {selectedActivity.price_estimate != null && (
                      <p className="text-slate-500 text-sm mt-1">Est. cost: ${selectedActivity.price_estimate.toFixed(2)}</p>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Trip</label>
                      <select
                        value={selectedTripId}
                        onChange={(e) => setSelectedTripId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="">Choose a trip...</option>
                        {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                      </select>
                    </div>

                    {selectedTripId && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Stop</label>
                        {stops.length === 0 ? (
                          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-medium">
                            ⚠️ This trip has no stops yet. Go to Build Itinerary to add stops first.
                          </p>
                        ) : (
                          <select
                            value={selectedStopId}
                            onChange={(e) => setSelectedStopId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                          >
                            <option value="">Choose a stop...</option>
                            {stops.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.city?.name || `Stop ${s.id}`}{s.city?.country ? `, ${s.city.country}` : ''}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedActivity(null)}
                      className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToTrip}
                      disabled={!selectedStopId || addingToTrip}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-md shadow-indigo-600/20"
                    >
                      {addingToTrip ? 'Adding...' : 'Add to Itinerary'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
