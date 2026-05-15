import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const tripService = {
  createTrip: (tripData) => api.post('/trips/create', tripData),
  getTrips: () => api.get('/trips'),
  getTrip: (id) => api.get(`/trips/${id}`),
};

export const aiService = {
  chat: (tripId, message) => api.post('/ai/chat', { trip_id: tripId, message }),
};

export const debugService = {
  getLogs: (tripId) => api.get(`/debug/logs/${tripId}`),
  clearLogs: (tripId) => api.delete(`/debug/logs/${tripId}`),
};

export default api;
