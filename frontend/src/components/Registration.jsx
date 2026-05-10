import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImg from '../assets/avatar.png';

export default function Registration() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans px-4 sm:px-6 lg:px-8 py-10">
      {/* Soft Light Mode Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-60 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 sm:w-96 sm:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-60 animate-blob animation-delay-4000"></div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[640px] p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-indigo-900/5 transition-all">
        
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
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Create an Account</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Join Traveloop today! Please fill in your details below.</p>
        </div>

        {/* Form */}
        <form className="space-y-4 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border border-slate-100 bg-slate-50/50 p-4 sm:p-6 rounded-2xl">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">First Name</label>
              <input 
                type="text" 
                placeholder="First Name" 
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Last Name</label>
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Phone Number</label>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">City</label>
              <input 
                type="text" 
                placeholder="City" 
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Country</label>
              <input 
                type="text" 
                placeholder="Country" 
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="space-y-2 sm:col-span-2 mt-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Additional Information</label>
              <textarea 
                placeholder="Additional Information ...." 
                rows="4"
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 resize-none shadow-sm"
              ></textarea>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Register User
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
