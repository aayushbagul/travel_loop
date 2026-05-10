import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import avatarImg from '../assets/avatar.png';
import { authApi, tripsApi } from '../api/client';
import bannerImg from '../assets/travel_banner.png';
import parisImg from '../assets/destination_paris.png';
import tokyoImg from '../assets/destination_tokyo.png';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, tripsRes] = await Promise.all([
        authApi.getMe(),
        tripsApi.getAll(),
      ]);
      setUser(userRes.data);
      setTrips(tripsRes.data);
    } catch (err) {
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Use trip images cyclically for display
  const tripImages = [parisImg, tokyoImg, bannerImg];

  const now = new Date();
  const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) > now);
  const previousTrips = trips.filter(t => t.end_date && new Date(t.end_date) < now);
  const plannedTrips = trips.filter(t => {
    const isUpcoming = t.start_date && new Date(t.start_date) > now;
    const isPrevious = t.end_date && new Date(t.end_date) < now;
    return !isUpcoming && !isPrevious;
  });

  const TripCard = ({ trip, idx }) => (
    <div 
      className="min-w-[160px] sm:min-w-[200px] bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 snap-start flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/itinerary-view/${trip.id}`)}
    >
      <div className="h-32 sm:h-40 overflow-hidden">
        <img src={tripImages[idx % tripImages.length]} alt={trip.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col items-center gap-3">
        <h3 className="font-semibold text-slate-700 text-center truncate w-full">{trip.title}</h3>
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/itinerary-view/${trip.id}`); }}
          className="px-6 py-2 w-full bg-white border border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        {/* User Details Header */}
        <div className="flex flex-col sm:flex-row gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-md opacity-70 transform scale-110"></div>
            <img 
              src={user?.profile_photo || avatarImg} 
              alt="User" 
              className="relative w-32 h-32 rounded-full object-cover border-[3px] border-white shadow-lg bg-white"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{user?.name || user?.email || 'Traveler'}</h1>
            <p className="text-slate-500 mb-4">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">{trips.length} Trips</span>
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-center gap-3">
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-white border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Planned Trips */}
        {plannedTrips.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Planned Trips</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {plannedTrips.map((trip, idx) => <TripCard key={trip.id} trip={trip} idx={idx} />)}
            </div>
          </section>
        )}

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Upcoming Trips</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {upcomingTrips.map((trip, idx) => <TripCard key={trip.id} trip={trip} idx={idx} />)}
            </div>
          </section>
        )}

        {/* Previous Trips */}
        {previousTrips.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Previous Trips</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
              {previousTrips.map((trip, idx) => <TripCard key={trip.id} trip={trip} idx={idx} />)}
            </div>
          </section>
        )}

        {trips.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-5xl mb-4">✈️</p>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No trips yet</h3>
            <p className="text-slate-500 mb-6">Start planning your next adventure!</p>
            <button onClick={() => navigate('/create-trip')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30">
              Plan Your First Trip
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
