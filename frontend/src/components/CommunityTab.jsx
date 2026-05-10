import React from 'react';
import Header from './Header';
import avatarImg from '../assets/avatar.png';

export default function CommunityTab() {
  const posts = [
    { id: 1, user: 'Sarah Jenkins', trip: '2 Weeks in Japan', content: 'Just finished my 14-day itinerary across Tokyo, Kyoto, and Osaka. Highly recommend getting the JR Pass before arriving! Total budget was around $2.5k including flights.', likes: 124, comments: 18 },
    { id: 2, user: 'Mike Chen', trip: 'Backpacking Europe', content: 'Does anyone know the best affordable hostels near the colosseum in Rome? Looking for something with a good social vibe.', likes: 45, comments: 32 },
    { id: 3, user: 'Emma Stone', trip: 'Bali Digital Nomad', content: 'Canggu is getting a bit crowded, but the coworking spaces are top tier. Uploaded my list of favorite cafes to work from.', likes: 89, comments: 5 },
    { id: 4, user: 'David Silva', trip: 'Patagonia Trek', content: 'The W Trek was the most challenging but rewarding experience of my life. Make sure to pack layers, the weather changes every 10 minutes.', likes: 210, comments: 42 }
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
              placeholder="Search community posts..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Group by</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">Sort by...</button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center sm:text-left">Community tab</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="flex gap-4 sm:gap-6 items-start">
              <div className="shrink-0">
                <img src={avatarImg} alt={post.user} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-indigo-100 object-cover" />
              </div>
              <div className="flex-1 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{post.user}</h3>
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{post.trip}</span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {post.content}
                </p>
                <div className="flex gap-4 text-sm font-semibold text-slate-400">
                  <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    {post.comments}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
