import React, { useState, useEffect } from 'react';
import Header from './Header';
import avatarImg from '../assets/avatar.png';
import { communityApi, tripsApi, authApi } from '../api/client';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommunityTab() {
  const [posts, setPosts]           = useState([]);
  const [trips, setTrips]           = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posting, setPosting]       = useState(false);

  // Create post form
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTripId, setSelectedTripId] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const [postsRes, tripsRes, meRes] = await Promise.allSettled([
        communityApi.getPosts(),
        tripsApi.getAll(),
        authApi.getMe(),
      ]);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data);
      else setError('Failed to load posts.');
      if (tripsRes.status === 'fulfilled') setTrips(tripsRes.value.data);
      if (meRes.status === 'fulfilled') setCurrentUser(meRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setPosting(true);
    try {
      const payload = { content: newPostContent.trim() };
      if (selectedTripId) payload.trip_id = parseInt(selectedTripId);
      const res = await communityApi.createPost(payload);
      // Optimistically inject current user info
      const enriched = {
        ...res.data,
        user: res.data.user || { name: currentUser?.name, email: currentUser?.email }
      };
      setPosts([enriched, ...posts]);
      setNewPostContent('');
      setSelectedTripId('');
    } catch (err) {
      const msg = err.response?.data?.detail;
      alert(typeof msg === 'string' ? msg : 'Failed to post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  // Client-side search filter
  const filtered = posts.filter(p =>
    !searchQuery ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.trip?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = (user) => user?.name || user?.email?.split('@')[0] || 'Traveller';
  const initials = (user) => (user?.name || user?.email || '?').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Community</h1>
          <p className="text-slate-500 mt-1">Share your travel experiences with fellow explorers</p>
        </div>

        {/* Create Post card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
              {currentUser ? initials(currentUser) : '?'}
            </div>
            <form onSubmit={handleCreatePost} className="flex-1 space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-slate-800 placeholder-slate-400 text-sm"
                placeholder="Share your travel experience, ask a question, or give tips..."
                rows="3"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="flex-1 min-w-[160px] bg-white border border-slate-200 text-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="">📍 Link a trip (optional)</option>
                  {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
                <button
                  type="submit"
                  disabled={!newPostContent.trim() || posting}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition text-sm shadow-md shadow-indigo-600/20"
                >
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, people, or trips..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm text-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium mb-6">
            {error}
            <button onClick={fetchAll} className="ml-3 font-bold underline">Retry</button>
          </div>
        )}

        {/* Posts feed */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading posts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-5xl mb-4">💬</p>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              {searchQuery ? 'No posts match your search' : 'No posts yet'}
            </h3>
            <p className="text-slate-500">
              {searchQuery ? 'Try a different search term.' : 'Be the first to share a travel experience!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchQuery && (
              <p className="text-sm text-slate-500 font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"</p>
            )}
            {filtered.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all p-5 sm:p-6">
                {/* Author row */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials(post.user)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{displayName(post.user)}</p>
                      <p className="text-xs text-slate-400">{timeAgo(post.created_at)}</p>
                    </div>
                  </div>
                  {post.trip && (
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full shrink-0">
                      ✈️ {post.trip.title}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-slate-700 leading-relaxed text-sm">{post.content}</p>

                {/* Footer stats */}
                {(post.likes_count > 0 || post.comments_count > 0) && (
                  <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
                    {post.likes_count > 0 && <span>❤️ {post.likes_count} like{post.likes_count !== 1 ? 's' : ''}</span>}
                    {post.comments_count > 0 && <span>💬 {post.comments_count} comment{post.comments_count !== 1 ? 's' : ''}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
