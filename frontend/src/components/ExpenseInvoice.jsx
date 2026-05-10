import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export default function ExpenseInvoice() {
  const navigate = useNavigate();

  const invoiceItems = [
    { id: 1, category: 'hotel', desc: 'hotel booking paris', qty: '3 nights', unitCost: 3000, amount: 9000 },
    { id: 2, category: 'travel', desc: 'flight bookings (DEL -> PAR)', qty: '1', unitCost: 12000, amount: 12000 }
  ];

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.05;
  const discount = 50;
  const grandTotal = subtotal + tax - discount;

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
              placeholder="Search invoices..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Filter</button>
            <button className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm">Sort ⇅</button>
          </div>
        </div>

        <button 
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          back to My Trips
        </button>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Trip Info Block */}
          <div className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100">
              <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-1">Trip to Europe Adventure</h2>
              <p className="text-sm text-slate-500 mb-6">May 20 - Jun 05, 2025 • 4 cities<br/>created by James</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Invoice Id</p>
                  <p className="text-slate-800 font-medium">INV-xyz-30290</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Generated date</p>
                  <p className="text-slate-800 font-medium">May 20, 2025</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Traveler Details:</p>
                  <p className="text-slate-800 font-medium text-sm leading-tight">James<br/>Arjun<br/>Jerry<br/>Cristina</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Payment status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Insights Block */}
          <div className="lg:w-80 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h3 className="font-bold text-slate-800 mb-4">budget Insights</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 relative shrink-0">
                {/* CSS Pie Chart snippet */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)' }}></div>
              </div>
              <div className="text-sm">
                <p className="text-slate-600"><span className="font-semibold text-slate-800">Total Budget:</span> 20000</p>
                <p className="text-slate-600"><span className="font-semibold text-slate-800">Total spent:</span> 22000</p>
                <p className="text-red-500 font-bold mt-1">Remaining: -2000</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors">
              View Full Budget
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 border-r border-slate-200 w-16 text-center">#</th>
                  <th className="p-4 border-r border-slate-200 text-center">Category</th>
                  <th className="p-4 border-r border-slate-200">Description</th>
                  <th className="p-4 border-r border-slate-200 text-center">Qty/details</th>
                  <th className="p-4 border-r border-slate-200 text-right">Unit Cost</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {invoiceItems.map(item => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                    <td className="p-4 border-r border-slate-200 text-center font-medium text-slate-400">{item.id}</td>
                    <td className="p-4 border-r border-slate-200 text-center">{item.category}</td>
                    <td className="p-4 border-r border-slate-200 font-medium">{item.desc}</td>
                    <td className="p-4 border-r border-slate-200 text-center text-slate-500">{item.qty}</td>
                    <td className="p-4 border-r border-slate-200 text-right">{item.unitCost}</td>
                    <td className="p-4 text-right font-medium">{item.amount}</td>
                  </tr>
                ))}
                {/* Empty rows to match mockup style */}
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-200 h-14"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4"></td></tr>
                <tr className="border-b border-slate-100"><td className="p-4 border-r border-slate-200 h-14"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4 border-r border-slate-200"></td><td className="p-4"></td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row border-t border-slate-200">
            <div className="flex-1 p-6 border-b sm:border-b-0 sm:border-r border-slate-200 bg-slate-50/50 hidden sm:block"></div>
            <div className="w-full sm:w-1/3 p-6 space-y-2">
              <div className="flex justify-between text-slate-600 font-medium"><span>Subtotal</span><span>$ {subtotal}</span></div>
              <div className="flex justify-between text-slate-600 font-medium"><span>tax (5%)</span><span>$ {tax}</span></div>
              <div className="flex justify-between text-slate-600 font-medium"><span>Discount</span><span>$ {discount}</span></div>
              <div className="h-px bg-slate-200 my-4"></div>
              <div className="flex justify-between text-slate-800 font-bold text-lg"><span>Grand Total</span><span>$ {grandTotal}</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex w-full sm:w-auto gap-4">
            <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
              Download Invoice
            </button>
            <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
              Export as PDF
            </button>
          </div>
          <button className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
            Mark as paid
          </button>
        </div>

      </main>
    </div>
  );
}
