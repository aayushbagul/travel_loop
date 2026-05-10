import React from 'react';
import Header from './Header';
import avatarImg from '../assets/avatar.png';
import bannerImg from '../assets/travel_banner.png';
import parisImg from '../assets/destination_paris.png';
import tokyoImg from '../assets/destination_tokyo.png';

export default function UserProfile() {
  const preplannedTrips = [
    { id: 1, img: parisImg, title: 'Paris Tour' },
    { id: 2, img: tokyoImg, title: 'Tokyo Nights' },
    { id: 3, img: bannerImg, title: 'Amalfi Coast' },
  ];

  const previousTrips = [
    { id: 4, img: bannerImg, title: 'Bali Escape' },
    { id: 5, img: parisImg, title: 'Rome Visit' },
    { id: 6, img: tokyoImg, title: 'Osaka Foodie' },
  ];

  const TripCard = ({ trip }) => (
    <div className="min-w-[160px] sm:min-w-[200px] bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 snap-start flex flex-col">
      <div className="h-32 sm:h-40 overflow-hidden">
        <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col items-center gap-3">
        <h3 className="font-semibold text-slate-700 text-center truncate w-full">{trip.title}</h3>
        <button className="px-6 py-2 w-full bg-white border border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
          View
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* User Details Header */}
        <div className="flex flex-col sm:flex-row gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-md opacity-70 transform scale-110"></div>
            <img 
              src={avatarImg} 
              alt="User" 
              className="relative w-32 h-32 rounded-full object-cover border-[3px] border-white shadow-lg bg-white"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Alex Wanderlust</h1>
            <p className="text-slate-500 mb-4">Travel enthusiast, photography lover. Exploring the world one city at a time.</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">15 Trips</span>
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">12 Countries</span>
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-center">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Preplanned Trips */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Preplanned Trips</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {preplannedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>

        {/* Previous Trips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Previous Trips</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {previousTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
        </section>

      </main>
    </div>
  );
}
