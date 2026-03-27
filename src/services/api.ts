import axios from 'axios';
import type { Location, Speaker, Event } from '../types/index';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

export const locationService = {
  getAll: () => api.get<Location[]>('/locations'),
  create: (data: Location) => api.post<Location>('/locations', data),
};

export const speakerService = {
  getAll: () => api.get<Speaker[]>('/speakers'),
  create: (data: Speaker) => api.post<Speaker>('/speakers', data),
};

export const eventService = {
  getAll: () => api.get<Event[]>('/events'),
  create: (data: Event) => api.post<Event>('/events', data),
  update: (id: number, data: Event) => api.put<Event>(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

export default api;
