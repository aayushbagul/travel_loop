import React from 'react';
import Header from './Header';

export default function ItineraryView() {
  const itinerary = [
    {
      day: 'Day 1',
      activities: [
        { id: 1, name: 'Check-in at Ritz Paris', expense: '$450' },
        { id: 2, name: 'Lunch at Cafe de Flore', expense: '$80' },
        { id: 3, name: 'Visit Louvre Museum', expense: '$20' }
      ]
    },
    {
      day: 'Day 2',
      activities: [
        { id: 4, name: 'Eiffel Tower Tour', expense: '$35' },
        { id: 5, name: 'Seine River Cruise', expense: '$25' },
        { id: 6, name: 'Dinner at Le Jules Verne', expense: '$250' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search itinerary..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Itinerary for Paris, France</h1>
        
        <div className="flex justify-between px-4 sm:px-16 mb-4 text-slate-500 font-bold tracking-wider uppercase text-sm">
          <span>Physical Activity</span>
          <span>Expense</span>
        </div>

        <div className="space-y-12">
          {itinerary.map((dayData) => (
            <div key={dayData.day} className="relative pl-24 sm:pl-32">
              {/* Day Badge */}
              <div className="absolute left-0 top-0 bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl shadow-md">
                {dayData.day}
              </div>

              <div className="space-y-4">
                {dayData.activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <div className="flex items-center gap-4">
                      {/* Activity Block */}
                      <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <span className="font-semibold text-slate-700">{activity.name}</span>
                      </div>
                      
                      {/* Expense Block */}
                      <div className="w-24 sm:w-32 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <span className="font-bold text-indigo-600">{activity.expense}</span>
                      </div>
                    </div>

                    {/* Down Arrow */}
                    {index < dayData.activities.length - 1 && (
                      <div className="flex justify-center sm:justify-start sm:pl-1/2 text-slate-300 py-1">
                        <svg className="w-6 h-6 mx-auto sm:mx-0 sm:ml-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </main>
    </div>
  );
}
