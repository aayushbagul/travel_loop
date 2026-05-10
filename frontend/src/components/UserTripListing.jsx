import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { tripsApi } from '../api/client';

export default function UserTripListing() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripsApi.getAll();
      setTrips(response.data);
    } catch (err) {
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripsApi.delete(tripId);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      setError('Failed to delete trip.');
    }
  };

  const now = new Date();
  const ongoingTrips = trips.filter(t => {
    if (!t.start_date || !t.end_date) return false;
    return new Date(t.start_date) <= now && new Date(t.end_date) >= now;
  });
  const upcomingTrips = trips.filter(t => {
    if (!t.start_date) return false;
    return new Date(t.start_date) > now;
  });
  const completedTrips = trips.filter(t => {
    if (!t.end_date) return false;
    return new Date(t.end_date) < now;
  });
  // Trips with no dates or only partial dates
  const undatedTrips = trips.filter(t => {
    const isOngoing = t.start_date && t.end_date && new Date(t.start_date) <= now && new Date(t.end_date) >= now;
    const isUpcoming = t.start_date && new Date(t.start_date) > now;
    const isCompleted = t.end_date && new Date(t.end_date) < now;
    return !isOngoing && !isUpcoming && !isCompleted;
  });

  const formatDates = (trip) => {
    if (trip.start_date && trip.end_date) {
      return `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`;
    }
    if (trip.start_date) return `From ${new Date(trip.start_date).toLocaleDateString()}`;
    if (trip.end_date) return `Until ${new Date(trip.end_date).toLocaleDateString()}`;
    return 'No dates set';
  };

  const TripCard = ({ trip }) => (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all group">
      {/* Title + dates row */}
      <div
        className="flex items-start justify-between gap-3 mb-4 cursor-pointer"
        onClick={() => navigate(`/itinerary-view/${trip.id}`)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{trip.title}</h3>
          <p className="text-slate-500 text-sm mt-1">{formatDates(trip)}</p>
          {trip.description && <p className="text-slate-400 text-sm mt-1 line-clamp-2">{trip.description}</p>}
        </div>
        <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
      {/* Action buttons — wrap on small screens */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => navigate(`/itinerary-view/${trip.id}`)}
          className="flex-1 min-w-[100px] px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition text-sm"
        >
          View Itinerary
        </button>
        <button
          onClick={() => navigate(`/build-itinerary/${trip.id}`)}
          className="flex-1 min-w-[80px] px-4 py-2 bg-slate-50 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition text-sm"
        >
          ✏️ Build
        </button>
        <button
          onClick={() => navigate(`/notes/${trip.id}`)}
          className="px-3 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition text-sm"
          title="Notes"
        >📝</button>
        <button
          onClick={() => navigate(`/invoice/${trip.id}`)}
          className="px-3 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition text-sm"
          title="Invoice"
        >💰</button>
        <button
          onClick={() => handleDelete(trip.id)}
          className="px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition text-sm"
          title="Delete"
        >🗑️</button>
      </div>
    </div>
  );

  const TripSection = ({ title, tripList }) => {
    if (tripList.length === 0) return null;
    return (
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
        <div className="space-y-4">
          {tripList.map(trip => <TripCard key={trip.id} trip={trip} />)}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search your trips..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button 
            onClick={() => navigate('/create-trip')}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
          >
            + New Trip
          </button>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading your trips...</p>
          </div>
        )}

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        {!loading && trips.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-5xl mb-4">🌍</p>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No trips yet</h3>
            <p className="text-slate-500 mb-6">Start planning your next adventure!</p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
            >
              Create Your First Trip
            </button>
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="space-y-10">
            <TripSection title="Ongoing" tripList={ongoingTrips} />
            <TripSection title="Up-coming" tripList={upcomingTrips} />
            <TripSection title="Planned" tripList={undatedTrips} />
            <TripSection title="Completed" tripList={completedTrips} />
          </div>
        )}
      </main>
    </div>
  );
}
