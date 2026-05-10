import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImg from '../assets/avatar.png';
import { authApi } from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans px-4 sm:px-6 lg:px-8">
      {/* Soft Light Mode Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-60 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 sm:w-96 sm:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-60 animate-blob animation-delay-4000"></div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[420px] p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-indigo-900/5 transition-all">
        
        {/* Avatar Area */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-md opacity-70 transform scale-110"></div>
            <img 
              src={avatarImg} 
              alt="User Avatar" 
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-[3px] border-white shadow-lg bg-white"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Please enter your details to sign in.</p>
        </div>

        {/* Form */}
        <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium text-center border border-red-200">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 sm:py-3.5 mt-2 sm:mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/register')} 
                className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
