import React, { useState } from 'react';
import Header from './Header';

export default function BuildItinerary() {
  const [sections, setSections] = useState([
    { id: 1, title: 'Stop 1: Paris', description: '', startDate: '', endDate: '', budget: '' },
  ]);

  const addSection = () => {
    const newId = sections.length > 0 ? sections[sections.length - 1].id + 1 : 1;
    setSections([...sections, { id: newId, title: `Stop ${newId}`, description: '', startDate: '', endDate: '', budget: '' }]);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  const removeSection = (id) => {
    setSections(sections.filter(sec => sec.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Build Your Itinerary</h1>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 relative group transition-all hover:shadow-md hover:border-indigo-200">
              
              {/* Delete Button (visible on hover) */}
              <button 
                onClick={() => removeSection(section.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Stop"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>

              <div className="mb-4">
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  className="text-xl font-bold text-indigo-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full placeholder-indigo-300"
                  placeholder="e.g. Stop 1: Paris"
                />
              </div>
              
              <div className="mb-6">
                <textarea 
                  value={section.description}
                  onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                  rows="2"
                  className="w-full text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
                  placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity..."
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    value={section.startDate}
                    onChange={(e) => updateSection(section.id, 'startDate', e.target.value)}
                    placeholder="Date Range: xxx to yyy"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    value={section.budget}
                    onChange={(e) => updateSection(section.id, 'budget', e.target.value)}
                    placeholder="Budget of this section"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={addSection}
            className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 font-bold rounded-xl transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add another Section
          </button>
        </div>

      </main>
    </div>
  );
}
