import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import bannerImg from '../assets/travel_banner.png';
import parisImg from '../assets/destination_paris.png';
import tokyoImg from '../assets/destination_tokyo.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const regions = [
    { id: 1, name: 'Paris, France', img: parisImg },
    { id: 2, name: 'Tokyo, Japan', img: tokyoImg },
    { id: 3, name: 'Bali, Indonesia', img: bannerImg },
    { id: 4, name: 'New York, USA', img: parisImg }, // Reusing for demo
    { id: 5, name: 'Rome, Italy', img: tokyoImg },
  ];

  const trips = [
    { id: 1, title: 'Summer in Europe', dates: 'Jun 10 - Jun 25', img: parisImg },
    { id: 2, title: 'Japan Adventure', dates: 'Oct 5 - Oct 20', img: tokyoImg },
    { id: 3, title: 'Beach Retreat', dates: 'Dec 1 - Dec 10', img: bannerImg },
  ];

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
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search destinations, activities..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        {/* Top Regional Selections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Top Regional Selections
            <div className="h-px bg-slate-200 flex-grow ml-4"></div>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {regions.map((region) => (
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

        {/* Previous Trips */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Previous Trips
            <div className="h-px bg-slate-200 flex-grow ml-4"></div>
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
            {trips.map((trip) => (
              <div key={trip.id} className="min-w-[240px] sm:min-w-[280px] h-[320px] rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 snap-start relative group cursor-pointer border border-slate-200 bg-white">
                <img src={trip.img} alt={trip.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{trip.title}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {trip.dates}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
