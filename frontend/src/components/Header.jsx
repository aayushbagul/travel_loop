import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import avatarImg from '../assets/avatar.png';
import { authApi } from '../api/client';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    authApi.getMe()
      .then(res => setUser(res.data))
      .catch(() => {});
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home',           path: '/home',              icon: '🏠' },
    { name: 'My Trips',       path: '/trips',             icon: '🗺️' },
    { name: 'Community',      path: '/community',         icon: '👥' },
    { name: 'Search',         path: '/search',            icon: '🔍' },
    { name: 'Itinerary',      path: '/itinerary-view',    icon: '📍' },
    { name: 'Checklist',      path: '/packing-checklist', icon: '✅' },
    { name: 'Notes',          path: '/notes',             icon: '📝' },
    { name: 'Invoice',        path: '/invoice',           icon: '💰' },
  ];

  if (user?.is_admin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: '⚙️' });
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div
              className="text-xl font-bold text-indigo-600 tracking-tight flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => navigate('/home')}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Traveloop
            </div>

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Right side: avatar + hamburger */}
            <div className="flex items-center gap-3">
              <img
                src={avatarImg}
                alt="Profile"
                title="View Profile"
                className="w-9 h-9 rounded-full border-2 border-indigo-100 object-cover cursor-pointer hover:border-indigo-400 transition shrink-0"
                onClick={() => navigate('/profile')}
              />

              {/* Hamburger — shown on tablet/mobile */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-200 shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navLinks.map(link => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <span>{link.icon}</span>
                {link.name}
              </button>
            ))}
          </nav>
          {/* User info bar */}
          {user && (
            <div
              className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 cursor-pointer hover:bg-slate-50 transition"
              onClick={() => navigate('/profile')}
            >
              <img src={avatarImg} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-800">{user.name || user.email}</p>
                <p className="text-xs text-slate-500">{user.is_admin ? '⚙️ Admin' : '✈️ Traveller'} · View Profile</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/20"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
