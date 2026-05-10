import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import bannerImg from '../assets/travel_banner.png';
import parisImg from '../assets/destination_paris.png';
import tokyoImg from '../assets/destination_tokyo.png';

export default function CreateTrip() {
  const navigate = useNavigate();
  
  const suggestions = [
    { id: 1, title: 'Eiffel Tower', location: 'Paris', img: parisImg },
    { id: 2, title: 'Shibuya Crossing', location: 'Tokyo', img: tokyoImg },
    { id: 3, title: 'Amalfi Coast Drive', location: 'Italy', img: bannerImg },
    { id: 4, title: 'Louvre Museum', location: 'Paris', img: parisImg },
    { id: 5, title: 'Mount Fuji', location: 'Japan', img: tokyoImg },
    { id: 6, title: 'Positano Beach', location: 'Italy', img: bannerImg },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Form Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
          <div className="bg-indigo-600 px-6 sm:px-8 py-5">
            <h1 className="text-2xl font-bold text-white tracking-tight">Plan a new trip</h1>
          </div>
          
          <div className="p-6 sm:p-8">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/build-itinerary'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Trip Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Summer Vacation in Europe" 
                    className="w-full px-4 sm:px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Select a Place</label>
                  <input 
                    type="text" 
                    placeholder="Search for a city or country..." 
                    className="w-full px-4 sm:px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 sm:px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 ml-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 sm:px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>

              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Suggestions Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Suggestion for Places to Visit / Activities to perform</h2>
            <div className="h-px bg-slate-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestions.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-300 group cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
