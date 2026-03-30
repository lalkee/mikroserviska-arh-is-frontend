import axios from 'axios';
import type { Location, Speaker, Event } from '../types/index';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

export const locationService = {
  getAll: () => api.get<Location[]>('/locations'),
  getById: (id: number) => api.get<Location>(`/locations/${id}`),
  create: (data: Location) => api.post<Location>('/locations', data),
  update: (id: number, data: Location) => api.put<Location>(`/locations/${id}`, data),
  delete: (id: number) => api.delete(`/locations/${id}`),
};

export const speakerService = {
  getAll: () => api.get<Speaker[]>('/speakers'),
  getById: (id: number) => api.get<Speaker>(`/speakers/${id}`),
  create: (data: Speaker) => api.post<Speaker>('/speakers', data),
  update: (id: number, data: Speaker) => api.put<Speaker>(`/speakers/${id}`, data),
  delete: (id: number) => api.delete(`/speakers/${id}`),
};

export const eventService = {
  getAll: () => api.get<Event[]>('/events'),
  getById: (id: number) => api.get<Event>(`/events/${id}`),
  create: (data: Event) => api.post<Event>('/events', data),
  update: (id: number, data: Event) => api.put<Event>(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

export default api;