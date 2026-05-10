import React, { useState } from 'react';
import Header from './Header';

export default function PackingChecklist() {
  const [categories, setCategories] = useState([
    {
      name: 'Documents',
      items: [
        { id: 1, text: 'Passport', checked: true },
        { id: 2, text: 'Flight Tickets (printed)', checked: true },
        { id: 3, text: 'Travel insurance', checked: true },
        { id: 4, text: 'Hotel booking confirmation', checked: false },
      ]
    },
    {
      name: 'Clothing',
      items: [
        { id: 5, text: 'Casual Shirts', checked: true },
        { id: 6, text: 'Trousers / jeans', checked: false },
        { id: 7, text: 'Comfortable walking shoes', checked: false },
        { id: 8, text: 'Light jacket / windbreaker', checked: false },
      ]
    },
    {
      name: 'Electronics',
      items: [
        { id: 9, text: 'Phone charger', checked: true },
        { id: 10, text: 'Universal power adapter', checked: false },
        { id: 11, text: 'Earphones / headphones', checked: false },
      ]
    }
  ]);

  const toggleItem = (categoryId, itemId) => {
    const newCategories = [...categories];
    const category = newCategories.find(c => c.name === categoryId);
    const item = category.items.find(i => i.id === itemId);
    item.checked = !item.checked;
    setCategories(newCategories);
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedItems = categories.reduce((sum, cat) => sum + cat.items.filter(i => i.checked).length, 0);
  const progressPercentage = (packedItems / totalItems) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/2">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search checklist..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">Packing checklist</h1>
        
        <div className="mb-6 relative w-full sm:w-1/2">
          <select className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold cursor-pointer">
            <option>Trip: Paris & Rome Adventure</option>
            <option>Trip: Bali Escape</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-600">Progress: {packedItems}/{totalItems} items packed</span>
            <span className="text-sm font-bold text-indigo-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          {categories.map(category => {
            const catPacked = category.items.filter(i => i.checked).length;
            const catTotal = category.items.length;
            return (
              <div key={category.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">{category.name}</h2>
                  <span className="text-sm font-semibold text-slate-500">{catPacked}/{catTotal}</span>
                </div>
                <div className="p-4 sm:p-6 space-y-3">
                  {category.items.map(item => (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={item.checked} 
                          onChange={() => toggleItem(category.name, item.id)}
                          className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className={`text-slate-700 font-medium transition-all ${item.checked ? 'line-through text-slate-400' : 'group-hover:text-indigo-600'}`}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
            + add item to checklist
          </button>
          <div className="flex gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-8 py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Reset all
            </button>
            <button className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
              Share Checklist
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
