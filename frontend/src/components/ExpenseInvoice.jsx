import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import { budgetApi, tripsApi, authApi } from '../api/client';

export default function ExpenseInvoice() {
  const navigate = useNavigate();
  const { tripId: paramTripId } = useParams();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(paramTripId || '');
  const [trip, setTrip] = useState(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ category: '', description: '', amount: '', currency: 'USD', is_paid: false });
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authApi.getMe().then(res => setUser(res.data)).catch(() => {});
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      fetchBudgetData(selectedTripId);
    } else {
      setBudgetItems([]);
      setSummary(null);
      setTrip(null);
      setLoading(false);
    }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const res = await tripsApi.getAll();
      setTrips(res.data);
      if (!selectedTripId && res.data.length > 0) {
        setSelectedTripId(res.data[0].id.toString());
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load trips.');
      setLoading(false);
    }
  };

  const fetchBudgetData = async (tripId) => {
    setLoading(true);
    try {
      const [tripRes, itemsRes, summaryRes] = await Promise.all([
        tripsApi.getById(tripId),
        budgetApi.getItems(tripId),
        budgetApi.getSummary(tripId).catch(() => null),
      ]);
      setTrip(tripRes.data);
      setBudgetItems(itemsRes.data);
      if (summaryRes) setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load budget data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return;
    setSaving(true);
    try {
      const res = await budgetApi.createItem(selectedTripId, {
        ...newItem,
        amount: parseFloat(newItem.amount),
      });
      setBudgetItems([...budgetItems, res.data]);
      setNewItem({ category: '', description: '', amount: '', currency: 'USD', is_paid: false });
      setShowAddForm(false);
      // Refresh summary
      try {
        const summaryRes = await budgetApi.getSummary(selectedTripId);
        setSummary(summaryRes.data);
      } catch {}
    } catch (err) {
      setError('Failed to add expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await budgetApi.deleteItem(selectedTripId, itemId);
      setBudgetItems(budgetItems.filter(i => i.id !== itemId));
      // Refresh summary
      try {
        const summaryRes = await budgetApi.getSummary(selectedTripId);
        setSummary(summaryRes.data);
      } catch {}
    } catch (err) {
      setError('Failed to delete expense.');
    }
  };

  const handleTogglePaid = async (item) => {
    try {
      const res = await budgetApi.updateItem(selectedTripId, item.id, { is_paid: !item.is_paid });
      setBudgetItems(budgetItems.map(i => i.id === item.id ? res.data : i));
    } catch (err) {
      setError('Failed to update item.');
    }
  };

  const subtotal = budgetItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const paidAmount = budgetItems.filter(i => i.is_paid).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative w-full md:w-1/3">
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold cursor-pointer"
            >
              <option value="">Select a trip...</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>Trip: {t.title}</option>
              ))}
            </select>
          </div>
          {user?.is_admin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
            >
              + Add Expense
            </button>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-200 mb-6">{error}</div>}

        <button 
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          back to My Trips
        </button>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Trip Info Block */}
              <div className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100">
                  <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">{trip?.title || 'Select a trip'}</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    {trip?.start_date && trip?.end_date 
                      ? `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
                      : 'No dates set'
                    }
                  </p>
                  <p className="text-sm text-slate-500">{budgetItems.length} expense items</p>
                </div>
              </div>

              {/* Budget Insights Block */}
              <div className="lg:w-80 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <h3 className="font-bold text-slate-800 mb-4">Budget Insights</h3>
                <div className="text-sm space-y-2 mb-4">
                  <p className="text-slate-600"><span className="font-semibold text-slate-800">Total Expenses:</span> ${subtotal.toFixed(2)}</p>
                  <p className="text-slate-600"><span className="font-semibold text-slate-800">Paid:</span> ${paidAmount.toFixed(2)}</p>
                  <p className={`font-bold ${subtotal - paidAmount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    Unpaid: ${(subtotal - paidAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Expense Form */}
            {showAddForm && (
              <form onSubmit={handleAddItem} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Category (e.g. Hotel, Flight)" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} required className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  <input type="text" placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} required className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  <input type="number" step="0.01" placeholder="Amount" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} required className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 text-slate-600 font-semibold rounded-xl hover:bg-slate-100">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400">
                    {saving ? 'Adding...' : 'Add Expense'}
                  </button>
                </div>
              </form>
            )}

            {/* Invoice Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="p-4 border-r border-slate-200 w-16 text-center">#</th>
                      <th className="p-4 border-r border-slate-200 text-center">Category</th>
                      <th className="p-4 border-r border-slate-200">Description</th>
                      <th className="p-4 border-r border-slate-200 text-right">Amount</th>
                      <th className="p-4 border-r border-slate-200 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {budgetItems.length === 0 && (
                      <tr><td colSpan="6" className="p-8 text-center text-slate-400 font-medium">No expenses yet. Add one above.</td></tr>
                    )}
                    {budgetItems.map((item, idx) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                        <td className="p-4 border-r border-slate-200 text-center font-medium text-slate-400">{idx + 1}</td>
                        <td className="p-4 border-r border-slate-200 text-center font-medium">{item.category}</td>
                        <td className="p-4 border-r border-slate-200">{item.description}</td>
                        <td className="p-4 border-r border-slate-200 text-right font-medium">${parseFloat(item.amount).toFixed(2)}</td>
                        <td className="p-4 border-r border-slate-200 text-center">
                          {user?.is_admin ? (
                            <button onClick={() => handleTogglePaid(item)} className={`text-xs font-bold px-3 py-1 rounded-full ${item.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {item.is_paid ? 'Paid' : 'Pending'}
                            </button>
                          ) : (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.is_paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {item.is_paid ? 'Paid' : 'Pending'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {user?.is_admin && (
                            <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {budgetItems.length > 0 && (
                <div className="flex flex-col sm:flex-row border-t border-slate-200">
                  <div className="flex-1 p-6 border-b sm:border-b-0 sm:border-r border-slate-200 bg-slate-50/50 hidden sm:block"></div>
                  <div className="w-full sm:w-1/3 p-6 space-y-2">
                    <div className="flex justify-between text-slate-600 font-medium"><span>Total</span><span>$ {subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-green-600 font-medium"><span>Paid</span><span>$ {paidAmount.toFixed(2)}</span></div>
                    <div className="h-px bg-slate-200 my-4"></div>
                    <div className="flex justify-between text-slate-800 font-bold text-lg"><span>Unpaid</span><span>$ {(subtotal - paidAmount).toFixed(2)}</span></div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
