import React from 'react';
import Header from './Header';

export default function AdminPanel() {
  const tabs = ['Manage Users', 'Popular cities', 'Popular Activities', 'User Trends and Analytics'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/3">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search admin dashboard..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 snap-x">
          {tabs.map((tab, idx) => (
            <button 
              key={tab} 
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all snap-start ${idx === 3 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Content Container */}
        <div className="bg-slate-100 rounded-[2rem] p-8 sm:p-12 border border-slate-200 shadow-inner min-h-[600px] flex flex-col gap-12">
          
          {/* Top Row: Legend & Pie Chart */}
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            {/* Mock Legend */}
            <div className="flex flex-col gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-400 opacity-60"></div>
                  <div className="w-32 h-6 rounded-md bg-slate-300 opacity-60"></div>
                </div>
              ))}
            </div>

            {/* Mock Pie Chart (CSS pure) */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#4fa7c2] shadow-lg flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#6eb95c] origin-bottom-left transform -skew-x-[20deg] shadow-[-5px_5px_10px_rgba(0,0,0,0.1)]"></div>
              {/* Inner cutout for donut look if wanted, leaving solid for pie */}
            </div>
          </div>

          {/* Middle Row: Line Chart */}
          <div className="w-full max-w-3xl mx-auto h-48 border-b-4 border-l-4 border-slate-300 relative flex items-end justify-between px-4 pb-2">
            {/* SVG Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline fill="none" stroke="#cf5c5c" strokeWidth="3" points="10,80 30,60 50,70 70,40 90,50" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            {/* Dots */}
            <div className="absolute w-6 h-6 rounded-full bg-[#cf5c5c] shadow-md border-4 border-slate-100" style={{ left: '10%', bottom: '20%', transform: 'translate(-50%, 50%)' }}></div>
            <div className="absolute w-6 h-6 rounded-full bg-[#cf5c5c] shadow-md border-4 border-slate-100" style={{ left: '30%', bottom: '40%', transform: 'translate(-50%, 50%)' }}></div>
            <div className="absolute w-6 h-6 rounded-full bg-[#cf5c5c] shadow-md border-4 border-slate-100" style={{ left: '50%', bottom: '30%', transform: 'translate(-50%, 50%)' }}></div>
            <div className="absolute w-6 h-6 rounded-full bg-[#cf5c5c] shadow-md border-4 border-slate-100" style={{ left: '70%', bottom: '60%', transform: 'translate(-50%, 50%)' }}></div>
            <div className="absolute w-6 h-6 rounded-full bg-[#cf5c5c] shadow-md border-4 border-slate-100" style={{ left: '90%', bottom: '50%', transform: 'translate(-50%, 50%)' }}></div>
          </div>

          {/* Bottom Row: Bar Chart & Data Lines */}
          <div className="flex flex-col md:flex-row gap-12 items-end justify-center w-full max-w-3xl mx-auto">
            {/* Bar Chart */}
            <div className="flex items-end gap-4 h-48">
              <div className="w-12 sm:w-16 h-24 bg-[#faa660] rounded-t-lg shadow-sm"></div>
              <div className="w-12 sm:w-16 h-32 bg-[#faa660] rounded-t-lg shadow-sm"></div>
              <div className="w-12 sm:w-16 h-48 bg-[#faa660] rounded-t-lg shadow-sm"></div>
            </div>
            
            {/* Data Lines */}
            <div className="flex flex-col gap-4 flex-1 w-full max-w-xs">
              <div className="w-full h-8 bg-slate-400 opacity-80 rounded-md"></div>
              <div className="w-4/5 h-6 bg-slate-300 opacity-80 rounded-md"></div>
              <div className="w-full h-6 bg-slate-300 opacity-80 rounded-md"></div>
              <div className="w-5/6 h-6 bg-slate-300 opacity-80 rounded-md"></div>
              <div className="w-3/4 h-6 bg-slate-300 opacity-80 rounded-md"></div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
