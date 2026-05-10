import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/client';

// ── Inject logo animation CSS once ──────────────────────────────────────────
const STYLE_ID = 'traveloop-logo-style';
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes swirlPan {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes logoFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-2px); }
    }
    @keyframes globeGlow {
      0%, 100% { filter: drop-shadow(0 0 5px rgba(139,92,246,0.6)); }
      50%       { filter: drop-shadow(0 0 12px rgba(217,70,239,0.9)); }
    }
    .traveloop-logo-text {
      background: linear-gradient(270deg, #a855f7, #ec4899, #6366f1, #06b6d4, #a855f7);
      background-size: 300% 300%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: swirlPan 5s ease-in-out infinite, logoFloat 3s ease-in-out infinite;
      transition: filter 0.3s ease;
    }
    .traveloop-logo-text:hover {
      animation-play-state: paused;
      filter: drop-shadow(0 0 14px rgba(217,70,239,0.7));
    }
    .traveloop-globe {
      animation: globeGlow 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

const API_BASE = 'http://127.0.0.1:8000';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      authApi.getMe()
        .then(res => setUser(res.data))
        .catch(() => {});
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Home',      path: '/home',              icon: '🏠' },
    { name: 'My Trips',  path: '/trips',             icon: '🗺️' },
    { name: 'Community', path: '/community',         icon: '👥' },
    { name: 'Search',    path: '/search',            icon: '🔍' },
    { name: 'Itinerary', path: '/itinerary-view',    icon: '📍' },
    { name: 'Checklist', path: '/packing-checklist', icon: '✅' },
    { name: 'Notes',     path: '/notes',             icon: '📝' },
    { name: 'Invoice',   path: '/invoice',           icon: '💰' },
  ];
  if (user?.is_admin) navLinks.push({ name: 'Admin', path: '/admin', icon: '⚙️' });

  // Avatar helpers
  const getInitial = () => {
    if (user?.name)  return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };
  const profileImageUrl = (() => {
    if (!user?.profile_photo) return null;
    if (user.profile_photo.startsWith('http')) return user.profile_photo;
    return `${API_BASE}/${user.profile_photo}`;
  })();

  const Avatar = ({ size = 'w-9 h-9', textSize = 'text-base' }) =>
    profileImageUrl ? (
      <img
        src={profileImageUrl}
        alt="Profile"
        className={`${size} rounded-full border-2 border-indigo-200 object-cover cursor-pointer hover:border-purple-400 transition`}
        onClick={() => navigate('/profile')}
      />
    ) : (
      <div
        className={`${size} ${textSize} rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-bold cursor-pointer hover:shadow-lg hover:shadow-purple-500/40 transition-all`}
        onClick={() => navigate('/profile')}
        title="View Profile"
      >
        {getInitial()}
      </div>
    );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Animated Logo ── */}
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0 select-none"
              onClick={() => navigate('/home')}
            >
              {/* Gradient-stroked globe SVG */}
              <div className="traveloop-globe relative shrink-0">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#a855f7" />
                      <stop offset="50%"  stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <path
                    stroke="url(#globeGrad)"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Swirl-animated gradient text */}
              <span className="traveloop-logo-text text-2xl font-black tracking-tight">
                Traveloop
              </span>
            </div>

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                    location.pathname === link.path
                      ? 'bg-white/20 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Right side: avatar + hamburger */}
            <div className="flex items-center gap-3">
              <Avatar />

              {/* Hamburger — shown on tablet/mobile */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition"
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
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navLinks.map(link => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white'
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
              className="flex items-center justify-between px-6 py-4 border-t border-white/10 cursor-pointer hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3" onClick={() => navigate('/profile')}>
                <Avatar size="w-10 h-10" />
                <div>
                  <p className="text-sm font-bold text-white">{user.name || user.email}</p>
                  <p className="text-xs text-slate-400">{user.is_admin ? '⚙️ Admin' : '✈️ Traveller'}</p>
                </div>
              </div>
              <button
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                className="text-xs font-bold text-red-400 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
