import axios from 'axios';

// Create an Axios instance with base URL
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────────
export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
};

// ─── Trips API ───────────────────────────────────────────────
export const tripsApi = {
  getAll: () => apiClient.get('/trips'),
  getById: (id) => apiClient.get(`/trips/${id}`),
  create: (tripData) => apiClient.post('/trips', tripData),
  update: (id, tripData) => apiClient.put(`/trips/${id}`, tripData),
  delete: (id) => apiClient.delete(`/trips/${id}`),
  share: (id, role = 'viewer') => apiClient.post(`/trips/${id}/share`, null, { params: { role } }),
  unshare: (id) => apiClient.delete(`/trips/${id}/share`),
  getShared: (token) => apiClient.get(`/trips/shared/${token}`),
  copyShared: (token) => apiClient.post(`/trips/shared/${token}/copy`),
};

// ─── Stops API ───────────────────────────────────────────────
export const stopsApi = {
  getAll: (tripId) => apiClient.get(`/trips/${tripId}/stops`),
  create: (tripId, stopData) => apiClient.post(`/trips/${tripId}/stops`, stopData),
  update: (tripId, stopId, stopData) => apiClient.put(`/trips/${tripId}/stops/${stopId}`, stopData),
  delete: (tripId, stopId) => apiClient.delete(`/trips/${tripId}/stops/${stopId}`),
  reorder: (tripId, stopIds) => apiClient.put(`/trips/${tripId}/stops/reorder`, { stop_ids: stopIds }),
};

// ─── Notes API ───────────────────────────────────────────────
export const notesApi = {
  getAll: (tripId) => apiClient.get(`/trips/${tripId}/notes`),
  getById: (tripId, noteId) => apiClient.get(`/trips/${tripId}/notes/${noteId}`),
  create: (tripId, noteData) => apiClient.post(`/trips/${tripId}/notes`, noteData),
  update: (tripId, noteId, noteData) => apiClient.put(`/trips/${tripId}/notes/${noteId}`, noteData),
  delete: (tripId, noteId) => apiClient.delete(`/trips/${tripId}/notes/${noteId}`),
};

// ─── Budget API ──────────────────────────────────────────────
export const budgetApi = {
  getSummary: (tripId) => apiClient.get(`/trips/${tripId}/budget/summary`),
  getItems: (tripId) => apiClient.get(`/trips/${tripId}/budget/items`),
  createItem: (tripId, itemData) => apiClient.post(`/trips/${tripId}/budget/items`, itemData),
  updateItem: (tripId, itemId, itemData) => apiClient.put(`/trips/${tripId}/budget/items/${itemId}`, itemData),
  deleteItem: (tripId, itemId) => apiClient.delete(`/trips/${tripId}/budget/items/${itemId}`),
};

// ─── Packing API ─────────────────────────────────────────────
export const packingApi = {
  getAll: (tripId) => apiClient.get(`/trips/${tripId}/packing`),
  create: (tripId, itemData) => apiClient.post(`/trips/${tripId}/packing`, itemData),
  update: (tripId, itemId, itemData) => apiClient.put(`/trips/${tripId}/packing/${itemId}`, itemData),
  delete: (tripId, itemId) => apiClient.delete(`/trips/${tripId}/packing/${itemId}`),
  resetAll: (tripId) => apiClient.delete(`/trips/${tripId}/packing/reset`),
};

// ─── Profile API ─────────────────────────────────────────────
export const profileApi = {
  update: (profileData) => apiClient.put('/users/me', profileData),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/users/me/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updatePassword: (passwordData) => apiClient.put('/users/me/password', passwordData),
  deleteAccount: () => apiClient.delete('/users/me'),
  getSavedDestinations: () => apiClient.get('/users/me/saved-destinations'),
  addSavedDestination: (cityId) => apiClient.post('/users/me/saved-destinations', { city_id: cityId }),
  removeSavedDestination: (cityId) => apiClient.delete(`/users/me/saved-destinations/${cityId}`),
};

// ─── Dashboard API ───────────────────────────────────────────
export const dashboardApi = {
  getSummary: () => apiClient.get('/dashboard/summary'),
  getBudgetAlerts: () => apiClient.get('/dashboard/budget-alerts'),
};

// ─── Admin API ───────────────────────────────────────────────
export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/admin/users'),
  getUser: (id) => apiClient.get(`/admin/users/${id}`),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  suspendUser: (id) => apiClient.put(`/admin/users/${id}/suspend`),
  getTopCities: () => apiClient.get('/admin/cities/top'),
  getTopActivities: () => apiClient.get('/admin/activities/top'),
  getRecentTrips: () => apiClient.get('/admin/trips/recent'),
};

// ─── Itinerary API ───────────────────────────────────────────
export const itineraryApi = {
  get: (tripId) => apiClient.get(`/trips/${tripId}/itinerary`),
  addActivity: (stopId, activityData) => apiClient.post(`/stops/${stopId}/activities`, activityData),
  removeActivity: (stopId, activityId) => apiClient.delete(`/stops/${stopId}/activities/${activityId}`),
};

// ─── Cities API ──────────────────────────────────────────────
export const citiesApi = {
  getAll: () => apiClient.get('/cities'),
  getById: (id) => apiClient.get(`/cities/${id}`),
  getActivities: (cityId) => apiClient.get(`/cities/${cityId}/activities`),
};

// ─── Activities API ──────────────────────────────────────────
export const activitiesApi = {
  getAll: () => apiClient.get('/activities'),
  getById: (id) => apiClient.get(`/activities/${id}`),
};

// ─── Community API ───────────────────────────────────────────
export const communityApi = {
  getPosts: () => apiClient.get('/community/posts'),
  createPost: (postData) => apiClient.post('/community/posts', postData),
  likePost: (postId) => apiClient.put(`/community/posts/${postId}/like`),
};

export default apiClient;
