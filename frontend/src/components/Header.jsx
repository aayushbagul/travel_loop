import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import avatarImg from '../assets/avatar.png';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'My Trips', path: '/trips' },
    { name: 'Community', path: '/community' },
    { name: 'Search', path: '/search' },
    { name: 'Itinerary View', path: '/itinerary-view' }
  ];

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 gap-4">
      <div 
        className="text-2xl font-bold text-indigo-600 tracking-tight flex items-center gap-2 cursor-pointer shrink-0"
        onClick={() => navigate('/home')}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Traveloop
      </div>
      
      {/* Navigation Links */}
      <nav className="flex gap-1 sm:gap-4 overflow-x-auto w-full sm:w-auto hide-scrollbar pb-2 sm:pb-0">
        {navLinks.map((link) => (
          <button 
            key={link.name}
            onClick={() => navigate(link.path)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-50'}`}
          >
            {link.name}
          </button>
        ))}
      </nav>

      <img 
        src={avatarImg} 
        alt="Profile" 
        title="View Profile"
        className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover cursor-pointer hover:border-indigo-300 transition shrink-0" 
        onClick={() => navigate('/profile')}
      />
    </header>
  );
}
