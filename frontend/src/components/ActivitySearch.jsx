import React from 'react';
import Header from './Header';

export default function ActivitySearch() {
  const results = [
    { id: 1, title: 'Paragliding over the Alps', details: 'Experience the thrill of flying above the Swiss Alps. 2 hours. High altitude.', cost: '$150', rating: '4.9/5' },
    { id: 2, title: 'Scuba Diving at Coral Reef', details: 'Dive deep into the ocean and explore vibrant marine life. 4 hours. Equipment included.', cost: '$120', rating: '4.8/5' },
    { id: 3, title: 'Sunset Desert Safari', details: 'Ride the dunes and enjoy a traditional dinner under the stars. 6 hours.', cost: '$80', rating: '4.7/5' },
    { id: 4, title: 'Historical City Walk', details: 'Guided tour through the ancient ruins and historical monuments. 3 hours.', cost: '$40', rating: '4.6/5' },
    { id: 5, title: 'Mountain Biking Trail', details: 'Extreme biking adventure through challenging terrain. 5 hours. Expert level.', cost: '$65', rating: '4.8/5' },
    { id: 6, title: 'Gourmet Food Tour', details: 'Taste local delicacies across 5 top-rated restaurants. 3 hours.', cost: '$90', rating: '4.9/5' },
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
              defaultValue="Paragliding"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-semibold"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Results</h2>

        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col sm:flex-row justify-between gap-4 group">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{result.title}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">{result.details}</p>
              </div>
              <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end gap-2 shrink-0">
                <span className="text-xl font-bold text-slate-800">{result.cost}</span>
                <span className="text-sm font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">★ {result.rating}</span>
                <button className="hidden sm:block mt-auto text-sm font-semibold text-indigo-600 hover:text-indigo-800">Add to Trip +</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
