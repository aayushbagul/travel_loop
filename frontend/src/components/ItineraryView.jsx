import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { itineraryApi, tripsApi } from '../api/client';

const TYPE_COLORS = {
  Adventure:  { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200' },
  Cultural:   { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200' },
  Food:       { bg: 'bg-yellow-50',  text: 'text-yellow-600',  border: 'border-yellow-200' },
  Relaxation: { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200'  },
  Sightseeing:{ bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200'  },
};
const defaultType = { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };

function fmt(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`;
}

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ItineraryView() {
  const { tripId: paramTripId } = useParams();
  const navigate = useNavigate();
  const [trips, setTrips]           = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(paramTripId || '');
  const [itinerary, setItinerary]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [removing, setRemoving]     = useState(null); // id of item being removed

  useEffect(() => { fetchTrips(); }, []);

  useEffect(() => {
    if (selectedTripId) fetchItinerary(selectedTripId);
    else { setItinerary(null); setLoading(false); }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const res = await tripsApi.getAll();
      setTrips(res.data);
      if (!selectedTripId && res.data.length > 0) {
        setSelectedTripId(res.data[0].id.toString());
      } else if (res.data.length === 0) {
        setLoading(false);
      }
    } catch { setError('Failed to load trips.'); setLoading(false); }
  };

  const fetchItinerary = async (tripId) => {
    setLoading(true); setError('');
    try {
      const res = await itineraryApi.get(tripId);
      setItinerary(res.data);
    } catch {
      setItinerary({ trip: null, stops: [] });
    } finally { setLoading(false); }
  };

  const handleRemoveActivity = async (stopId, taId) => {
    if (!window.confirm('Remove this activity from your itinerary?')) return;
    setRemoving(taId);
    try {
      await itineraryApi.removeActivity(stopId, taId);
      await fetchItinerary(selectedTripId);
    } catch { alert('Failed to remove activity.'); }
    finally { setRemoving(null); }
  };

  const trip = itinerary?.trip;
  const stops = itinerary?.stops || [];

  const totalActivities = stops.reduce((acc, s) => acc + (s.trip_activities?.length || 0), 0);
  const totalCost = stops.reduce((acc, s) =>
    acc + (s.trip_activities || []).reduce((a, ta) => a + (ta.activity?.price_estimate || 0), 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Top bar: Trip selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {trip?.title ? `📍 ${trip.title}` : 'Itinerary View'}
            </h1>
            {trip?.start_date && trip?.end_date && (
              <p className="text-slate-500 mt-1 text-sm font-medium">
                {formatDate(trip.start_date)} → {formatDate(trip.end_date)}
              </p>
            )}
            {trip?.description && (
              <p className="text-slate-500 mt-1 text-sm">{trip.description}</p>
            )}
          </div>

          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold cursor-pointer min-w-[200px]"
          >
            <option value="">Select a trip...</option>
            {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        {/* Stats bar */}
        {!loading && stops.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Stops', value: stops.length, icon: '📍' },
              { label: 'Activities', value: totalActivities, icon: '🎯' },
              { label: 'Est. Cost', value: `$${totalCost.toFixed(0)}`, icon: '💰' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading itinerary...</p>
          </div>
        ) : stops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-6xl mb-4">🗺️</p>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No stops yet</h3>
            <p className="text-slate-500 mb-6">Build your itinerary by adding stops and activities.</p>
            <button
              onClick={() => navigate(selectedTripId ? `/build-itinerary/${selectedTripId}` : '/build-itinerary')}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
            >
              Build Itinerary
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-indigo-100 hidden sm:block"></div>

            <div className="space-y-10">
              {stops.map((stop, stopIdx) => {
                const activities = stop.trip_activities || [];
                return (
                  <div key={stop.id} className="relative sm:pl-16">
                    {/* Timeline dot */}
                    <div className="hidden sm:flex absolute left-0 top-4 w-12 h-12 bg-indigo-600 rounded-full items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-600/30 shrink-0">
                      {stopIdx + 1}
                    </div>

                    {/* Stop card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Stop header */}
                      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <h2 className="text-lg font-bold text-white">
                              Stop {stopIdx + 1}: {stop.city?.name || `City #${stop.city_id}`}
                              {stop.city?.country && <span className="font-normal opacity-80">, {stop.city.country}</span>}
                            </h2>
                            {stop.notes && <p className="text-indigo-100 text-sm mt-1">{stop.notes}</p>}
                          </div>
                          <div className="text-right">
                            {stop.start_date && (
                              <p className="text-indigo-100 text-sm font-medium">
                                {formatDate(stop.start_date)}
                                {stop.end_date && ` → ${formatDate(stop.end_date)}`}
                              </p>
                            )}
                            <p className="text-indigo-200 text-xs mt-1">{activities.length} activit{activities.length === 1 ? 'y' : 'ies'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Activities list */}
                      {activities.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-400">
                          <p className="text-3xl mb-2">✨</p>
                          <p className="font-medium">No activities added to this stop yet.</p>
                          <p className="text-sm mt-1">Use the Search page to find and add activities.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {activities.map((ta, taIdx) => {
                            const act = ta.activity;
                            const colors = TYPE_COLORS[act?.type] || defaultType;
                            return (
                              <div key={ta.id} className="px-6 py-5 flex items-start gap-4 hover:bg-slate-50/50 transition group">
                                {/* Activity index bubble */}
                                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm mt-0.5">
                                  {taIdx + 1}
                                </div>

                                {/* Activity info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="font-bold text-slate-800 text-base">
                                      {act?.name || `Activity #${ta.activity_id}`}
                                    </h3>
                                    {act?.type && (
                                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                                        {act.type}
                                      </span>
                                    )}
                                  </div>

                                  {act?.description && (
                                    <p className="text-slate-500 text-sm mb-2 line-clamp-2">{act.description}</p>
                                  )}

                                  <div className="flex flex-wrap gap-3 text-sm">
                                    {ta.date && (
                                      <span className="flex items-center gap-1 text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        {formatDate(ta.date)}
                                      </span>
                                    )}
                                    {(ta.start_time || ta.end_time) && (
                                      <span className="flex items-center gap-1 text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        {ta.start_time}{ta.end_time ? ` – ${ta.end_time}` : ''}
                                      </span>
                                    )}
                                    {act?.duration_minutes && (
                                      <span className="flex items-center gap-1 text-slate-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                        {fmt(act.duration_minutes)}
                                      </span>
                                    )}
                                    {act?.price_estimate != null && (
                                      <span className="flex items-center gap-1 font-semibold text-indigo-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        ${act.price_estimate.toFixed(2)}
                                      </span>
                                    )}
                                    {ta.notes && (
                                      <span className="text-slate-400 italic text-xs">📝 {ta.notes}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Remove button */}
                                <button
                                  onClick={() => handleRemoveActivity(stop.id, ta.id)}
                                  disabled={removing === ta.id}
                                  className="shrink-0 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 rounded-lg hover:bg-red-50"
                                  title="Remove activity"
                                >
                                  {removing === ta.id ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="flex gap-4 justify-center mt-12">
              <button
                onClick={() => navigate(selectedTripId ? `/build-itinerary/${selectedTripId}` : '/build-itinerary')}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-200 hover:border-indigo-400 text-indigo-600 font-bold rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Edit Stops
              </button>
              <button
                onClick={() => navigate('/search')}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Add Activities
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
