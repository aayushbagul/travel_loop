import React, { useState, useEffect } from 'react';
import Header from './Header';
import { adminApi, authApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topActivities, setTopActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = ['Manage Users', 'Popular Cities', 'Popular Activities', 'Stats Overview'];
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const userRes = await authApi.getMe();
      if (!userRes.data.is_admin) {
        navigate('/home');
        return;
      }
      fetchAdminData();
    } catch {
      navigate('/home');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, citiesRes, activitiesRes] = await Promise.all([
        adminApi.getStats().catch(() => ({ data: null })),
        adminApi.getUsers().catch(() => ({ data: [] })),
        adminApi.getTopCities().catch(() => ({ data: [] })),
        adminApi.getTopActivities().catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTopCities(citiesRes.data);
      setTopActivities(activitiesRes.data);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const res = await adminApi.suspendUser(userId);
      setUsers(users.map(u => u.id === userId ? res.data : u));
    } catch (err) {
      setError('Failed to suspend user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

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
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 snap-x">
          {tabs.map((tab, idx) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all snap-start ${activeTab === idx ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-8 sm:p-12 border border-slate-200 shadow-sm min-h-[400px]">
            
            {/* Stats Overview */}
            {activeTab === 3 && stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-indigo-50 p-6 rounded-2xl text-center border border-indigo-100">
                  <p className="text-3xl font-bold text-indigo-600">{stats.total_users}</p>
                  <p className="text-slate-600 font-semibold mt-2">Total Users</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
                  <p className="text-3xl font-bold text-green-600">{stats.active_trips}</p>
                  <p className="text-slate-600 font-semibold mt-2">Active Trips</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl text-center border border-amber-100">
                  <p className="text-3xl font-bold text-amber-600">{stats.total_destinations_saved}</p>
                  <p className="text-slate-600 font-semibold mt-2">Destinations Saved</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl text-center border border-purple-100">
                  <p className="text-3xl font-bold text-purple-600">{stats.total_activities_booked}</p>
                  <p className="text-slate-600 font-semibold mt-2">Activities Booked</p>
                </div>
              </div>
            )}

            {/* Manage Users */}
            {activeTab === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4">All Users ({users.length})</h2>
                {users.length === 0 && <p className="text-slate-500 text-center py-8">No users found.</p>}
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">{user.name || 'Unnamed User'}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button onClick={() => handleSuspendUser(user.id)} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full hover:bg-amber-200">
                        Suspend
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Cities */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Popular Cities</h2>
                {topCities.length === 0 && <p className="text-slate-500 text-center py-8">No city data available yet.</p>}
                {topCities.map((city, idx) => (
                  <div key={city.city_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-indigo-300">#{idx + 1}</span>
                      <p className="font-bold text-slate-800">{city.city_name}</p>
                    </div>
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg">{city.saves_count} saves</span>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Activities */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Popular Activities</h2>
                {topActivities.length === 0 && <p className="text-slate-500 text-center py-8">No activity data available yet.</p>}
                {topActivities.map((activity, idx) => (
                  <div key={activity.activity_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-indigo-300">#{idx + 1}</span>
                      <p className="font-bold text-slate-800">{activity.activity_name}</p>
                    </div>
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg">{activity.booking_count} bookings</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
