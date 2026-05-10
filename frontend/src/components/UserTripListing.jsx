import React from 'react';
import Header from './Header';

export default function UserTripListing() {
  const ongoingTrips = [
    { id: 1, title: 'Summer in Europe', dates: 'Current - Jun 25', destination: 'France, Italy' }
  ];
  
  const upcomingTrips = [
    { id: 2, title: 'Japan Adventure', dates: 'Oct 5 - Oct 20', destination: 'Tokyo, Kyoto' }
  ];
  
  const completedTrips = [
    { id: 3, title: 'Beach Retreat', dates: 'Dec 1 - Dec 10, 2024', destination: 'Bali' },
    { id: 4, title: 'New York Business Trip', dates: 'Jan 15 - Jan 20, 2024', destination: 'USA' }
  ];

  const TripCard = ({ trip }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex justify-between items-center group">
      <div>
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{trip.title}</h3>
        <p className="text-slate-500 mt-1">{trip.dates} • {trip.destination}</p>
      </div>
      <button className="px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        View
      </button>
    </div>
  );

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
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Ongoing</h2>
            <div className="space-y-4">
              {ongoingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Up-coming</h2>
            <div className="space-y-4">
              {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Completed</h2>
            <div className="space-y-4">
              {completedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
