import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { tripsApi, dashboardApi, citiesApi } from '../api/client';
import bannerImg from '../assets/travel_banner_new.png';
import parisImg from '../assets/destination_paris_new.png';
import tokyoImg from '../assets/destination_tokyo_new.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Static fallback for regions (cities may not have data yet)
  const defaultRegions = [
    { id: 1, name: 'Paris, France', img: parisImg },
    { id: 2, name: 'Tokyo, Japan', img: tokyoImg },
    { id: 3, name: 'Bali, Indonesia', img: bannerImg },
    { id: 4, name: 'New York, USA', img: parisImg },
    { id: 5, name: 'Rome, Italy', img: tokyoImg },
  ];

  const tripImages = [parisImg, tokyoImg, bannerImg];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tripsRes = await tripsApi.getAll();
      setTrips(tripsRes.data);
    } catch (err) {
      // Non-critical, show empty state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative">
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Banner Section */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-xl shadow-indigo-900/10 mb-8 group">
          <img src={bannerImg} alt="Explore the world" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">Discover Your Next Adventure</h1>
            <p className="text-indigo-100 text-lg sm:text-xl">Plan, organize, and experience the world.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your trips..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
            />
          </div>
        </div>

        {/* Top Regional Selections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Top Regional Selections
            <div className="h-px bg-slate-200 flex-grow ml-4"></div>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {defaultRegions.map((region) => (
              <div key={region.id} className="min-w-[140px] sm:min-w-[180px] snap-start group cursor-pointer">
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-md shadow-slate-200 mb-3 relative">
                  <img src={region.img} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors px-1 truncate">{region.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* User's Trips */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            {trips.length > 0 ? 'Your Trips' : 'Get Started'}
            <div className="h-px bg-slate-200 flex-grow ml-4"></div>
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : trips.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
              {trips
                .filter(trip => trip.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((trip, idx) => (
                <div 
                  key={trip.id} 
                  onClick={() => navigate(`/itinerary-view/${trip.id}`)}
                  className="min-w-[240px] sm:min-w-[280px] h-[320px] rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 snap-start relative group cursor-pointer border border-slate-200 bg-white"
                >
                  <img src={tripImages[idx % tripImages.length]} alt={trip.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{trip.title}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {trip.start_date && trip.end_date 
                        ? `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
                        : 'No dates set'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-5xl mb-4">🌍</p>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No trips yet</h3>
              <p className="text-slate-500 mb-6">Create your first trip to get started!</p>
            </div>
          )}
        </section>
      </main>

      {/* FAB - Plan a trip */}
      <button 
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-full shadow-xl shadow-indigo-600/30 flex items-center gap-2 font-bold text-lg transition-transform transform hover:-translate-y-1 z-50 border-2 border-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Plan a trip
      </button>

      {/* Hide Scrollbar Style */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
