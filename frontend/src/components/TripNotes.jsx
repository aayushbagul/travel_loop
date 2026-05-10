import React from 'react';
import Header from './Header';

export default function TripNotes() {
  const notes = [
    { id: 1, title: 'Hotel check-in details - Rome stop', desc: 'check in after 2pm, room 302, breakfast included (7-10am)', date: 'Day 3: June 14 2025' },
    { id: 2, title: 'Flight confirmation - Paris to Rome', desc: 'Flight AF1234. Departure 10:00 AM from CDG. Terminal 2E.', date: 'Day 1: June 12 2025' },
    { id: 3, title: 'Colosseum Tour guide contact', desc: 'Guide name: Marco. Phone: +39 333 123 4567. Meet at main gate.', date: 'Day 4: June 15 2025' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Trip notes</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <select className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold cursor-pointer">
              <option>Trip: Paris & Rome Adventure</option>
              <option>Trip: Bali Escape</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          <button className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shrink-0">
            + Add Note
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-slate-200 pb-4">
          <button className="px-6 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors border border-indigo-200">All</button>
          <button className="px-6 py-2 bg-white text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">by Day</button>
          <button className="px-6 py-2 bg-white text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">by stop</button>
        </div>

        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit Note">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors" title="Delete Note">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-800 pr-20">{note.title}</h3>
              <p className="text-slate-600 mt-2">{note.desc}</p>
              <p className="text-slate-400 text-sm font-semibold mt-4">{note.date}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
